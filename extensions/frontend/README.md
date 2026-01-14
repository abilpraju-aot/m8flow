# M8Flow Frontend Extensions

This directory contains M8Flow frontend customizations that can run **standalone** without modifying upstream code.

## Architecture

```
m8flow/
├── spiffworkflow-frontend/     # Upstream (NO CHANGES NEEDED)
│   └── src/                     # Upstream source (read-only)
│
└── extensions/frontend/         # M8Flow standalone app
    ├── src/
    │   ├── index.tsx           # Entry point
    │   ├── M8FlowApp.tsx       # Main app (wraps upstream)
    │   ├── routes/             # Custom routes
    │   ├── pages/              # Custom pages
    │   ├── components/         # Custom components
    │   ├── theme/              # Theme customizations
    │   ├── i18n/               # Translations
    │   └── config/             # Configuration
    ├── package.json            # Minimal deps (uses upstream's node_modules)
    ├── vite.config.ts          # Vite config (aliases to upstream)
    └── tsconfig.json           # TypeScript config
```

## How It Works

1. **Standalone Entry Point**: `extensions/frontend/src/index.tsx` is the entry point
2. **Upstream Imports**: All upstream code is imported via `@spiff/*` alias
3. **Single Dependencies**: All dependencies resolve to upstream's `node_modules` to avoid duplicates
4. **M8Flow Wrapper**: `M8FlowApp.tsx` wraps upstream components with M8Flow customizations

## Setup

### 1. Install Dependencies

First, ensure upstream dependencies are installed:

```bash
cd ../../spiffworkflow-frontend
npm install
```

Then install M8Flow minimal dependencies:

```bash
cd ../../extensions/frontend
npm install
```

### 2. Run from Extensions

```bash
cd extensions/frontend
npm start
```

The app will run on `http://localhost:7001` (or the port specified in `vite.config.ts`).

## Upstream Changes

**IMPORTANT**: This setup is designed to work **without modifying upstream code**. However, if upstream has already been modified with `@m8flow` imports, you have two options:

### Option A: Revert Upstream Changes (Recommended)

If upstream has been modified, revert these files to their original state:
- `spiffworkflow-frontend/src/App.tsx` - Remove `@m8flow/config` import
- `spiffworkflow-frontend/src/views/BaseRoutes.tsx` - Remove `@m8flow/routes` import
- `spiffworkflow-frontend/src/ContainerForExtensions.tsx` - Remove `@m8flow/theme` import
- `spiffworkflow-frontend/src/components/SideNav.tsx` - Remove `@m8flow/components` import
- `spiffworkflow-frontend/src/index.tsx` - Remove `@m8flow/i18n` import
- `spiffworkflow-frontend/src/index.scss` - Remove `@m8flow/styles` import
- `spiffworkflow-frontend/vite.config.ts` - Remove `@m8flow` alias
- `spiffworkflow-frontend/tsconfig.json` - Remove `@m8flow` paths

### Option B: Keep Minimal Upstream Changes

If you prefer to keep upstream changes, the standalone setup will still work, but you'll have:
- Upstream code that references `@m8flow` (which won't be used when running standalone)
- Some duplication, but it won't break anything

## Features

### Custom Routes

Add routes in `src/routes/M8FlowRoutes.tsx`:

```typescript
export const m8flowRoutes: RouteObject[] = [
  {
    path: 'm8flow/dashboard',
    element: <M8FlowDashboard />,
  },
];
```

### Custom Theme

Edit `src/theme/M8FlowTheme.ts` to customize colors, typography, etc.

### Custom Components

Add components in `src/components/` and export from `src/components/index.ts`.

### Translations

Add translations in `src/i18n/index.ts`.

## Development

```bash
# Start dev server
npm start

# Type check
npm run typecheck

# Build for production
npm run build
```

## Production Build

```bash
npm run build
```

Output will be in `dist/` directory.

## How It Avoids Duplicate Dependencies

The `vite.config.ts` uses aliases to force all context-dependent libraries (React, Preact, MUI, etc.) to resolve to upstream's `node_modules`. This ensures:

- Single React/Preact instance (no context mismatches)
- Single MUI theme instance
- Single i18n instance
- Proper hook context sharing

## Troubleshooting

### "Cannot find module '@spiff/...'"

Ensure upstream dependencies are installed:
```bash
cd ../../spiffworkflow-frontend && npm install
```

### "Hooks context mismatch"

This means dependencies are resolving to different instances. Check that `vite.config.ts` aliases are pointing to upstream's `node_modules`.

### "Module not found" errors

Ensure `vite.config.ts` has correct paths and `fs.allow` includes upstream directories.
