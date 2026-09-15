export function resolveApiTarget(raw = 'http://127.0.0.1:8000') {
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('CODELINGO_API_PROXY debe ser una URL HTTP(S) sin credenciales.');
  const local = ['localhost','127.0.0.1','[::1]'].includes(url.hostname);
  let path = url.pathname.replace(/\/+$/, '');
  if (path.endsWith('/api')) path = path.slice(0,-4);
  if (!local && !path) path = '/CodeLingo';
  return { origin: url.origin, prefix: path, label: url.origin + path, remote: !local };
}
export function proxyOptions(target, { isolated = false } = {}) {
  return {
    target: target.origin, changeOrigin: true, cookieDomainRewrite: '', cookiePathRewrite: isolated ? '/local-api' : '/',
    rewrite: path => target.prefix + (isolated ? path.replace(/^\/local-api/, '/api') : path),
    configure(proxy) {
      if (isolated) proxy.on('proxyReq', (outgoing, req) => {
        const cookies = (req.headers.cookie || '').split(';').map(c=>c.trim()).filter(c=>c.startsWith('local_api_')).map(c=>c.slice('local_api_'.length));
        outgoing.removeHeader('cookie'); if(cookies.length)outgoing.setHeader('cookie',cookies.join('; '));
      });
      proxy.on('proxyRes', (response, req) => {
        const loopback = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(req.headers.host || '');
        if (response.headers['set-cookie']) response.headers['set-cookie'] = response.headers['set-cookie'].map(cookie => {
          if (isolated) cookie = 'local_api_' + cookie;
          // Only the local development hop is HTTP; upstream TLS is still verified.
          return loopback ? cookie.replace(/;\s*Secure\b/ig, '') : cookie;
        });
      });
      proxy.on('error', (_error, _req, res) => {
        if (res.writeHead && !res.headersSent) {
          res.writeHead(502, {'Content-Type':'application/json'});
          res.end(JSON.stringify({message:'No se pudo conectar con la API configurada. Comprueba que el servidor este disponible.'}));
        }
      });
    },
  };
}
