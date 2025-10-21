import { useEffect } from "react";

// PUBLIC_INTERFACE
export default function ProgressBar({ jobId, status, onPoll }) {
  /**
   * Displays progress and stage; triggers polling when jobId present.
   * status: { status, progress, stage, error }
   * onPoll(jobId): function to poll status
   */
  useEffect(() => {
    if (jobId) {
      onPoll(jobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const pct =
    typeof status?.progress === "number"
      ? Math.max(0, Math.min(100, status.progress))
      : status?.status === "completed"
      ? 100
      : 0;

  const label =
    status?.status === "failed"
      ? "Failed"
      : status?.status === "completed"
      ? "Completed"
      : status?.stage || status?.status || "Idle";

  return (
    <div className="card">
      <div className="card-header">
        <h3>Processing Progress</h3>
      </div>
      <div className="card-body">
        {!jobId ? (
          <p className="muted">Upload a document to begin.</p>
        ) : (
          <>
            <div className="progress">
              <div className={`progress-bar ${status?.status}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-meta">
              <span className="label">{label}</span>
              <span className="value">{pct}%</span>
            </div>
            {status?.error && (
              <div className="alert error" role="alert">
                {status.error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
