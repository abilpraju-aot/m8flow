# How M8Flow Extension Injection Works

This document explains how M8Flow customizations are injected into the application while keeping upstream SpiffArena code pristine.

## The Challenge

We need to add M8Flow customizations without modifying upstream `spiffworkflow-frontend/src/` code, ensuring:
1. Clean separation between upstream and custom code
2. Easy upstream updates via git subtree
3. Clear licensing boundaries

## The Solution: Separate Entry Point

M8Flow uses a **separate entry point** strategy:

```
Upstream Entry Point          M8Flow Entry Point
(untouched)                   (with extensions)

index.html                    index.m8flow.html
    ↓                             ↓
src/index.tsx                 src/index.m8flow.tsx
    ↓                             ↓
<App />                       <M8FlowApp />
                                  ↓
                              wrapAppWithExtensions(App)
                                  ↓
                              ExtensionProvider + Plugins
```

## File Structure

```
spiffworkflow-frontend/
├── index.html                    # Upstream entry (untouched)
├── index.m8flow.html             # M8Flow entry (custom)
├── src/
│   ├── index.tsx                 # Upstream entry point (untouched)
│   ├── index.m8flow.tsx          # M8Flow entry point (custom)
│   └── App.tsx                   # Upstream App (untouched)
├── vite.config.ts                # Upstream config (untouched)
└── vite.config.m8flow.ts         # M8Flow config (custom)
```

## How It Works

### 1. Development Mode

When you run:
```bash
npm start -- --config vite.config.m8flow.ts
```

Vite:
1. Loads `vite.config.m8flow.ts` (M8Flow configuration)
2. Configures `@m8flow/*` path aliases
3. Uses `index.m8flow.html` as entry (via build.rollupOptions.input)
4. Loads `src/index.m8flow.tsx` instead of `src/index.tsx`

### 2. Extension Injection Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Browser loads index.m8flow.html                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Executes src/index.m8flow.tsx                               │
│  • Imports upstream App component                            │
│  • Imports wrapAppWithExtensions from integration layer      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  wrapAppWithExtensions(App)                                  │
│  • Creates M8FlowApp wrapper component                       │
│  • Wraps with ExtensionProvider context                      │
│  • Initializes plugin system                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  initializePlugins()                                         │
│  • Loads all plugin modules                                  │
│  • Each plugin registers its extensions                      │
│  • Extensions stored in global registry                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  React renders M8FlowApp                                     │
│  • ExtensionProvider wraps entire app                        │
│  • Upstream App component renders normally                   │
│  • ExtensionPoint components query registry                  │
│  • Registered extensions render at extension points          │
└─────────────────────────────────────────────────────────────┘
```

### 3. Code Walkthrough

#### `src/index.m8flow.tsx` (Custom Entry Point)

```typescript
import App from './App';  // Upstream App (unchanged)
import { wrapAppWithExtensions } from '@m8flow/integration/App.extensions';

// Wrap upstream App with M8Flow extensions
const M8FlowApp = wrapAppWithExtensions(App);

// Render wrapped app instead of original
root.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={overrideTheme}>
        <M8FlowApp />  {/* M8Flow-wrapped version */}
      </ThemeProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

#### `integration/frontend/App.extensions.tsx` (Wrapper)

```typescript
export const AppExtensionsWrapper: React.FC = ({ children }) => {
  useEffect(() => {
    // Initialize all M8Flow plugins
    initializePlugins({
      config: {
        enableMultiTenancy: true,
        enableAdvancedIntegrations: true,
      },
    });
  }, []);

  return (
    <ExtensionProvider>
      {children}  {/* Original upstream App renders here */}
    </ExtensionProvider>
  );
};
```

#### `extensions/frontend/plugins/initialize.ts` (Plugin Loader)

```typescript
export function initializePlugins(context: PluginContext): void {
  const { registry } = context;

  // Load all plugin modules
  // Each plugin calls registry.register() to add extensions
  
  // Example: Multi-tenancy plugin
  registry.register({
    id: 'tenant-switcher',
    extensionPoint: 'app.header',
    component: TenantSwitcher,
    enabled: true,
  });
}
```

### 4. Extension Points Rendering

When upstream code reaches an extension point:

```typescript
// In upstream component (or wrapped component)
import { ExtensionPoint } from '@m8flow/plugins';

function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
      {/* Extension point - M8Flow extensions render here */}
      <ExtensionPoint id="app.header" />
    </header>
  );
}
```

The `ExtensionPoint` component:
1. Queries the registry for extensions registered at "app.header"
2. Filters enabled extensions
3. Sorts by priority
4. Renders each extension component

## Key Benefits

### ✅ No Upstream Modifications

```
spiffworkflow-frontend/src/
├── index.tsx          ← UNTOUCHED (original upstream)
├── App.tsx            ← UNTOUCHED (original upstream)
└── components/        ← UNTOUCHED (original upstream)
```

### ✅ Clean Separation

```
Upstream:     spiffworkflow-frontend/src/
M8Flow:       extensions/frontend/
Integration:  integration/frontend/
Entry Point:  src/index.m8flow.tsx (minimal bridge)
```

### ✅ Easy Updates

```bash
# Update upstream without conflicts
git subtree pull --prefix spiffworkflow-frontend upstream main

# Your customizations remain in extensions/
# Your entry point remains in src/index.m8flow.tsx
```

### ✅ Flexible Configuration

```bash
# Run upstream version (no extensions)
npm start

# Run M8Flow version (with extensions)
npm start -- --config vite.config.m8flow.ts
```

## Build Process

### Development Build

```bash
npm start -- --config vite.config.m8flow.ts
```

Uses:
- `vite.config.m8flow.ts` → Configures aliases
- `index.m8flow.html` → Entry HTML
- `src/index.m8flow.tsx` → Entry JS
- Extensions loaded via `@m8flow/*` aliases

### Production Build

```bash
npm run build -- --config vite.config.m8flow.ts
```

Output:
```
dist/
├── index.html (from index.m8flow.html)
├── assets/
│   ├── index-[hash].js (includes extensions)
│   └── index-[hash].css
└── ...
```

## Comparison with Alternatives

### Alternative 1: Modify Upstream ✗

```typescript
// Would require modifying src/index.tsx
import { M8FlowExtensions } from '../extensions/...';
```

**Problems:**
- Violates pristine upstream principle
- Merge conflicts on updates
- Unclear licensing boundaries

### Alternative 2: Proxy App Component ✗

```typescript
// Create proxy that replaces App
export default function AppProxy() {
  return <M8FlowApp />;
}
```

**Problems:**
- Still requires modifying imports
- More complex to maintain

### Alternative 3: Build-time Injection ✗

```javascript
// Use build tools to inject code
plugins: [
  injectExtensions({
    target: 'src/index.tsx',
    inject: 'import Extensions...'
  })
]
```

**Problems:**
- Fragile (breaks on upstream changes)
- Hard to debug
- Modifies upstream at build time

### ✅ Our Solution: Separate Entry Point

**Advantages:**
- Zero upstream modifications
- Clear separation
- Easy to understand
- Simple to maintain
- No build-time magic
- Can run both versions

## Testing

### Test Upstream Version

```bash
npm start  # Uses index.html + src/index.tsx
```

Should work exactly as upstream intended.

### Test M8Flow Version

```bash
npm start -- --config vite.config.m8flow.ts
```

Should include all M8Flow extensions.

### Verify Extension Injection

1. Open browser console
2. Check for initialization logs:
   ```
   🚀 Initializing M8Flow plugins...
   ✓ Registered extension: Tenant Switcher (tenant-switcher)
   ✓ Registered extension: M8Flow Banner (m8flow-banner)
   ✓ M8Flow plugins initialized
   ```

3. Inspect React DevTools:
   - Find `ExtensionProvider` wrapper
   - Find `M8FlowApp` component
   - See extension components rendered

## Troubleshooting

### Extensions Not Loading

**Check 1: Using correct config?**
```bash
# Must include --config flag
npm start -- --config vite.config.m8flow.ts
```

**Check 2: Is entry point correct?**
```bash
# Open browser DevTools > Sources
# Should see index.m8flow.tsx, not index.tsx
```

**Check 3: Are plugins initialized?**
```javascript
// In browser console
console.log('Extensions:', window.__M8FLOW_EXTENSIONS__);
```

### Upstream Updates Breaking Extensions

If upstream changes break extensions:
1. Extensions are isolated, so upstream still works
2. Fix only extension code, not upstream
3. Update integration layer if needed

## Summary

M8Flow achieves extension injection through:

1. **Separate Entry Point**: `src/index.m8flow.tsx` instead of modifying `src/index.tsx`
2. **Custom HTML**: `index.m8flow.html` loads M8Flow entry point
3. **App Wrapper**: `wrapAppWithExtensions()` wraps upstream App
4. **Extension Provider**: Provides extension context to app
5. **Plugin System**: Loads and registers all extensions
6. **Extension Points**: Renders extensions at predefined locations

**Result**: Complete customization with zero upstream modifications! ✨

