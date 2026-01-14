/**
 * M8Flow Frontend Vite Configuration
 * 
 * This config allows extensions/frontend to run standalone while importing
 * from upstream spiffworkflow-frontend. All dependencies resolve to upstream's
 * node_modules to avoid duplicate React/Preact instances.
 */

import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 7001;

// Paths
const rootDir = path.resolve(__dirname);
const upstreamPath = path.resolve(__dirname, '../../spiffworkflow-frontend');
const upstreamSrc = path.resolve(upstreamPath, 'src');
const upstreamNodeModules = path.resolve(upstreamPath, 'node_modules');

export default defineConfig({
  base: '/',
  plugins: [
    // Use preact for bpmn-js-spiffworkflow compatibility (same as upstream)
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
  resolve: {
    alias: {
      // M8Flow source alias
      '@m8flow': path.resolve(rootDir, 'src'),

      // Point to upstream Spiff source for imports
      '@spiff': upstreamSrc,

      // Inferno alias (required for bpmn-js)
      inferno:
        process.env.NODE_ENV !== 'production'
          ? 'inferno/dist/index.dev.esm.js'
          : 'inferno/dist/index.esm.js',

      // ============================================================
      // CRITICAL: Force single instances of all context-dependent libs
      // These MUST resolve to upstream's node_modules to avoid
      // duplicate React/Preact contexts causing hooks failures
      // ============================================================

      // Preact core - MUST be single instance for hooks to work
      'preact': path.resolve(upstreamNodeModules, 'preact'),
      'preact/hooks': path.resolve(upstreamNodeModules, 'preact/hooks'),
      'preact/compat': path.resolve(upstreamNodeModules, 'preact/compat'),
      // Preact JSX runtime - point to actual files (preact uses package.json exports)
      'preact/jsx-dev-runtime': path.resolve(upstreamNodeModules, 'preact/jsx-runtime/dist/jsxRuntime.module.js'),
      'preact/jsx-runtime': path.resolve(upstreamNodeModules, 'preact/jsx-runtime/dist/jsxRuntime.module.js'),

      // React compatibility layer
      'react': path.resolve(upstreamNodeModules, 'react'),
      'react-dom': path.resolve(upstreamNodeModules, 'react-dom'),

      // Router - uses React context
      'react-router': path.resolve(upstreamNodeModules, 'react-router'),
      'react-router-dom': path.resolve(upstreamNodeModules, 'react-router-dom'),

      // i18n - uses React context
      'i18next': path.resolve(upstreamNodeModules, 'i18next'),
      'react-i18next': path.resolve(upstreamNodeModules, 'react-i18next'),

      // React Query - uses React context
      '@tanstack/react-query': path.resolve(upstreamNodeModules, '@tanstack/react-query'),
      '@tanstack/react-query-devtools': path.resolve(upstreamNodeModules, '@tanstack/react-query-devtools'),

      // Emotion - uses React context for theming
      '@emotion/react': path.resolve(upstreamNodeModules, '@emotion/react'),
      '@emotion/styled': path.resolve(upstreamNodeModules, '@emotion/styled'),
      '@emotion/cache': path.resolve(upstreamNodeModules, '@emotion/cache'),

      // MUI - uses Emotion and React context
      '@mui/material': path.resolve(upstreamNodeModules, '@mui/material'),
      '@mui/system': path.resolve(upstreamNodeModules, '@mui/system'),
      '@mui/styled-engine': path.resolve(upstreamNodeModules, '@mui/styled-engine'),
      '@mui/icons-material': path.resolve(upstreamNodeModules, '@mui/icons-material'),

      // CASL - uses React context
      '@casl/ability': path.resolve(upstreamNodeModules, '@casl/ability'),
      '@casl/react': path.resolve(upstreamNodeModules, '@casl/react'),

      // Error boundary - uses React context
      'react-error-boundary': path.resolve(upstreamNodeModules, 'react-error-boundary'),
    },
    preserveSymlinks: true,
    // Dedupe these packages to ensure single instances
    dedupe: [
      'preact',
      'preact/hooks',
      'preact/compat',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'i18next',
      'react-i18next',
      '@tanstack/react-query',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@casl/ability',
      '@casl/react',
    ],
  },
  server: {
    open: false,
    host,
    port,
    // Allow serving files from upstream
    fs: {
      allow: [
        rootDir,
        upstreamPath,
        upstreamNodeModules,
      ],
    },
  },
  preview: {
    host,
    port,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['mixed-decls'],
      },
    },
  },
  optimizeDeps: {
    // Force optimization of upstream deps
    include: [
      'preact',
      'preact/hooks',
      'preact/compat',
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@tanstack/react-query',
      'react-i18next',
      'i18next',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
});
