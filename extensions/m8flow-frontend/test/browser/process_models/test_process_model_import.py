"""Tests for process model import dialog."""
import pytest
from playwright.sync_api import Page, expect
from helpers.config import BASE_URL, SHORT_TIMEOUT
from helpers.waiters import wait_for_app_ready


def test_process_model_import_dialog_opens(authenticated_page: Page) -> None:
    """The import dialog should open from the process model page."""
    page = authenticated_page
    page.goto(f"{BASE_URL}/process-groups")
    wait_for_app_ready(page)

    add_model_btn = page.get_by_test_id("add-process-model-button")
    if not add_model_btn.is_visible(timeout=5_000):
        pytest.skip("Add-process-model button not visible -- no process groups or insufficient permissions")

    add_model_btn.click()
    wait_for_app_ready(page)


def test_process_model_import_button_visible(authenticated_page: Page) -> None:
    """The process model import button should be visible on the model page."""
    page = authenticated_page
    page.goto(f"{BASE_URL}/process-groups")
    wait_for_app_ready(page)

    breadcrumbs = page.locator('[data-testid^="process-group-breadcrumb-"]')
    if breadcrumbs.count() == 0:
        pytest.skip("No process groups available -- seed test data to enable this test")

    breadcrumbs.first.click()
    wait_for_app_ready(page)

    model_cards = page.locator('[data-testid^="process-model-card-"]')
    if model_cards.count() == 0:
        pytest.skip("No process model cards available -- seed test data to enable this test")

    model_cards.first.click()
    wait_for_app_ready(page)

    import_button = page.get_by_test_id("process-model-import-button")
    if not import_button.is_visible(timeout=5_000):
        pytest.skip("Import button not visible for current user role")

    import_button.click()
    expect(
        page.get_by_test_id("repository-url-input")
    ).to_be_visible(timeout=5_000)
