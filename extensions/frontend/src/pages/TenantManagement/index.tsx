/**
 * M8Flow Tenant Management Page
 */

import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const mockTenants = [
  { id: '1', name: 'Acme Corp', users: 45, status: 'Active' },
  { id: '2', name: 'Globex Inc', users: 23, status: 'Active' },
  { id: '3', name: 'Initech', users: 12, status: 'Inactive' },
];

export default function TenantManagement() {
  const { t } = useTranslation();
  const { tenantId } = useParams();

  if (tenantId) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tenant: {tenant?.name || 'Unknown'}
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography>Tenant ID: {tenantId}</Typography>
          <Typography>Users: {tenant?.users}</Typography>
          <Typography>Status: {tenant?.status}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('m8flow.tenants.title', 'Tenant Management')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('m8flow.tenants.description', 'Manage your organization tenants')}
          </Typography>
        </Box>
        <Button variant="contained" color="primary">
          Add Tenant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockTenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.users}</TableCell>
                <TableCell>{tenant.status}</TableCell>
                <TableCell>
                  <Button size="small">View</Button>
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
