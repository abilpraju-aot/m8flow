/**
 * M8Flow Routes Configuration
 *
 * Defines M8Flow-specific routes that can be integrated into upstream BaseRoutes.
 * These routes use relative paths for proper nesting.
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load M8Flow pages for code splitting
const M8FlowDashboard = React.lazy(() => import('../pages/Dashboard'));
const TenantManagement = React.lazy(() => import('../pages/TenantManagement'));
const Templates = React.lazy(() => import('../pages/Templates'));

/**
 * Route configuration interface
 */
export interface M8FlowRouteConfig {
  path: string;
  component: string;
  isOverride: boolean;
  description?: string;
}

/**
 * M8Flow custom routes
 *
 * These can be spread into the upstream routes array.
 * Use relative paths (no leading slash) for proper nesting.
 */
export const m8flowRoutes: RouteObject[] = [
  // M8Flow Dashboard
  {
    path: 'm8flow',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <M8FlowDashboard />
      </React.Suspense>
    ),
  },
  {
    path: 'm8flow/dashboard',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <M8FlowDashboard />
      </React.Suspense>
    ),
  },

  // Tenant Management
  {
    path: 'm8flow/tenants',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <TenantManagement />
      </React.Suspense>
    ),
  },
  {
    path: 'm8flow/tenants/:tenantId',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <TenantManagement />
      </React.Suspense>
    ),
  },

  // Templates
  {
    path: 'm8flow/templates',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Templates />
      </React.Suspense>
    ),
  },
  {
    path: 'm8flow/templates/:templateId',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Templates />
      </React.Suspense>
    ),
  },
];

/**
 * Get all M8Flow route paths
 */
export function getM8FlowRoutePaths(): string[] {
  return m8flowRoutes
    .map((route) => route.path)
    .filter((path): path is string => typeof path === 'string');
}

/**
 * Check if a path is an M8Flow route
 */
export function isM8FlowRoute(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return normalizedPath.startsWith('m8flow');
}
