"""Smoke tests for login and logout flows."""
from playwright.sync_api import Page, expect
from helpers.login import login, logout, expect_logged_out


def test_login(page: Page) -> None:
    """Verify that a user can log in successfully."""
    login(page)
    expect(page.get_by_role("button", name="User Actions")).to_be_visible()


def test_logout(page: Page) -> None:
    """Verify that a logged-in user can log out."""
    login(page)
    logout(page)
    expect_logged_out(page)


def test_login_and_see_sidenav(authenticated_page: Page) -> None:
    """After login the SideNav should be rendered."""
    expect(
        authenticated_page.get_by_test_id("m8flow-logo")
    ).to_be_visible(timeout=10_000)
