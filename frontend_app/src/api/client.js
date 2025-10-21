//
// REST API client for the frontend app, using env-driven base URL
//

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// Helper to build full URL
function url(path) {
  const base = BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

// Internal: parse JSON safely
async function parseJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

// PUBLIC_INTERFACE
export async function apiUploadFile(file) {
  /**
   * Upload a file to the backend.
   * Returns: { job_id: string }
   */
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url("/uploads"), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Upload failed");
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiGetJobStatus(jobId) {
  /**
   * Get job status by jobId.
   * Returns: { status: string, progress?: number, stage?: string, error?: string }
   */
  const res = await fetch(url(`/jobs/${encodeURIComponent(jobId)}/status`));
  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Failed to get job status");
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiGetEntities(jobId) {
  /**
   * Get extracted entities by jobId.
   * Returns: { entities: Array<{ id, type, name, value, ... }> }
   */
  const res = await fetch(url(`/jobs/${encodeURIComponent(jobId)}/entities`));
  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Failed to load entities");
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiGetTaxonomy() {
  /**
   * Get taxonomy options for L1/L2/L3.
   * Expected return shape example:
   * {
   *   l1: string[],
   *   l2: Record<string, string[]>,
   *   l3: Record<string, string[]>
   * }
   */
  const res = await fetch(url(`/taxonomy`));
  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Failed to load taxonomy");
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPostTaxonomyMap(jobId, mappings) {
  /**
   * Post taxonomy mapping overrides.
   * mappings: Array<{ entityId, l1, l2, l3 }>
   * Returns: { success: boolean }
   */
  const res = await fetch(url(`/jobs/${encodeURIComponent(jobId)}/taxonomy/map`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mappings }),
  });
  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Failed to save mappings");
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDownloadReport(jobId) {
  /**
   * Download the report for the given jobId.
   * Returns a Blob (Excel likely); consumer must trigger file download.
   */
  const res = await fetch(url(`/jobs/${encodeURIComponent(jobId)}/report`), {
    method: "GET",
  });
  if (!res.ok) {
    const payload = await parseJson(res);
    throw new Error(payload?.detail || "Report not ready");
  }
  return res.blob();
}
