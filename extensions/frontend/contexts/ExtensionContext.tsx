/**
 * M8Flow Extension Context
 * 
 * Provides extension-related context to the entire application.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { extensionRegistry } from '@m8flow/plugins';
import { ExtensionRegistry } from '@m8flow/types';

interface ExtensionContextValue {
  registry: ExtensionRegistry;
}

const ExtensionContext = createContext<ExtensionContextValue | null>(null);

interface ExtensionProviderProps {
  children: ReactNode;
}

/**
 * ExtensionProvider wraps the app and provides extension context
 */
export const ExtensionProvider: React.FC<ExtensionProviderProps> = ({ children }) => {
  const value: ExtensionContextValue = {
    registry: extensionRegistry,
  };

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  );
};

/**
 * Hook to access extension context
 */
export function useExtensionContext(): ExtensionContextValue {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtensionContext must be used within ExtensionProvider');
  }
  return context;
}

