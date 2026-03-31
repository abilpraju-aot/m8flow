import os

import pytest
from playwright.sync_api import Page
from helpers.config import (
    BASE_URL,
    ROLE_USERS,
    SUPER_ADMIN_USERNAME,
    SUPER_ADMIN_PASSWORD,
    APP_READY_TIMEOUT,
    NAV_TIMEOUT,
    VIEWPORT,
)
from helpers.login import login, login_as_global_admin, logout
from helpers.waiters import wait_for_app_ready

_PAGE_FIXTURES = (
    "page",
    "authenticated_page",
    "editor_page",
    "viewer_page",
    "reviewer_page",
    "super_admin_page",
)


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture
def context(browser, base_url):
    """Fresh browser context per test with sensible defaults."""
    ctx = browser.new_context(
        base_url=base_url,
        viewport=VIEWPORT,
        ignore_https_errors=True,
    )
    ctx.set_default_timeout(APP_READY_TIMEOUT)
    ctx.set_default_navigation_timeout(NAV_TIMEOUT)
    yield ctx
    ctx.close()


@pytest.fixture
def page(context):
    """Fresh page per test from an isolated context."""
    pg = context.new_page()
    yield pg
    pg.close()


@pytest.fixture
def authenticated_page(page: Page):
    """Page logged in as the default user (tenant-admin)."""
    login(page)
    wait_for_app_ready(page)
    yield page
    logout(page)


@pytest.fixture
def editor_page(page: Page):
    """Page logged in as the editor role."""
    creds = ROLE_USERS["editor"]
    login(page, username=creds["username"], password=creds["password"])
    wait_for_app_ready(page)
    yield page
    logout(page)


@pytest.fixture
def viewer_page(page: Page):
    """Page logged in as the viewer role."""
    creds = ROLE_USERS["viewer"]
    login(page, username=creds["username"], password=creds["password"])
    wait_for_app_ready(page)
    yield page
    logout(page)


@pytest.fixture
def reviewer_page(page: Page):
    """Page logged in as the reviewer role."""
    creds = ROLE_USERS["reviewer"]
    login(page, username=creds["username"], password=creds["password"])
    wait_for_app_ready(page)
    yield page
    logout(page)


@pytest.fixture
def super_admin_page(page: Page):
    """Page logged in as the global super-admin (master realm)."""
    login_as_global_admin(
        page, username=SUPER_ADMIN_USERNAME, password=SUPER_ADMIN_PASSWORD
    )
    wait_for_app_ready(page)
    yield page
    logout(page)


def pytest_runtest_makereport(item, call):
    """Capture a full-page screenshot on test failure."""
    if call.when == "call" and call.excinfo is not None:
        pg = None
        for name in _PAGE_FIXTURES:
            pg = item.funcargs.get(name)
            if pg is not None:
                break
        if pg and not pg.is_closed():
            os.makedirs("test-results", exist_ok=True)
            test_name = item.nodeid.replace("::", "_").replace("/", "_")
            pg.screenshot(path=f"test-results/{test_name}.png", full_page=True)
