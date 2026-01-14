/**
 * M8Flow Type Definitions
 *
 * This module exports all M8Flow-specific TypeScript types and interfaces.
 */

// Re-export upstream types that M8Flow uses
export type {
  ProcessModel,
  ProcessFile,
  ProcessInstance,
  Task,
  PermissionsToCheck,
} from '@spiff/interfaces';

// M8Flow-specific types

/**
 * M8Flow tenant representation
 */
export interface M8FlowTenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  config?: M8FlowTenantConfig;
}

/**
 * Tenant-specific configuration
 */
export interface M8FlowTenantConfig {
  /** Custom branding for this tenant */
  branding?: {
    primaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  /** Feature flags for this tenant */
  features?: {
    [key: string]: boolean;
  };
  /** Usage limits */
  limits?: {
    maxUsers?: number;
    maxWorkflows?: number;
    maxStorageGB?: number;
  };
}

/**
 * M8Flow process template
 */
export interface M8FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  tags: string[];
  processModelId?: string;
  thumbnail?: string;
}

/**
 * Template category
 */
export interface M8FlowTemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

/**
 * Dashboard statistics
 */
export interface M8FlowDashboardStats {
  activeWorkflows: number;
  completedToday: number;
  pendingTasks: number;
  systemHealth: number;
  trends?: {
    activeWorkflowsTrend: number;
    completedTodayTrend: number;
    pendingTasksTrend: number;
  };
}

/**
 * Activity item for dashboard
 */
export interface M8FlowActivityItem {
  id: string;
  type: 'workflow_started' | 'workflow_completed' | 'task_assigned' | 'task_completed' | 'error';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  processInstanceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * User preferences
 */
export interface M8FlowUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dashboardLayout?: string;
  notifications: {
    email: boolean;
    browser: boolean;
    taskAssignment: boolean;
    workflowComplete: boolean;
  };
}

/**
 * API response wrapper
 */
export interface M8FlowApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Pagination parameters
 */
export interface M8FlowPaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters for list queries
 */
export interface M8FlowFilterParams {
  search?: string;
  status?: string | string[];
  category?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  [key: string]: unknown;
}
