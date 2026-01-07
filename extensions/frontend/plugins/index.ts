/**
 * M8Flow Plugin System
 * 
 * Main entry point for the plugin system.
 */

export { extensionRegistry, ExtensionRegistryImpl } from './ExtensionRegistry';
export { ExtensionPoint, useHasExtensions, useExtensions } from './ExtensionPoint';
export { initializePlugins } from './initialize';

// Re-export types
export type {
  Extension,
  ComponentExtension,
  RouteExtension,
  HookExtension,
  ServiceExtension,
  ThemeExtension,
  PluginConfig,
  PluginContext,
  ExtensionPointId,
  ExtensionPriority,
} from '@m8flow/types';

