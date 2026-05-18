import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SecretNew from './SecretNew';

const mockUsePermissionFetcher = vi.fn();

const mockTargetUris = {
  secretListPath: '/v1.0/secrets',
  m8flowTenantListPath: '/m8flow/tenants',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../hooks/PermissionService', () => ({
  usePermissionFetcher: (...args: any[]) => mockUsePermissionFetcher(...args),
}));

vi.mock('../hooks/M8flowUriListForPermissions', () => ({
  useM8flowUriListForPermissions: () => ({ targetUris: mockTargetUris }),
}));

function abilityWith(grants: Record<string, boolean>) {
  return {
    can: (action: string, target: string) =>
      Boolean(grants[`${action}:${target}`]),
  };
}

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/configuration/secrets/new']}>
      <Routes>
        <Route path="/configuration/secrets/new" element={<SecretNew />} />
        <Route
          path="/configuration/secrets"
          element={<div data-testid="secrets-list-page">secrets-list-page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SecretNew', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects super-admin users to /configuration/secrets', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/m8flow/tenants': true,
        'POST:/v1.0/secrets': true,
      }),
    });

    renderWithRoutes();

    expect(await screen.findByTestId('secrets-list-page')).toBeInTheDocument();
  });

  it('renders the add-secret form for non-super-admin users with POST permission', () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'POST:/v1.0/secrets': true,
      }),
    });

    renderWithRoutes();

    expect(screen.getByText('add_secret')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });
});
