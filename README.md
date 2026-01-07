# M8Flow - AOT Technologies Workflow Platform

M8Flow is AOT Technologies' branded workflow automation platform built on top of [SpiffArena](https://github.com/sartography/spiff-arena).

## Architecture Overview

This repository maintains a clean separation between upstream SpiffArena code and AOT customizations:

```
m8flow/
├── spiffworkflow-backend/       # Upstream backend (untouched)
├── spiffworkflow-frontend/      # Upstream frontend (untouched)
├── extensions/                  # AOT customizations
│   ├── backend/                # Backend extensions
│   └── frontend/               # Frontend extensions
├── integration/                # Glue code wiring extensions
├── config/                     # Feature flags & configuration
├── docker/                     # Local & CI containerization
├── deployment/                 # Production deployment
└── docs/                       # Documentation
```

## 🚀 Quick Start for Development

### Frontend Development

1. **Setup** (first time only):
   ```bash
   cd spiffworkflow-frontend
   npm install
   ```

2. **Start Development Server with M8Flow Extensions**:
   ```bash
   cd spiffworkflow-frontend
   npm start -- --config vite.config.m8flow.ts
   ```
   The frontend will be available at http://localhost:7001

   > **Note**: The `--config vite.config.m8flow.ts` flag is required to load M8Flow extensions. Without it, only upstream SpiffArena code runs.

3. **Make Changes in Extensions**:
   - All AOT customizations go in `extensions/frontend/`
   - No modifications to `spiffworkflow-frontend/src/` allowed
   - Extensions are automatically imported via Vite aliases

### Backend Development

See [spiffworkflow-backend/AGENTS.md](spiffworkflow-backend/AGENTS.md) for backend setup instructions.

### Using Docker (Recommended for Full Stack)

```bash
cd docker
docker-compose up
```

## 📁 Extension Architecture

### Frontend Extensions

Extensions live in `extensions/frontend/` and are automatically integrated via Vite path aliases:

```typescript
// Vite automatically resolves:
import { CustomComponent } from '@m8flow/components';
// To: extensions/frontend/components/CustomComponent.tsx
```

**Extension Types:**
- **Components**: Reusable UI components (`extensions/frontend/components/`)
- **Views**: Full page views (`extensions/frontend/views/`)
- **Hooks**: Custom React hooks (`extensions/frontend/hooks/`)
- **Services**: Business logic services (`extensions/frontend/services/`)
- **Themes**: Custom styling (`extensions/frontend/themes/`)
- **Plugins**: Extension points (`extensions/frontend/plugins/`)

### Backend Extensions

Backend extensions follow a similar pattern in `extensions/backend/`:
- **APIs**: Additional REST endpoints
- **Services**: Business logic
- **Models**: Database models
- **Integrations**: Third-party integrations

## 🔧 Development Workflow

1. **Never modify upstream code** in `spiffworkflow-backend/` or `spiffworkflow-frontend/`
2. **All customizations** go in `extensions/` directory
3. **Integration code** in `integration/` wires extensions into the core application
4. **Test locally** using npm scripts or Docker
5. **Deploy** using Helm charts in `deployment/`

## 📚 Documentation

- [Frontend Development Guide](docs/getting-started/frontend-development.md)
- [Backend Development Guide](docs/getting-started/backend-development.md)
- [Extension Development Guide](docs/getting-started/extension-development.md)
- [Docker Development Guide](docs/getting-started/docker-development.md)
- [Deployment Guide](docs/getting-started/deployment.md)

## 📄 Licensing

- **Upstream SpiffArena**: LGPL-2.1 (see [LICENSES/LGPL-2.1.txt](LICENSES/LGPL-2.1.txt))
- **M8Flow Extensions**: Proprietary (see [LICENSES/Proprietary.txt](LICENSES/Proprietary.txt))
- **Attribution**: See [NOTICE.md](NOTICE.md)

## 🔗 Links

- **Upstream Project**: [SpiffArena](https://github.com/sartography/spiff-arena)
- **Documentation**: [SpiffWorkflow Docs](https://spiff-arena.readthedocs.io/)
- **AOT Technologies**: [https://aot-technologies.com](https://aot-technologies.com)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📞 Support

For M8Flow specific issues:
- **Email**: support@aot-technologies.com
- **Internal Wiki**: [Confluence M8Flow Space](https://your-wiki-url)

For upstream SpiffArena issues:
- See the [SpiffArena repository](https://github.com/sartography/spiff-arena)
