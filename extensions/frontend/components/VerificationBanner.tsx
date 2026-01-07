/**
 * M8Flow Verification Banner
 * 
 * Displays a visible banner to confirm M8Flow extensions are active.
 * Remove this after verifying extensions work.
 */

import React, { useState } from 'react';

export const VerificationBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '12px 20px',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <div>
          <strong style={{ fontSize: '16px' }}>M8Flow Extensions Active!</strong>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>
            Extensions are loading successfully from: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '3px' }}>extensions/frontend/</code>
          </div>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

export default VerificationBanner;

