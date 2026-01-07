/**
 * M8Flow SideNav Extensions
 * 
 * Extends the sidebar navigation with M8Flow branding and custom items
 */

import React from 'react';
import { Dashboard } from '@mui/icons-material';
import { M8FlowLogo } from '@m8flow/components';
import { NavItem } from '../../spiffworkflow-frontend/src/interfaces';

/**
 * Get M8Flow logo component (replaces SpiffWorkflow logo)
 */
export function getM8FlowLogo() {
  return <M8FlowLogo />;
}

/**
 * Get additional navigation items for M8Flow
 */
export function getM8FlowNavItems(): NavItem[] {
  return [
    {
      text: 'Sample Page',
      icon: <Dashboard />,
      route: '/sample-page',
      id: 'm8flow-sample',
    },
    // Add more custom navigation items here
  ];
}

/**
 * Get the route identifier for a custom M8Flow path
 */
export function getM8FlowRouteIdentifier(pathname: string): string | null {
  if (pathname === '/sample-page') {
    return 'm8flow-sample';
  }
  // Add more route identifiers as needed
  return null;
}

