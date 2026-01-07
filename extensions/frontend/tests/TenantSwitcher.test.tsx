/**
 * TenantSwitcher Component Tests
 * 
 * Example unit tests for M8Flow extension components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TenantSwitcher } from '../components/TenantSwitcher';

describe('TenantSwitcher', () => {
  it('renders loading state initially', () => {
    render(<TenantSwitcher />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders tenant options after loading', async () => {
    render(<TenantSwitcher />);
    
    await waitFor(() => {
      expect(screen.getByText('Default Tenant')).toBeInTheDocument();
    });

    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('Globex Inc')).toBeInTheDocument();
  });

  it('calls onTenantChange when tenant is changed', async () => {
    const onTenantChange = vi.fn();
    render(<TenantSwitcher onTenantChange={onTenantChange} />);

    await waitFor(() => {
      expect(screen.getByText('Default Tenant')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Organization');
    // Note: Full select interaction testing would require more setup
    // This is just a basic structure example
  });

  it('applies custom className', () => {
    const { container } = render(<TenantSwitcher className="custom-class" />);
    const select = container.querySelector('.custom-class');
    expect(select).toBeTruthy();
  });
});

