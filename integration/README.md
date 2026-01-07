# M8Flow Integration Layer

This directory contains the glue code that wires M8Flow extensions into the upstream SpiffArena codebase.

## Purpose

The integration layer serves as a bridge between:
- Upstream SpiffArena code (untouched)
- M8Flow extensions (AOT customizations)

## Structure

```
integration/
├── frontend/           # Frontend integration
│   ├── vite.config.extensions.ts    # Vite configuration for extensions
│   ├── App.extensions.tsx           # App-level integration
│   ├── routes.extensions.ts         # Route extensions
│   └── plugins.ts                   # Plugin system initialization
├── backend/            # Backend integration
│   ├── app.extensions.py           # Flask app extensions
│   └── routes.extensions.py        # API route extensions
└── config/             # Shared configuration
    └── feature-flags.json
```

## How It Works

### Frontend Integration

The integration layer:
1. Configures Vite path aliases to map `@m8flow/*` to `extensions/frontend/*`
2. Wraps the main App component with extension providers
3. Registers additional routes
4. Initializes the plugin system

### Backend Integration

The integration layer:
1. Registers Flask blueprints for extension APIs
2. Adds middleware for multi-tenancy
3. Configures additional database models
4. Sets up background tasks and event handlers

## Development Guidelines

1. **Keep integration code minimal** - Most logic should be in `extensions/`
2. **Use dependency injection** - Pass services and config through the integration layer
3. **Maintain backward compatibility** - Don't break upstream functionality
4. **Document integration points** - Explain why and how extensions are wired

## Example: Adding a New Frontend Extension

1. Create your component in `extensions/frontend/components/MyComponent.tsx`
2. Export it from `extensions/frontend/components/index.ts`
3. Use it in `integration/frontend/App.extensions.tsx`:

```typescript
import { MyComponent } from '@m8flow/components';

export function extendApp(App: React.ComponentType) {
  return function ExtendedApp(props: any) {
    return (
      <ExtensionProvider>
        <App {...props} />
        <MyComponent />
      </ExtensionProvider>
    );
  };
}
```

## Testing Integration

Run the full test suite:

```bash
./bin/agents/run_playwright.sh
```

Test specific integration:

```bash
cd spiffworkflow-frontend/test/browser
uv run pytest integration/test_extensions.py -v
```

