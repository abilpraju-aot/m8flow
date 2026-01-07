# M8Flow Frontend Extensions

This directory contains all AOT Technologies customizations for the M8Flow frontend.

## 🎯 Key Principle

**NEVER modify code in `spiffworkflow-frontend/src/`**. All customizations must be implemented as extensions in this directory.

## 📁 Directory Structure

```
extensions/frontend/
├── components/          # Reusable UI components
├── views/              # Full page views
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── themes/             # Custom styling and themes
├── plugins/            # Extension points and plugin system
├── config/             # Extension configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── tests/              # Extension-specific tests
```

## 🔌 Extension System

### How Extensions Work

Extensions are integrated via Vite path aliases configured in the integration layer. Import them using the `@m8flow/*` prefix:

```typescript
// Import M8Flow components
import { TenantSwitcher } from '@m8flow/components';
import { useTenant } from '@m8flow/hooks';
import { TenantService } from '@m8flow/services';

// Import from upstream (still available)
import { ProcessInstanceListTable } from '../components/ProcessInstanceListTable';
```

### Extension Points

The system provides several extension points where you can inject custom functionality:

#### 1. Component Extensions

Replace or wrap existing components:

```typescript
// extensions/frontend/plugins/componentRegistry.ts
import { ComponentExtension } from './types';

export const componentExtensions: ComponentExtension[] = [
  {
    name: 'HeaderTabs',
    replace: false, // Wrap instead of replace
    component: withTenantContext(HeaderTabs),
  },
  {
    name: 'ProcessInstanceListTable',
    replace: false,
    component: withMultiTenancy(ProcessInstanceListTable),
  },
];
```

#### 2. Route Extensions

Add new routes:

```typescript
// extensions/frontend/plugins/routes.ts
import { RouteExtension } from './types';
import { TenantManagement } from '@m8flow/views';

export const routeExtensions: RouteExtension[] = [
  {
    path: '/admin/tenants',
    element: TenantManagement,
    permission: 'tenant:manage',
  },
  {
    path: '/integrations',
    element: IntegrationsView,
    permission: 'integrations:view',
  },
];
```

#### 3. Hook Extensions

Extend functionality with custom hooks:

```typescript
// extensions/frontend/hooks/useTenant.ts
import { useContext } from 'react';
import { TenantContext } from '@m8flow/contexts';

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
```

#### 4. Service Extensions

Add business logic services:

```typescript
// extensions/frontend/services/TenantService.ts
import HttpService from '../../spiffworkflow-frontend/src/services/HttpService';

export class TenantService {
  static async getCurrentTenant() {
    return HttpService.makeCallToBackend({
      path: '/api/v1/tenants/current',
      httpMethod: 'GET',
    });
  }

  static async switchTenant(tenantId: string) {
    return HttpService.makeCallToBackend({
      path: `/api/v1/tenants/${tenantId}/switch`,
      httpMethod: 'POST',
    });
  }
}
```

#### 5. Theme Extensions

Customize the UI theme:

```typescript
// extensions/frontend/themes/m8flowTheme.ts
import { SpiffTheme } from '../../spiffworkflow-frontend/src/assets/theme/SpiffTheme';

export const M8FlowTheme = {
  ...SpiffTheme,
  palette: {
    ...SpiffTheme.palette,
    primary: {
      main: '#1976d2', // M8Flow primary color
    },
  },
  components: {
    ...SpiffTheme.components,
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
};
```

## 🚀 Creating Your First Extension

### Example: Adding a Tenant Switcher Component

1. **Create the Component**:

```typescript
// extensions/frontend/components/TenantSwitcher.tsx
import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@carbon/react';
import { useTenant } from '@m8flow/hooks';
import { TenantService } from '@m8flow/services';

export const TenantSwitcher: React.FC = () => {
  const { currentTenant, setCurrentTenant } = useTenant();
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    TenantService.listTenants().then(setTenants);
  }, []);

  const handleTenantChange = async (e: any) => {
    const tenantId = e.target.value;
    await TenantService.switchTenant(tenantId);
    setCurrentTenant(tenantId);
  };

  return (
    <Select
      id="tenant-switcher"
      labelText="Tenant"
      value={currentTenant}
      onChange={handleTenantChange}
    >
      {tenants.map((tenant: any) => (
        <SelectItem key={tenant.id} value={tenant.id} text={tenant.name} />
      ))}
    </Select>
  );
};
```

2. **Register the Component**:

```typescript
// extensions/frontend/components/index.ts
export { TenantSwitcher } from './TenantSwitcher';
```

3. **Use in Integration Layer**:

```typescript
// integration/frontend/App.extensions.tsx
import { TenantSwitcher } from '@m8flow/components';

// Add to header or sidebar
<Header>
  <TenantSwitcher />
</Header>
```

## 🧪 Testing Extensions

### Unit Tests

```typescript
// extensions/frontend/tests/TenantSwitcher.test.tsx
import { render, screen } from '@testing-library/react';
import { TenantSwitcher } from '@m8flow/components';
import { TenantProvider } from '@m8flow/contexts';

describe('TenantSwitcher', () => {
  it('renders tenant options', async () => {
    render(
      <TenantProvider>
        <TenantSwitcher />
      </TenantProvider>
    );
    
    expect(screen.getByLabelText('Tenant')).toBeInTheDocument();
  });
});
```

### Integration Tests

Run Playwright tests from the root:

```bash
./bin/agents/run_playwright.sh
```

## 📝 Best Practices

1. **Naming Conventions**:
   - Components: PascalCase (e.g., `TenantSwitcher.tsx`)
   - Hooks: camelCase with `use` prefix (e.g., `useTenant.ts`)
   - Services: PascalCase with `Service` suffix (e.g., `TenantService.ts`)

2. **Import Aliases**:
   - Use `@m8flow/*` for extension imports
   - Use relative paths for upstream imports (if needed)
   - Never modify upstream files

3. **Type Safety**:
   - Define types in `extensions/frontend/types/`
   - Export types for reuse
   - Extend upstream types when needed

4. **Documentation**:
   - Document all public APIs
   - Include usage examples
   - Keep this README updated

5. **Testing**:
   - Write unit tests for all components
   - Test integration points
   - Use mocks for external services

## 🔄 Development Workflow

1. **Start the dev server**:
   ```bash
   cd spiffworkflow-frontend
   npm start
   ```

2. **Make changes in `extensions/frontend/`**

3. **Test your changes** (hot reload enabled)

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Lint your code**:
   ```bash
   npm run lint
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

## 🐛 Troubleshooting

### Extensions Not Loading

- Check Vite config has correct aliases
- Verify import paths use `@m8flow/*` prefix
- Check for TypeScript errors

### Type Errors

- Ensure types are exported from `types/index.ts`
- Check tsconfig.json includes extensions directory
- Run `npm run typecheck`

### Hot Reload Not Working

- Restart Vite dev server
- Check file extensions are `.tsx` or `.ts`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Material-UI Documentation](https://mui.com/)
- [SpiffArena Documentation](https://spiff-arena.readthedocs.io/)

