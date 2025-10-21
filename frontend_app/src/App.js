import { useEffect } from "react";
import "./App.css";
import { applyCssVariables } from "./theme";
import { useApi } from "./hooks/useApi";
import UploadPanel from "./components/UploadPanel";
import ProgressBar from "./components/ProgressBar";
import EntityTable from "./components/EntityTable";
import TaxonomyMapper from "./components/TaxonomyMapper";
import ReportDownload from "./components/ReportDownload";

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application shell with Ocean Professional theme and Classic layout.
   */
  const {
    jobId,
    status,
    entities,
    taxonomy,
    loading,
    error,
    upload,
    pollStatus,
    loadEntities,
    loadTaxonomy,
    saveMappings,
    downloadReport,
    setEntities,
  } = useApi();

  // apply theme vars
  useEffect(() => {
    applyCssVariables();
  }, []);

  // Load entities and taxonomy when job completes
  useEffect(() => {
    if (jobId && status?.status === "completed") {
      loadEntities(jobId);
      loadTaxonomy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, status?.status]);

  const onUpload = async (file) => {
    const jid = await upload(file);
    await pollStatus(jid);
  };

  const onEntitiesChange = (next) => {
    setEntities(next);
  };

  const onSaveMappings = async (mappings) => {
    await saveMappings(jobId, mappings);
  };

  const onDownloadReport = async () => {
    return downloadReport(jobId);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Document Analysis</div>
        <div className="nav">
          <span>Upload</span>
          <span>Progress</span>
          <span>Entities</span>
          <span>Taxonomy</span>
          <span>Report</span>
        </div>
      </aside>

      <header className="topbar">
        <div className="title">AI-driven Document Entity Mapping</div>
        <div className="right">
          {loading && <span className="muted">Working...</span>}
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="section">
            <UploadPanel onUpload={onUpload} />
            <ProgressBar jobId={jobId} status={status} onPoll={pollStatus} />
            <ReportDownload jobId={jobId} onDownload={onDownloadReport} />
          </div>
          <div className="section">
            <EntityTable entities={entities} onChange={onEntitiesChange} />
            <TaxonomyMapper entities={entities} taxonomy={taxonomy} onSave={onSaveMappings} />
          </div>
        </div>

        {error && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-body">
              <div className="alert error" role="alert">
                {error}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
