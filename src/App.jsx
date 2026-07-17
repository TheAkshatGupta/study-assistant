import { useRef, useState } from "react";
import InputPanel from "./components/InputPanel.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ErrorState from "./components/ErrorState.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Flashcards from "./components/Flashcards.jsx";
import Quiz from "./components/Quiz.jsx";
import ModeToggle from "./components/ModeToggle.jsx";
import { generateStudySet } from "./api/generate.js";

export default function App() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [studySet, setStudySet] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("flashcards");
  const [lastInput, setLastInput] = useState("");
  const [dark, setDark] = useState(false);

  // Guards against stale responses: if the user fires a second request before
  // the first one resolves, we abort the first and ignore its result even if
  // it arrives after the second one already landed.
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  async function handleGenerate(text) {
    setLastInput(text);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const thisRequestId = ++requestIdRef.current;

    setStatus("loading");
    setError(null);

    let result;
    try {
      result = await generateStudySet(text, controller.signal);
    } catch (err) {
      if (err.name === "AbortError") return; // superseded by a newer request
      result = { ok: false, error: { code: "NETWORK_ERROR", message: "Request failed unexpectedly." } };
    }

    // Ignore this result if a newer request has since started.
    if (thisRequestId !== requestIdRef.current) return;

    if (result.ok) {
      setStudySet(result.data);
      setMode("flashcards");
      setStatus("success");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }

  function handleRetry() {
    if (lastInput) handleGenerate(lastInput);
  }

  return (
    <div className={`app ${dark ? "theme-dark" : "theme-light"}`}>
      <header className="app-header">
        <div>
          <h1>Study Assistant</h1>
          <p className="subtitle">
AI-powered study companion that transforms notes into interactive flashcards and quizzes.
</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="app-main">
        <InputPanel onGenerate={handleGenerate} disabled={status === "loading"} initialValue={lastInput} />

        <section className="results">
          {status === "idle" && <EmptyState />}
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState error={error} onRetry={handleRetry} />}
          {status === "success" && studySet && (
            <div className="study-set">
              <div className="study-set-header">
                <h2>{studySet.topic}</h2>
                <ModeToggle mode={mode} onChange={setMode} />
              </div>
              {mode === "flashcards" ? (
                <Flashcards key={studySet.topic + "-cards"} cards={studySet.flashcards} />
              ) : (
                <Quiz key={studySet.topic + "-quiz"} questions={studySet.quiz} />
              )}
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
  <p>
    Made with ❤️ by <strong>Akshat Gupta</strong>
  </p>

  <div className="footer-links">
    <a
      href="https://github.com/TheAkshatGupta"
      target="_blank"
      rel="noreferrer"
    >
      GitHub
    </a>

    <a
      href="https://www.linkedin.com/in/akshat-gupta-csds"
      target="_blank"
      rel="noreferrer"
    >
      LinkedIn
    </a>

    <a
      href="https://x.com/The_AkshatG"
      target="_blank"
      rel="noreferrer"
    >
      X
    </a>
  </div>
</footer>
    </div>
  );
}
