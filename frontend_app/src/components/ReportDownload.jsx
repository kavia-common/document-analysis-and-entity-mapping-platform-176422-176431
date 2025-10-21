import { useState } from "react";

// PUBLIC_INTERFACE
export default function ReportDownload({ jobId, onDownload }) {
  /**
   * Provides a button to download the Excel report once ready.
   * onDownload(jobId): Promise<Blob>
   */
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const triggerDownload = async () => {
    if (!jobId) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await onDownload(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document-analysis-report-${jobId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || "Failed to download report");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Report</h3>
        <p className="muted">Download the 5-sheet Excel report when processing is completed.</p>
      </div>
      <div className="card-body">
        <button className="btn primary" disabled={!jobId || busy} onClick={triggerDownload}>
          {busy ? "Downloading..." : "Download Report"}
        </button>
        {!jobId && <p className="muted">Upload and process a document to enable download.</p>}
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
