"""Tests for SideNav navigation."""
import pytest
from playwright.sync_api import Page, expect
from helpers.login import expect_logged_out


def test_sidenav_logo_visible(authenticated_page: Page) -> None:
    """The m8flow logo should be visible in the SideNav."""
    expect(
        authenticated_page.get_by_test_id("m8flow-logo")
    ).to_be_visible(timeout=10_000)


def test_sidenav_collapse_and_expand(authenticated_page: Page) -> None:
    """The SideNav should support collapsing and expanding."""
    page = authenticated_page

    collapse_button = page.get_by_test_id("collapse-primary-nav")
    if not collapse_button.is_visible(timeout=3_000):
        pytest.skip("Collapse button not present in current layout")

    collapse_button.click()
    expect(page.get_by_test_id("expand-primary-nav")).to_be_visible(timeout=5_000)

    page.get_by_test_id("expand-primary-nav").click()
    expect(page.get_by_test_id("collapse-primary-nav")).to_be_visible(timeout=5_000)


def test_sidenav_nav_home(authenticated_page: Page) -> None:
    """Clicking the Home nav item should navigate to the home page."""
    page = authenticated_page
    home_nav = page.get_by_test_id("nav-home")
    expect(home_nav).to_be_visible(timeout=5_000)
    home_nav.click()
    expect(page.get_by_role("button", name="User Actions")).to_be_visible(timeout=10_000)


def test_sidenav_nav_templates(authenticated_page: Page) -> None:
    """Clicking Templates in the SideNav should show the gallery page."""
    page = authenticated_page
    page.get_by_test_id("nav-templates").click()
    expect(
        page.get_by_test_id("template-gallery-page")
    ).to_be_visible(timeout=15_000)


def test_sidenav_nav_processes(authenticated_page: Page) -> None:
    """Clicking Processes in the SideNav should navigate to process groups."""
    page = authenticated_page

    processes_nav = page.get_by_test_id("nav-processes")
    if not processes_nav.is_visible(timeout=3_000):
        pytest.skip("Processes nav item not visible for current user role")

    processes_nav.click()
    page.wait_for_url("**/process-groups**", timeout=15_000)


def test_sidenav_nav_process_instances(authenticated_page: Page) -> None:
    """Clicking Process Instances in the SideNav should work."""
    page = authenticated_page

    instances_nav = page.get_by_test_id("nav-process-instances")
    if not instances_nav.is_visible(timeout=3_000):
        pytest.skip("Process Instances nav item not visible for current user role")

    instances_nav.click()
    page.wait_for_url("**/process-instances**", timeout=15_000)


def test_sidenav_sign_out(authenticated_page: Page) -> None:
    """The sign-out button in the SideNav should log the user out."""
    page = authenticated_page

    user_menu = page.get_by_role("button", name="User Actions")
    expect(user_menu).to_be_visible()
    user_menu.click()

    page.get_by_test_id("sign-out-button").click()
    expect_logged_out(page)
