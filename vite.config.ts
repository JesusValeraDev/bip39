import { defineConfig } from 'vitest/config';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

let gitHash = 'dev';
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  console.warn('Could not determine git hash, using "dev"');
}

export default defineConfig({
  plugins: [
    {
      // The offline file is a build artifact. It is built on demand here rather
      // than served from dist: falling through to the dev server's fallback
      // returns index.html with a 200, which downloads as a page that looks
      // right and cannot work offline, and a stale dist is barely better.
      name: 'serve-offline-build',
      configureServer(server) {
        server.middlewares.use('/bip39-offline.html', (_req, res) => {
          try {
            execSync('npm run build', { stdio: 'pipe' });
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Could not build the offline page. Run "npm run build" to see why.');
            return;
          }

          res.setHeader('Content-Type', 'text/html');
          res.end(readFileSync('dist/bip39-offline.html'));
        });
      },
    },
  ],
  define: {
    'import.meta.env.VITE_GIT_HASH': JSON.stringify(gitHash),
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/test/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      exclude: [
        'src/main.ts',
        // Build script, exercised by the offline-download e2e specs
        'scripts/',
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
