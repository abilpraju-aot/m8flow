/**
 * M8Flow Plugin Initialization
 * 
 * Initializes all M8Flow plugins and extensions.
 */

import { extensionRegistry } from './ExtensionRegistry';
import { PluginContext } from '@m8flow/types';

/**
 * Initialize all M8Flow plugins
 * 
 * This function is called once during app startup to register all extensions.
 */
export function initializePlugins(context?: Partial<PluginContext>): void {
  console.log('🚀 Initializing M8Flow plugins...');

  const pluginContext: PluginContext = {
    registry: extensionRegistry,
    config: context?.config || {},
    services: context?.services || {},
  };

  // Import and initialize plugin modules here
  // Each plugin module should call registry.register() to register its extensions
  
  try {
    // Example: Load multi-tenancy plugin
    // import('./plugins/multiTenancyPlugin').then(module => {
    //   module.default(pluginContext);
    // });

    console.log('✓ M8Flow plugins initialized');
  } catch (error) {
    console.error('✗ Error initializing M8Flow plugins:', error);
  }
}

/**
 * Helper to create a plugin
 */
export function createPlugin(
  name: string,
  initialize: (context: PluginContext) => void
) {
  return function (context: PluginContext) {
    console.log(`  Loading plugin: ${name}`);
    try {
      initialize(context);
      console.log(`  ✓ ${name} loaded`);
    } catch (error) {
      console.error(`  ✗ Failed to load ${name}:`, error);
    }
  };
}

