# Testing M8Flow Frontend Changes Locally - Expert Guide

Complete guide for testing M8Flow frontend customizations locally while maintaining separation from upstream SpiffArena code.

## Quick Start for Experts

```bash
# Option 1: Local dev server (fastest for frontend work)
cd spiffworkflow-frontend
npm install
npm start -- --config vite.config.m8flow.ts

# Option 2: Full stack with Docker
cd docker && cp sample.env .env && docker-compose up
```

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+
- VS Code or your preferred IDE
- Chrome/Firefox with React DevTools

### Project Structure Overview

```
m8flow/
├── spiffworkflow-frontend/          # Upstream - NEVER MODIFY
│   ├── src/                         # Upstream source
│   ├── vite.config.ts               # Original config
│   ├── vite.config.m8flow.ts        # M8Flow config (use this!)
│   ├── tsconfig.json                # Original tsconfig
│   └── tsconfig.m8flow.json         # M8Flow tsconfig (use this!)
│
├── extensions/frontend/             # ALL YOUR CODE HERE
│   ├── components/                  # UI components
│   │   ├── TenantSwitcher.tsx      # Example component
│   │   ├── M8FlowBanner.tsx        # Example component
│   │   └── index.ts                # Export all components
│   ├── views/                       # Full page views
│   ├── hooks/                       # Custom hooks
│   ├── services/                    # API services
│   ├── plugins/                     # Extension plugins
│   ├── contexts/                    # React contexts
│   ├── types/                       # TypeScript types
│   └── tests/                       # Extension tests
│
└── integration/frontend/            # Wiring layer (minimal)
    ├── App.extensions.tsx           # App wrapper
    ├── vite.config.extensions.ts    # Vite plugin config
    └── tsconfig.extensions.json     # TypeScript config
```

## Starting the Development Server

### Method 1: NPM Script (Recommended)

```bash
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts
```

This starts Vite with:
- Hot Module Replacement (HMR)
- TypeScript checking
- Extension path aliases (`@m8flow/*`)
- Port 7001 (default)

### Method 2: Custom Port

```bash
PORT=3000 npm start -- --config vite.config.m8flow.ts
```

### Method 3: Open to Network

```bash
npm run startopen -- --config vite.config.m8flow.ts
```

Accessible at: http://0.0.0.0:7001

## Development Workflow

### 1. Create a New Component

```bash
# Create component file
touch extensions/frontend/components/MyFeature.tsx
```

```typescript
// extensions/frontend/components/MyFeature.tsx
import React, { useState } from 'react';
import { Button, TextInput } from '@carbon/react';

interface MyFeatureProps {
  title?: string;
}

export const MyFeature: React.FC<MyFeatureProps> = ({ title = 'My Feature' }) => {
  const [value, setValue] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h2>{title}</h2>
      <TextInput
        id="my-input"
        labelText="Enter something"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button style={{ marginTop: '10px' }}>
        Submit
      </Button>
    </div>
  );
};
```

### 2. Export Component

```typescript
// extensions/frontend/components/index.ts
export { MyFeature } from './MyFeature';
export { TenantSwitcher } from './TenantSwitcher';
export { M8FlowBanner } from './M8FlowBanner';
```

### 3. Use Component

Import using `@m8flow/*` alias:

```typescript
import { MyFeature } from '@m8flow/components';

function SomeView() {
  return (
    <div>
      <MyFeature title="Custom Title" />
    </div>
  );
}
```

### 4. See Changes Live

1. Save file
2. Browser auto-reloads (< 1 second)
3. Check result in browser

**No manual refresh needed!** Vite HMR handles it.

## Testing Your Extensions

### Unit Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- extensions/frontend/tests/MyFeature.test.tsx

# Run with coverage
npm test -- --coverage
```

### Example Test

```typescript
// extensions/frontend/tests/MyFeature.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyFeature } from '@m8flow/components';

describe('MyFeature', () => {
  it('renders with default title', () => {
    render(<MyFeature />);
    expect(screen.getByText('My Feature')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<MyFeature title="Custom" />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    const { user } = render(<MyFeature />);
    const input = screen.getByLabelText('Enter something');
    
    await user.type(input, 'test');
    expect(input).toHaveValue('test');
  });
});
```

### Integration Tests (Playwright)

From root directory:

```bash
./bin/agents/run_playwright.sh
```

This will:
1. Start backend (port 8000)
2. Start frontend (port 7001)
3. Run all Playwright tests
4. Generate test report
5. Clean up servers

## Linting and Type Checking

### Lint Code

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Check

```bash
# Check TypeScript types
npm run typecheck
```

### Format Code

```bash
# Format with Prettier
npm run format
```

## Building for Production

### Build with Extensions

```bash
npm run build -- --config vite.config.m8flow.ts
```

Output: `spiffworkflow-frontend/dist/`

### Build Without Extensions (Upstream Only)

```bash
npm run build:upstream
```

### Test Production Build

```bash
# Build
npm run build -- --config vite.config.m8flow.ts

# Preview
npm run serve -- --config vite.config.m8flow.ts
```

## Debugging

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Install React DevTools extension
3. Use Components tab to inspect React tree
4. Use Console for debugging

### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:7001",
      "webRoot": "${workspaceFolder}/spiffworkflow-frontend"
    }
  ]
}
```

### Check Extension Loading

```typescript
// In browser console
console.log(window.__M8FLOW_EXTENSIONS__);
```

### Verify Imports

```bash
# Check if module resolves
cd spiffworkflow-frontend
node -e "import('@m8flow/components').then(console.log)"
```

## Common Issues & Solutions

### Issue: Extensions Not Loading

**Symptom:** Component from `@m8flow/components` not found

**Solution:**
```bash
# 1. Verify you're using M8Flow config
npm start -- --config vite.config.m8flow.ts
#                      ^^^^^^^^^^^^^^^^^^^ Required!

# 2. Check tsconfig
npm run typecheck

# 3. Restart dev server
# Ctrl+C then restart
```

### Issue: Type Errors

**Symptom:** TypeScript can't find types

**Solution:**
```bash
# 1. Check types are exported
cat extensions/frontend/types/index.ts

# 2. Verify tsconfig paths
cat spiffworkflow-frontend/tsconfig.m8flow.json

# 3. Restart TypeScript server in VS Code
# Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Issue: Hot Reload Not Working

**Symptom:** Changes don't appear without manual refresh

**Solution:**
```bash
# 1. Check file extension (.tsx not .jsx)
# 2. Clear Vite cache
rm -rf spiffworkflow-frontend/node_modules/.vite

# 3. Restart dev server
npm start -- --config vite.config.m8flow.ts
```

### Issue: Import Path Errors

**Symptom:** Can't import from extensions

**Solution:**
```typescript
// ✗ Wrong
import { MyComponent } from '../extensions/frontend/components/MyComponent';
import { MyComponent } from '../../extensions/frontend/components/MyComponent';

// ✓ Correct
import { MyComponent } from '@m8flow/components';
```

### Issue: Port Already in Use

**Solution:**
```bash
# Option 1: Use different port
PORT=3000 npm start -- --config vite.config.m8flow.ts

# Option 2: Kill process using port
# Linux/Mac:
lsof -ti:7001 | xargs kill -9

# Windows:
netstat -ano | findstr :7001
taskkill /PID <PID> /F
```

## Performance Testing

### Check Bundle Size

```bash
npm run build -- --config vite.config.m8flow.ts

# Analyze bundle
npx vite-bundle-visualizer
```

### Lighthouse Audit

```bash
# In Chrome DevTools
# 1. Build production
npm run build -- --config vite.config.m8flow.ts
npm run serve -- --config vite.config.m8flow.ts

# 2. Open DevTools > Lighthouse
# 3. Run audit
```

## Best Practices for Local Testing

### 1. Use TypeScript Strictly

```typescript
// ✓ Good: Typed props
interface Props {
  title: string;
  count: number;
}

export const MyComponent: React.FC<Props> = ({ title, count }) => {
  // ...
};

// ✗ Bad: Any types
export const MyComponent = (props: any) => {
  // ...
};
```

### 2. Write Tests First

```typescript
// 1. Write test
describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" count={5} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

// 2. Implement component
export const MyComponent: React.FC<Props> = ({ title, count }) => {
  return <div>{title}: {count}</div>;
};

// 3. Run test
npm test -- --watch
```

### 3. Use React DevTools

1. Install React DevTools browser extension
2. Open DevTools > Components tab
3. Inspect component props and state
4. Use Profiler for performance

### 4. Check Accessibility

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Use in development
import { useEffect } from 'react';
if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

### 5. Test in Multiple Browsers

- Chrome (primary)
- Firefox
- Safari (if on Mac)
- Edge

### 6. Use Browser Extension Points

```typescript
// Test extension point rendering
import { ExtensionPoint } from '@m8flow/plugins';

function TestView() {
  return (
    <div>
      <h1>Test Extension Points</h1>
      <ExtensionPoint id="app.header" />
      <ExtensionPoint id="app.sidebar" />
    </div>
  );
}
```

## Testing Checklist

Before committing code:

- [ ] Code compiles: `npm run typecheck`
- [ ] Tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] Works in development: `npm start`
- [ ] Works in production build: `npm run build && npm run serve`
- [ ] No console errors
- [ ] Accessibility checked (axe DevTools)
- [ ] Tested in Chrome and Firefox
- [ ] Documentation updated

## Advanced: Testing with Backend

If you need backend API:

### Option 1: Use Docker Backend

```bash
# Start only backend and database
cd docker
docker-compose up mysql backend

# In another terminal, start frontend locally
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts
```

### Option 2: Run Backend Locally

```bash
# Terminal 1: Backend
cd spiffworkflow-backend
./bin/agents/backend_setup.sh  # First time only
uv run python app.py

# Terminal 2: Frontend
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts
```

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm start -- --config vite.config.m8flow.ts` |
| Run tests | `npm test` |
| Run tests (watch) | `npm test -- --watch` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build -- --config vite.config.m8flow.ts` |
| Preview build | `npm run serve -- --config vite.config.m8flow.ts` |
| Playwright tests | `./bin/agents/run_playwright.sh` |

## Next Steps

- [Frontend Development Guide](./frontend-development.md)
- [Extension Development Guide](./extension-development.md)
- [Docker Development Guide](./docker-development.md)

---

**Happy coding!** Your extensions in `extensions/frontend/` are automatically picked up with hot reload. 🚀

