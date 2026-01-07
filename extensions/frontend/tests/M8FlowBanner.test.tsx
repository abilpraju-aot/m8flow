/**
 * M8FlowBanner Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { M8FlowBanner } from '../components/M8FlowBanner';

describe('M8FlowBanner', () => {
  it('renders with default message', () => {
    render(<M8FlowBanner />);
    expect(screen.getByText(/Powered by M8Flow/)).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<M8FlowBanner message="Custom Message" />);
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });

  it('applies info variant styles by default', () => {
    render(<M8FlowBanner />);
    const banner = screen.getByTestId('m8flow-banner');
    expect(banner).toHaveStyle({ backgroundColor: '#0f62fe' });
  });

  it('applies success variant styles', () => {
    render(<M8FlowBanner variant="success" />);
    const banner = screen.getByTestId('m8flow-banner');
    expect(banner).toHaveStyle({ backgroundColor: '#24a148' });
  });

  it('applies warning variant styles', () => {
    render(<M8FlowBanner variant="warning" />);
    const banner = screen.getByTestId('m8flow-banner');
    expect(banner).toHaveStyle({ backgroundColor: '#f1c21b' });
  });
});

