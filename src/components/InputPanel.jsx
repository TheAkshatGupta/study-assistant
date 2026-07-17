import { useState } from "react";

const EXAMPLES = [
  "The water cycle: evaporation, condensation, precipitation, collection.",
  "Key events of the French Revolution, 1789-1799",
  "React hooks: useState, useEffect, useMemo, useCallback"
];

export default function InputPanel({ onGenerate, disabled, initialValue = "" }) {
  const [text, setText] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onGenerate(text.trim());
  }

  return (
    <form className="input-panel" onSubmit={handleSubmit}>
      <label htmlFor="notes" className="input-label">
        Paste your notes, or just name a topic
      </label>
      <textarea
        id="notes"
        className="input-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Paste your biology notes, or just type 'the water cycle'..."
        rows={7}
        maxLength={8000}
        disabled={disabled}
      />
      <div className="input-footer">
        <div className="example-chips">
          {EXAMPLES.map((ex) => (
            <button
              type="button"
              key={ex}
              className="chip"
              disabled={disabled}
              onClick={() => setText(ex)}
            >
              {ex.length > 28 ? ex.slice(0, 28) + "…" : ex}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={disabled || !text.trim()}>
          {disabled ? "Generating…" : "Generate study set"}
        </button>
      </div>
    </form>
  );
}
