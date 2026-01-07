/**
 * M8Flow Extension Registry
 * 
 * Central registry for managing all extensions in the M8Flow system.
 */

import {
  Extension,
  ExtensionRegistry as IExtensionRegistry,
  ExtensionPointId,
  ComponentExtension,
} from '@m8flow/types';

class ExtensionRegistryImpl implements IExtensionRegistry {
  private extensions: Map<string, Extension> = new Map();

  /**
   * Register a new extension
   */
  register(extension: Extension): void {
    if (this.extensions.has(extension.id)) {
      console.warn(`Extension ${extension.id} is already registered. Overwriting.`);
    }
    this.extensions.set(extension.id, extension);
    console.log(`✓ Registered extension: ${extension.name} (${extension.id})`);
  }

  /**
   * Unregister an extension
   */
  unregister(id: string): void {
    if (this.extensions.delete(id)) {
      console.log(`✓ Unregistered extension: ${id}`);
    } else {
      console.warn(`Extension ${id} not found`);
    }
  }

  /**
   * Get all extensions, optionally filtered by type
   */
  getExtensions(type?: Extension['type']): Extension[] {
    const allExtensions = Array.from(this.extensions.values());
    
    if (!type) {
      return allExtensions;
    }

    return allExtensions.filter((ext) => 'type' in ext && ext.type === type);
  }

  /**
   * Get component extensions for a specific extension point
   */
  getExtensionsByPoint(point: ExtensionPointId): ComponentExtension[] {
    return this.getExtensions('component')
      .filter((ext) => (ext as ComponentExtension).extensionPoint === point)
      .filter((ext) => ext.enabled)
      .sort((a, b) => (a.priority || 100) - (b.priority || 100)) as ComponentExtension[];
  }

  /**
   * Check if an extension is enabled
   */
  isEnabled(id: string): boolean {
    const extension = this.extensions.get(id);
    return extension ? extension.enabled : false;
  }

  /**
   * Enable an extension
   */
  enable(id: string): void {
    const extension = this.extensions.get(id);
    if (extension) {
      extension.enabled = true;
      console.log(`✓ Enabled extension: ${id}`);
    }
  }

  /**
   * Disable an extension
   */
  disable(id: string): void {
    const extension = this.extensions.get(id);
    if (extension) {
      extension.enabled = false;
      console.log(`✓ Disabled extension: ${id}`);
    }
  }

  /**
   * Get all registered extension IDs
   */
  getExtensionIds(): string[] {
    return Array.from(this.extensions.keys());
  }

  /**
   * Clear all extensions (useful for testing)
   */
  clear(): void {
    this.extensions.clear();
  }
}

// Singleton instance
export const extensionRegistry = new ExtensionRegistryImpl();

// Export class for testing
export { ExtensionRegistryImpl };

