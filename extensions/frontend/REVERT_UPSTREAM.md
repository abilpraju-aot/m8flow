# Reverting Upstream Changes

If you want to run M8Flow from `extensions/frontend` without any upstream modifications, follow these steps to revert upstream changes.

## Files to Revert

### 1. `spiffworkflow-frontend/src/App.tsx`

**Remove:**
```typescript
// M8Flow: Import M8Flow config provider
import { M8FlowConfigProvider } from '@m8flow/config';
```

**And remove from JSX:**
```typescript
<M8FlowConfigProvider>
  <Outlet />
</M8FlowConfigProvider>
```

**Revert to:**
```typescript
<Outlet />
```

### 2. `spiffworkflow-frontend/src/views/BaseRoutes.tsx`

**Remove:**
```typescript
// M8Flow: Import custom routes from extensions
import { m8flowRoutes } from '@m8flow/routes';
```

**And remove from JSX:**
```typescript
{/* M8Flow: Custom routes from extensions/frontend */}
{m8flowRoutes.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
))}
```

### 3. `spiffworkflow-frontend/src/ContainerForExtensions.tsx`

**Remove:**
```typescript
// M8Flow: Import M8Flow theme to override Spiff theme
import { createM8FlowTheme } from '@m8flow/theme';
```

**Replace:**
```typescript
const [globalTheme, setGlobalTheme] = useState(
  createM8FlowTheme(storedTheme),
);
```

**With:**
```typescript
const [globalTheme, setGlobalTheme] = useState(
  createTheme(createSpiffTheme(storedTheme)),
);
```

**And in `toggleDarkMode`:**
```typescript
setGlobalTheme(createM8FlowTheme(desiredTheme));
```

**Replace with:**
```typescript
setGlobalTheme(createTheme(createSpiffTheme(desiredTheme)));
```

### 4. `spiffworkflow-frontend/src/components/SideNav.tsx`

**Remove:**
```typescript
import { M8FlowLogo } from '@m8flow/components';
```

**And remove M8Flow nav items:**
```typescript
{
  text: t('m8flow.navigation.dashboard', 'M8Flow'),
  icon: <DashboardIcon />,
  route: '/m8flow',
  id: 'm8flow-dashboard',
},
// ... other M8Flow nav items
```

**And revert logo:**
```typescript
<MuiLink component={Link} to="/">
  <M8FlowLogo variant="full" />
</MuiLink>
```

**To:**
```typescript
<MuiLink component={Link} to="/">
  <SpiffLogo />
</MuiLink>
```

### 5. `spiffworkflow-frontend/src/index.tsx`

**Remove:**
```typescript
// M8Flow: Initialize M8Flow translations
import { initM8FlowI18n } from '@m8flow/i18n';
initM8FlowI18n();
```

### 6. `spiffworkflow-frontend/src/index.scss`

**Remove:**
```scss
// M8Flow: Import M8Flow styles to override upstream styles
@import '@m8flow/styles/index.scss';
```

### 7. `spiffworkflow-frontend/vite.config.ts`

**Remove:**
```typescript
// M8Flow extension path - all customizations live here
const m8flowExtensionPath = path.resolve(__dirname, '../extensions/frontend/src');
```

**And remove from `fs.allow`:**
```typescript
m8flowExtensionPath,
```

**And remove from `resolve.alias`:**
```typescript
// M8Flow: Point to extension customizations
'@m8flow': m8flowExtensionPath,
// M8Flow: Alias for upstream src (allows extensions to import upstream code)
'@spiff': path.resolve(__dirname, 'src'),
```

### 8. `spiffworkflow-frontend/tsconfig.json`

**Remove:**
```json
"baseUrl": ".",
"paths": {
  "@m8flow/*": ["../extensions/frontend/src/*"],
  "@spiff/*": ["src/*"]
}
```

**And remove from `include`:**
```json
"../extensions/frontend/src"
```

### 9. `spiffworkflow-frontend/src/m8flow.ts`

**Delete this file entirely** (if it exists).

## After Reverting

1. Run from `extensions/frontend`:
   ```bash
   cd extensions/frontend
   npm start
   ```

2. All M8Flow customizations will be injected via the standalone app wrapper.

3. Upstream code remains completely untouched.

## Verification

After reverting, verify:
- ✅ `cd spiffworkflow-frontend && npm start` should work (original Spiff app)
- ✅ `cd extensions/frontend && npm start` should work (M8Flow app with customizations)
- ✅ No `@m8flow` imports in upstream code
- ✅ No errors about missing `@m8flow` modules when running upstream
