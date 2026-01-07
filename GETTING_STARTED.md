# Getting Started with M8Flow

Welcome! This guide will get you up and running with M8Flow frontend development in minutes.

## 🚀 Quick Start (2 Minutes)

```bash
# 1. Navigate to frontend
cd spiffworkflow-frontend

# 2. Install dependencies
npm install

# 3. Start development server WITH M8Flow extensions
npm start -- --config vite.config.m8flow.ts

# ✓ Done! Open http://localhost:7001
```

> **Important**: The `--config vite.config.m8flow.ts` flag is **required** to load M8Flow extensions. This uses the M8Flow entry point (`index.m8flow.tsx`) instead of the upstream entry point.

## 📁 Where to Put Your Code

```
✓ PUT YOUR CODE HERE:
  extensions/frontend/     ← All your customizations go here
    ├── components/        ← UI components
    ├── views/            ← Full pages
    ├── hooks/            ← React hooks
    └── services/         ← API services

✗ NEVER TOUCH:
  spiffworkflow-frontend/src/    ← Upstream code (pristine)
  spiffworkflow-backend/src/     ← Upstream code (pristine)
```

## 🎯 Your First Extension (5 Minutes)

### 1. Create Component

```typescript
// extensions/frontend/components/HelloM8Flow.tsx
import React from 'react';
import { Button } from '@carbon/react';

export const HelloM8Flow: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h2>🎉 Hello M8Flow!</h2>
      <p>Your extension is working!</p>
      <Button>Click Me</Button>
    </div>
  );
};
```

### 2. Export It

```typescript
// extensions/frontend/components/index.ts
export { HelloM8Flow } from './HelloM8Flow';
export { TenantSwitcher } from './TenantSwitcher';  // existing
export { M8FlowBanner } from './M8FlowBanner';      // existing
```

### 3. Use It (for testing)

```typescript
// Test by importing in any file
import { HelloM8Flow } from '@m8flow/components';

// Add to render:
<HelloM8Flow />
```

### 4. See It Live

- Save files
- Browser auto-reloads
- See your component! 🎉

## 🏗️ Architecture Overview

### The Extension System

M8Flow uses a **plugin architecture** that keeps your code separate from upstream:

```
┌─────────────────────────────────────┐
│  Your Browser                       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  M8Flow App                  │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Upstream SpiffArena   │  │  │
│  │  │  (untouched)           │  │  │
│  │  └────────────────────────┘  │  │
│  │           ↓ wired by          │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Integration Layer     │  │  │
│  │  │  (minimal glue)        │  │  │
│  │  └────────────────────────┘  │  │
│  │           ↓ loads             │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Your Extensions       │  │  │
│  │  │  (all your code)       │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Import System

Use `@m8flow/*` aliases (configured in Vite):

```typescript
// ✓ CORRECT: Use aliases
import { MyComponent } from '@m8flow/components';
import { useMyHook } from '@m8flow/hooks';
import { MyService } from '@m8flow/services';

// ✗ WRONG: Don't use relative paths
import { MyComponent } from '../extensions/frontend/components/MyComponent';
```

## 🛠️ Development Tools

### Start Development Server

```bash
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts
```

**Key Features:**
- Hot Module Replacement (HMR) - changes appear instantly
- TypeScript checking
- Extension path aliases
- Source maps for debugging

### Run Tests

```bash
npm test                    # All tests
npm test -- --watch         # Watch mode
npm test -- MyTest.test.tsx # Specific test
```

### Type Check

```bash
npm run typecheck
```

### Lint Code

```bash
npm run lint        # Check
npm run lint:fix    # Fix
```

### Build for Production

```bash
npm run build -- --config vite.config.m8flow.ts
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](docs/getting-started/QUICKSTART.md) | 5-minute quick start |
| [LOCAL_TESTING.md](docs/getting-started/LOCAL_TESTING.md) | Complete testing guide |
| [frontend-development.md](docs/getting-started/frontend-development.md) | Full frontend guide |
| [extension-development.md](docs/getting-started/extension-development.md) | Plugin system guide |
| [docker-development.md](docs/getting-started/docker-development.md) | Docker setup |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

## 🎓 Learning Path

### Day 1: Basics
1. Read this file ✓
2. Start dev server
3. Create a simple component
4. Use `@m8flow/components` import

### Day 2: Extensions
1. Read [extension-development.md](docs/getting-started/extension-development.md)
2. Create a plugin
3. Use extension points
4. Write tests

### Day 3: Advanced
1. Read [frontend-development.md](docs/getting-started/frontend-development.md)
2. Create custom hooks
3. Add services
4. Integrate with backend

### Week 2: Production
1. Docker setup
2. Production builds
3. Deployment
4. Monitoring

## 🧪 Example Extensions

Check out working examples:

### Simple Component
```typescript
// extensions/frontend/components/M8FlowBanner.tsx
export const M8FlowBanner: React.FC = () => {
  return <div>Welcome to M8Flow!</div>;
};
```

### Component with Props
```typescript
// extensions/frontend/components/TenantSwitcher.tsx
interface Props {
  onTenantChange?: (id: string) => void;
}

export const TenantSwitcher: React.FC<Props> = ({ onTenantChange }) => {
  // Implementation with Carbon components
};
```

### Plugin Registration
```typescript
// extensions/frontend/plugins/ExamplePlugin.tsx
import { createPlugin } from '@m8flow/plugins';

export default createPlugin('Example', (context) => {
  context.registry.register({
    id: 'my-component',
    extensionPoint: 'app.header',
    component: MyComponent,
  });
});
```

## 🚦 Development Checklist

Before committing code:

- [ ] Code runs: `npm start -- --config vite.config.m8flow.ts`
- [ ] Tests pass: `npm test`
- [ ] Types check: `npm run typecheck`
- [ ] Lint passes: `npm run lint`
- [ ] No console errors in browser
- [ ] Only modified `extensions/` directory (never `spiffworkflow-frontend/src/`)

## 🐛 Troubleshooting

### Extensions Not Loading?

```bash
# Verify you're using M8Flow config
npm start -- --config vite.config.m8flow.ts
#                      ^^^^^^^^^^^^^^^^^^^ This is required!
```

### Type Errors?

```bash
# Check TypeScript
npm run typecheck

# Restart TypeScript server in VS Code
# Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

### Hot Reload Not Working?

```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm start -- --config vite.config.m8flow.ts
```

### Import Not Found?

```typescript
// Use @m8flow/* alias, not relative paths
import { X } from '@m8flow/components';  // ✓
import { X } from '../extensions/...';   // ✗
```

## 🎯 Key Concepts

### 1. Extension Points

Pre-defined locations where you can inject components:

```typescript
import { ExtensionPoint } from '@m8flow/plugins';

<ExtensionPoint id="app.header" />
```

### 2. Plugin System

Register extensions via plugins:

```typescript
registry.register({
  id: 'my-extension',
  extensionPoint: 'app.header',
  component: MyComponent,
});
```

### 3. Import Aliases

Use `@m8flow/*` for clean imports:

- `@m8flow/components` → `extensions/frontend/components`
- `@m8flow/hooks` → `extensions/frontend/hooks`
- `@m8flow/services` → `extensions/frontend/services`

### 4. Separation of Concerns

```
Upstream (untouched) → Integration (minimal) → Extensions (your code)
```

## 📞 Getting Help

1. **Check docs** in `docs/getting-started/`
2. **Look at examples** in `extensions/frontend/components/`
3. **Run tests** to see working code
4. **Ask questions** via issues or discussions

## 🎉 Next Steps

Choose your path:

**Just want to code?**
→ [QUICKSTART.md](docs/getting-started/QUICKSTART.md)

**Need to test locally?**
→ [LOCAL_TESTING.md](docs/getting-started/LOCAL_TESTING.md)

**Want to understand the system?**
→ [frontend-development.md](docs/getting-started/frontend-development.md)

**Ready to build extensions?**
→ [extension-development.md](docs/getting-started/extension-development.md)

**Need full-stack setup?**
→ [docker-development.md](docs/getting-started/docker-development.md)

---

**Welcome to M8Flow!** Start coding in `extensions/frontend/` and see your changes live! 🚀

Questions? Check `docs/` or open an issue.

