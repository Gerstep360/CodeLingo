let csrf = '';
let accountId = '';
export function setAccountId(id) { accountId = String(id || ''); }
export async function api(path, options = {}) {
  const base = import.meta.env.VITE_API_BASE || new URL('./api/', window.location.href).pathname;
  const response = await fetch(`${base.replace(/\/$/, '')}/${path}`, {
    credentials: 'same-origin', ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Account-ID': accountId, ...options.headers },
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('La API no está disponible. Revisa la conexión del servidor.'); }
  if (data.csrf) csrf = data.csrf;
  if (!response.ok) {
    const message = response.status === 419 ? 'Tu sesión venció. Vuelve a iniciar sesión para guardar.' : response.status === 429 ? 'Demasiados intentos. Espera un minuto.' : Object.values(data.errors || {}).flat()[0] || data.message || 'No se pudo guardar.';
    throw Object.assign(new Error(message), { status: response.status, data });
  }
  return data;
}
