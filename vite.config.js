import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The preview proxy forwards the public host to this dev server, so the sandbox
// host wildcard has to be allowed. Only added while running inside the preview.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;
const allowedHosts =
  previewMode && sandboxDomain ? [`.${sandboxDomain}`] : undefined;

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /<repo>/, so the production build has to
  // address its assets relatively. Dev keeps the normal root base.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts,
    watch: { usePolling: true },
  },
}));
