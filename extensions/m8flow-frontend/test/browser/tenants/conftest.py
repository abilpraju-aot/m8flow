"""Tenant-specific fixtures providing mock data."""
import pytest
from playwright.sync_api import Page

from helpers.mocks import (
    mock_tenants_api,
    mock_permissions_api,
    MOCK_TENANT_M8FLOW,
    MOCK_TENANT_ACME,
    MOCK_TENANT_INACTIVE,
    ALL_MOCK_TENANTS,
)


@pytest.fixture
def mocked_tenant_page(super_admin_page: Page) -> Page:
    """Super-admin page with tenant API routes mocked (all tenants)."""
    mock_permissions_api(super_admin_page)
    mock_tenants_api(super_admin_page)
    return super_admin_page


@pytest.fixture
def mocked_tenant_page_admin(authenticated_page: Page) -> Page:
    """Tenant-admin page with tenant API routes mocked (all tenants)."""
    mock_permissions_api(authenticated_page)
    mock_tenants_api(authenticated_page)
    return authenticated_page
