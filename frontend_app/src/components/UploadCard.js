import React, { useCallback, useRef, useState } from 'react';
import { exportFiles } from '../api/client';

const ACCEPTED = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'text/csv',
];

const MAX_SIZE_MB = 25;

function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export default function UploadCard() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFiles = useCallback((fileList) => {
    const arr = Array.from(fileList || []);
    const valErrors = [];
    const filtered = arr.filter((f) => {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        valErrors.push(`${f.name}: exceeds ${MAX_SIZE_MB}MB`);
        return false;
      }
      // Allow by extension if browser doesn't set type
      const name = f.name.toLowerCase();
      const extOk = ['.pdf', '.docx', '.pptx', '.xlsx', '.csv'].some((ext) => name.endsWith(ext));
      const typeOk = ACCEPTED.includes(f.type) || f.type === '' || f.type === 'application/vnd.ms-excel';
      if (!extOk && !typeOk) {
        valErrors.push(`${f.name}: unsupported type`);
        return false;
      }
      return true;
    });

    setError(valErrors.join(' | '));
    setFiles((prev) => [...prev, ...filtered]);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const onBrowse = () => {
    inputRef.current?.click();
  };

  const onInput = (e) => {
    onFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onGenerate = async () => {
    setError('');
    if (!files.length) {
      setError('Please add at least one file.');
      return;
    }
    setLoading(true);
    try {
      const blob = await exportFiles(files);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exported.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || 'Failed to generate Excel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div
        className="dropzone"
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onBrowse(); }}
        aria-label="Upload files by drag and drop or browse"
      >
        <div className="dz-content">
          <div className="dz-title">Drag & Drop your files here</div>
          <div className="dz-subtitle">PDF, DOCX, PPTX, XLSX, CSV up to {MAX_SIZE_MB}MB each</div>
          <button className="btn-secondary" onClick={onBrowse} type="button">Browse Files</button>
          <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.pptx,.xlsx,.csv" onChange={onInput} style={{ display: 'none' }} />
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list" aria-live="polite">
          {files.map((f, idx) => (
            <div key={`${f.name}-${idx}`} className="file-item">
              <div className="file-main">
                <span className="file-name">{f.name}</span>
                <span className="file-size">{bytesToMB(f.size)} MB</span>
              </div>
              <button type="button" className="btn-link" onClick={() => removeFile(idx)} aria-label={`Remove ${f.name}`}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="actions">
        <button className="btn-primary" onClick={onGenerate} type="button" disabled={loading}>
          {loading ? 'Generating…' : 'Generate Excel'}
        </button>
      </div>

      {loading && (
        <div className="progress">
          <div className="spinner" aria-hidden="true" />
          <span className="progress-text">Processing files…</span>
        </div>
      )}
    </div>
  );
}
