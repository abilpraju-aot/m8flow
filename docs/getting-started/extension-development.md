# M8Flow Extension Development Guide

Comprehensive guide for creating M8Flow extensions that add custom functionality while keeping upstream code pristine.

## Table of Contents

1. [Extension Types](#extension-types)
2. [Creating Extensions](#creating-extensions)
3. [Extension Points](#extension-points)
4. [Plugin System](#plugin-system)
5. [Real-World Examples](#real-world-examples)
6. [Testing Extensions](#testing-extensions)

## Extension Types

M8Flow supports several types of extensions:

### 1. Component Extensions

Add or replace UI components at specific extension points.

```typescript
import { ComponentExtension } from '@m8flow/types';

const extension: ComponentExtension = {
  id: 'my-component',
  name: 'My Component',
  type: 'component',
  extensionPoint: 'app.header',
  component: MyComponent,
  props: { color: 'blue' },
  enabled: true,
  priority: 10,
  replace: false,  // false = add alongside, true = replace existing
};
```

### 2. Route Extensions

Add new routes to the application.

```typescript
import { RouteExtension } from '@m8flow/types';

const extension: RouteExtension = {
  id: 'tenant-management',
  name: 'Tenant Management',
  type: 'route',
  path: '/admin/tenants',
  element: TenantManagementView,
  permission: 'tenant:manage',
  title: 'Tenant Management',
  enabled: true,
};
```

### 3. Service Extensions

Add business logic services.

```typescript
import { ServiceExtension } from '@m8flow/types';

const extension: ServiceExtension = {
  id: 'tenant-service',
  name: 'Tenant Service',
  type: 'service',
  serviceName: 'TenantService',
  service: TenantService,
  enabled: true,
};
```

### 4. Theme Extensions

Customize the UI theme.

```typescript
import { ThemeExtension } from '@m8flow/types';

const extension: ThemeExtension = {
  id: 'm8flow-theme',
  name: 'M8Flow Theme',
  type: 'theme',
  theme: {
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  },
  enabled: true,
};
```

## Creating Extensions

### Step 1: Create Your Extension Code

```typescript
// extensions/frontend/components/MyComponent.tsx
import React from 'react';
import { Button } from '@carbon/react';

export const MyComponent: React.FC = () => {
  return (
    <div className="my-component">
      <h3>My M8Flow Extension</h3>
      <Button>Action</Button>
    </div>
  );
};
```

### Step 2: Create a Plugin

```typescript
// extensions/frontend/plugins/myPlugin.ts
import { PluginContext, ComponentExtension } from '@m8flow/types';
import { createPlugin } from '@m8flow/plugins';
import { MyComponent } from '@m8flow/components';

export default createPlugin('MyPlugin', (context: PluginContext) => {
  const { registry, config } = context;

  // Only register if enabled in config
  if (config.enableMyFeature) {
    const extension: ComponentExtension = {
      id: 'my-component',
      name: 'My Component',
      type: 'component',
      extensionPoint: 'app.header',
      component: MyComponent,
      enabled: true,
    };

    registry.register(extension);
  }
});
```

### Step 3: Load the Plugin

```typescript
// integration/frontend/plugins/index.ts
import myPlugin from '../../extensions/frontend/plugins/myPlugin';

export const plugins = [
  myPlugin,
  // Add more plugins here
];
```

### Step 4: Initialize in App

```typescript
// integration/frontend/App.extensions.tsx
import { initializePlugins } from '@m8flow/plugins';
import { plugins } from './plugins';

export function initializeM8Flow() {
  initializePlugins({
    config: {
      enableMyFeature: true,
    },
  });

  // Load all plugins
  plugins.forEach(plugin => plugin({ registry, config, services }));
}
```

## Extension Points

### Available Extension Points

| Extension Point | Description | Location |
|----------------|-------------|----------|
| `app.header` | Header area | Top of application |
| `app.sidebar` | Sidebar navigation | Left side panel |
| `app.footer` | Footer area | Bottom of application |
| `process.list.actions` | Process list actions | Process list page |
| `process.instance.actions` | Process instance actions | Process instance page |
| `task.actions` | Task actions | Task page |
| `user.menu` | User menu | User dropdown |

### Using Extension Points

In your integration or upstream-wrapping code:

```typescript
import { ExtensionPoint } from '@m8flow/plugins';

function Header() {
  return (
    <header className="app-header">
      <Logo />
      <Navigation />
      
      {/* Extension point for custom header components */}
      <ExtensionPoint id="app.header">
        {/* Default content shown if no extensions */}
        <DefaultHeaderContent />
      </ExtensionPoint>
    </header>
  );
}
```

### Conditional Rendering

```typescript
import { useHasExtensions } from '@m8flow/plugins';

function Header() {
  const hasExtensions = useHasExtensions('app.header');

  return (
    <header>
      {hasExtensions ? (
        <ExtensionPoint id="app.header" />
      ) : (
        <DefaultHeader />
      )}
    </header>
  );
}
```

## Plugin System

### Plugin Structure

```typescript
import { PluginContext, createPlugin } from '@m8flow/plugins';

export default createPlugin('PluginName', (context: PluginContext) => {
  const { registry, config, services } = context;

  // Register your extensions
  registry.register({
    id: 'my-extension',
    name: 'My Extension',
    type: 'component',
    // ... extension configuration
  });

  // Set up event listeners
  // Initialize services
  // Configure features
});
```

### Plugin Configuration

```typescript
export default createPlugin('MultiTenancy', (context: PluginContext) => {
  const { registry, config } = context;

  if (!config.enableMultiTenancy) {
    console.log('Multi-tenancy disabled, skipping plugin');
    return;
  }

  // Register extensions...
});
```

### Plugin Dependencies

```typescript
export default createPlugin('AdvancedPlugin', (context: PluginContext) => {
  const { services } = context;

  // Check for required services
  if (!services.TenantService) {
    throw new Error('AdvancedPlugin requires TenantService');
  }

  // Use services...
});
```

## Real-World Examples

### Example 1: Multi-Tenancy Extension

```typescript
// extensions/frontend/plugins/multiTenancyPlugin.ts
import { createPlugin } from '@m8flow/plugins';
import { TenantSwitcher, TenantBadge } from '@m8flow/components';

export default createPlugin('MultiTenancy', (context) => {
  const { registry } = context;

  // Add tenant switcher to header
  registry.register({
    id: 'tenant-switcher',
    name: 'Tenant Switcher',
    type: 'component',
    extensionPoint: 'app.header',
    component: TenantSwitcher,
    priority: 10,
    enabled: true,
  });

  // Add tenant badge to sidebar
  registry.register({
    id: 'tenant-badge',
    name: 'Tenant Badge',
    type: 'component',
    extensionPoint: 'app.sidebar',
    component: TenantBadge,
    priority: 1,
    enabled: true,
  });

  // Add tenant management route
  registry.register({
    id: 'tenant-management-route',
    name: 'Tenant Management Route',
    type: 'route',
    path: '/admin/tenants',
    element: TenantManagementView,
    permission: 'tenant:manage',
    enabled: true,
  });
});
```

### Example 2: Advanced Reporting Extension

```typescript
// extensions/frontend/plugins/reportingPlugin.ts
import { createPlugin } from '@m8flow/plugins';
import { ReportButton, ReportViewer } from '@m8flow/components';

export default createPlugin('AdvancedReporting', (context) => {
  const { registry } = context;

  // Add export button to process list
  registry.register({
    id: 'process-export-button',
    name: 'Process Export Button',
    type: 'component',
    extensionPoint: 'process.list.actions',
    component: ReportButton,
    props: {
      reportType: 'process-list',
      formats: ['pdf', 'excel', 'csv'],
    },
    enabled: true,
  });

  // Add report viewer route
  registry.register({
    id: 'report-viewer-route',
    name: 'Report Viewer',
    type: 'route',
    path: '/reports/:reportId',
    element: ReportViewer,
    permission: 'reports:view',
    enabled: true,
  });
});
```

### Example 3: Custom Dashboard Extension

```typescript
// extensions/frontend/plugins/dashboardPlugin.ts
import { createPlugin } from '@m8flow/plugins';
import { DashboardView } from '@m8flow/views';

export default createPlugin('CustomDashboard', (context) => {
  const { registry } = context;

  // Replace default home page with custom dashboard
  registry.register({
    id: 'custom-dashboard',
    name: 'Custom Dashboard',
    type: 'route',
    path: '/',
    element: DashboardView,
    replace: true,  // Replace default home page
    enabled: true,
    priority: 1,
  });
});
```

## Testing Extensions

### Unit Testing Components

```typescript
// extensions/frontend/tests/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@m8flow/components';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('My M8Flow Extension')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const { user } = render(<MyComponent />);
    const button = screen.getByRole('button', { name: 'Action' });
    
    await user.click(button);
    // Assert expected behavior
  });
});
```

### Testing Extension Registration

```typescript
// extensions/frontend/tests/myPlugin.test.ts
import { describe, it, expect } from 'vitest';
import { extensionRegistry } from '@m8flow/plugins';
import myPlugin from '../plugins/myPlugin';

describe('MyPlugin', () => {
  it('registers extensions', () => {
    const context = {
      registry: extensionRegistry,
      config: { enableMyFeature: true },
      services: {},
    };

    myPlugin(context);

    const extensions = extensionRegistry.getExtensions('component');
    expect(extensions).toHaveLength(1);
    expect(extensions[0].id).toBe('my-component');
  });
});
```

### Integration Testing with Playwright

```python
# spiffworkflow-frontend/test/browser/test_m8flow_extensions.py
def test_extension_renders(browser):
    """Test that M8Flow extension renders correctly"""
    page = browser.new_page()
    page.goto('http://localhost:7001')
    
    # Wait for extension to load
    extension = page.locator('[data-testid="my-component"]')
    expect(extension).to_be_visible()
    
    # Test interaction
    button = extension.locator('button:has-text("Action")')
    button.click()
    
    # Assert expected outcome
```

## Best Practices

### 1. Modular Design

Create small, focused extensions that do one thing well:

```typescript
// ✓ GOOD: Focused extension
createPlugin('TenantSwitcher', (context) => {
  // Only handles tenant switching
});

// ✗ BAD: Monolithic extension
createPlugin('Everything', (context) => {
  // Handles tenants, reports, integrations, etc.
});
```

### 2. Configuration-Driven

Make extensions configurable:

```typescript
export default createPlugin('MyPlugin', (context) => {
  const { config } = context;
  
  registry.register({
    component: MyComponent,
    props: {
      color: config.componentColor || 'blue',
      size: config.componentSize || 'medium',
    },
  });
});
```

### 3. Error Handling

Handle errors gracefully:

```typescript
export default createPlugin('MyPlugin', (context) => {
  try {
    // Extension logic
  } catch (error) {
    console.error('Failed to load MyPlugin:', error);
    // Don't break the app if extension fails
  }
});
```

### 4. Documentation

Document your extensions:

```typescript
/**
 * Multi-Tenancy Plugin
 * 
 * Adds multi-tenancy support to M8Flow, including:
 * - Tenant switcher in header
 * - Tenant badge in sidebar
 * - Tenant management UI
 * 
 * Configuration:
 * - enableMultiTenancy: boolean
 * 
 * Permissions required:
 * - tenant:view
 * - tenant:manage (for admin features)
 */
export default createPlugin('MultiTenancy', (context) => {
  // ...
});
```

### 5. Type Safety

Always use TypeScript types:

```typescript
import { ComponentExtension, PluginContext } from '@m8flow/types';

export default createPlugin('MyPlugin', (context: PluginContext) => {
  const extension: ComponentExtension = {
    // TypeScript will catch errors here
  };
});
```

## Next Steps

- [Frontend Development Guide](./frontend-development.md)
- [Backend Development Guide](./backend-development.md)
- [Docker Development Guide](./docker-development.md)

## Resources

- [Extension API Reference](../reference/extension-api.md)
- [Plugin Examples](../../extensions/frontend/plugins/)
- [Component Library](../../extensions/frontend/components/)

