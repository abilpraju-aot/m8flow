/**
 * M8Flow Templates Page
 */

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const mockTemplates = [
  { id: '1', name: 'Employee Onboarding', description: 'Standard employee onboarding workflow', category: 'HR' },
  { id: '2', name: 'Purchase Request', description: 'Purchase approval workflow', category: 'Finance' },
  { id: '3', name: 'Leave Request', description: 'Employee leave request and approval', category: 'HR' },
  { id: '4', name: 'Expense Report', description: 'Expense submission and reimbursement', category: 'Finance' },
];

export default function Templates() {
  const { t } = useTranslation();
  const { templateId } = useParams();

  if (templateId) {
    const template = mockTemplates.find(t => t.id === templateId);
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Template: {template?.name || 'Unknown'}
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>{template?.description}</Typography>
          <Typography color="text.secondary">Category: {template?.category}</Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Use Template
            </Button>
            <Button variant="outlined">
              Customize
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('m8flow.templates.title', 'Process Templates')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('m8flow.templates.description', 'Browse and manage process templates')}
      </Typography>

      <Grid container spacing={3}>
        {mockTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  {template.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small" color="primary">Use</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
