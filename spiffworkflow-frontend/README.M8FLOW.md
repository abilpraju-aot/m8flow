# M8Flow Frontend Setup

## Current Configuration

This frontend has been configured to load M8Flow extensions by default.

### File Structure

```
spiffworkflow-frontend/
├── index.html                    ← M8Flow version (WITH extensions) ✓
├── index.upstream.html           ← Original upstream (NO extensions)
├── index.m8flow.html             ← M8Flow template (reference)
├── src/
│   ├── index.tsx                 ← M8Flow entry point (WITH extensions) ✓
│   ├── index.upstream.tsx        ← Original upstream (NO extensions)
│   └── index.m8flow.tsx          ← M8Flow template (reference)
└── vite.config.m8flow.ts         ← M8Flow Vite configuration
```

## Development

### Start with M8Flow Extensions (Default)

```bash
npm start -- --config vite.config.m8flow.ts --host 0.0.0.0
```

This uses:
- `index.html` → M8Flow HTML (title: "M8Flow")
- `src/index.tsx` → M8Flow entry point with extensions
- Extensions from `../../extensions/frontend/`

**You should see:**
- ✅ Console: "🚀 Initializing M8Flow plugins..."
- ✅ Console: "✓ M8Flow plugins initialized"
- ✅ Extensions render in the UI

### Start Upstream Only (For Testing)

If you need to test the pure upstream version without extensions:

1. **Temporarily swap files**:
   ```bash
   # Backup current
   mv index.html index.m8flow-current.html
   mv src/index.tsx src/index.m8flow-current.tsx
   
   # Use upstream
   cp index.upstream.html index.html
   cp src/index.upstream.tsx src/index.tsx
   
   # Start
   npm start
   
   # Restore after testing
   mv index.m8flow-current.html index.html
   mv src/index.m8flow-current.tsx src/index.tsx
   ```

## How Extensions Are Injected

### 1. Entry Point (`src/index.tsx`)

```typescript
import { wrapAppWithExtensions } from '@m8flow/integration/App.extensions';

// Wrap upstream App with M8Flow extensions
const M8FlowApp = wrapAppWithExtensions(App);

// Render wrapped app
root.render(<M8FlowApp />);
```

### 2. Extension Wrapper

```typescript
// integration/frontend/App.extensions.tsx
export const AppExtensionsWrapper = ({ children }) => {
  useEffect(() => {
    // Initialize M8Flow plugins
    initializePlugins({ config: { ... } });
  }, []);

  return (
    <ExtensionProvider>
      {children}  {/* Original App renders here */}
    </ExtensionProvider>
  );
};
```

### 3. Plugin Registration

```typescript
// extensions/frontend/plugins/initialize.ts
initializePlugins() {
  // Load all plugin modules
  // Each plugin registers its extensions
  registry.register({
    id: 'tenant-switcher',
    extensionPoint: 'app.header',
    component: TenantSwitcher,
  });
}
```

## Verification

### Check Extensions Are Loading

1. **Console Logs**:
   ```
   🚀 Initializing M8Flow plugins...
   ✓ M8Flow plugins initialized
   ```

2. **DevTools Sources**:
   - Should see `src/index.tsx` with M8Flow code
   - Should NOT see `src/index.upstream.tsx`

3. **React DevTools**:
   - Look for `ExtensionProvider` wrapper
   - Look for `M8FlowApp` component

4. **Import Test**:
   ```typescript
   import { M8FlowBanner } from '@m8flow/components';
   // Should work without errors
   ```

## Common Issues

### Extensions Not Loading

**Symptom**: No console logs, no extensions visible

**Solution**: Make sure you're using the M8Flow config:
```bash
npm start -- --config vite.config.m8flow.ts
#                      ^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Module Not Found Errors

**Symptom**: `Cannot find module '@m8flow/components'`

**Solution**: 
1. Verify `vite.config.m8flow.ts` has path aliases
2. Restart dev server
3. Check files exist in `../../extensions/frontend/`

### Wrong Entry Point Loading

**Symptom**: DevTools shows `index.upstream.tsx` instead of `index.tsx`

**Solution**: 
1. Verify `index.html` points to `/src/index.tsx`
2. Clear browser cache
3. Hard refresh (Ctrl+Shift+R)

## Building for Production

```bash
npm run build -- --config vite.config.m8flow.ts
```

Output includes all M8Flow extensions bundled in.

## Important Notes

- ✅ `index.html` and `src/index.tsx` are M8Flow versions (default)
- ✅ Upstream code is preserved in `*.upstream.*` files
- ✅ Original templates kept in `*.m8flow.*` files
- ✅ No modifications to `spiffworkflow-frontend/src/` except entry point
- ✅ All extensions live in `../../extensions/frontend/`

## Next Steps

1. Start dev server: `npm start -- --config vite.config.m8flow.ts --host 0.0.0.0`
2. Verify console shows "Initializing M8Flow plugins..."
3. Create extensions in `../../extensions/frontend/`
4. Import using `@m8flow/components`, `@m8flow/hooks`, etc.
5. Extensions automatically render!

---

**Your M8Flow frontend is ready!** 🚀

