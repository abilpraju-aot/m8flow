/**
 * M8Flow Banner Component
 * 
 * Example extension component that adds branding to the application.
 */

import React from 'react';

interface M8FlowBannerProps {
  message?: string;
  variant?: 'info' | 'success' | 'warning';
}

/**
 * M8FlowBanner displays a branded banner message
 * 
 * @example
 * ```tsx
 * import { M8FlowBanner } from '@m8flow/components';
 * 
 * <M8FlowBanner 
 *   message="Welcome to M8Flow - Powered by AOT Technologies"
 *   variant="info"
 * />
 * ```
 */
export const M8FlowBanner: React.FC<M8FlowBannerProps> = ({
  message = 'Powered by M8Flow - AOT Technologies',
  variant = 'info',
}) => {
  const variantStyles = {
    info: {
      backgroundColor: '#0f62fe',
      color: '#ffffff',
    },
    success: {
      backgroundColor: '#24a148',
      color: '#ffffff',
    },
    warning: {
      backgroundColor: '#f1c21b',
      color: '#000000',
    },
  };

  const style = {
    ...variantStyles[variant],
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    textAlign: 'center' as const,
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  return (
    <div style={style} data-testid="m8flow-banner">
      {message}
    </div>
  );
};

export default M8FlowBanner;

