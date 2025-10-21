import { useMemo, useState } from "react";

// PUBLIC_INTERFACE
export default function EntityTable({ entities, onChange }) {
  /**
   * Displays entities grouped by type with inline edit/delete.
   * entities: [{ id, type, name, value, ... }]
   * onChange(nextEntities): notify parent when edits or deletions occur.
   */
  const [editing, setEditing] = useState({}); // id -> { field, value }

  const grouped = useMemo(() => {
    const g = {};
    (entities || []).forEach((e) => {
      const key = e.type || "unknown";
      if (!g[key]) g[key] = [];
      g[key].push(e);
    });
    return g;
  }, [entities]);

  const beginEdit = (id, field, initVal) => {
    setEditing((prev) => ({ ...prev, [id]: { field, value: initVal } }));
  };

  const commitEdit = (id) => {
    const edit = editing[id];
    if (!edit) return;
    const next = (entities || []).map((e) =>
      e.id === id ? { ...e, [edit.field]: edit.value } : e
    );
    onChange?.(next);
    setEditing((prev) => {
      const { [id]: omit, ...rest } = prev;
      return rest;
    });
  };

  const cancelEdit = (id) => {
    setEditing((prev) => {
      const { [id]: omit, ...rest } = prev;
      return rest;
    });
  };

  const removeEntity = (id) => {
    const next = (entities || []).filter((e) => e.id !== id);
    onChange?.(next);
  };

  const renderGroup = (type, list) => {
    return (
      <div className="entity-group" key={type}>
        <div className="entity-group-header">
          <h4>{type}</h4>
          <span className="count">{list.length}</span>
        </div>
        <div className="table">
          <div className="row header">
            <div className="cell">ID</div>
            <div className="cell">Name</div>
            <div className="cell">Value</div>
            <div className="cell actions">Actions</div>
          </div>
          {list.map((e) => {
            const ed = editing[e.id];
            const isEditing = !!ed;
            return (
              <div className="row" key={e.id}>
                <div className="cell mono">{e.id}</div>
                <div className="cell">
                  {isEditing && ed.field === "name" ? (
                    <div className="inline-edit">
                      <input
                        value={ed.value}
                        onChange={(ev) =>
                          setEditing((prev) => ({
                            ...prev,
                            [e.id]: { ...prev[e.id], value: ev.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span>{e.name ?? "-"}</span>
                  )}
                </div>
                <div className="cell">
                  {isEditing && ed.field === "value" ? (
                    <div className="inline-edit">
                      <input
                        value={ed.value}
                        onChange={(ev) =>
                          setEditing((prev) => ({
                            ...prev,
                            [e.id]: { ...prev[e.id], value: ev.target.value },
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span>{e.value ?? "-"}</span>
                  )}
                </div>
                <div className="cell actions">
                  {!isEditing ? (
                    <>
                      <button
                        className="btn subtle"
                        onClick={() => beginEdit(e.id, "name", e.name ?? "")}
                        title="Edit name"
                      >
                        Edit Name
                      </button>
                      <button
                        className="btn subtle"
                        onClick={() => beginEdit(e.id, "value", e.value ?? "")}
                        title="Edit value"
                      >
                        Edit Value
                      </button>
                      <button className="btn danger subtle" onClick={() => removeEntity(e.id)}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn success" onClick={() => commitEdit(e.id)}>
                        Save
                      </button>
                      <button className="btn" onClick={() => cancelEdit(e.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!entities || entities.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3>Extracted Entities</h3>
        </div>
        <div className="card-body">
          <p className="muted">No entities available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>Extracted Entities</h3>
        <p className="muted">Grouped by type. Inline edit and delete supported.</p>
      </div>
      <div className="card-body">{Object.entries(grouped).map(([t, list]) => renderGroup(t, list))}</div>
    </div>
  );
}
