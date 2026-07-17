import "dotenv/config";
import express from "express";
import cors from "cors";
import { getProvider } from "./providers.js";
import { SYSTEM_PROMPT, buildUserPrompt, RETRY_PROMPT_SUFFIX } from "./prompt.js";
import { extractJson, validateStudySet, normalizeStudySet } from "./validate.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;
const PROVIDER_NAME = process.env.PROVIDER || "groq";
const API_KEY = process.env.API_KEY || "";
const MODEL = process.env.MODEL || undefined;
const REQUEST_TIMEOUT_MS = 25000;

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function callModelOnce(userPrompt) {
  const provider = getProvider(PROVIDER_NAME);
  const { signal, cancel } = withTimeout(REQUEST_TIMEOUT_MS);
  try {
    const text = await provider({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      apiKey: API_KEY,
      model: MODEL,
      signal
    });
    return text;
  } finally {
    cancel();
  }
}

app.post("/api/generate", async (req, res) => {
  const userText = (req.body?.text || "").trim();

  if (!userText) {
    return res.status(400).json({ ok: false, error: { code: "BAD_INPUT", message: "Please provide some notes or a topic." } });
  }
  if (userText.length > 8000) {
    return res.status(400).json({ ok: false, error: { code: "BAD_INPUT", message: "That's too long — please paste under 8000 characters." } });
  }
  if (PROVIDER_NAME !== "ollama" && !API_KEY) {
    return res.status(500).json({
      ok: false,
      error: { code: "CONFIG_ERROR", message: `No API_KEY set for provider "${PROVIDER_NAME}". Copy .env.example to .env and add one.` }
    });
  }

  const basePrompt = buildUserPrompt(userText);
  let lastRawText = "";
  let lastReason = "";

  // Try up to 2 times total: once normally, once with a corrective prompt if the
  // first response wasn't valid JSON matching our schema.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const prompt = attempt === 1 ? basePrompt : basePrompt + RETRY_PROMPT_SUFFIX + `\n\nYour last attempt failed because: ${lastReason}`;

    let rawText;
    try {
      rawText = await callModelOnce(prompt);
    } catch (err) {
      const isAbort = err?.name === "AbortError";
      if (isAbort) {
        return res.status(504).json({ ok: false, error: { code: "TIMEOUT", message: "The model took too long to respond. Please try again." } });
      }
      // Network/provider failure — don't retry a second time on hard errors, just report it.
      return res.status(502).json({ ok: false, error: { code: "PROVIDER_ERROR", message: err.message || "The AI provider request failed." } });
    }

    lastRawText = rawText;
    const parsed = extractJson(rawText);

    if (!parsed) {
      lastReason = "response was not valid JSON.";
      continue;
    }

    const { valid, reason } = validateStudySet(parsed);
    if (!valid) {
      lastReason = reason;
      continue;
    }

    return res.json({ ok: true, data: normalizeStudySet(parsed) });
  }

  // Both attempts failed to produce a usable study set.
  return res.status(422).json({
    ok: false,
    error: {
      code: "INVALID_JSON",
      message: `The model didn't return a usable study set after two attempts (${lastReason}). Try rephrasing your notes, or try again.`
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, provider: PROVIDER_NAME });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT} (provider: ${PROVIDER_NAME})`);
});
