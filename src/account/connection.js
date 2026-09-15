const configured = typeof __CODELINGO_CONNECTION__ === 'undefined' ? null : __CODELINGO_CONNECTION__;
export const connection = import.meta.env.DEV
  ? { remote: !!configured?.remote, label: configured?.label || 'http://127.0.0.1:8000', canReadLocal: !!configured?.remote }
  : { remote: true, label: new URL('./api/', window.location.href).origin + new URL('./api/', window.location.href).pathname.replace(/\/api\/$/, ''), canReadLocal: false };
