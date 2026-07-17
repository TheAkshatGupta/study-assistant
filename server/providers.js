import fetch from "node-fetch";

// Each provider function takes (systemPrompt, userPrompt, { apiKey, model }) and
// returns the raw text the model produced (still needs JSON-parsing/validation).
// Timeouts are enforced by the caller via AbortController.

async function callOpenAICompatible(baseUrl, defaultModel, { systemPrompt, userPrompt, apiKey, model, signal, extraHeaders = {} }) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders
    },
    body: JSON.stringify({
      model: model || defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
    signal
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Provider HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Provider returned no content.");
  return text;
}

async function callGroq(args) {
  return callOpenAICompatible(
    "https://api.groq.com/openai/v1/chat/completions",
    "llama-3.1-70b-versatile",
    args
  );
}

async function callOpenRouter(args) {
  return callOpenAICompatible(
    "https://openrouter.ai/api/v1/chat/completions",
    "openai/gpt-4o-mini",
    { ...args, extraHeaders: { "HTTP-Referer": "http://localhost", "X-Title": "Study Assistant" } }
  );
}

async function callOpenAI(args) {
  return callOpenAICompatible(
    "https://api.openai.com/v1/chat/completions",
    "gpt-4o-mini",
    args
  );
}

async function callOllama({ systemPrompt, userPrompt, model, signal }) {
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model || "llama3.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: false,
      format: "json"
    }),
    signal
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ollama HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.message?.content;
  if (!text) throw new Error("Ollama returned no content.");
  return text;
}

async function callGemini({ systemPrompt, userPrompt, apiKey, model, signal }) {
  const modelName = model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    }),
    signal
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content.");
  return text;
}

async function callAnthropic({ systemPrompt, userPrompt, apiKey, model, signal }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    }),
    signal
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text = data?.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("Anthropic returned no content.");
  return text;
}

const PROVIDERS = {
  groq: callGroq,
  openrouter: callOpenRouter,
  openai: callOpenAI,
  ollama: callOllama,
  gemini: callGemini,
  anthropic: callAnthropic
};

export function getProvider(name) {
  const fn = PROVIDERS[name];
  if (!fn) {
    throw new Error(`Unknown PROVIDER "${name}". Use one of: ${Object.keys(PROVIDERS).join(", ")}`);
  }
  return fn;
}
