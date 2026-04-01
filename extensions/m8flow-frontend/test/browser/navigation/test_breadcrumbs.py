"""Tests for breadcrumb navigation (mock-backed)."""
from playwright.sync_api import Page, expect
from helpers.config import PAGE_DATA_TIMEOUT
from helpers.templates import navigate_to_templates


def _open_template_detail(page: Page) -> None:
    """Navigate to the template gallery and open the first template card."""
    navigate_to_templates(page)

    cards = page.locator('[data-testid^="template-card-"]')
    cards.first.wait_for(state="visible", timeout=PAGE_DATA_TIMEOUT)
    cards.first.click()
    expect(
        page.get_by_test_id("template-modeler-page")
    ).to_be_visible(timeout=PAGE_DATA_TIMEOUT)


def test_breadcrumb_visible_on_template_detail(mocked_template_page: Page) -> None:
    """The breadcrumb should be visible when viewing a template."""
    page = mocked_template_page
    _open_template_detail(page)

    breadcrumb = page.locator("nav.spiff-breadcrumb")
    expect(breadcrumb).to_be_visible(timeout=PAGE_DATA_TIMEOUT)
    expect(breadcrumb.get_by_text("Templates")).to_be_visible()


def test_breadcrumb_back_to_gallery(mocked_template_page: Page) -> None:
    """Clicking 'Templates' in the breadcrumb should go back to the gallery."""
    page = mocked_template_page
    _open_template_detail(page)

    breadcrumb = page.locator("nav.spiff-breadcrumb")
    expect(breadcrumb).to_be_visible(timeout=PAGE_DATA_TIMEOUT)

    templates_link = breadcrumb.get_by_text("Templates")
    expect(templates_link).to_be_visible()
    templates_link.click()
    expect(
        page.get_by_test_id("template-gallery-page")
    ).to_be_visible(timeout=PAGE_DATA_TIMEOUT)
