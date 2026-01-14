/**
 * M8Flow Services
 *
 * This module exports all M8Flow-specific service functions.
 * Services handle API calls and business logic.
 */

// Re-export upstream services for convenience
export { default as HttpService } from '@spiff/services/HttpService';
export { default as UserService } from '@spiff/services/UserService';

// M8Flow-specific service utilities will be added here
// Example:
// export { default as TenantService } from './TenantService';
// export { default as TemplateService } from './TemplateService';
