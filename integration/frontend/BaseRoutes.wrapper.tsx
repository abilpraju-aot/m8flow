/**
 * M8Flow BaseRoutes Wrapper
 * 
 * Wraps the upstream BaseRoutes component to inject M8Flow custom routes
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UpstreamBaseRoutes from '../../spiffworkflow-frontend/src/views/BaseRoutes';
import { UiSchemaUxElement } from '../../spiffworkflow-frontend/src/extension_ui_schema_interfaces';
import { SampleView } from '@m8flow/views';

type OwnProps = {
  setAdditionalNavElement: Function;
  extensionUxElements?: UiSchemaUxElement[] | null;
  isMobile?: boolean;
};

/**
 * Wrapped BaseRoutes that includes M8Flow custom routes
 */
export default function BaseRoutesWrapper({
  extensionUxElements,
  setAdditionalNavElement,
  isMobile = false,
}: OwnProps) {
  return (
    <>
      {/* Render upstream routes */}
      <UpstreamBaseRoutes
        extensionUxElements={extensionUxElements}
        setAdditionalNavElement={setAdditionalNavElement}
        isMobile={isMobile}
      />
      {/* Add M8Flow custom routes */}
      <Routes>
        <Route path="/sample-page" element={<SampleView />} />
        {/* Add more custom routes here */}
      </Routes>
    </>
  );
}

