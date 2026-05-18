import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProcessInstanceListTabs from './ProcessInstanceListTabs';

const mockNavigate = vi.fn();
const mockUsePermissionFetcher = vi.fn();

const mockTargetUris = {
  processInstanceListPath: '/v1.0/process-instances',
  processInstanceListForMePath: '/v1.0/process-instances/for-me',
  m8flowTenantListPath: '/m8flow/tenants',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../hooks/PermissionService', () => ({
  usePermissionFetcher: (...args: any[]) => mockUsePermissionFetcher(...args),
}));

vi.mock('../hooks/M8flowUriListForPermissions', () => ({
  useM8flowUriListForPermissions: () => ({ targetUris: mockTargetUris }),
}));

vi.mock('./SpiffTooltip', () => ({
  default: ({ children }: any) => children,
}));

function abilityWith(grants: Record<string, boolean>) {
  return {
    can: (action: string, target: string) =>
      Boolean(grants[`${action}:${target}`]),
  };
}

describe('ProcessInstanceListTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides For Me and shows All + Find By ID for super-admin', () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/m8flow/tenants': true,
      }),
    });

    render(<ProcessInstanceListTabs variant="all" />);

    expect(
      screen.queryByTestId('process-instance-list-for-me'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('process-instance-list-all'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('process-instance-list-find-by-id'),
    ).toBeInTheDocument();
  });

  it('shows For Me for non-super-admin users with permissions', () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/v1.0/process-instances': true,
        'POST:/v1.0/process-instances/for-me': true,
      }),
    });

    render(<ProcessInstanceListTabs variant="for-me" />);

    expect(
      screen.getByTestId('process-instance-list-for-me'),
    ).toBeInTheDocument();
  });

  it('redirects super-admin from for-me variant to all', async () => {
    mockUsePermissionFetcher.mockReturnValue({
      permissionsLoaded: true,
      ability: abilityWith({
        'GET:/m8flow/tenants': true,
      }),
    });

    render(<ProcessInstanceListTabs variant="for-me" />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/process-instances/all', {
        replace: true,
      });
    });
  });
});
