const FRIENDLY_TITLES = {
  TIMEOUT: "That took too long",
  PROVIDER_ERROR: "The AI provider had a problem",
  INVALID_JSON: "The model's answer didn't come out right",
  BAD_INPUT: "Can't generate from that",
  CONFIG_ERROR: "Backend isn't configured",
  NETWORK_ERROR: "Can't reach the server",
  BAD_RESPONSE: "Unexpected server response"
};

export default function ErrorState({ error, onRetry }) {
  const title = FRIENDLY_TITLES[error?.code] || "Something went wrong";
  const canRetry = error?.code !== "BAD_INPUT" && error?.code !== "CONFIG_ERROR";

  return (
    <div className="state-panel error-panel" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3>{title}</h3>
      <p>{error?.message || "An unknown error occurred."}</p>
      {canRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
