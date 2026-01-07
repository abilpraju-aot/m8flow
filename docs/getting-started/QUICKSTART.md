# M8Flow Quick Start Guide

Get M8Flow running locally in 5 minutes with this guide for expert developers.

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- MySQL 8.0+ (or use Docker)
- Git

## Option 1: Local Development (Recommended for Frontend Work)

### 1. Install Frontend Dependencies

```bash
cd spiffworkflow-frontend
npm install
```

### 2. Start Frontend (Development Mode)

```bash
npm start -- --config vite.config.m8flow.ts
```

Frontend will be available at: **http://localhost:7001**

### 3. (Optional) Start Backend

If you need backend API:

```bash
cd ../spiffworkflow-backend
./bin/agents/backend_setup.sh  # First time only
uv run python app.py
```

Backend API will be available at: **http://localhost:8000**

## Option 2: Docker (Full Stack)

### 1. Start All Services

```bash
cd docker
cp sample.env .env
docker-compose up
```

### 2. Access the Application

- Frontend: http://localhost:7001
- Backend API: http://localhost:8000

## Testing Your Setup

### Test Frontend Extensions

1. Create a test component:

```bash
# extensions/frontend/components/TestComponent.tsx
```

```typescript
import React from 'react';

export const TestComponent: React.FC = () => {
  return <div style={{ padding: '20px', backgroundColor: '#e0f7fa' }}>
    <h2>M8Flow Extension Test</h2>
    <p>If you see this, extensions are working! ✓</p>
  </div>;
};
```

2. Export it:

```typescript
// extensions/frontend/components/index.ts
export { TestComponent } from './TestComponent';
```

3. Import and use (for quick testing, add to any upstream component):

```typescript
import { TestComponent } from '@m8flow/components';

// In your render:
<TestComponent />
```

4. Check browser - you should see your component!

## Development Workflow

### Making Frontend Changes

1. **Edit files** in `extensions/frontend/`
2. **Save** - browser auto-reloads (< 1 second)
3. **Test** in browser at http://localhost:7001

### Project Structure

```
m8flow/
├── spiffworkflow-frontend/          # Upstream (don't touch)
├── extensions/frontend/             # Your code goes here!
│   ├── components/                  # UI components
│   ├── views/                       # Full pages
│   ├── hooks/                       # React hooks
│   └── services/                    # Business logic
└── integration/frontend/            # Wiring (minimal)
```

## Import Syntax

Always use `@m8flow/*` aliases:

```typescript
// ✓ Correct
import { TenantSwitcher } from '@m8flow/components';
import { useTenant } from '@m8flow/hooks';
import { TenantService } from '@m8flow/services';

// ✗ Wrong
import { TenantSwitcher } from '../extensions/frontend/components/TenantSwitcher';
```

## Key Commands

### Frontend

```bash
# Development
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts

# Build
npm run build -- --config vite.config.m8flow.ts

# Test
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

### Docker

```bash
cd docker

# Start
docker-compose up

# Stop
docker-compose down

# Logs
docker-compose logs -f frontend

# Restart
docker-compose restart frontend
```

## Common Issues

### Port Already in Use

```bash
# Change port in .env (Docker) or:
PORT=3000 npm start -- --config vite.config.m8flow.ts
```

### Extensions Not Loading

Verify you're using M8Flow config:
```bash
npm start -- --config vite.config.m8flow.ts
#                      ^^^^^^^^^^^^^^^^^^^ Important!
```

### Type Errors

```bash
npm run typecheck
# Fix reported errors
```

### Hot Reload Not Working

```bash
# Restart dev server
# Ctrl+C then:
npm start -- --config vite.config.m8flow.ts
```

## Next Steps

1. **Read the guides:**
   - [Frontend Development](./frontend-development.md) - Complete frontend guide
   - [Extension Development](./extension-development.md) - Plugin system
   - [Docker Development](./docker-development.md) - Docker details

2. **Explore examples:**
   - `extensions/frontend/components/TenantSwitcher.tsx` - Example component
   - `extensions/frontend/components/ExamplePlugin.tsx` - Example plugin

3. **Write tests:**
   - `extensions/frontend/tests/` - Test examples

## Architecture Principles

### ✓ DO

- ✓ Put all customizations in `extensions/`
- ✓ Use `@m8flow/*` import aliases
- ✓ Create plugins for extension points
- ✓ Write tests for your extensions
- ✓ Use TypeScript types

### ✗ DON'T

- ✗ Modify `spiffworkflow-frontend/src/`
- ✗ Modify `spiffworkflow-backend/src/`
- ✗ Use relative paths to import extensions
- ✗ Skip type checking
- ✗ Commit without testing

## Example: Adding a New Feature

Let's add a "Quick Actions" menu:

### 1. Create Component

```typescript
// extensions/frontend/components/QuickActions.tsx
import React from 'react';
import { Button } from '@carbon/react';

export const QuickActions: React.FC = () => {
  return (
    <div className="quick-actions">
      <Button kind="primary">New Process</Button>
      <Button kind="secondary">View Reports</Button>
    </div>
  );
};
```

### 2. Export

```typescript
// extensions/frontend/components/index.ts
export { QuickActions } from './QuickActions';
```

### 3. Create Plugin

```typescript
// extensions/frontend/plugins/quickActionsPlugin.ts
import { createPlugin } from '@m8flow/plugins';
import { QuickActions } from '@m8flow/components';

export default createPlugin('QuickActions', (context) => {
  context.registry.register({
    id: 'quick-actions',
    name: 'Quick Actions',
    type: 'component',
    extensionPoint: 'app.header',
    component: QuickActions,
    enabled: true,
  });
});
```

### 4. Test

Open browser, should see Quick Actions in header!

## Getting Help

- **Check logs:** `docker-compose logs -f` or browser console
- **Read docs:** `docs/getting-started/`
- **Example code:** `extensions/frontend/components/`
- **Tests:** `extensions/frontend/tests/`

## Pro Tips

1. **Use Hot Reload:** Keep dev server running, just save files
2. **Check Types Early:** Run `npm run typecheck` often
3. **Test in Browser:** Use React DevTools
4. **Read Upstream Code:** Learn from `spiffworkflow-frontend/src/`
5. **Use Carbon Components:** Consistent UI with `@carbon/react`

## Quick Reference

| Task | Command |
|------|---------|
| Start frontend | `npm start -- --config vite.config.m8flow.ts` |
| Start Docker | `docker-compose up` |
| Run tests | `npm test` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build -- --config vite.config.m8flow.ts` |

---

**You're ready to go!** Start editing files in `extensions/frontend/` and see changes instantly in your browser. 🚀

