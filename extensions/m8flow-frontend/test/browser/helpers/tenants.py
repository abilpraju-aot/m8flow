from playwright.sync_api import Page, expect
from helpers.config import BASE_URL, PAGE_DATA_TIMEOUT, ELEMENT_TIMEOUT, SHORT_TIMEOUT
from helpers.waiters import wait_for_app_ready


def navigate_to_tenants(page: Page) -> None:
    """Navigate to the tenant management page.

    Uses direct URL navigation since the Tenants nav item may be
    registered as an extension nav element with varying label text.
    """
    page.goto(f"{BASE_URL}/tenants")
    wait_for_app_ready(page)
    expect(
        page.get_by_test_id("tenant-page")
    ).to_be_visible(timeout=PAGE_DATA_TIMEOUT)


def search_tenant(page: Page, query: str) -> None:
    """Type a search query into the tenant search input."""
    search_input = page.get_by_test_id("tenant-search-input").locator("input")
    search_input.clear()
    search_input.fill(query)


def edit_tenant(page: Page, tenant_slug: str, new_name: str) -> None:
    """Edit a tenant's name through the edit modal."""
    edit_btn = page.get_by_test_id(f"tenant-edit-{tenant_slug}")
    expect(edit_btn).to_be_visible(timeout=ELEMENT_TIMEOUT)
    edit_btn.click()
    expect(page.get_by_test_id("tenant-modal")).to_be_visible(timeout=SHORT_TIMEOUT)

    name_input = page.get_by_test_id("tenant-name-input").locator("input")
    name_input.clear()
    name_input.fill(new_name)

    page.get_by_test_id("tenant-modal-submit-button").click()
    expect(page.get_by_test_id("tenant-modal")).not_to_be_visible(timeout=SHORT_TIMEOUT)
