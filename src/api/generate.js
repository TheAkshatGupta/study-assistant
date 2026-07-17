// Talks only to our own backend (never to the LLM provider directly), so the
// API key never reaches the browser. Takes an AbortSignal so the caller can
// cancel a stale in-flight request.
export async function generateStudySet(text, signal) {
  let res;
  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal
    });
  } catch (err) {
    if (err.name === "AbortError") throw err; // let the caller distinguish cancellation
    return { ok: false, error: { code: "NETWORK_ERROR", message: "Couldn't reach the backend. Is the server running?" } };
  }

  let json;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: { code: "BAD_RESPONSE", message: "The server sent back something unreadable." } };
  }

  return json;
}
