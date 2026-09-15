import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

import { useEffect, useRef, useState } from 'react';

import { accountStorage, legacyProgress, validateValues } from './accountStorage';

import { api, setAccountId } from './api';

import { AccountScreen } from './AccountScreen';

import { AccountContext as Context } from './AccountContext';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: contar nodos completados en un objeto de valores
// ─────────────────────────────────────────────────────────────────────────────
function countNodes(values) {
  try {
    const raw = values?.vargas_duo_completed ?? values?.['vargas_duo_completed'];
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

// Combina dos sets de progreso: une los nodos completados y toma el máximo de XP.
// Para claves que no son nodos/xp, gana el valor local (más reciente por defecto).
function mergeProgress(localValues, remoteValues) {
  const merged = { ...remoteValues, ...localValues };

  // Unir nodos completados (union de ambos arrays)
  try {
    const localNodes  = new Set(JSON.parse(localValues?.vargas_duo_completed  || '[]'));
    const remoteNodes = new Set(JSON.parse(remoteValues?.vargas_duo_completed || '[]'));
    const union = [...new Set([...localNodes, ...remoteNodes])];
    merged.vargas_duo_completed = JSON.stringify(union);
  } catch { /* si algo falla, queda el local */ }

  // XP: tomar el mayor
  try {
    const lxp = parseInt(localValues?.vargas_duo_xp  || '0', 10);
    const rxp = parseInt(remoteValues?.vargas_duo_xp || '0', 10);
    merged.vargas_duo_xp = String(Math.max(lxp, rxp));
  } catch { /* queda local */ }

  // Racha: tomar la mayor
  try {
    const ls = parseInt(localValues?.vargas_duo_streak  || '0', 10);
    const rs = parseInt(remoteValues?.vargas_duo_streak || '0', 10);
    merged.vargas_duo_streak = String(Math.max(ls, rs));
  } catch { /* queda local */ }

  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
export function AccountProvider({ children }) {

  useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');

  const [status, setStatus] = useState('saved'), [conflict, setConflict] = useState(null), [epoch, setEpoch] = useState(0);

  const current = useRef({ user: null, revision: 0, generation: 0, dirty: false, busy: false, conflict: false });

  const timer = useRef(null);

  const pendingKey = id => `codelingo_pending_${id}`;

  function preserve() {

    const c = current.current;

    try { localStorage.setItem(pendingKey(c.user.id), JSON.stringify({ revision: c.revision, values: accountStorage.snapshot() })); }

    catch { setError('No se pudo crear la copia de recuperacion. Mantén esta pestaña abierta hasta guardar.'); }

  }

  async function flush() {

    const c = current.current;

    if (!c.user || !c.dirty || c.busy || c.conflict) return;

    c.busy = true; setStatus('saving');

    const generation = c.generation;

    try {

      const values = validateValues(accountStorage.snapshot());

      const result = await api('progress', { method: 'PUT', body: JSON.stringify({ revision: c.revision, values }) });

      c.revision = result.revision;

      c.dirty = c.generation !== generation;

      if (c.dirty) preserve();

      else localStorage.removeItem(pendingKey(c.user.id));

      setError(''); setStatus(c.dirty ? 'pending' : 'saved');

    } catch (e) {

      setError(e.message); setStatus('error');

      if (e.status === 409) { c.conflict = true; setConflict(e.data); }

      if ([401, 403, 419].includes(e.status)) { preserve(); c.user = null; setUser(null); setError('La sesión cambió o venció. Inicia sesión para recuperar tus cambios pendientes.'); }

    } finally { c.busy = false; }

    if (c.dirty && !c.conflict && c.generation !== generation) timer.current = setTimeout(flush, 1200);

  }

  // ─── activate: el núcleo de la sincronización inteligente ─────────────────
  // Regla: gana quien tenga MÁS nodos completados. Si hay empate, se fusionan.
  // Si local gana → se sube al servidor automáticamente (forzando la revisión
  // del servidor para evitar el 409).
  async function activate(account) {

    setAccountId(account.id);

    const remote = await api('progress');

    // Leer progreso local pendiente (si existe de una sesión anterior sin subir)
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(pendingKey(account.id)) || 'null');
      if (cached) validateValues(cached.values);
    } catch { cached = null; }

    const localValues  = cached?.values ?? {};
    const remoteValues = remote.values ?? {};

    const localCount  = countNodes(localValues);
    const remoteCount = countNodes(remoteValues);

    let finalValues;
    let needsUpload = false;

    if (localCount === 0 && remoteCount === 0) {
      // Sin progreso en ningún lado → vacío, no subir nada
      finalValues  = remoteValues;
      needsUpload  = false;

    } else if (localCount === 0) {
      // Solo el servidor tiene progreso → bajar del servidor
      finalValues = remoteValues;
      needsUpload = false;

    } else if (remoteCount === 0) {
      // Solo local tiene progreso → subir al servidor
      finalValues = localValues;
      needsUpload = true;

    } else {
      // Ambos tienen progreso → fusionar (union de nodos, max de XP)
      finalValues = mergeProgress(localValues, remoteValues);
      // Subir si el merge tiene más nodos que el servidor
      needsUpload = countNodes(finalValues) > remoteCount;
    }

    accountStorage.hydrate(finalValues);

    // Usar la revisión del servidor como base para poder subir sin 409
    current.current = {
      user:       account,
      revision:   remote.revision,
      generation: 0,
      dirty:      needsUpload,
      busy:       false,
      conflict:   false,
    };

    setConflict(null);
    setUser(account);
    setStatus(needsUpload ? 'pending' : 'saved');
    setError('');
    setEpoch(e => e + 1);

    // Si necesitamos subir, hacerlo de inmediato
    if (needsUpload) {
      preserve();
      await flush();
    }

  }

  async function bootstrap() {

    setLoading(true); setError('');

    try { const result = await api('session'); if (result.user) await activate(result.user); }

    catch (e) { setError(e.message); }

    finally { setLoading(false); }

  }

  useEffect(() => {

    let active = true;

    // A single initialization per mounted provider; StrictMode's effect replay is harmless.

    api('session').then(async data => { if (active && data.user) await activate(data.user); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });

    const unsubscribe = accountStorage.subscribe(() => {

      const c = current.current; if (!c.user) return;

      c.dirty = true; c.generation++; preserve(); setStatus('pending');

      clearTimeout(timer.current); timer.current = setTimeout(flush, 1200);

    });

    const online = () => flush();

    const beforeUnload = event => { if (current.current.dirty) { event.preventDefault(); event.returnValue = ''; } };

    const hidden = () => { if (document.visibilityState === 'hidden') flush(); };

    window.addEventListener('online', online); window.addEventListener('beforeunload', beforeUnload); document.addEventListener('visibilitychange', hidden);

    return () => { active = false; unsubscribe(); clearTimeout(timer.current); window.removeEventListener('online', online); window.removeEventListener('beforeunload', beforeUnload); document.removeEventListener('visibilitychange', hidden); };

  }, []);

  async function authenticate(mode, fields) {

    await api('session');

    const result = await api(mode, { method: 'POST', body: JSON.stringify(fields) });

    await activate(result.user);

  }

  async function logout() {

    await flush();

    if (current.current.dirty) throw new Error('Hay cambios sin guardar. Resuelve la sincronizacion antes de salir.');

    await api('logout', { method: 'POST' });

    current.current.user = null; setAccountId(null); accountStorage.hydrate({}); setUser(null); setConflict(null); setError('');

  }

  async function refresh() {

    if (current.current.busy) return;

    // Obtener el estado actual del servidor y volver a aplicar la lógica de merge
    await activate(current.current.user);

  }

  async function resolveConflict(useLocal) {

    const c = current.current;

    if (c.busy) return;

    const latest = await api('progress');

    c.revision = latest.revision; c.conflict = false; setConflict(null);

    if (useLocal) { c.dirty = true; preserve(); await flush(); }

    else { accountStorage.hydrate(latest.values); c.dirty = false; localStorage.removeItem(pendingKey(c.user.id)); setError(''); setStatus('saved'); setEpoch(e => e + 1); }

  }

  async function migrate() {

    if (Object.keys(accountStorage.snapshot()).length) throw new Error('La cuenta ya tiene progreso. La migracion inicial solo esta disponible en una cuenta vacia.');

    const old = legacyProgress();

    if (!Object.keys(old).length) throw new Error('No se encontro progreso anterior en este navegador.');

    accountStorage.hydrate(old); current.current.dirty = true; current.current.generation++; preserve(); await flush(); setEpoch(e => e + 1);

  }

  const value = { user, loading, error, status, conflict, authenticate, logout, refresh, flush, resolveConflict, migrate, bootstrap };

  return <Context.Provider value={value}>{!user ? <AccountScreen /> : <div key={`${user.id}:${epoch}`}>{children}</div>}</Context.Provider>;

}
