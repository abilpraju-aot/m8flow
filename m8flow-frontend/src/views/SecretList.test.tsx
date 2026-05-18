import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SecretList from './SecretList';
import HttpService from '../services/HttpService';

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

vi.mock('../services/HttpService', () => ({
  default: {
    makeCallToBackend: vi.fn(),
  },
}));

function abilityWith(grants: Record<string, boolean>) {
  return {
    can: (action: string, target: string) =>
      Boolean(grants[`${action}:${target}`]),
  };
}

function renderSecretList() {
  return render(
    <MemoryRouter initialEntries={['/configuration/secrets?page=1&per_page=50']}>
      <SecretList />
    </MemoryRouter>,
  );
}

describe('SecretList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(HttpService.makeCallToBackend).mockImplementation((options: any) => {
      if (typeof options.path === 'string' && options.path.startsWith('/secrets?')) {
        options.successCallback?.({
          results: [{ id: 1, key: 'stripe-key', username: 'admin' }],
          pagination: { count: 1, total: 1, pages: 1 },
        });
      }
    });
  });

  it('hides add and delete controls for super-admin', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/v1.0/secrets': true,
        'POST:/v1.0/secrets': true,
        'DELETE:/v1.0/secrets': true,
        'GET:/m8flow/tenants': true,
      }),
    });

    renderSecretList();

    await waitFor(() => {
      expect(screen.getByText('stripe-key')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('secret-list-add-button')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('secret-list-delete-stripe-key'),
    ).not.toBeInTheDocument();
  });

  it('shows add and delete controls for non-super-admin users with permissions', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/v1.0/secrets': true,
        'POST:/v1.0/secrets': true,
        'DELETE:/v1.0/secrets': true,
      }),
    });

    renderSecretList();

    await waitFor(() => {
      expect(screen.getByText('stripe-key')).toBeInTheDocument();
    });

    expect(screen.getByTestId('secret-list-add-button')).toBeInTheDocument();
    expect(screen.getByTestId('secret-list-delete-stripe-key')).toBeInTheDocument();
  });
});
