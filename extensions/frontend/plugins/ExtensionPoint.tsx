/**
 * M8Flow Extension Point Component
 * 
 * A React component that renders all extensions registered for a specific extension point.
 */

import React from 'react';
import { extensionRegistry } from './ExtensionRegistry';
import { ExtensionPointId } from '@m8flow/types';

interface ExtensionPointProps {
  id: ExtensionPointId;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ExtensionPoint component renders all extensions for a given extension point
 * 
 * @example
 * ```tsx
 * // In your component
 * <ExtensionPoint id="app.header">
 *   <DefaultHeader />
 * </ExtensionPoint>
 * ```
 */
export const ExtensionPoint: React.FC<ExtensionPointProps> = ({
  id,
  children,
  fallback,
}) => {
  const extensions = extensionRegistry.getExtensionsByPoint(id);

  // If no extensions and no children, show fallback
  if (extensions.length === 0 && !children) {
    return <>{fallback || null}</>;
  }

  // If extensions should replace content
  const replacingExtension = extensions.find((ext) => ext.replace);
  if (replacingExtension) {
    const Component = replacingExtension.component;
    return <Component {...(replacingExtension.props || {})} />;
  }

  // Render extensions alongside children
  return (
    <>
      {children}
      {extensions.map((extension) => {
        const Component = extension.component;
        return (
          <React.Fragment key={extension.id}>
            <Component {...(extension.props || {})} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * Hook to check if an extension point has any extensions
 */
export function useHasExtensions(id: ExtensionPointId): boolean {
  const extensions = extensionRegistry.getExtensionsByPoint(id);
  return extensions.length > 0;
}

/**
 * Hook to get all extensions for an extension point
 */
export function useExtensions(id: ExtensionPointId) {
  return extensionRegistry.getExtensionsByPoint(id);
}

