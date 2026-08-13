import { defineConfig } from 'vitest/config';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

let gitHash = 'dev';
try {
  gitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  console.warn('Could not determine git hash, using "dev"');
}

export default defineConfig({
  plugins: [
    {
      // The offline file is a build artifact, so the dev server hands out the
      // last built one rather than leaving the download button dead.
      name: 'serve-offline-build',
      configureServer(server) {
        server.middlewares.use('/bip39-offline.html', (_req, res, next) => {
          const file = 'dist/bip39-offline.html';

          if (!existsSync(file)) return next();

          res.setHeader('Content-Type', 'text/html');
          res.end(readFileSync(file));
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
