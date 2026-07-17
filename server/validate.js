// Validates that a parsed object actually matches the study-set contract.
// Returns { valid: true } or { valid: false, reason: string } — never throws.

export function validateStudySet(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, reason: "Response is not a JSON object." };
  }
  if (typeof data.topic !== "string" || !data.topic.trim()) {
    return { valid: false, reason: "Missing or empty 'topic' string." };
  }
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    return { valid: false, reason: "'flashcards' must be a non-empty array." };
  }
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return { valid: false, reason: "'quiz' must be a non-empty array." };
  }

  for (const [i, card] of data.flashcards.entries()) {
    if (!card || typeof card.front !== "string" || typeof card.back !== "string" || !card.front.trim() || !card.back.trim()) {
      return { valid: false, reason: `flashcards[${i}] is missing 'front' or 'back'.` };
    }
  }

  for (const [i, q] of data.quiz.entries()) {
    if (!q || typeof q.question !== "string" || !q.question.trim()) {
      return { valid: false, reason: `quiz[${i}] is missing 'question'.` };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => typeof o !== "string" || !o.trim())) {
      return { valid: false, reason: `quiz[${i}] must have exactly 4 non-empty string options.` };
    }
    if (
      typeof q.correctIndex !== "number" ||
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      return { valid: false, reason: `quiz[${i}].correctIndex must be an integer 0-3.` };
    }
  }

  return { valid: true };
}

// Assigns stable ids if the model forgot them / duplicated them, and trims strings.
export function normalizeStudySet(data) {
  return {
    topic: data.topic.trim(),
    flashcards: data.flashcards.map((c, i) => ({
      id: String(c.id || `f${i + 1}`),
      front: c.front.trim(),
      back: c.back.trim()
    })),
    quiz: data.quiz.map((q, i) => ({
      id: String(q.id || `q${i + 1}`),
      question: q.question.trim(),
      options: q.options.map((o) => o.trim()),
      correctIndex: q.correctIndex,
      explanation: typeof q.explanation === "string" ? q.explanation.trim() : ""
    }))
  };
}

// The model sometimes wraps JSON in ```json fences or adds a stray sentence.
// Try a straight parse first, then fall back to extracting the outermost {...}.
export function extractJson(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  const withoutFences = trimmed.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(withoutFences);
  } catch {
    // fall through
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      // fall through
    }
  }

  return null;
}
