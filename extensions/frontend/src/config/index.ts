/**
 * M8Flow Config Module
 *
 * Provides M8Flow configuration via React context.
 */

import React, { createContext, useContext, ReactNode } from 'react';

/**
 * M8Flow feature flags
 */
export interface M8FlowFeatureFlags {
  multiTenancy?: boolean;
  templates?: boolean;
  analytics?: boolean;
  advancedPermissions?: boolean;
}

/**
 * M8Flow configuration
 */
export interface M8FlowConfig {
  brandName: string;
  supportUrl?: string;
  docsUrl?: string;
  features: M8FlowFeatureFlags;
}

// Default configuration
const defaultConfig: M8FlowConfig = {
  brandName: 'M8Flow',
  supportUrl: 'https://support.m8flow.com',
  docsUrl: 'https://docs.m8flow.com',
  features: {
    multiTenancy: false,
    templates: true,
    analytics: false,
    advancedPermissions: false,
  },
};

// Get config from window if available
function getWindowConfig(): Partial<M8FlowConfig> {
  if (typeof window !== 'undefined' && (window as any).m8flowConfig) {
    return (window as any).m8flowConfig;
  }
  return {};
}

// Context
const M8FlowConfigContext = createContext<M8FlowConfig>({
  ...defaultConfig,
  ...getWindowConfig(),
});

/**
 * M8Flow Config Provider
 */
export function M8FlowConfigProvider({ 
  children, 
  config 
}: { 
  children: ReactNode; 
  config?: Partial<M8FlowConfig>;
}) {
  const mergedConfig: M8FlowConfig = {
    ...defaultConfig,
    ...getWindowConfig(),
    ...config,
    features: {
      ...defaultConfig.features,
      ...getWindowConfig().features,
      ...config?.features,
    },
  };

  return React.createElement(
    M8FlowConfigContext.Provider,
    { value: mergedConfig },
    children
  );
}

/**
 * Hook to access M8Flow config
 */
export function useM8FlowConfig(): M8FlowConfig {
  return useContext(M8FlowConfigContext);
}

/**
 * Hook to check if a feature is enabled
 */
export function useM8FlowFeature(feature: keyof M8FlowFeatureFlags): boolean {
  const config = useM8FlowConfig();
  return config.features[feature] ?? false;
}
