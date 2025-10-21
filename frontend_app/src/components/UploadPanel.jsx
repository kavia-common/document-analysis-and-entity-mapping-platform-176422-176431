import { useRef, useState } from "react";

// Allowed file extensions
const ACCEPTED = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
];

function humanFileSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + " " + units[u];
}

// PUBLIC_INTERFACE
export default function UploadPanel({ onUpload }) {
  /**
   * Upload panel with validation for allowed formats and file size.
   * onUpload(file): should return a Promise that resolves to jobId.
   */
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onChooseClick = () => inputRef.current?.click();

  const validateFile = (f) => {
    if (!f) return "No file selected";
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      return `Unsupported format: ${ext}. Allowed: ${ACCEPTED.join(", ")}`;
    }
    // 50MB limit by default
    const MAX = 50 * 1024 * 1024;
    if (f.size > MAX) {
      return `File is too large (${humanFileSize(f.size)}). Max 50MB.`;
    }
    return null;
  };

  const onFileChange = (e) => {
    setLocalError(null);
    const f = e.target.files?.[0];
    const err = validateFile(f);
    setFile(err ? null : f);
    setLocalError(err);
  };

  const onSubmit = async () => {
    if (!file) {
      setLocalError("Choose a valid file first.");
      return;
    }
    setBusy(true);
    setLocalError(null);
    try {
      await onUpload(file);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      setLocalError(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Upload Document</h3>
        <p className="muted">Supported: PDF, Word, PowerPoint, Excel, Images</p>
      </div>
      <div className="card-body">
        <input
          ref={inputRef}
          type="file"
          onChange={onFileChange}
          accept={ACCEPTED.join(",")}
          style={{ display: "none" }}
          aria-label="File input"
        />
        <div className="upload-row">
          <button className="btn" onClick={onChooseClick} disabled={busy}>
            Choose File
          </button>
          <div className="file-summary">
            {file ? (
              <>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{humanFileSize(file.size)}</span>
              </>
            ) : (
              <span className="muted">No file selected</span>
            )}
          </div>
          <button className="btn primary" onClick={onSubmit} disabled={busy || !file}>
            {busy ? "Uploading..." : "Upload"}
          </button>
        </div>
        {localError && <div className="alert error" role="alert">{localError}</div>}
      </div>
    </div>
  );
}
