export default function LoadingState() {
  return (
    <div className="state-panel loading-panel" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>Reading your notes and building a study set…</p>
      <div className="skeleton-row">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </div>
  );
}
