import { useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function TaxonomyMapper({ entities, taxonomy, onSave }) {
  /**
   * Provides dropdowns L1/L2/L3 per entity to map taxonomy and POST overrides.
   * onSave(mappings): Promise
   */
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // initialize rows from entities (keep previous selections if possible)
    setRows((prev) => {
      const prevById = Object.fromEntries(prev.map((r) => [r.entityId, r]));
      return (entities || []).map((e) => {
        const existing = prevById[e.id];
        return (
          existing || {
            entityId: e.id,
            name: e.name ?? e.value ?? "",
            l1: "",
            l2: "",
            l3: "",
          }
        );
      });
    });
  }, [entities]);

  const l1Options = taxonomy?.l1 || [];
  const l2Map = taxonomy?.l2 || {};
  const l3Map = taxonomy?.l3 || {};

  const enhancedRows = useMemo(() => {
    // ensure dependent options clamp when parent changes
    return rows.map((r) => {
      const l2Options = r.l1 ? l2Map[r.l1] || [] : [];
      const hasL2 = l2Options.includes(r.l2);
      const l2 = hasL2 ? r.l2 : "";
      const l3OptionsKey = l2 ? `${r.l1}::${l2}` : r.l1 ? `${r.l1}::` : "";
      const l3Options = l3Map[l3OptionsKey] || [];
      const hasL3 = l3Options.includes(r.l3);
      const l3 = hasL3 ? r.l3 : "";
      return { ...r, l2, l3, _l2Options: l2Options, _l3Options: l3Options };
    });
  }, [rows, l2Map, l3Map]);

  const updateRow = (entityId, patch) => {
    setRows((prev) => prev.map((r) => (r.entityId === entityId ? { ...r, ...patch } : r)));
  };

  const onSubmit = async () => {
    const mappings = enhancedRows.map(({ entityId, l1, l2, l3 }) => ({ entityId, l1, l2, l3 }));
    await onSave(mappings);
  };

  if (!taxonomy) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Taxonomy Mapping</h3>
        </div>
        <div className="card-body">
          <p className="muted">Loading taxonomy options...</p>
        </div>
      </div>
    );
  }

  if (!entities || entities.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Taxonomy Mapping</h3>
        </div>
        <div className="card-body">
          <p className="muted">No entities to map yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Taxonomy Mapping</h3>
        <p className="muted">Select L1, L2, and L3 classifications per entity.</p>
      </div>
      <div className="card-body">
        <div className="table">
          <div className="row header">
            <div className="cell">Entity</div>
            <div className="cell">L1</div>
            <div className="cell">L2</div>
            <div className="cell">L3</div>
          </div>
          {enhancedRows.map((r) => (
            <div className="row" key={r.entityId}>
              <div className="cell">{r.name || r.entityId}</div>
              <div className="cell">
                <select
                  value={r.l1}
                  onChange={(e) => updateRow(r.entityId, { l1: e.target.value, l2: "", l3: "" })}
                >
                  <option value="">Select L1</option>
                  {l1Options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cell">
                <select
                  value={r.l2}
                  onChange={(e) => updateRow(r.entityId, { l2: e.target.value, l3: "" })}
                  disabled={!r._l2Options?.length}
                >
                  <option value="">Select L2</option>
                  {r._l2Options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cell">
                <select
                  value={r.l3}
                  onChange={(e) => updateRow(r.entityId, { l3: e.target.value })}
                  disabled={!r._l3Options?.length}
                >
                  <option value="">Select L3</option>
                  {r._l3Options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn primary" onClick={onSubmit}>
            Save Mappings
          </button>
        </div>
      </div>
    </div>
  );
}
