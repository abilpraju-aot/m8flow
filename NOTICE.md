# Attribution Notice

M8Flow is built upon SpiffArena, an open-source workflow automation platform.

## Upstream Project

**SpiffArena**
- Copyright (c) 2023 Sartography
- Licensed under LGPL-2.1
- Source: https://github.com/sartography/spiff-arena

## Upstream Components

M8Flow incorporates the following upstream components without modification:

### Backend (`spiffworkflow-backend/`)
- SpiffWorkflow Backend
- Version: As specified in git subtree
- License: LGPL-2.1
- Copyright: Sartography

### Frontend (`spiffworkflow-frontend/`)
- SpiffWorkflow Frontend  
- Version: As specified in git subtree
- License: LGPL-2.1
- Copyright: Sartography

## M8Flow Customizations

The following components are proprietary customizations by AOT Technologies:

- `extensions/` - All M8Flow-specific extensions
- `integration/` - Integration layer
- `config/` - M8Flow configuration
- `docker/` - Docker configuration for M8Flow
- `deployment/` - Deployment scripts and configurations
- M8Flow branding and documentation

## Third-Party Dependencies

M8Flow also incorporates various open-source libraries and tools. For a complete list, see:

- `spiffworkflow-backend/pyproject.toml` (Python dependencies)
- `spiffworkflow-frontend/package.json` (JavaScript dependencies)

## Compliance

M8Flow complies with the LGPL-2.1 license by:

1. Keeping upstream code in separate directories (`spiffworkflow-backend/`, `spiffworkflow-frontend/`)
2. Not modifying upstream source code
3. Clearly separating proprietary extensions in `extensions/` directory
4. Providing proper attribution in this notice
5. Making upstream code available via git subtrees

## Contact

For questions about licensing or attribution:

**AOT Technologies**
- Email: legal@aot-technologies.com
- Website: https://aot-technologies.com

For questions about SpiffArena:

**Sartography**
- Website: https://www.sartography.com
- GitHub: https://github.com/sartography

