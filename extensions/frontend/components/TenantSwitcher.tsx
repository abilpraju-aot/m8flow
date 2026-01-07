/**
 * M8Flow Tenant Switcher Component
 * 
 * Example extension component that demonstrates:
 * - How to create a reusable component
 * - How to use custom hooks
 * - How to style with Carbon Design System
 * - How to integrate with backend services
 */

import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@carbon/react';

interface Tenant {
  id: string;
  name: string;
  description?: string;
}

interface TenantSwitcherProps {
  className?: string;
  onTenantChange?: (tenantId: string) => void;
}

/**
 * TenantSwitcher component allows users to switch between different tenants
 * 
 * @example
 * ```tsx
 * import { TenantSwitcher } from '@m8flow/components';
 * 
 * function Header() {
 *   return (
 *     <div>
 *       <TenantSwitcher onTenantChange={(id) => console.log('Switched to', id)} />
 *     </div>
 *   );
 * }
 * ```
 */
export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  className,
  onTenantChange,
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call using HttpService
    // Example:
    // import HttpService from '../../../spiffworkflow-frontend/src/services/HttpService';
    // HttpService.makeCallToBackend({
    //   path: '/api/v1/tenants',
    //   httpMethod: 'GET',
    // }).then(response => {
    //   setTenants(response);
    //   setLoading(false);
    // });

    // Mock data for demonstration
    const mockTenants: Tenant[] = [
      { id: 'default', name: 'Default Tenant', description: 'Default organization' },
      { id: 'acme', name: 'ACME Corp', description: 'ACME Corporation' },
      { id: 'globex', name: 'Globex Inc', description: 'Globex Industries' },
    ];

    // Simulate API delay
    setTimeout(() => {
      setTenants(mockTenants);
      setCurrentTenant(mockTenants[0].id);
      setLoading(false);
    }, 500);
  }, []);

  const handleTenantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tenantId = event.target.value;
    setCurrentTenant(tenantId);
    
    // TODO: Call backend API to switch tenant
    // HttpService.makeCallToBackend({
    //   path: `/api/v1/tenants/${tenantId}/switch`,
    //   httpMethod: 'POST',
    // });

    if (onTenantChange) {
      onTenantChange(tenantId);
    }
  };

  if (loading) {
    return (
      <Select
        id="tenant-switcher-loading"
        labelText="Tenant"
        disabled
        className={className}
      >
        <SelectItem value="" text="Loading..." />
      </Select>
    );
  }

  return (
    <Select
      id="tenant-switcher"
      labelText="Organization"
      value={currentTenant}
      onChange={handleTenantChange}
      className={className}
    >
      {tenants.map((tenant) => (
        <SelectItem
          key={tenant.id}
          value={tenant.id}
          text={tenant.name}
        />
      ))}
    </Select>
  );
};

export default TenantSwitcher;

