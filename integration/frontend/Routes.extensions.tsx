/**
 * M8Flow Route Extensions
 * 
 * Adds custom routes to the application
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { SampleView } from '@m8flow/views';

/**
 * Get additional routes for M8Flow extensions
 */
export function getM8FlowRoutes() {
  return [
    <Route key="sample-page" path="/sample-page" element={<SampleView />} />,
    // Add more custom routes here
  ];
}

