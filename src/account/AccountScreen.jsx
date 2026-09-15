import { useState } from 'react';
import { Cloud, Check, LogOut, RefreshCw, ArrowRight, ShieldCheck, BookOpen, AlertCircle, Link, WifiOff } from 'lucide-react';
import { useAccount } from './AccountContext';
import { accountStorage, legacyProgress } from './accountStorage';
import './account.css';

/* Indicador de conexión — se inyecta desde vite.config.js vía define */
const CONNECTION = typeof __CODELINGO_CONNECTION__ !== 'undefined'
  ? __CODELINGO_CONNECTION__
  : { remote: false, label: 'http://127.0.0.1:8000' };

export function AccountScreen() {
  const account = useAccount();
  const [mode, setMode] = useState('login'), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', password: '', password_confirmation: '' });

  let hasLegacy = false;
  try { hasLegacy = Object.keys(legacyProgress()).length > 0; } catch { /* noop */ }
  const canMigrate = hasLegacy && !Object.keys(accountStorage.snapshot()).length;

  async function run(action) { setBusy(true); setMessage(''); try { await action(); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }

  function field(name, label, type, autoComplete) {
    return (
      <label>
        {label}
        <input
          name={name} type={type} autoComplete={autoComplete} value={fields[name]}
          required
          minLength={name.startsWith('password') && mode === 'register' ? 10 : undefined}
          maxLength={name === 'email' ? 254 : name === 'name' ? 80 : 128}
          onChange={e => setFields({ ...fields, [name]: e.target.value })}
        />
      </label>
    );
  }

  if (account.loading) return (
    <main className="account-page">
      <div className="account-emblem account-emblem-pulse"><Cloud size={36} /></div>
      <h1>Conectando con tu cuenta</h1>
      <p role="status" className="account-lead">Buscando tu progreso…</p>
    </main>
  );

  const statusIcon = {
    saved:   <Check size={20} />,
    saving:  <Cloud size={20} className="account-spin" />,
    pending: <Cloud size={20} />,
    error:   <WifiOff size={20} />,
  };
  const statusText = {
    saved:   'Guardado',
    saving:  'Guardando…',
    pending: 'Sincronizando…',
    error:   'Error al guardar',
  };

  return (
    <main className="account-page">
      <div className="account-emblem"><Cloud size={36} /></div>
      <span className="account-eyebrow">CODELINGO · TU PROGRESO</span>

      <h1>{account.user
        ? `Tu avance, ${account.user.name}`
        : 'Aprende aqui. Continua donde quieras.'
      }</h1>

      <p className="account-lead">{account.user
        ? account.user.email
        : 'Tus clases, ejercicios y borradores se guardan en tu cuenta.'
      }</p>

      {/* Indicador de servidor */}
      <div className={`account-env-badge ${CONNECTION.remote ? 'account-env-remote' : ''}`}>
        <Link size={13} />
        {CONNECTION.remote
          ? `Produccion: ${CONNECTION.label}`
          : 'Local (localhost)'
        }
      </div>

      {account.user ? (
        <>
          <section className="account-summary" aria-label="Estado de sincronizacion">
            <div className="account-status-row">
              {statusIcon[account.status] ?? <Cloud size={20} />}
              <strong role="status">{statusText[account.status] ?? ''}</strong>
            </div>

            {!CONNECTION.remote && (
              <div className="account-sync-tip">
                <span>Para sincronizar local con produccion, activa <code>CODELINGO_API_PROXY</code> en <code>.env.local</code> y reinicia npm run dev.</span>
              </div>
            )}

            <button
              className="duo-btn duo-btn-primary"
              disabled={busy || account.status === 'saving'}
              onClick={() => run(account.refresh)}
            >
              <RefreshCw size={18} /> Sincronizar ahora
            </button>
          </section>

          {/* Conflicto: solo se muestra si el merge automático no pudo resolverlo */}
          {account.conflict && (
            <section className="account-conflict">
              <h2>Dos versiones de tu avance</h2>
              <p>El avance automatico no pudo fusionarse. Elige que version conservar.</p>
              <button className="duo-btn" disabled={busy} onClick={() => run(() => account.resolveConflict(false))}>
                Usar version del servidor
              </button>
              <button className="duo-btn" disabled={busy} onClick={() => run(() => account.resolveConflict(true))}>
                Usar version de este dispositivo
              </button>
            </section>
          )}

          {canMigrate && (
            <section className="account-migration">
              <BookOpen size={24} />
              <h2>Rescata lo que ya aprendiste</h2>
              <p>Encontramos avance anterior en este navegador. Puedes subirlo a esta cuenta sin descargar archivos.</p>
              <button className="duo-btn duo-btn-primary" disabled={busy} onClick={() => run(account.migrate)}>
                Subir mi avance anterior <ArrowRight size={18} />
              </button>
            </section>
          )}

          {account.user?.is_admin && (
            <a href="#/admin" className="duo-btn account-admin-link">
              <ShieldCheck size={18} /> Panel de Administracion
            </a>
          )}

          <button
            className="duo-btn account-logout"
            disabled={busy || account.status === 'saving'}
            onClick={() => run(account.logout)}
          >
            <LogOut size={18} /> Cerrar sesion
          </button>
        </>
      ) : (
        <>
          <div className="account-tabs" aria-label="Acceso a tu cuenta">
            <button aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setMessage(''); }}>
              Iniciar sesion
            </button>
            <button aria-pressed={mode === 'register'} onClick={() => { setMode('register'); setMessage(''); }}>
              Crear cuenta
            </button>
          </div>

          <form
            className="account-form"
            onSubmit={e => {
              e.preventDefault();
              run(async () => {
                await account.authenticate(mode, fields);
                setFields({ name: '', email: '', password: '', password_confirmation: '' });
              });
            }}
          >
            {mode === 'register' && field('name', 'Tu nombre', 'text', 'name')}
            {field('email', 'Correo electronico', 'email', 'email')}
            {field('password', mode === 'register' ? 'Contrasena · minimo 10 caracteres' : 'Contrasena', 'password', mode === 'register' ? 'new-password' : 'current-password')}
            {mode === 'register' && field('password_confirmation', 'Repite tu contrasena', 'password', 'new-password')}
            <button className="duo-btn duo-btn-primary" disabled={busy}>
              {busy ? 'Conectando…' : mode === 'register' ? 'Crear mi cuenta' : 'Entrar y continuar'}
              <ArrowRight size={19} />
            </button>
          </form>

          <p className="account-note">
            <ShieldCheck size={18} />
            Tu contrasena se protege en el servidor. No se guarda en este navegador.
          </p>
        </>
      )}

      {(message || account.error) && (
        <p className="account-error" role="alert">
          <AlertCircle size={20} />{message || account.error}
        </p>
      )}

      {!account.user && account.error && (
        <button className="duo-btn" disabled={busy} onClick={() => run(account.bootstrap)}>
          Reintentar conexion
        </button>
      )}
    </main>
  );
}

export function SyncNotice() {
  const { status, conflict, error } = useAccount();
  if (!error && !conflict) return null;
  return (
    <a className="account-sync-notice" href="#/account" aria-live="polite">
      <Cloud size={18} />
      {conflict
        ? 'Conflicto de avance. Revisar cuenta'
        : error
          ? 'Error de guardado. Revisar cuenta'
          : status === 'saving'
            ? 'Guardando en tu cuenta…'
            : 'Cambios pendientes de guardar'
      }
    </a>
  );
}
