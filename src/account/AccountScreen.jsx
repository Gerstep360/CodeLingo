import { useState } from 'react';
import { Cloud, Check, LogOut, RefreshCw, ArrowRight, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { useAccount } from './AccountContext';
import { accountStorage, legacyProgress } from './accountStorage';
import './account.css';
export function AccountScreen() {
  const account = useAccount();
  const [mode, setMode] = useState('login'), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  let hasLegacy = false;
  try { hasLegacy = Object.keys(legacyProgress()).length > 0; } catch { /* Show validation on migration. */ }
  const canMigrate = hasLegacy && !Object.keys(accountStorage.snapshot()).length;
  async function run(action) { setBusy(true); setMessage(''); try { await action(); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }
  function field(name, label, type, autoComplete) {
    return <label>{label}<input name={name} type={type} autoComplete={autoComplete} value={fields[name]} required minLength={name.startsWith('password') && mode === 'register' ? 10 : undefined} maxLength={name === 'email' ? 254 : name === 'name' ? 80 : 128} onChange={e => setFields({ ...fields, [name]: e.target.value })} /></label>;
  }
  if (account.loading) return <main className="account-page"><Cloud size={36}/><h1>Conectando con tu cuenta</h1><p role="status">Buscando tu progreso…</p></main>;
  return <main className="account-page">
    <div className="account-emblem"><Cloud size={36}/></div>
    <span className="account-eyebrow">CODELINGO · TU PROGRESO</span>
    <h1>{account.user ? `Tu avance, ${account.user.name}` : 'Aprende aquí. Continúa donde quieras.'}</h1>
    <p className="account-lead">{account.user ? account.user.email : 'Tus clases, ejercicios y borradores se guardan en tu cuenta.'}</p>
    {account.user ? <>
      <section className="account-summary" aria-label="Estado de sincronización">
        <div>{account.status === 'saved' ? <Check size={24}/> : <Cloud size={24}/>}<strong role="status">{{saved:'Guardado en tu cuenta',saving:'Guardando cambios…',pending:'Cambios pendientes',error:'No se pudo sincronizar'}[account.status]}</strong></div>
        <p>Usa esta misma cuenta en local y en producción. Ambos deben conectarse al mismo servidor.</p>
        <button className="duo-btn duo-btn-primary" disabled={busy || account.status === 'saving'} onClick={() => run(account.refresh)}><RefreshCw size={18}/>Sincronizar ahora</button>
      </section>
      {account.conflict && <section className="account-conflict"><h2>Hay dos versiones de tu avance</h2><p>Otro dispositivo guardó cambios. Elige qué versión conservar: la elegida reemplazará la otra.</p><button className="duo-btn" disabled={busy} onClick={() => run(() => account.resolveConflict(false))}>Usar versión de la cuenta</button><button className="duo-btn" disabled={busy} onClick={() => run(() => account.resolveConflict(true))}>Guardar versión de este dispositivo</button></section>}
      {canMigrate && <section className="account-migration"><BookOpen size={24}/><h2>Rescata lo que ya aprendiste</h2><p>Encontramos avance anterior en este navegador. Puedes subirlo a esta cuenta vacía sin descargar archivos.</p><button className="duo-btn duo-btn-primary" disabled={busy} onClick={() => run(account.migrate)}>Subir mi avance anterior<ArrowRight size={18}/></button></section>}
      <button className="duo-btn account-logout" disabled={busy || account.status === 'saving'} onClick={() => run(account.logout)}><LogOut size={18}/>Cerrar sesión</button>
    </> : <>
      <div className="account-tabs" aria-label="Acceso a tu cuenta"><button aria-pressed={mode === 'login'} onClick={() => {setMode('login');setMessage('');}}>Iniciar sesión</button><button aria-pressed={mode === 'register'} onClick={() => {setMode('register');setMessage('');}}>Crear cuenta</button></div>
      <form className="account-form" onSubmit={e => { e.preventDefault(); run(async () => { await account.authenticate(mode, fields); setFields({name:'',email:'',password:'',password_confirmation:''}); }); }}>
        {mode === 'register' && field('name', 'Tu nombre', 'text', 'name')}
        {field('email', 'Correo electrónico', 'email', 'email')}
        {field('password', mode === 'register' ? 'Contraseña · mínimo 10 caracteres' : 'Contraseña', 'password', mode === 'register' ? 'new-password' : 'current-password')}
        {mode === 'register' && field('password_confirmation', 'Repite tu contraseña', 'password', 'new-password')}
        <button className="duo-btn duo-btn-primary" disabled={busy}>{busy ? 'Conectando…' : mode === 'register' ? 'Crear mi cuenta' : 'Entrar y continuar'}<ArrowRight size={19}/></button>
      </form>
      <p className="account-note"><ShieldCheck size={18}/>Tu contraseña se protege en el servidor. No se guarda en este navegador.</p>
    </>}
    {(message || account.error) && <p className="account-error" role="alert"><AlertCircle size={20}/>{message || account.error}</p>}
    {!account.user && account.error && <button className="duo-btn" disabled={busy} onClick={() => run(account.bootstrap)}>Reintentar conexión</button>}
  </main>;
}
export function SyncNotice() {
  const { status, conflict, error } = useAccount();
  if (!error && !conflict) return null;
  return <a className="account-sync-notice" href="#/account" aria-live="polite"><Cloud size={18}/>{conflict ? 'Hay cambios en otro dispositivo. Revisar cuenta' : error ? 'Guardado pendiente. Revisar cuenta' : status === 'saving' ? 'Guardando en tu cuenta…' : 'Cambios pendientes de guardar'}</a>;
}
