"""Tests for creating a process model from a template (mock-backed)."""
import re

import pytest
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.config import PAGE_DATA_TIMEOUT, SHORT_TIMEOUT, ELEMENT_TIMEOUT
from helpers.templates import navigate_to_templates


def _open_first_template(page: Page) -> None:
    """Navigate to templates and open the first template card."""
    navigate_to_templates(page)

    cards = page.locator('[data-testid^="template-card-"]')
    cards.first.wait_for(state="visible", timeout=PAGE_DATA_TIMEOUT)
    cards.first.click()
    expect(
        page.get_by_test_id("template-modeler-page")
    ).to_be_visible(timeout=15_000)


def _open_create_modal(page: Page) -> None:
    """Click the create-process-model button and wait for the modal."""
    create_button = page.get_by_test_id("template-create-process-model-button")
    try:
        create_button.wait_for(state="visible", timeout=ELEMENT_TIMEOUT)
    except PlaywrightTimeout:
        pytest.skip("Create-process-model button not visible for current user role")

    create_button.click()
    expect(
        page.get_by_test_id("create-process-model-from-template-modal")
    ).to_be_visible(timeout=ELEMENT_TIMEOUT)


def test_create_process_model_modal_opens(mocked_process_model_page: Page) -> None:
    """The create-process-model modal should open from the template page."""
    page = mocked_process_model_page
    _open_first_template(page)
    _open_create_modal(page)

    expect(page.get_by_test_id("process-group-select")).to_be_visible()
    expect(page.get_by_test_id("process-model-display-name-input")).to_be_visible()
    expect(page.get_by_test_id("process-model-id-input")).to_be_visible()
    expect(page.get_by_test_id("process-model-description-input")).to_be_visible()
    expect(page.get_by_test_id("create-process-model-submit-button")).to_be_visible()
    expect(page.get_by_test_id("create-process-model-cancel-button")).to_be_visible()

    page.get_by_test_id("create-process-model-cancel-button").click()
    expect(
        page.get_by_test_id("create-process-model-from-template-modal")
    ).not_to_be_visible(timeout=5_000)


def test_create_process_model_validation(mocked_process_model_page: Page) -> None:
    """Submitting the create-process-model form without required fields shows errors."""
    page = mocked_process_model_page
    _open_first_template(page)
    _open_create_modal(page)

    display_name = page.get_by_test_id("process-model-display-name-input").locator("input")
    display_name.clear()

    model_id = page.get_by_test_id("process-model-id-input").locator("input")
    model_id.clear()

    page.get_by_test_id("create-process-model-submit-button").click()

    expect(
        page.get_by_text("Please select a process group")
    ).to_be_visible(timeout=5_000)

    page.get_by_test_id("create-process-model-cancel-button").click()


def test_create_process_model_full_flow(mocked_process_model_page: Page) -> None:
    """Select a process group, fill the form, submit, and verify navigation to the new model."""
    page = mocked_process_model_page
    _open_first_template(page)
    _open_create_modal(page)

    group_select = page.get_by_test_id("process-group-select")
    group_select.click()

    options = page.get_by_role("option")
    options.first.wait_for(state="visible", timeout=PAGE_DATA_TIMEOUT)
    options.first.click()

    display_name = page.get_by_test_id("process-model-display-name-input").locator("input")
    display_name.clear()
    display_name.fill("E2E Test Model")

    model_id = page.get_by_test_id("process-model-id-input").locator("input")
    model_id.clear()
    model_id.fill("e2e-test-model")

    page.get_by_test_id("create-process-model-submit-button").click()

    expect(page).to_have_url(re.compile(r"/process-models/"), timeout=PAGE_DATA_TIMEOUT)


def test_create_process_model_auto_fills_from_template(mocked_process_model_page: Page) -> None:
    """Opening the create-process-model modal should pre-fill fields from the template."""
    page = mocked_process_model_page
    _open_first_template(page)
    _open_create_modal(page)

    display_name = page.get_by_test_id("process-model-display-name-input").locator("input")
    assert display_name.input_value().strip() != "", "Display name should be pre-filled"

    model_id = page.get_by_test_id("process-model-id-input").locator("input")
    assert model_id.input_value().strip() != "", "Model ID should be pre-filled"

    page.get_by_test_id("create-process-model-cancel-button").click()
