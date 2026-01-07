/**
 * M8Flow Logo Component
 * 
 * Displays the M8Flow branding in the sidebar
 */

import React from 'react';
import { Stack, Typography } from '@mui/material';

export const M8FlowLogo: React.FC = () => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      {/* M8Flow Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
        }}
      >
        M8
      </div>
      <Typography
        sx={{
          color: 'primary.main',
          fontSize: 22,
          fontWeight: 600,
          display: { xs: 'none', md: 'block' },
        }}
      >
        M8Flow
      </Typography>
    </Stack>
  );
};

export default M8FlowLogo;

