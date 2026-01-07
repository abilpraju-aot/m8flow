/**
 * M8Flow Extension Types
 * 
 * Core type definitions for the M8Flow extension system.
 */

import { ComponentType, ReactNode } from 'react';

/**
 * Extension point identifier
 */
export type ExtensionPointId =
  | 'app.header'
  | 'app.sidebar'
  | 'app.footer'
  | 'process.list.actions'
  | 'process.instance.actions'
  | 'task.actions'
  | 'user.menu';

/**
 * Extension priority (lower numbers run first)
 */
export type ExtensionPriority = number;

/**
 * Base extension interface
 */
export interface Extension {
  id: string;
  name: string;
  enabled: boolean;
  priority?: ExtensionPriority;
}

/**
 * Component extension - adds or replaces UI components
 */
export interface ComponentExtension extends Extension {
  type: 'component';
  extensionPoint: ExtensionPointId;
  component: ComponentType<any>;
  props?: Record<string, any>;
  replace?: boolean; // If true, replaces existing component; if false, adds alongside
}

/**
 * Route extension - adds new routes
 */
export interface RouteExtension extends Extension {
  type: 'route';
  path: string;
  element: ComponentType<any>;
  permission?: string;
  title?: string;
  icon?: ReactNode;
}

/**
 * Hook extension - extends functionality with custom hooks
 */
export interface HookExtension extends Extension {
  type: 'hook';
  hookName: string;
  hook: (...args: any[]) => any;
}

/**
 * Service extension - adds business logic services
 */
export interface ServiceExtension extends Extension {
  type: 'service';
  serviceName: string;
  service: any;
}

/**
 * Theme extension - customizes UI theme
 */
export interface ThemeExtension extends Extension {
  type: 'theme';
  theme: Record<string, any>;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;
  extensions: Extension[];
}

/**
 * Extension registry
 */
export interface ExtensionRegistry {
  register(extension: Extension): void;
  unregister(id: string): void;
  getExtensions(type?: Extension['type']): Extension[];
  getExtensionsByPoint(point: ExtensionPointId): ComponentExtension[];
  isEnabled(id: string): boolean;
  enable(id: string): void;
  disable(id: string): void;
}

/**
 * Plugin context - passed to plugins for initialization
 */
export interface PluginContext {
  registry: ExtensionRegistry;
  config: Record<string, any>;
  services: Record<string, any>;
}

