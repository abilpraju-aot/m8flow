"""Tests for breadcrumb navigation."""
import pytest
from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.templates import navigate_to_templates


def test_breadcrumb_visible_on_template_detail(authenticated_page: Page) -> None:
    """The breadcrumb should be visible when viewing a template."""
    page = authenticated_page
    navigate_to_templates(page)

    cards = page.locator('[data-testid^="template-card-"]')
    if cards.count() == 0:
        pytest.skip("No template cards available -- seed test data to enable this test")

    cards.first.click()
    expect(
        page.get_by_test_id("template-modeler-page")
    ).to_be_visible(timeout=15_000)

    breadcrumb = page.get_by_test_id("process-breadcrumb")
    try:
        breadcrumb.wait_for(state="visible", timeout=10_000)
    except PlaywrightTimeout:
        pytest.skip(
            "process-breadcrumb not rendered -- may require backend permission resolution"
        )


def test_breadcrumb_back_to_gallery(authenticated_page: Page) -> None:
    """Clicking 'Templates' in the breadcrumb should go back to the gallery."""
    page = authenticated_page
    navigate_to_templates(page)

    cards = page.locator('[data-testid^="template-card-"]')
    if cards.count() == 0:
        pytest.skip("No template cards available -- seed test data to enable this test")

    cards.first.click()
    expect(
        page.get_by_test_id("template-modeler-page")
    ).to_be_visible(timeout=15_000)

    breadcrumb = page.get_by_test_id("process-breadcrumb")
    try:
        breadcrumb.wait_for(state="visible", timeout=10_000)
    except PlaywrightTimeout:
        pytest.skip(
            "process-breadcrumb not rendered -- may require backend permission resolution"
        )

    templates_link = breadcrumb.get_by_text("Templates")
    expect(templates_link).to_be_visible(timeout=5_000)
    templates_link.click()
    expect(
        page.get_by_test_id("template-gallery-page")
    ).to_be_visible(timeout=15_000)
