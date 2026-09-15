import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { resolveApiTarget, proxyOptions } from './scripts/api-proxy.mjs';
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const target = resolveApiTarget(env.CODELINGO_API_PROXY);
  return {
    base: env.VITE_BASE_PATH || './',
    plugins: [react()],
    define: { __CODELINGO_CONNECTION__: JSON.stringify({ remote: target.remote, label: target.label }) },
    server: { proxy: {
      '/api': proxyOptions(target),
      '/local-api': proxyOptions(resolveApiTarget(env.CODELINGO_LOCAL_API || 'http://127.0.0.1:8000'), { isolated: true }),
    } },
  };
});
