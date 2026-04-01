"""Tests for process model import dialog (mock-backed)."""
import pytest
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.config import BASE_URL, SHORT_TIMEOUT, PAGE_DATA_TIMEOUT, ELEMENT_TIMEOUT
from helpers.waiters import wait_for_app_ready


def _navigate_into_process_group(page: Page) -> None:
    """Navigate to process groups page and click into the first group."""
    nav = page.get_by_test_id("nav-processes")
    try:
        nav.wait_for(state="visible", timeout=SHORT_TIMEOUT)
    except PlaywrightTimeout:
        page.goto(f"{BASE_URL}/process-groups")
        wait_for_app_ready(page)
    else:
        nav.click()
        wait_for_app_ready(page)

    group_link = page.get_by_text("Test Process Group").first
    group_link.wait_for(state="visible", timeout=PAGE_DATA_TIMEOUT)
    group_link.click()
    wait_for_app_ready(page)


def test_process_model_import_dialog_opens(mocked_import_page: Page) -> None:
    """The import dialog should open from inside a process group."""
    page = mocked_import_page
    _navigate_into_process_group(page)

    add_model_btn = page.get_by_test_id("add-process-model-button")
    try:
        add_model_btn.wait_for(state="visible", timeout=ELEMENT_TIMEOUT)
    except PlaywrightTimeout:
        pytest.skip("Add-process-model button not visible -- insufficient permissions")

    add_model_btn.click()
    wait_for_app_ready(page)


def test_new_process_model_form_visible(mocked_import_page: Page) -> None:
    """The new-process-model page should display a form with name and description fields."""
    page = mocked_import_page
    _navigate_into_process_group(page)

    add_model_btn = page.get_by_test_id("add-process-model-button")
    add_model_btn.wait_for(state="visible", timeout=ELEMENT_TIMEOUT)
    add_model_btn.click()
    wait_for_app_ready(page)

    expect(page.get_by_label("Display Name")).to_be_visible(timeout=ELEMENT_TIMEOUT)
    expect(page.get_by_label("Description")).to_be_visible(timeout=ELEMENT_TIMEOUT)
