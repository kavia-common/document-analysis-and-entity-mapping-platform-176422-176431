import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiUploadFile,
  apiGetJobStatus,
  apiGetEntities,
  apiGetTaxonomy,
  apiPostTaxonomyMap,
  apiDownloadReport,
} from "../api/client";

// PUBLIC_INTERFACE
export function useApi() {
  /**
   * Provides high-level API orchestration: upload, poll status, load entities/taxonomy,
   * save mappings, and download report, with simple state management.
   */
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [entities, setEntities] = useState([]);
  const [taxonomy, setTaxonomy] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollTimer = useRef(null);

  // Clear timer unmount
  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  const upload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiUploadFile(file);
      setJobId(res.job_id);
      setStatus({ status: "queued", progress: 0, stage: "queued" });
      return res.job_id;
    } catch (e) {
      setError(e.message || "Upload failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatusOnce = useCallback(async (jid) => {
    const res = await apiGetJobStatus(jid);
    setStatus(res);
    return res;
  }, []);

  const pollStatus = useCallback(
    async (jid, intervalMs = 1500) => {
      if (!jid) return;
      try {
        const s = await fetchStatusOnce(jid);
        if (s.status === "completed" || s.status === "failed") {
          // Terminal
          return s;
        }
        pollTimer.current = setTimeout(() => {
          pollStatus(jid, intervalMs);
        }, intervalMs);
        return s;
      } catch (e) {
        setError(e.message || "Failed to poll status");
        // Continue polling in case of transient error
        pollTimer.current = setTimeout(() => {
          pollStatus(jid, intervalMs * 1.5);
        }, intervalMs * 1.5);
      }
    },
    [fetchStatusOnce]
  );

  const loadEntities = useCallback(async (jid) => {
    setError(null);
    try {
      const res = await apiGetEntities(jid);
      setEntities(res.entities || []);
      return res.entities || [];
    } catch (e) {
      setError(e.message || "Failed to load entities");
      return [];
    }
  }, []);

  const loadTaxonomy = useCallback(async () => {
    setError(null);
    try {
      const res = await apiGetTaxonomy();
      setTaxonomy(res);
      return res;
    } catch (e) {
      setError(e.message || "Failed to load taxonomy");
      return null;
    }
  }, []);

  const saveMappings = useCallback(async (jid, mappings) => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiPostTaxonomyMap(jid, mappings);
      return res;
    } catch (e) {
      setError(e.message || "Failed to save mappings");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadReport = useCallback(async (jid) => {
    setError(null);
    try {
      const blob = await apiDownloadReport(jid);
      return blob;
    } catch (e) {
      setError(e.message || "Report not ready");
      throw e;
    }
  }, []);

  return {
    // state
    jobId,
    status,
    entities,
    taxonomy,
    loading,
    error,

    // actions
    upload,
    pollStatus,
    loadEntities,
    loadTaxonomy,
    saveMappings,
    downloadReport,

    // utilities
    setJobId,
    setEntities,
  };
}
