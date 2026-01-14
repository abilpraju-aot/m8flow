# Standalone Setup - Run from Extensions Without Upstream Changes

This guide shows you how to run M8Flow from `extensions/frontend` **without modifying upstream code**.

## Quick Start

```bash
# 1. Install upstream dependencies
cd ../../spiffworkflow-frontend
npm install

# 2. Install M8Flow minimal dependencies
cd ../../extensions/frontend
npm install

# 3. Run from extensions
npm start
```

The app will be available at `http://localhost:7001`.

## How It Works

1. **Entry Point**: `extensions/frontend/src/index.tsx` is the main entry point
2. **App Wrapper**: `extensions/frontend/src/M8FlowApp.tsx` wraps upstream components
3. **Upstream Imports**: All upstream code imported via `@spiff/*` alias
4. **Single Dependencies**: All deps resolve to upstream's `node_modules` (no duplicates)

## File Structure

```
extensions/frontend/
├── src/
│   ├── index.tsx              # Entry point (imports upstream App)
│   ├── M8FlowApp.tsx          # Main app wrapper
│   ├── routes/                # M8Flow routes
│   ├── pages/                 # M8Flow pages
│   ├── components/            # M8Flow components
│   ├── theme/                 # M8Flow theme
│   ├── i18n/                  # M8Flow translations
│   └── config/                # M8Flow config
├── package.json               # Minimal deps (uses upstream's node_modules)
├── vite.config.ts             # Vite config (aliases to upstream)
├── tsconfig.json              # TypeScript config
└── index.html                 # HTML entry point
```

## Key Configuration

### vite.config.ts

- **`@m8flow` alias**: Points to `extensions/frontend/src`
- **`@spiff` alias**: Points to `spiffworkflow-frontend/src`
- **Dependency aliases**: All context-dependent libs resolve to upstream's `node_modules`
- **fs.allow**: Allows serving files from upstream directory

### tsconfig.json

- **`@m8flow/*` paths**: Maps to `src/*`
- **`@spiff/*` paths**: Maps to `../../spiffworkflow-frontend/src/*`

## What Gets Injected

When running from `extensions/frontend`:

1. **Theme**: M8Flow theme extends Spiff theme (via `M8FlowApp.tsx`)
2. **Routes**: M8Flow routes added to router (via `M8FlowApp.tsx`)
3. **Config**: M8Flow config provider wraps app (via `M8FlowApp.tsx`)
4. **Translations**: M8Flow i18n keys added (via `index.tsx`)
5. **Styles**: M8Flow styles imported (via `index.tsx`)

## Navigation Items

**Note**: M8Flow navigation items in the sidebar require adding them to upstream's `SideNav.tsx`. However, the app works without them - users can navigate directly to `/m8flow/*` routes.

If you want M8Flow nav items in the sidebar, you have two options:

### Option 1: Add to Upstream SideNav (Minimal Change)

Add M8Flow nav items to `spiffworkflow-frontend/src/components/SideNav.tsx`:

```typescript
import { M8FlowLogo } from '@m8flow/components';
import { Dashboard as DashboardIcon, Business as BusinessIcon } from '@mui/icons-material';

// In navItems array:
{
  text: t('m8flow.navigation.dashboard', 'Dashboard'),
  icon: <DashboardIcon />,
  route: '/m8flow',
  id: 'm8flow-dashboard',
},
// ... other M8Flow items
```

### Option 2: Use Extension System

Use upstream's extension system to inject nav items dynamically (no code changes needed).

## Upstream Code Status

**Current State**: Upstream may have `@m8flow` imports if you've been using the integrated approach.

**For Standalone**: You can either:
- **Revert upstream changes** (see `REVERT_UPSTREAM.md`)
- **Keep them** (they won't be used when running standalone, but won't break anything)

## Troubleshooting

### "Cannot find module '@spiff/...'"

**Solution**: Ensure upstream dependencies are installed:
```bash
cd ../../spiffworkflow-frontend && npm install
```

### "Hooks context mismatch"

**Solution**: Check that `vite.config.ts` aliases point to upstream's `node_modules`. All context-dependent libraries must resolve to the same instance.

### "Module not found" errors

**Solution**: 
1. Check `vite.config.ts` has correct paths
2. Ensure `fs.allow` includes upstream directories
3. Verify `tsconfig.json` paths are correct

### Port already in use

**Solution**: Change port in `vite.config.ts`:
```typescript
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 7002;
```

## Development Workflow

```bash
# Terminal 1: Run M8Flow frontend
cd extensions/frontend
npm start

# Terminal 2: Run backend (if needed)
cd ../../spiffworkflow-backend
# ... start backend
```

## Production Build

```bash
cd extensions/frontend
npm run build
```

Output will be in `dist/` directory.

## Benefits of Standalone Setup

✅ **No upstream modifications** - Upstream code remains untouched  
✅ **Independent development** - Develop M8Flow features independently  
✅ **Easy upgrades** - Upgrade upstream without merge conflicts  
✅ **Clear separation** - All M8Flow code in one place  
✅ **Single dependencies** - No duplicate React/Preact instances  

## Limitations

⚠️ **Navigation items** - Require upstream modification or extension system  
⚠️ **Logo replacement** - Requires upstream modification or CSS override  
⚠️ **Initial setup** - Need to install upstream dependencies first  

## Next Steps

1. ✅ Run `npm start` from `extensions/frontend`
2. ✅ Verify app loads with M8Flow customizations
3. ⚠️ (Optional) Add M8Flow nav items to upstream SideNav
4. ⚠️ (Optional) Revert upstream changes if you want completely clean upstream
