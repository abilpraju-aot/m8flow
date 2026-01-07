import { defineConfig, mergeConfig, UserConfig } from 'vite';
import path from 'path';
import baseConfig from '../../spiffworkflow-frontend/vite.config';

/**
 * M8Flow Extension Configuration for Vite
 * 
 * This configuration extends the base SpiffArena Vite config to support M8Flow extensions.
 * It adds path aliases that map @m8flow/* imports to the extensions directory.
 */

const extensionsConfig: UserConfig = {
  resolve: {
    alias: {
      // M8Flow extension aliases
      '@m8flow/components': path.resolve(__dirname, '../../extensions/frontend/components'),
      '@m8flow/views': path.resolve(__dirname, '../../extensions/frontend/views'),
      '@m8flow/hooks': path.resolve(__dirname, '../../extensions/frontend/hooks'),
      '@m8flow/services': path.resolve(__dirname, '../../extensions/frontend/services'),
      '@m8flow/themes': path.resolve(__dirname, '../../extensions/frontend/themes'),
      '@m8flow/plugins': path.resolve(__dirname, '../../extensions/frontend/plugins'),
      '@m8flow/config': path.resolve(__dirname, '../../extensions/frontend/config'),
      '@m8flow/types': path.resolve(__dirname, '../../extensions/frontend/types'),
      '@m8flow/utils': path.resolve(__dirname, '../../extensions/frontend/utils'),
      '@m8flow/contexts': path.resolve(__dirname, '../../extensions/frontend/contexts'),
      
      // Integration layer
      '@m8flow/integration': path.resolve(__dirname, '../frontend'),
    },
  },
};

export default defineConfig(mergeConfig(baseConfig, extensionsConfig));

