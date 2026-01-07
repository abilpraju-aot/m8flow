import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 7001;

/**
 * M8Flow Vite Configuration
 * 
 * This extends the standard SpiffArena config with M8Flow extension support.
 * Use this config when developing M8Flow: npm start -- --config vite.config.m8flow.ts
 */

export default defineConfig({
  base: '/',
  plugins: [
    preact({ devToolsEnabled: false }),
    viteTsconfigPaths(),
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  server: {
    open: false,
    host,
    port,
  },
  preview: {
    host,
    port,
  },
  resolve: {
    alias: {
      // Upstream inferno alias
      inferno:
        process.env.NODE_ENV !== 'production'
          ? 'inferno/dist/index.dev.esm.js'
          : 'inferno/dist/index.esm.js',
      
      // M8Flow extension aliases
      '@m8flow/components': path.resolve(__dirname, '../extensions/frontend/components'),
      '@m8flow/views': path.resolve(__dirname, '../extensions/frontend/views'),
      '@m8flow/hooks': path.resolve(__dirname, '../extensions/frontend/hooks'),
      '@m8flow/services': path.resolve(__dirname, '../extensions/frontend/services'),
      '@m8flow/themes': path.resolve(__dirname, '../extensions/frontend/themes'),
      '@m8flow/plugins': path.resolve(__dirname, '../extensions/frontend/plugins'),
      '@m8flow/config': path.resolve(__dirname, '../extensions/frontend/config'),
      '@m8flow/types': path.resolve(__dirname, '../extensions/frontend/types'),
      '@m8flow/utils': path.resolve(__dirname, '../extensions/frontend/utils'),
      '@m8flow/contexts': path.resolve(__dirname, '../extensions/frontend/contexts'),
      
      // Integration layer
      '@m8flow/integration': path.resolve(__dirname, '../integration/frontend'),
    },
    preserveSymlinks: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls'],
      },
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.m8flow.html'),
      },
    },
  },
});

