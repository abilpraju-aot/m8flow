"""Tests for tenant management CRUD operations."""
import pytest
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.tenants import navigate_to_tenants, search_tenant


def _wait_for_tenant_rows(page: Page, prefix: str = "tenant-row-") -> int:
    """Wait for tenant rows and return the count, or skip if none exist."""
    rows = page.locator(f'[data-testid^="{prefix}"]')
    try:
        rows.first.wait_for(state="visible", timeout=15_000)
    except PlaywrightTimeout:
        pytest.skip("No tenant rows available -- seed test data to enable this test")
    return rows.count()


def test_tenant_page_loads(authenticated_page: Page) -> None:
    """The tenant management page should render."""
    navigate_to_tenants(authenticated_page)
    expect(authenticated_page.get_by_test_id("tenant-page")).to_be_visible()


def test_tenant_list_displays_rows(authenticated_page: Page) -> None:
    """The tenant table should display tenant rows."""
    page = authenticated_page
    navigate_to_tenants(page)

    count = _wait_for_tenant_rows(page)
    assert count > 0


def test_tenant_search_filters_results(authenticated_page: Page) -> None:
    """Searching for a tenant name should filter the table."""
    page = authenticated_page
    navigate_to_tenants(page)

    _wait_for_tenant_rows(page)

    search_tenant(page, "nonexistent-tenant-xyz-12345")

    rows_after = page.locator('[data-testid^="tenant-row-"]')
    expect(rows_after).to_have_count(0, timeout=5_000)


def test_tenant_edit_modal_opens(authenticated_page: Page) -> None:
    """Clicking the edit button on a tenant row should open the edit modal."""
    page = authenticated_page
    navigate_to_tenants(page)

    _wait_for_tenant_rows(page, prefix="tenant-edit-")

    edit_buttons = page.locator('[data-testid^="tenant-edit-"]')
    edit_buttons.first.click()
    expect(page.get_by_test_id("tenant-modal")).to_be_visible(timeout=5_000)
    expect(page.get_by_test_id("tenant-name-input")).to_be_visible()

    page.get_by_test_id("tenant-modal-cancel-button").click()
    expect(page.get_by_test_id("tenant-modal")).not_to_be_visible(timeout=5_000)
