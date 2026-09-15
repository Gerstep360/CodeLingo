import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

import { useEffect, useRef, useState } from 'react';

import { accountStorage, legacyProgress, validateValues } from './accountStorage';

import { api, setAccountId } from './api';

import { AccountScreen } from './AccountScreen';

import { AccountContext as Context } from './AccountContext';

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

    catch { setError('No se pudo crear la copia de recuperaciÃ³n. MantÃ©n esta pestaÃ±a abierta hasta guardar.'); }

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

  async function activate(account) {

    setAccountId(account.id);

    const remote = await api('progress');

    let cached = null;

    try { cached = JSON.parse(localStorage.getItem(pendingKey(account.id)) || 'null'); if (cached) validateValues(cached.values); } catch { cached = null; }

    accountStorage.hydrate(cached?.values || remote.values);

    current.current = { user: account, revision: remote.revision, generation: 0, dirty: !!cached, busy: false, conflict: !!cached && cached.revision !== remote.revision };

    setConflict(current.current.conflict ? remote : null);

    setUser(account); setStatus(cached ? 'pending' : 'saved'); setError(''); setEpoch(e => e + 1);

    if (cached && !current.current.conflict) await flush();

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

    if (current.current.dirty) throw new Error('Hay cambios sin guardar. Resuelve la sincronizaciÃ³n antes de salir.');

    await api('logout', { method: 'POST' });

    current.current.user = null; setAccountId(null); accountStorage.hydrate({}); setUser(null); setConflict(null); setError('');

  }

  async function refresh() {

    if (current.current.busy) return;

    await flush();

    if (current.current.dirty) return;

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

    if (Object.keys(accountStorage.snapshot()).length) throw new Error('La cuenta ya tiene progreso. La migraciÃ³n inicial solo estÃ¡ disponible en una cuenta vacÃ­a.');

    const old = legacyProgress();

    if (!Object.keys(old).length) throw new Error('No se encontrÃ³ progreso anterior en este navegador.');

    accountStorage.hydrate(old); current.current.dirty = true; current.current.generation++; preserve(); await flush(); setEpoch(e => e + 1);

  }

  const value = { user, loading, error, status, conflict, authenticate, logout, refresh, flush, resolveConflict, migrate, bootstrap };

  return <Context.Provider value={value}>{!user ? <AccountScreen /> : <div key={`${user.id}:${epoch}`}>{children}</div>}</Context.Provider>;

}

