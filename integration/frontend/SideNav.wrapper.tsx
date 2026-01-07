/**
 * M8Flow SideNav Wrapper
 * 
 * Wraps the upstream SideNav component to inject M8Flow logo and custom nav items
 * This is a HOC (Higher Order Component) approach
 */

import React, { ReactElement, MouseEventHandler } from 'react';
import { Box, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import UpstreamSideNav from '../../spiffworkflow-frontend/src/components/SideNav';
import { M8FlowLogo } from '@m8flow/components';
import { UiSchemaUxElement } from '../../spiffworkflow-frontend/src/extension_ui_schema_interfaces';

type OwnProps = {
  isCollapsed: boolean;
  onToggleCollapse: MouseEventHandler<HTMLButtonElement>;
  onToggleDarkMode: MouseEventHandler<HTMLButtonElement>;
  isDark: boolean;
  additionalNavElement?: ReactElement | null;
  setAdditionalNavElement: Function;
  extensionUxElements?: UiSchemaUxElement[] | null;
};

/**
 * Wrapper that replaces SpiffWorkflow logo with M8Flow logo
 * and adds custom navigation items
 */
export default function SideNavWrapper(props: OwnProps) {
  const location = useLocation();
  
  // For now, we'll use the upstream SideNav but provide a way to inject our logo
  // The cleanest approach is to pass M8Flow-specific extension elements
  
  const m8flowExtensions: UiSchemaUxElement[] = [
    {
      component: 'header_menu_item',
      display_location: 'primary_nav_item',
      label: 'Sample Page',
      page: '/sample-page',
    },
    ...(props.extensionUxElements || []),
  ];

  return (
    <UpstreamSideNav
      {...props}
      extensionUxElements={m8flowExtensions}
    />
  );
}

