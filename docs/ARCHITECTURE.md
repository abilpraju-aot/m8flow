# M8Flow Architecture

Complete architecture overview of the M8Flow extension system.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        M8Flow Platform                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Presentation Layer                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │   Browser    │  │   Mobile     │  │   Desktop   │  │ │
│  │  │   (React)    │  │   (Future)   │  │   (Future)  │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ HTTP/WebSocket                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Frontend Layer                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  SpiffArena Frontend (Upstream - Untouched)      │  │ │
│  │  │  - React components                              │  │ │
│  │  │  - BPMN.js integration                           │  │ │
│  │  │  - Base UI                                       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                        ↓ Extended by                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  M8Flow Extensions (Your Code)                   │  │ │
│  │  │  - Custom components                             │  │ │
│  │  │  - Multi-tenancy                                 │  │ │
│  │  │  - Advanced features                             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ REST API                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Backend Layer                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  SpiffArena Backend (Upstream - Untouched)       │  │ │
│  │  │  - Flask API                                     │  │ │
│  │  │  - SpiffWorkflow engine                          │  │ │
│  │  │  - Core services                                 │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                        ↓ Extended by                     │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  M8Flow Backend Extensions (Your Code)           │  │ │
│  │  │  - Custom APIs                                   │  │ │
│  │  │  - Multi-tenancy logic                           │  │ │
│  │  │  - Integrations                                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ Database                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Data Layer                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  MySQL   │  │  Redis   │  │  S3      │            │ │
│  │  │  (Main)  │  │  (Cache) │  │  (Files) │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
m8flow/
├── spiffworkflow-frontend/          # Upstream (NEVER MODIFY)
│   ├── src/                         # Original source code
│   │   ├── components/              # Base components
│   │   ├── views/                   # Base views
│   │   ├── services/                # Base services
│   │   └── hooks/                   # Base hooks
│   ├── vite.config.ts               # Original config
│   └── package.json                 # Original dependencies
│
├── extensions/frontend/             # M8Flow Customizations (YOUR CODE)
│   ├── components/                  # Custom components
│   │   ├── TenantSwitcher.tsx      # Example
│   │   ├── M8FlowBanner.tsx        # Example
│   │   └── index.ts                # Export all
│   ├── views/                       # Custom views
│   ├── hooks/                       # Custom hooks
│   ├── services/                    # Custom services
│   ├── plugins/                     # Extension plugins
│   │   ├── ExtensionRegistry.ts    # Plugin registry
│   │   ├── ExtensionPoint.tsx      # Extension point component
│   │   └── ExamplePlugin.tsx       # Example plugin
│   ├── contexts/                    # React contexts
│   │   └── ExtensionContext.tsx    # Extension context
│   ├── types/                       # TypeScript types
│   │   └── index.ts                # Type definitions
│   ├── utils/                       # Utilities
│   └── tests/                       # Tests
│
├── integration/frontend/            # Integration Layer (MINIMAL)
│   ├── App.extensions.tsx          # App wrapper
│   ├── vite.config.extensions.ts   # Vite configuration
│   └── tsconfig.extensions.json    # TypeScript config
│
└── spiffworkflow-frontend/          # M8Flow-specific configs
    ├── vite.config.m8flow.ts       # M8Flow Vite config (USE THIS)
    └── tsconfig.m8flow.json        # M8Flow TS config (USE THIS)
```

### Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    React App                            │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  ExtensionProvider (Wrapper)                     │  │ │
│  │  │                                                  │  │ │
│  │  │  ┌────────────────────────────────────────────┐ │  │ │
│  │  │  │  Upstream App Component                    │ │  │ │
│  │  │  │                                            │ │  │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │  │ │
│  │  │  │  │  Header                              │ │ │  │ │
│  │  │  │  │  ┌────────────────────────────────┐ │ │ │  │ │
│  │  │  │  │  │  ExtensionPoint: app.header   │ │ │ │  │ │
│  │  │  │  │  │  ↓                            │ │ │ │  │ │
│  │  │  │  │  │  • TenantSwitcher            │ │ │ │  │ │
│  │  │  │  │  │  • M8FlowBanner               │ │ │ │  │ │
│  │  │  │  │  └────────────────────────────────┘ │ │ │  │ │
│  │  │  │  └──────────────────────────────────────┘ │ │  │ │
│  │  │  │                                            │ │  │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │  │ │
│  │  │  │  │  Sidebar                             │ │ │  │ │
│  │  │  │  │  ┌────────────────────────────────┐ │ │ │  │ │
│  │  │  │  │  │  ExtensionPoint: app.sidebar  │ │ │ │  │ │
│  │  │  │  │  │  ↓                            │ │ │ │  │ │
│  │  │  │  │  │  • Custom menu items          │ │ │ │  │ │
│  │  │  │  │  └────────────────────────────────┘ │ │ │  │ │
│  │  │  │  └──────────────────────────────────────┘ │ │  │ │
│  │  │  │                                            │ │  │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │  │ │
│  │  │  │  │  Main Content (Routes)               │ │ │  │ │
│  │  │  │  │  • Upstream routes                   │ │ │  │ │
│  │  │  │  │  • Extension routes                  │ │ │  │ │
│  │  │  │  └──────────────────────────────────────┘ │ │  │ │
│  │  │  └────────────────────────────────────────────┘ │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Extension System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Startup                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  1. Initialize Extension Registry                            │
│     • Create global registry                                 │
│     • Set up extension points                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Load Plugins                                             │
│     • Import plugin modules                                  │
│     • Call plugin initialization functions                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Register Extensions                                      │
│     Plugin 1: registry.register({                            │
│       extensionPoint: 'app.header',                          │
│       component: TenantSwitcher                              │
│     })                                                       │
│                                                              │
│     Plugin 2: registry.register({                            │
│       extensionPoint: 'app.header',                          │
│       component: M8FlowBanner                                │
│     })                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Render Application                                       │
│     • Render upstream components                             │
│     • Reach ExtensionPoint components                        │
│     • Query registry for extensions                          │
│     • Render registered extensions                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Runtime                                                  │
│     • Extensions respond to user interactions                │
│     • Extensions communicate via contexts/services           │
│     • Extensions can be enabled/disabled dynamically         │
└─────────────────────────────────────────────────────────────┘
```

### Import Resolution

```
Developer writes:
  import { TenantSwitcher } from '@m8flow/components';

              ↓ Vite resolves via alias

  vite.config.m8flow.ts:
    alias: {
      '@m8flow/components': '../extensions/frontend/components'
    }

              ↓ Resolves to

  extensions/frontend/components/index.ts:
    export { TenantSwitcher } from './TenantSwitcher';

              ↓ Imports

  extensions/frontend/components/TenantSwitcher.tsx:
    export const TenantSwitcher = ...
```

## Data Flow

### User Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks "Switch Tenant" button                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  TenantSwitcher Component                                    │
│  • Handle click event                                        │
│  • Call TenantService.switchTenant(tenantId)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  TenantService (Frontend)                                    │
│  • Prepare API request                                       │
│  • Call HttpService.makeCallToBackend()                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP POST
┌─────────────────────────────────────────────────────────────┐
│  Backend API Endpoint                                        │
│  • Authenticate request                                      │
│  • Validate tenant access                                    │
│  • Update user session                                       │
│  • Return tenant data                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ Response
┌─────────────────────────────────────────────────────────────┐
│  TenantService (Frontend)                                    │
│  • Process response                                          │
│  • Update TenantContext                                      │
│  • Emit tenant change event                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  React Components                                            │
│  • Listening components re-render                            │
│  • UI updates with new tenant data                           │
│  • User sees tenant change                                   │
└─────────────────────────────────────────────────────────────┘
```

## Build Process

### Development Build

```
┌─────────────────────────────────────────────────────────────┐
│  npm start -- --config vite.config.m8flow.ts                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Vite Dev Server                                             │
│  • Load vite.config.m8flow.ts                               │
│  • Configure path aliases (@m8flow/*)                        │
│  • Enable HMR (Hot Module Replacement)                       │
│  • Start TypeScript compiler                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Source Watching                                             │
│  • Watch spiffworkflow-frontend/src/                        │
│  • Watch extensions/frontend/                                │
│  • Watch integration/frontend/                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ File changes
┌─────────────────────────────────────────────────────────────┐
│  Hot Module Replacement                                      │
│  • Detect changed modules                                    │
│  • Update module in browser                                  │
│  • Preserve React state                                      │
│  • Instant feedback (< 1 second)                            │
└─────────────────────────────────────────────────────────────┘
```

### Production Build

```
┌─────────────────────────────────────────────────────────────┐
│  npm run build -- --config vite.config.m8flow.ts            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  TypeScript Compilation                                      │
│  • Type check all files                                      │
│  • Transpile to JavaScript                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Bundling                                                    │
│  • Bundle upstream code                                      │
│  • Bundle extension code                                     │
│  • Bundle integration code                                   │
│  • Tree-shake unused code                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Optimization                                                │
│  • Minify JavaScript                                         │
│  • Minify CSS                                                │
│  • Optimize images                                           │
│  • Generate source maps                                      │
│  • Code splitting                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Output: dist/                                               │
│  • index.html                                                │
│  • assets/*.js (code chunks)                                 │
│  • assets/*.css (styles)                                     │
│  • assets/* (images, fonts)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production Environment                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Load Balancer / Ingress                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                    ↓                    ↓                    │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │  Frontend Pods (Nginx)   │  │  Backend Pods (Flask)    │ │
│  │  • Static files          │  │  • API endpoints         │ │
│  │  • SPA routing           │  │  • Workflow engine       │ │
│  │  • Gzip compression      │  │  • Business logic        │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                          ↓                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Database (MySQL)                                       │ │
│  │  • Master node                                          │ │
│  │  • Read replicas                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Cache Layer (Redis)                                    │ │
│  │  • Session storage                                      │ │
│  │  • Application cache                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Object Storage (S3)                                    │ │
│  │  • Process diagrams                                     │ │
│  │  • Uploaded files                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1. Network Security                                    │ │
│  │     • HTTPS/TLS encryption                              │ │
│  │     • Firewall rules                                    │ │
│  │     • DDoS protection                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  2. Authentication                                      │ │
│  │     • OIDC/OAuth2                                       │ │
│  │     • JWT tokens                                        │ │
│  │     • MFA support                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  3. Authorization                                       │ │
│  │     • RBAC (Role-Based Access Control)                  │ │
│  │     • Permission checks                                 │ │
│  │     • Tenant isolation                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  4. Data Security                                       │ │
│  │     • Encryption at rest                                │ │
│  │     • Encryption in transit                             │ │
│  │     • Data sanitization                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  5. Application Security                                │ │
│  │     • XSS protection                                    │ │
│  │     • CSRF protection                                   │ │
│  │     • Input validation                                  │ │
│  │     • Output encoding                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### 1. Separation of Concerns

```
Upstream Code  →  Never modified, updated via git subtree
Integration    →  Minimal glue code, mostly configuration
Extensions     →  All customizations, fully tested
```

### 2. Plugin Architecture

```
Core System    →  Provides extension points
Plugins        →  Register at extension points
Registry       →  Manages all extensions
Render Time    →  Dynamically load extensions
```

### 3. Type Safety

```
TypeScript     →  All code is typed
Strict Mode    →  Enabled for extensions
Type Checking  →  Pre-commit and CI/CD
```

### 4. Testability

```
Unit Tests     →  Test individual components
Integration    →  Test extension points
E2E Tests      →  Test full user flows
```

### 5. Performance

```
Code Splitting →  Load extensions on demand
Tree Shaking   →  Remove unused code
Caching        →  Aggressive caching strategy
Lazy Loading   →  Defer non-critical code
```

## Next Steps

- [Frontend Development Guide](getting-started/frontend-development.md)
- [Extension Development Guide](getting-started/extension-development.md)
- [Testing Guide](getting-started/LOCAL_TESTING.md)

