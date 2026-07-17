import { useEffect, useState, useCallback } from "react";

export default function Flashcards({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());

  const card = cards[index];

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  function markKnown(isKnown) {
    setKnown((prev) => {
      const next = new Set(prev);
      if (isKnown) next.add(card.id);
      else next.delete(card.id);
      return next;
    });
    goNext();
  }

  return (
    <div className="flashcards">
      <div className="flashcards-progress">
        Card {index + 1} of {cards.length} · {known.size} marked known
      </div>

      <div
        className={`flip-card ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label="Flashcard, tap or press space to flip"
      >
        <div className="flip-card-inner">
          <div className="flip-card-face flip-card-front">
            <span className="flip-card-label">Q</span>
            <p>{card.front}</p>
          </div>
          <div className="flip-card-face flip-card-back">
            <span className="flip-card-label">A</span>
            <p>{card.back}</p>
          </div>
        </div>
      </div>

      <div className="flashcards-controls">
        <button className="btn btn-ghost" onClick={goPrev} disabled={index === 0}>
          ← Prev
        </button>
        <button className="btn btn-outline btn-warn" onClick={() => markKnown(false)}>
          Still learning
        </button>
        <button className="btn btn-outline btn-good" onClick={() => markKnown(true)}>
          I know this
        </button>
        <button className="btn btn-ghost" onClick={goNext} disabled={index === cards.length - 1}>
          Next →
        </button>
      </div>
      <p className="hint">Tap the card to flip · arrow keys to move · space to flip</p>
    </div>
  );
}
