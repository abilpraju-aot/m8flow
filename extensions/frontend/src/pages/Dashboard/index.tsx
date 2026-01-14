/**
 * M8Flow Dashboard Page
 */

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function M8FlowDashboard() {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('m8flow.dashboard.title', 'M8Flow Dashboard')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('m8flow.dashboard.welcome', 'Welcome to M8Flow')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Active Workflows</Typography>
            <Typography variant="h3">24</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Completed Today</Typography>
            <Typography variant="h3">156</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Pending Tasks</Typography>
            <Typography variant="h3">12</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
