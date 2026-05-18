import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SecretShow from './SecretShow';
import HttpService from '../services/HttpService';

const mockUsePermissionFetcher = vi.fn();

const mockTargetUris = {
  secretShowPath: '/v1.0/secrets/stripe-key',
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

vi.mock('../services/HttpService', () => ({
  default: {
    makeCallToBackend: vi.fn(),
  },
}));

vi.mock('../components/ProcessBreadcrumb', () => ({
  default: () => <div data-testid="process-breadcrumb" />,
}));

vi.mock('../components/ConfirmButton', () => ({
  default: ({ buttonLabel }: any) => <button>{buttonLabel}</button>,
}));

function abilityWith(grants: Record<string, boolean>) {
  return {
    can: (action: string, target: string) =>
      Boolean(grants[`${action}:${target}`]),
  };
}

function renderSecretShow() {
  return render(
    <MemoryRouter initialEntries={['/configuration/secrets/stripe-key']}>
      <Routes>
        <Route
          path="/configuration/secrets/:secret_identifier"
          element={<SecretShow />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SecretShow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(HttpService.makeCallToBackend).mockImplementation((options: any) => {
      if (typeof options.path === 'string' && options.path === '/secrets/stripe-key') {
        options.successCallback?.({
          id: 1,
          key: 'stripe-key',
          value: '',
          username: 'admin',
        });
      }
    });
  });

  it('hides delete action for super-admin', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/m8flow/tenants': true,
        'DELETE:/v1.0/secrets/stripe-key': true,
        'PUT:/v1.0/secrets/stripe-key': true,
        'GET:/v1.0/secrets/stripe-key': true,
      }),
    });

    renderSecretShow();

    await waitFor(() => {
      expect(screen.getByText('secret_key: stripe-key')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument();
  });

  it('shows delete action for non-super-admin users with delete permission', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'DELETE:/v1.0/secrets/stripe-key': true,
        'PUT:/v1.0/secrets/stripe-key': true,
        'GET:/v1.0/secrets/stripe-key': true,
      }),
    });

    renderSecretShow();

    await waitFor(() => {
      expect(screen.getByText('secret_key: stripe-key')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument();
  });
});
