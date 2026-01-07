# Contributing to M8Flow

Thank you for your interest in contributing to M8Flow!

## Development Principles

### Golden Rule: Never Modify Upstream Code

**DO NOT modify any files in:**
- `spiffworkflow-backend/src/`
- `spiffworkflow-frontend/src/`

**ALL customizations MUST go in:**
- `extensions/backend/`
- `extensions/frontend/`
- `integration/` (minimal glue code only)

### Why This Matters

1. **Clean Upgrades:** We can pull upstream updates without merge conflicts
2. **Clear Attribution:** Separation makes licensing compliance easy
3. **Code Ownership:** Clear boundaries between upstream and custom code
4. **Maintainability:** Extensions are isolated and testable

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/AOT-Technologies/m8flow.git
   cd m8flow
   ```
3. **Create a branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```

## Development Workflow

### Frontend Development

1. **Start dev server:**
   ```bash
   cd spiffworkflow-frontend
   npm install
   npm start -- --config vite.config.m8flow.ts
   ```

2. **Create your extension** in `extensions/frontend/`

3. **Write tests** in `extensions/frontend/tests/`

4. **Test your changes:**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

### Backend Development

1. **Set up backend:**
   ```bash
   cd spiffworkflow-backend
   ./bin/agents/backend_setup.sh
   ```

2. **Create your extension** in `extensions/backend/`

3. **Write tests** in `extensions/backend/tests/`

4. **Run tests:**
   ```bash
   uv run pytest
   ```

## Code Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful variable names
- Add JSDoc comments for public APIs

```typescript
/**
 * TenantSwitcher allows users to switch between organizations
 * 
 * @param {string} currentTenantId - Currently active tenant
 * @param {Function} onTenantChange - Callback when tenant changes
 * 
 * @example
 * ```tsx
 * <TenantSwitcher 
 *   currentTenantId="tenant-1"
 *   onTenantChange={(id) => console.log(id)}
 * />
 * ```
 */
export const TenantSwitcher: React.FC<Props> = ({ ... }) => {
  // Implementation
};
```

### Python

- Follow PEP 8
- Use type hints
- Write docstrings
- Use meaningful variable names

```python
def switch_tenant(user_id: str, tenant_id: str) -> Tenant:
    """
    Switch user to a different tenant.
    
    Args:
        user_id: The ID of the user switching tenants
        tenant_id: The ID of the target tenant
        
    Returns:
        The activated Tenant object
        
    Raises:
        TenantNotFoundError: If tenant doesn't exist
        PermissionError: If user lacks access
    """
    # Implementation
```

## Testing Requirements

### All contributions must include tests

**Frontend:**
```typescript
// extensions/frontend/tests/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@m8flow/components';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**Backend:**
```python
# extensions/backend/tests/test_my_feature.py
import pytest
from extensions.backend.services import MyService

def test_my_service():
    result = MyService.do_something()
    assert result == expected_value
```

### Running Tests

```bash
# Frontend tests
cd spiffworkflow-frontend
npm test

# Backend tests
cd spiffworkflow-backend
uv run pytest

# E2E tests
./bin/agents/run_playwright.sh
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(frontend): add tenant switcher component

Implements a dropdown component that allows users to switch
between different tenant organizations.

Closes #123
```

```
fix(backend): resolve tenant permission check

Fixed bug where admin users couldn't access tenant settings
due to incorrect permission validation.

Fixes #456
```

## Pull Request Process

1. **Ensure all tests pass:**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

2. **Update documentation** if needed

3. **Create pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test coverage information

4. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] E2E tests added/updated
   - [ ] Manual testing performed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Tests pass locally
   
   ## Screenshots (if applicable)
   ```

5. **Wait for review** - maintainers will review and provide feedback

6. **Address feedback** - make requested changes

7. **Merge** - once approved, maintainers will merge

## Directory Structure for Extensions

```
extensions/
├── frontend/
│   ├── components/          # Reusable UI components
│   │   ├── MyComponent.tsx
│   │   └── index.ts        # Export all components
│   ├── views/              # Full page views
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── plugins/            # Extension plugins
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── tests/              # Tests
│
└── backend/
    ├── services/           # Business logic
    ├── models/             # Database models
    ├── apis/               # REST endpoints
    ├── integrations/       # Third-party integrations
    └── tests/              # Tests
```

## Extension Development Guidelines

### 1. Use Extension Points

```typescript
// Register at extension points
import { createPlugin } from '@m8flow/plugins';

export default createPlugin('MyPlugin', (context) => {
  context.registry.register({
    id: 'my-component',
    extensionPoint: 'app.header',
    component: MyComponent,
  });
});
```

### 2. Make Extensions Configurable

```typescript
export default createPlugin('MyPlugin', (context) => {
  const { config } = context;
  
  if (config.enableMyFeature) {
    // Register extension
  }
});
```

### 3. Handle Errors Gracefully

```typescript
export default createPlugin('MyPlugin', (context) => {
  try {
    // Plugin logic
  } catch (error) {
    console.error('Failed to load MyPlugin:', error);
    // Don't break the app
  }
});
```

### 4. Document Your Extensions

```typescript
/**
 * Multi-Tenancy Plugin
 * 
 * Adds multi-tenancy support to M8Flow.
 * 
 * Features:
 * - Tenant switcher in header
 * - Tenant management UI
 * - Per-tenant data isolation
 * 
 * Configuration:
 * - enableMultiTenancy: boolean
 * 
 * @example
 * ```typescript
 * initializePlugins({
 *   config: { enableMultiTenancy: true }
 * });
 * ```
 */
```

## Code Review Guidelines

### For Contributors

- Keep PRs small and focused
- Respond to feedback promptly
- Be open to suggestions
- Ask questions if unclear

### For Reviewers

- Be constructive and kind
- Focus on code quality
- Check test coverage
- Verify documentation
- Test changes locally

## Getting Help

- **Documentation:** See `docs/getting-started/`
- **Examples:** Check `extensions/frontend/components/`
- **Issues:** Search existing issues
- **Questions:** Open a discussion

## License

By contributing to M8Flow, you agree that:

1. Your contributions to `extensions/` are proprietary to AOT Technologies
2. You have the right to submit your contributions
3. You agree to the project's licensing terms

See [LICENSES/Proprietary.txt](LICENSES/Proprietary.txt) for details.

## Recognition

Contributors will be recognized in:
- Release notes
- Contributors file
- Project documentation

Thank you for contributing to M8Flow! 🚀

