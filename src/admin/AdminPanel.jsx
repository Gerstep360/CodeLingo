import { useState, useEffect, useCallback } from 'react';
import { Users, ShieldCheck, RotateCcw, Unlock, ChevronLeft, Crown, UserX, CheckSquare, Square, Loader2, AlertTriangle, Check } from 'lucide-react';
import { api } from '../account/api';
import { getAllNodes, DUO_UNITS } from '../content/curriculumAdapter';
import './admin.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ msg, type = 'ok', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`admin-toast admin-toast-${type}`}>
      {type === 'ok' ? <Check size={16} /> : <AlertTriangle size={16} />}
      <span>{msg}</span>
    </div>
  );
}

function Spinner() {
  return <Loader2 size={20} className="admin-spinner" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// User Row
// ─────────────────────────────────────────────────────────────────────────────
function UserRow({ user, onSelect }) {
  return (
    <button type="button" className="admin-user-row" onClick={() => onSelect(user)}>
      <div className="admin-user-avatar">
        {user.name.charAt(0).toUpperCase()}
        {user.is_admin && <Crown size={10} className="admin-crown" />}
      </div>
      <div className="admin-user-info">
        <span className="admin-user-name">{user.name}</span>
        <span className="admin-user-email">{user.email}</span>
      </div>
      <div className="admin-user-stats">
        <span className="admin-user-badge">{user.nodes_done} nodos</span>
        {user.is_admin && <span className="admin-user-badge admin-badge-admin">Admin</span>}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Panel — manage a single user
// ─────────────────────────────────────────────────────────────────────────────
function UserDetail({ user: initialUser, currentAdminId, onBack, onToast }) {
  const [user, setUser] = useState(initialUser);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For the node checklist
  const allNodes = getAllNodes ? getAllNodes() : [];
  const [checked, setChecked] = useState(new Set());
  const [showChecklist, setShowChecklist] = useState(false);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const p = await api(`admin/users/${user.id}/progress`);
      setProgress(p);
      // Parse completed nodes from the stored values
      const raw = p.values?.vargas_duo_completed;
      const nodes = raw ? JSON.parse(raw) : [];
      setChecked(new Set(nodes));
    } catch (e) {
      onToast(e.message, 'err');
    } finally {
      setLoading(false);
    }
  }, [user.id, onToast]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  async function doAction(fn, successMsg) {
    setSaving(true);
    try {
      await fn();
      onToast(successMsg, 'ok');
      await loadProgress();
    } catch (e) {
      onToast(e.message, 'err');
    } finally {
      setSaving(false);
    }
  }

  async function unlockAll() {
    const allNodeIds = allNodes.map(n => n.id);
    const current = progress?.values ?? {};
    const next = {
      ...current,
      vargas_duo_completed: JSON.stringify(allNodeIds),
      vargas_duo_xp: String(allNodeIds.length * 50),
    };
    await doAction(
      () => api(`admin/users/${user.id}/progress`, { method: 'PUT', body: JSON.stringify({ values: next }) }),
      `Todo desbloqueado para ${user.name} ✓`
    );
  }

  async function resetProgress() {
    if (!window.confirm(`¿Eliminar todo el progreso de ${user.name}? Esta acción no se puede deshacer.`)) return;
    await doAction(
      () => api(`admin/users/${user.id}/progress`, { method: 'DELETE' }),
      `Progreso de ${user.name} eliminado.`
    );
  }

  async function saveChecklist() {
    const nodeIds = [...checked];
    const current = progress?.values ?? {};
    const next = {
      ...current,
      vargas_duo_completed: JSON.stringify(nodeIds),
      vargas_duo_xp: String(nodeIds.length * 50),
    };
    await doAction(
      () => api(`admin/users/${user.id}/progress`, { method: 'PUT', body: JSON.stringify({ values: next }) }),
      'Progreso guardado.'
    );
    setShowChecklist(false);
  }

  async function toggleAdmin() {
    if (user.id === currentAdminId) { onToast('No puedes quitarte el rol a ti mismo.', 'err'); return; }
    const newVal = !user.is_admin;
    await doAction(async () => {
      const updated = await api(`admin/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ is_admin: newVal }) });
      setUser(updated);
    }, newVal ? `${user.name} es ahora administrador.` : `${user.name} ya no es administrador.`);
  }

  function toggleNode(id) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Group nodes by DUO_UNITS for cleaner display
  const nodesByUnit = DUO_UNITS.map(unit => ({
    unitId: unit.id,
    title: unit.title,
    nodes: unit.nodes,
  }));

  const xp = progress?.values?.vargas_duo_xp ?? '0';
  const streak = progress?.values?.vargas_duo_streak ?? '0';

  return (
    <div className="admin-detail">
      <button type="button" className="admin-back-btn" onClick={onBack}>
        <ChevronLeft size={18} /> Volver
      </button>

      <div className="admin-detail-header">
        <div className="admin-detail-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="admin-detail-name">{user.name}</h2>
          <p className="admin-detail-email">{user.email}</p>
          <div className="admin-detail-badges">
            {user.is_admin && <span className="admin-user-badge admin-badge-admin"><Crown size={11}/> Admin</span>}
            <span className="admin-user-badge">Rev. {progress?.revision ?? 0}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><Spinner /> Cargando progreso…</div>
      ) : (
        <>
          <div className="admin-stats-row">
            <div className="admin-stat-card">
              <span className="admin-stat-val">{checked.size}</span>
              <span className="admin-stat-label">Nodos completados</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-val">{xp}</span>
              <span className="admin-stat-label">XP total</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-val">{streak}</span>
              <span className="admin-stat-label">Racha días</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-val">{allNodes.length}</span>
              <span className="admin-stat-label">Total nodos</span>
            </div>
          </div>

          <div className="admin-actions-grid">
            <button type="button" className="admin-action-btn admin-action-unlock" onClick={unlockAll} disabled={saving}>
              {saving ? <Spinner /> : <Unlock size={18} />}
              Desbloquear todo
            </button>
            <button type="button" className="admin-action-btn admin-action-checklist" onClick={() => setShowChecklist(v => !v)} disabled={saving}>
              <CheckSquare size={18} />
              Editar nodo a nodo
            </button>
            <button type="button" className="admin-action-btn admin-action-reset" onClick={resetProgress} disabled={saving}>
              {saving ? <Spinner /> : <RotateCcw size={18} />}
              Resetear progreso
            </button>
            <button type="button" className={`admin-action-btn ${user.is_admin ? 'admin-action-demote' : 'admin-action-promote'}`} onClick={toggleAdmin} disabled={saving || user.id === currentAdminId}>
              {user.is_admin ? <UserX size={18} /> : <Crown size={18} />}
              {user.is_admin ? 'Quitar admin' : 'Hacer admin'}
            </button>
          </div>

          {showChecklist && (
            <div className="admin-checklist">
              <div className="admin-checklist-header">
                <h3>Selecciona los nodos completados</h3>
                <div className="admin-checklist-meta">{checked.size} / {allNodes.length} marcados</div>
              </div>
              <div className="admin-checklist-quick">
                <button type="button" onClick={() => setChecked(new Set(allNodes.map(n => n.id)))}>Marcar todos</button>
                <button type="button" onClick={() => setChecked(new Set())}>Desmarcar todos</button>
              </div>
              <div className="admin-checklist-body">
                {nodesByUnit.map(({ unitId, title, nodes }) => (
                  <div key={unitId} className="admin-checklist-group">
                    <div className="admin-checklist-group-title">{title}</div>
                    {nodes.map(node => {
                      const done = checked.has(node.id);
                      return (
                        <label key={node.id} className={`admin-node-row ${done ? 'is-checked' : ''}`}>
                          <button type="button" className="admin-node-check" onClick={() => toggleNode(node.id)}>
                            {done ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                          <span className="admin-node-role">{node.nodeRole}</span>
                          <span className="admin-node-title">{node.title}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="admin-checklist-footer">
                <button type="button" className="admin-save-btn" onClick={saveChecklist} disabled={saving}>
                  {saving ? <Spinner /> : <Check size={16} />}
                  Guardar cambios
                </button>
                <button type="button" className="admin-cancel-btn" onClick={() => setShowChecklist(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminPanel
// ─────────────────────────────────────────────────────────────────────────────
export function AdminPanel({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  function showToast(msg, type = 'ok') {
    setToast({ msg, type, key: Date.now() });
  }

  useEffect(() => {
    api('admin/users')
      .then(setUsers)
      .catch(e => showToast(e.message, 'err'))
      .finally(() => setLoading(false));
  }, []);

  function refreshUsers() {
    api('admin/users').then(setUsers).catch(() => {});
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      {toast && (
        <Toast
          key={toast.key}
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {selected ? (
        <UserDetail
          user={selected}
          currentAdminId={currentUser?.id}
          onBack={() => { setSelected(null); refreshUsers(); }}
          onToast={showToast}
        />
      ) : (
        <>
          <div className="admin-header">
            <div className="admin-header-icon"><ShieldCheck size={28} /></div>
            <div>
              <h1 className="admin-title">Panel de Administración</h1>
              <p className="admin-subtitle">Gestiona usuarios y progreso de CodeLingo</p>
            </div>
          </div>

          <div className="admin-search-wrap">
            <Users size={16} className="admin-search-icon" />
            <input
              className="admin-search"
              type="search"
              placeholder="Buscar por nombre o correo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="admin-user-count">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="admin-loading"><Spinner /> Cargando usuarios…</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No se encontraron usuarios.</div>
          ) : (
            <div className="admin-user-list">
              {filtered.map(u => (
                <UserRow key={u.id} user={u} onSelect={setSelected} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
