# M8Flow Frontend Development Guide

This guide explains how to develop frontend customizations for M8Flow while keeping the upstream SpiffArena code untouched.

## Quick Start

### 1. Install Dependencies

```bash
cd spiffworkflow-frontend
npm install
```

### 2. Start Development Server

```bash
npm start -- --config vite.config.m8flow.ts
```

The application will be available at http://localhost:7001

### 3. Create Your First Extension

Create a new component in `extensions/frontend/components/`:

```typescript
// extensions/frontend/components/MyComponent.tsx
import React from 'react';
import { Button } from '@carbon/react';

export const MyComponent: React.FC = () => {
  return (
    <div>
      <h2>My M8Flow Extension</h2>
      <Button>Click Me</Button>
    </div>
  );
};
```

Export it from `extensions/frontend/components/index.ts`:

```typescript
export { MyComponent } from './MyComponent';
```

Use it in your app via extension points or direct imports:

```typescript
import { MyComponent } from '@m8flow/components';
```

## Architecture Overview

### Directory Structure

```
m8flow/
├── spiffworkflow-frontend/           # Upstream code (DO NOT MODIFY)
├── extensions/frontend/              # M8Flow customizations
│   ├── components/                   # React components
│   ├── views/                        # Full page views
│   ├── hooks/                        # Custom hooks
│   ├── services/                     # Business logic
│   ├── themes/                       # Styling
│   ├── plugins/                      # Plugin system
│   ├── contexts/                     # React contexts
│   ├── types/                        # TypeScript types
│   └── utils/                        # Utilities
└── integration/frontend/             # Integration layer
    ├── App.extensions.tsx            # App wrapper
    └── vite.config.extensions.ts     # Vite config
```

### Import Aliases

Use `@m8flow/*` aliases to import from extensions:

```typescript
import { TenantSwitcher } from '@m8flow/components';
import { useTenant } from '@m8flow/hooks';
import { TenantService } from '@m8flow/services';
import { M8FlowTheme } from '@m8flow/themes';
import { ExtensionPoint } from '@m8flow/plugins';
```

## Extension System

### Extension Points

Extension points allow you to inject custom components at predefined locations:

Available extension points:
- `app.header` - Header area
- `app.sidebar` - Sidebar navigation
- `app.footer` - Footer area
- `process.list.actions` - Process list actions
- `process.instance.actions` - Process instance actions
- `task.actions` - Task actions
- `user.menu` - User menu

### Creating a Plugin

```typescript
// extensions/frontend/plugins/myPlugin.ts
import { PluginContext, ComponentExtension } from '@m8flow/types';
import { createPlugin } from '@m8flow/plugins';
import { MyComponent } from '@m8flow/components';

export default createPlugin('MyPlugin', (context: PluginContext) => {
  const { registry } = context;

  const extension: ComponentExtension = {
    id: 'my-component',
    name: 'My Component',
    type: 'component',
    extensionPoint: 'app.header',
    component: MyComponent,
    enabled: true,
    priority: 10,
  };

  registry.register(extension);
});
```

### Using Extension Points

In upstream or integration code, use `ExtensionPoint` component:

```typescript
import { ExtensionPoint } from '@m8flow/plugins';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ExtensionPoint id="app.header">
        {/* Default content if no extensions */}
      </ExtensionPoint>
    </header>
  );
}
```

## Development Workflows

### Hot Module Replacement

Changes to extension files will automatically reload in the browser:

1. Edit a file in `extensions/frontend/`
2. Save the file
3. Browser automatically updates (usually < 1 second)

### Testing

#### Unit Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run specific test file:

```bash
npm test -- extensions/frontend/tests/TenantSwitcher.test.tsx
```

#### E2E Tests with Playwright

From the root directory:

```bash
./bin/agents/run_playwright.sh
```

This will:
1. Start backend server
2. Start frontend server
3. Run all Playwright tests
4. Clean up servers

### Linting

Check for linting errors:

```bash
npm run lint
```

Auto-fix linting errors:

```bash
npm run lint:fix
```

### Type Checking

Run TypeScript type checker:

```bash
npm run typecheck
```

## Building for Production

### Build with Extensions

```bash
npm run build -- --config vite.config.m8flow.ts
```

Or use the script from `package.m8flow.json`:

```bash
npm run build
```

### Build Upstream Only

```bash
npm run build:upstream
```

## Best Practices

### 1. Never Modify Upstream Code

**✗ BAD:**
```typescript
// Editing spiffworkflow-frontend/src/components/Header.tsx
export function Header() {
  return <div>Modified!</div>;  // DON'T DO THIS
}
```

**✓ GOOD:**
```typescript
// extensions/frontend/components/CustomHeader.tsx
export function CustomHeader() {
  return <div>My Custom Header</div>;
}

// Then register it as an extension to replace or extend Header
```

### 2. Use Extension Points

**✗ BAD:**
```typescript
// Directly modifying upstream components
import Header from '../../../spiffworkflow-frontend/src/components/Header';
```

**✓ GOOD:**
```typescript
// Register your component at an extension point
const extension: ComponentExtension = {
  extensionPoint: 'app.header',
  component: MyCustomHeader,
};
```

### 3. Type Your Components

```typescript
interface MyComponentProps {
  title: string;
  onSave?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onSave }) => {
  // ...
};
```

### 4. Document Your Code

```typescript
/**
 * TenantSwitcher allows users to switch between tenants
 * 
 * @example
 * ```tsx
 * <TenantSwitcher onTenantChange={handleChange} />
 * ```
 */
export const TenantSwitcher: React.FC<Props> = (props) => {
  // ...
};
```

### 5. Write Tests

```typescript
describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### 6. Use Carbon Design System

M8Flow uses Carbon Design System for UI components:

```typescript
import { Button, Select, Modal } from '@carbon/react';

export const MyComponent = () => {
  return (
    <div>
      <Button>Click Me</Button>
      <Select id="my-select" labelText="Choose">
        <SelectItem value="a" text="Option A" />
      </Select>
    </div>
  );
};
```

## Troubleshooting

### Extensions Not Loading

**Problem:** Your extension component doesn't appear in the UI.

**Solutions:**
1. Check that you're using the M8Flow config:
   ```bash
   npm start -- --config vite.config.m8flow.ts
   ```

2. Verify import paths use `@m8flow/*` alias:
   ```typescript
   import { MyComponent } from '@m8flow/components';  // ✓
   import { MyComponent } from '../extensions/...';    // ✗
   ```

3. Check extension is registered:
   ```typescript
   registry.register(myExtension);
   ```

4. Verify extension is enabled:
   ```typescript
   { enabled: true }
   ```

### Type Errors

**Problem:** TypeScript can't find your types.

**Solutions:**
1. Check `tsconfig.m8flow.json` includes your directory
2. Export types from `extensions/frontend/types/index.ts`
3. Run type checker:
   ```bash
   npm run typecheck
   ```

### Hot Reload Not Working

**Problem:** Changes don't appear without manual refresh.

**Solutions:**
1. Restart dev server
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm start -- --config vite.config.m8flow.ts
   ```
3. Check file has `.tsx` or `.ts` extension

### Import Errors

**Problem:** Can't import from `@m8flow/*`

**Solutions:**
1. Verify you're using M8Flow config
2. Check path alias in `vite.config.m8flow.ts`
3. Restart dev server

## Environment Variables

### Available Variables

- `M8FLOW_ENABLE_MULTI_TENANCY` - Enable multi-tenancy features
- `M8FLOW_ENABLE_INTEGRATIONS` - Enable advanced integrations
- `HOST` - Dev server host (default: localhost)
- `PORT` - Dev server port (default: 7001)

### Usage

Create `.env.local` in `spiffworkflow-frontend/`:

```bash
M8FLOW_ENABLE_MULTI_TENANCY=true
M8FLOW_ENABLE_INTEGRATIONS=true
PORT=3000
```

## Common Tasks

### Adding a New Component

1. Create component file:
   ```bash
   # extensions/frontend/components/NewComponent.tsx
   ```

2. Export from index:
   ```typescript
   // extensions/frontend/components/index.ts
   export { NewComponent } from './NewComponent';
   ```

3. Use in your code:
   ```typescript
   import { NewComponent } from '@m8flow/components';
   ```

### Adding a New Service

1. Create service file:
   ```bash
   # extensions/frontend/services/MyService.ts
   ```

2. Implement service:
   ```typescript
   import HttpService from '../../../spiffworkflow-frontend/src/services/HttpService';

   export class MyService {
     static async getData() {
       return HttpService.makeCallToBackend({
         path: '/api/v1/my-data',
         httpMethod: 'GET',
       });
     }
   }
   ```

3. Use in components:
   ```typescript
   import { MyService } from '@m8flow/services';
   ```

### Adding a New Hook

1. Create hook file:
   ```bash
   # extensions/frontend/hooks/useMyHook.ts
   ```

2. Implement hook:
   ```typescript
   import { useState, useEffect } from 'react';

   export function useMyHook() {
     const [data, setData] = useState(null);
     
     useEffect(() => {
       // Logic here
     }, []);
     
     return { data };
   }
   ```

3. Use in components:
   ```typescript
   import { useMyHook } from '@m8flow/hooks';
   ```

## Next Steps

- [Extension Development Guide](./extension-development.md)
- [Backend Development Guide](./backend-development.md)
- [Docker Development Guide](./docker-development.md)
- [Deployment Guide](./deployment.md)

## Resources

- [React Documentation](https://react.dev/)
- [Carbon Design System](https://carbondesignsystem.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SpiffArena Documentation](https://spiff-arena.readthedocs.io/)

