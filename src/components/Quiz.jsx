import { useMemo, useState } from "react";

export default function Quiz({ questions: allQuestions }) {
  const [activeQuestions, setActiveQuestions] = useState(allQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [round, setRound] = useState(1);

  const current = activeQuestions[currentIndex];
  const isFinished = currentIndex >= activeQuestions.length;
  const total = activeQuestions.length;

  const wrongIdSet = useMemo(() => new Set(wrongQuestions.map((q) => q.id)), [wrongQuestions]);

  function selectOption(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongQuestions((prev) => (wrongIdSet.has(current.id) ? prev : [...prev, current]));
    }
  }

  function next() {
    setSelected(null);
    setAnswered(false);
    setCurrentIndex((i) => i + 1);
  }

  function retestWrong() {
    setActiveQuestions(wrongQuestions);
    setWrongQuestions([]);
    setCorrectCount(0);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setRound((r) => r + 1);
  }

  function restartAll() {
    setActiveQuestions(allQuestions);
    setWrongQuestions([]);
    setCorrectCount(0);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setRound(1);
  }

  if (isFinished) {
    return (
      <div className="quiz-summary">
        <h3>{round > 1 ? "Retest complete" : "Quiz complete"}</h3>
        <p className="quiz-score">
          {correctCount} / {total} correct
        </p>
        {wrongQuestions.length > 0 ? (
          <>
            <p>{wrongQuestions.length} question{wrongQuestions.length > 1 ? "s" : ""} to review:</p>
            <ul className="wrong-list">
              {wrongQuestions.map((q) => (
                <li key={q.id}>{q.question}</li>
              ))}
            </ul>
            <div className="quiz-summary-actions">
              <button className="btn btn-primary" onClick={retestWrong}>
                Retest wrong answers ({wrongQuestions.length})
              </button>
              <button className="btn btn-ghost" onClick={restartAll}>
                Restart full quiz
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Perfect score 🎉</p>
            <button className="btn btn-ghost" onClick={restartAll}>
              Restart quiz
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        {round > 1 ? `Retest · ` : ""}Question {currentIndex + 1} of {total}
      </div>
      <p className="quiz-question">{current.question}</p>
      <div className="quiz-options">
        {current.options.map((opt, i) => {
          let cls = "quiz-option";
          if (answered) {
            if (i === current.correctIndex) cls += " is-correct";
            else if (i === selected) cls += " is-wrong";
          } else if (i === selected) {
            cls += " is-selected";
          }
          return (
            <button key={i} className={cls} onClick={() => selectOption(i)} disabled={answered}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`quiz-feedback ${selected === current.correctIndex ? "is-correct" : "is-wrong"}`}>
          <p>{selected === current.correctIndex ? "Correct!" : "Not quite."}</p>
          {current.explanation && <p className="quiz-explanation">{current.explanation}</p>}
          <button className="btn btn-primary" onClick={next}>
            {currentIndex + 1 === total ? "See results" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}
