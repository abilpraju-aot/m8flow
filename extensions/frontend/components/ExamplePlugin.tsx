/**
 * Example M8Flow Plugin
 * 
 * This file demonstrates how to create a plugin that registers extensions.
 */

import { PluginContext, ComponentExtension } from '@m8flow/types';
import { createPlugin } from '@m8flow/plugins';
import { TenantSwitcher } from './TenantSwitcher';
import { M8FlowBanner } from './M8FlowBanner';

/**
 * Example plugin that adds tenant switcher and banner to the app
 */
export default createPlugin('ExamplePlugin', (context: PluginContext) => {
  const { registry } = context;

  // Register tenant switcher in the header
  const tenantSwitcherExtension: ComponentExtension = {
    id: 'tenant-switcher',
    name: 'Tenant Switcher',
    type: 'component',
    extensionPoint: 'app.header',
    component: TenantSwitcher,
    enabled: true,
    priority: 10,
    replace: false,
  };

  registry.register(tenantSwitcherExtension);

  // Register M8Flow banner
  const bannerExtension: ComponentExtension = {
    id: 'm8flow-banner',
    name: 'M8Flow Banner',
    type: 'component',
    extensionPoint: 'app.header',
    component: M8FlowBanner,
    props: {
      message: 'Welcome to M8Flow - Enterprise Workflow Platform',
      variant: 'info',
    },
    enabled: true,
    priority: 1, // Shows before tenant switcher
    replace: false,
  };

  registry.register(bannerExtension);
});

