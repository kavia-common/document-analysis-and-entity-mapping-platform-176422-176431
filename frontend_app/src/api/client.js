/**
 * Determine API base URL:
 * 1) Use REACT_APP_API_BASE_URL if provided.
 * 2) Otherwise, derive from current origin by swapping the port to 3001 (keeps protocol and hostname).
 *    This supports both localhost and preview environments automatically.
 */
const ENV_BASE = process.env.REACT_APP_API_BASE_URL;
let derivedBase = '';
try {
  if (typeof window !== 'undefined' && window.location) {
    const url = new URL(window.location.href);
    // Default backend port is 3001; if already 3001, keep as-is
    const backendPort = '3001';
    url.port = backendPort;
    derivedBase = `${url.protocol}//${url.hostname}:${backendPort}`;
  }
} catch {
  // no-op: stay with fallback when window/URL not available (SSR/tests)
}
const BASE_URL = ENV_BASE || derivedBase || 'http://localhost:3001';

// PUBLIC_INTERFACE
export async function exportFiles(files) {
  /** Uploads files to the backend /export endpoint and returns a Blob of the Excel file. */
  const form = new FormData();
  for (const f of files) {
    form.append('files', f, f.name);
  }

  const res = await fetch(`${BASE_URL}/export`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    let message = 'Failed to generate Excel';
    try {
      const data = await res.json();
      if (data?.detail) message = Array.isArray(data.detail) ? data.detail.map(d => d.msg || d).join('; ') : data.detail;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  return blob;
}
