/**
 * M8Flow Sample View
 * 
 * Example custom page demonstrating M8Flow extensions
 */

import React from 'react';
import { Typography, Box, Paper, Grid, Card, CardContent } from '@mui/material';
import { Dashboard, Build, TrendingUp } from '@mui/icons-material';

export default function SampleView() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Sample M8Flow Page
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Custom extension demonstrating M8Flow capabilities
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Dashboard sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Custom Features
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Add your custom dashboards, reports, or specialized workflow
                views here. This demonstrates how M8Flow extensions work.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Build sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Integration Ready
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Connect to external systems, APIs, or services. Build custom
                integrations specific to your organization's needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Analytics & Insights
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create custom analytics, metrics tracking, and business
                intelligence dashboards tailored to your workflows.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome to M8Flow Extensions!
        </Typography>
        <Typography variant="body1" paragraph>
          This is a sample page demonstrating how to add custom routes
          and views to the M8Flow platform. All extension code is cleanly
          separated in the <code>extensions/frontend/</code> directory.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can replace this content with your own custom functionality
          while keeping the upstream SpiffArena code completely untouched.
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3, mt: 3, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          💡 <strong>Development Tip:</strong> All customizations are in{' '}
          <code style={{ 
            background: 'rgba(0,0,0,0.1)', 
            padding: '2px 6px', 
            borderRadius: '3px' 
          }}>
            extensions/frontend/
          </code>
          {' '}and automatically hot-reload when you save changes!
        </Typography>
      </Paper>
    </Box>
  );
}

