# Verify M8Flow Extensions Are Loading

Quick guide to verify that M8Flow extensions are properly injected into your application.

## Prerequisites

Make sure you're running with the M8Flow configuration:

```bash
cd spiffworkflow-frontend
npm start -- --config vite.config.m8flow.ts
```

**⚠️ Without `--config vite.config.m8flow.ts`, extensions will NOT load!**

## Verification Steps

### 1. Check Console Logs

Open browser DevTools (F12) and check the Console tab. You should see:

```
🚀 Initializing M8Flow plugins...
✓ M8Flow plugins initialized
```

If you see these messages, the plugin system is working! ✅

### 2. Verify Entry Point

In DevTools > Sources tab:

**✅ Correct (M8Flow with extensions):**
```
src/
└── index.m8flow.tsx    ← Should see this
```

**✗ Wrong (Upstream only):**
```
src/
└── index.tsx           ← If you see this, extensions won't load
```

If you see `index.tsx` instead of `index.m8flow.tsx`, restart with the correct config:
```bash
npm start -- --config vite.config.m8flow.ts
```

### 3. Check React DevTools

Install React DevTools browser extension, then:

1. Open DevTools > Components tab
2. Look for these components in the tree:
   - `ExtensionProvider` (should wrap the entire app)
   - `M8FlowApp` or `AppExtensionsWrapper`

If you see these, the extension wrapper is working! ✅

### 4. Test Import Aliases

Create a test file to verify `@m8flow/*` aliases work:

```typescript
// Temporary test in any component
import { M8FlowBanner } from '@m8flow/components';

// In render:
<M8FlowBanner message="Testing M8Flow Extensions!" />
```

If it compiles and renders, your aliases are configured correctly! ✅

### 5. Check Extension Registry

In browser console, type:

```javascript
// Check if extensions are registered (if you've added any)
window.__M8FLOW_DEBUG__ = true;
```

Then refresh the page and check console for extension registration logs.

## Common Issues

### Issue 1: "Cannot find module '@m8flow/components'"

**Cause**: Not using M8Flow Vite config

**Solution**:
```bash
# Stop current server (Ctrl+C)
# Start with M8Flow config
npm start -- --config vite.config.m8flow.ts
```

### Issue 2: No extension logs in console

**Cause**: Extensions not initialized or no plugins registered yet

**Solutions**:
1. Check you're using M8Flow entry point (see step 2 above)
2. Check `extensions/frontend/plugins/initialize.ts` has plugins loaded
3. Add a test plugin to verify system works

### Issue 3: Extensions don't appear in UI

**Possible causes**:

1. **No extension points in UI yet**
   - The system is working, but you need to add `<ExtensionPoint>` components
   - Or directly import and use extension components

2. **Extensions not registered**
   - Check plugin initialization code
   - Verify `registry.register()` is called

3. **Extension disabled**
   - Check extension has `enabled: true`

### Issue 4: TypeScript errors on imports

**Cause**: Using wrong tsconfig

**Solution**:
The M8Flow config should automatically use `tsconfig.m8flow.json`. If not:
```bash
npm run typecheck
```

Should use M8Flow tsconfig. If errors persist, check `vite.config.m8flow.ts` has `viteTsconfigPaths()` plugin.

## Quick Test: Add a Visible Extension

To verify everything is working, add a test component that's immediately visible:

### 1. Create Test Component

```typescript
// extensions/frontend/components/TestVerification.tsx
import React from 'react';

export const TestVerification: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '15px',
      backgroundColor: '#4caf50',
      color: 'white',
      borderRadius: '8px',
      zIndex: 9999,
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}>
      ✅ M8Flow Extensions Active!
    </div>
  );
};
```

### 2. Export It

```typescript
// extensions/frontend/components/index.ts
export { TestVerification } from './TestVerification';
export { TenantSwitcher } from './TenantSwitcher';
export { M8FlowBanner } from './M8FlowBanner';
```

### 3. Import in App (Temporary Test)

Add to any upstream component temporarily (or use an extension point):

```typescript
import { TestVerification } from '@m8flow/components';

// In render:
<TestVerification />
```

### 4. Check Browser

You should see a green badge in the top-right corner saying "✅ M8Flow Extensions Active!"

If you see it: **Everything is working perfectly!** 🎉

## Verification Checklist

Run through this checklist:

- [ ] Started with `npm start -- --config vite.config.m8flow.ts`
- [ ] See "Initializing M8Flow plugins..." in console
- [ ] DevTools Sources shows `index.m8flow.tsx` (not `index.tsx`)
- [ ] React DevTools shows `ExtensionProvider` component
- [ ] Can import from `@m8flow/components` without errors
- [ ] TypeScript compilation works
- [ ] Test component renders successfully

If all checked: **You're ready to build M8Flow extensions!** ✅

## Next Steps

Once verified:

1. Remove any test components
2. Start building real extensions in `extensions/frontend/`
3. Register them via plugins
4. Use extension points to inject them
5. Write tests for your extensions

## Quick Reference

| What to Check | Where to Look | Expected Result |
|---------------|---------------|-----------------|
| Server config | Terminal command | `--config vite.config.m8flow.ts` |
| Console logs | DevTools Console | "Initializing M8Flow plugins..." |
| Entry point | DevTools Sources | `index.m8flow.tsx` |
| React wrapper | React DevTools | `ExtensionProvider` component |
| Imports | Code editor | `@m8flow/*` resolves without errors |
| Runtime | Browser | Extensions render correctly |

## Still Having Issues?

1. **Check the guide**: [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)
2. **Read the setup**: [LOCAL_TESTING.md](./LOCAL_TESTING.md)
3. **Review examples**: Look at `extensions/frontend/components/` for working examples

---

**Remember**: Always use `npm start -- --config vite.config.m8flow.ts` to load extensions! 🚀

