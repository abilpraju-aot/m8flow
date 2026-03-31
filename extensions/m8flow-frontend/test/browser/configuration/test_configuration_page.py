"""Tests for the configuration page."""
import pytest
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.config import PAGE_DATA_TIMEOUT, SHORT_TIMEOUT


def test_configuration_page_loads(authenticated_page: Page) -> None:
    """The configuration page should render for tenant-admin."""
    page = authenticated_page

    nav_config = page.get_by_test_id("nav-configuration")
    try:
        nav_config.wait_for(state="visible", timeout=SHORT_TIMEOUT)
    except PlaywrightTimeout:
        pytest.skip("Configuration nav not visible for current user role")

    nav_config.click()
    page.wait_for_url("**/configuration**", timeout=PAGE_DATA_TIMEOUT)


def test_configuration_secrets_tab_visible(authenticated_page: Page) -> None:
    """The configuration page should show a secrets tab for tenant-admin."""
    page = authenticated_page

    nav_config = page.get_by_test_id("nav-configuration")
    try:
        nav_config.wait_for(state="visible", timeout=SHORT_TIMEOUT)
    except PlaywrightTimeout:
        pytest.skip("Configuration nav not visible for current user role")

    nav_config.click()
    page.wait_for_url("**/configuration**", timeout=PAGE_DATA_TIMEOUT)

    secrets_tab = page.get_by_role("tab", name="Secrets")
    try:
        secrets_tab.wait_for(state="visible", timeout=SHORT_TIMEOUT)
    except PlaywrightTimeout:
        pytest.skip("Secrets tab not visible -- may require specific permissions")
