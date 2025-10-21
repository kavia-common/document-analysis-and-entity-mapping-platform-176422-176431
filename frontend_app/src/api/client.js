const BASE_URL = 'http://localhost:3001';

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
