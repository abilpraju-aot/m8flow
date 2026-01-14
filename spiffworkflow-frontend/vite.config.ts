import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 7001;

// M8Flow extension path - all customizations live here
const m8flowExtensionPath = path.resolve(__dirname, '../extensions/frontend/src');

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '/',
  plugins: [
    // react(),
    // seems to replace preact. hot module replacement doesn't work, so commented out. also causes errors when navigating with TabList:
    // Cannot read properties of undefined (reading 'disabled')
    // prefresh(),
    // we need preact for bpmn-js-spiffworkflow. see https://forum.bpmn.io/t/custom-prop-for-service-tasks-typeerror-cannot-add-property-object-is-not-extensible/8487
    preact({ devToolsEnabled: false }),
    viteTsconfigPaths(),
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  // for prefresh, from https://github.com/preactjs/prefresh/issues/454#issuecomment-1456491801, not working
  // optimizeDeps: {
  //   include: ['preact/hooks', 'preact/compat', 'preact']
  // },
  server: {
    // this ensures that the browser DOES NOT open upon server start
    open: false,
    host,
    port,
    // M8Flow: Allow serving files from extensions directory
    fs: {
      allow: [
        path.resolve(__dirname),
        m8flowExtensionPath,
      ],
    },
  },
  preview: {
    host,
    port,
  },
  resolve: {
    alias: {
      inferno:
        process.env.NODE_ENV !== 'production'
          ? 'inferno/dist/index.dev.esm.js'
          : 'inferno/dist/index.esm.js',
      // M8Flow: Point to extension customizations
      '@m8flow': m8flowExtensionPath,
      // M8Flow: Alias for upstream src (allows extensions to import upstream code)
      '@spiff': path.resolve(__dirname, 'src'),
    },
    preserveSymlinks: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // carbon creates this warning and it's not worth fixing
        silenceDeprecations: ['mixed-decls'],
      },
    }
  }
});
