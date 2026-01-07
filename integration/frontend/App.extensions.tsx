/**
 * M8Flow App Extensions Integration
 * 
 * This file wraps the SpiffArena App component with M8Flow extension providers
 * and initializes the plugin system.
 */

import React, { useEffect } from 'react';
import { ExtensionProvider } from '@m8flow/contexts/ExtensionContext';
import { initializePlugins } from '@m8flow/plugins';
import { VerificationBanner } from '@m8flow/components';

interface AppExtensionsWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides M8Flow extensions to the app
 */
export const AppExtensionsWrapper: React.FC<AppExtensionsWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Initialize M8Flow plugins on mount
    initializePlugins({
      config: {
        // Add any M8Flow-specific configuration here
        enableMultiTenancy: process.env.M8FLOW_ENABLE_MULTI_TENANCY === 'true',
        enableAdvancedIntegrations: process.env.M8FLOW_ENABLE_INTEGRATIONS === 'true',
      },
    });
  }, []);

  return (
    <ExtensionProvider>
      <VerificationBanner />
      {children}
    </ExtensionProvider>
  );
};

/**
 * Higher-order function to wrap the App component with M8Flow extensions
 * 
 * Usage in index.tsx:
 * ```tsx
 * import { wrapAppWithExtensions } from '@m8flow/integration/App.extensions';
 * import App from './App';
 * 
 * const M8FlowApp = wrapAppWithExtensions(App);
 * 
 * root.render(<M8FlowApp />);
 * ```
 */
export function wrapAppWithExtensions<P extends object>(
  AppComponent: React.ComponentType<P>
): React.FC<P> {
  return function M8FlowApp(props: P) {
    return (
      <AppExtensionsWrapper>
        <AppComponent {...props} />
      </AppExtensionsWrapper>
    );
  };
}

