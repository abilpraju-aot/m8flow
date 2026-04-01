from playwright.sync_api import Page, expect, TimeoutError as PlaywrightTimeout
from helpers.config import (
    BASE_URL,
    DEFAULT_USERNAME,
    DEFAULT_PASSWORD,
    DEFAULT_TENANT,
    SUPER_ADMIN_USERNAME,
    SUPER_ADMIN_PASSWORD,
    KC_TIMEOUT,
    POST_LOGIN_TIMEOUT,
    PAGE_DATA_TIMEOUT,
    MAX_LOGIN_ATTEMPTS,
    SHORT_TIMEOUT,
)


def _handle_tenant_selection(page: Page) -> None:
    """If the tenant-select page is showing, fill in the tenant and submit."""
    tenant_select = page.get_by_test_id("tenant-select-page")
    if tenant_select.is_visible(timeout=SHORT_TIMEOUT):
        page.get_by_test_id("tenant-name-select-input").locator("input").fill(
            DEFAULT_TENANT
        )
        page.get_by_test_id("tenant-select-submit-button").click()


def _handle_keycloak_update_password(page: Page, password: str) -> None:
    """Complete Keycloak's UPDATE_PASSWORD required action."""
    page.locator("#password-new").fill(password)
    page.locator("#password-confirm").fill(password)
    page.locator('input[type="submit"], button[type="submit"]').click()


def _wait_for_post_login(
    page: Page,
    password: str,
    new_password: str | None = None,
    timeout: int = POST_LOGIN_TIMEOUT,
) -> None:
    """Wait for the app shell or a Keycloak required-action page.

    Handles UPDATE_PASSWORD automatically if it appears.
    *new_password* is used when Keycloak forces a password change;
    defaults to *password* so the credentials stay the same.
    """
    indicator = page.locator('#password-new, [data-testid="m8flow-logo"]')
    indicator.first.wait_for(state="visible", timeout=timeout)

    if page.locator("#password-new").is_visible():
        _handle_keycloak_update_password(page, new_password or password)

    expect(
        page.get_by_role("button", name="User Actions")
    ).to_be_visible(timeout=timeout)


def expect_logged_out(page: Page, timeout: int = PAGE_DATA_TIMEOUT) -> None:
    """Wait for a post-logout page (tenant-select or Keycloak login form)."""
    page.locator(
        '[data-testid="tenant-select-page"], #username'
    ).first.wait_for(state="visible", timeout=timeout)



def _submit_keycloak_form(page: Page, username: str, password: str) -> None:
    """Fill and submit the Keycloak login form."""
    page.locator("#username").wait_for(state="visible", timeout=KC_TIMEOUT)
    page.locator("#username").fill(username)
    page.locator("#password").fill(password)
    page.locator("#kc-login").click()


def login(
    page: Page,
    username: str | None = None,
    password: str | None = None,
    new_password: str | None = None,
    base_url: str = BASE_URL,
) -> None:
    """Log in via Keycloak with automatic retry.

    Works for both single-tenant and multi-tenant setups.
    Handles Keycloak required actions (e.g. forced password update).
    *new_password* is forwarded to the update-password handler when
    Keycloak forces a change; defaults to *password*.
    """
    username = username or DEFAULT_USERNAME
    password = password or DEFAULT_PASSWORD

    page.goto(base_url)
    _handle_tenant_selection(page)

    for attempt in range(1, MAX_LOGIN_ATTEMPTS + 1):
        _submit_keycloak_form(page, username, password)
        try:
            _wait_for_post_login(page, password, new_password=new_password)
            return
        except (AssertionError, PlaywrightTimeout):
            if attempt == MAX_LOGIN_ATTEMPTS:
                raise
            page.goto(base_url)
            _handle_tenant_selection(page)


def login_as_global_admin(
    page: Page,
    username: str = SUPER_ADMIN_USERNAME,
    password: str = SUPER_ADMIN_PASSWORD,
    base_url: str = BASE_URL,
) -> None:
    """Log in as a global admin via the master realm.

    Clicks the 'Global admin sign in' button on the tenant-select page,
    which redirects to Keycloak's master realm.
    """
    page.goto(base_url)

    page.get_by_test_id("tenant-select-page").wait_for(
        state="visible", timeout=KC_TIMEOUT
    )
    page.get_by_test_id("global-admin-sign-in-button").click()

    for attempt in range(1, MAX_LOGIN_ATTEMPTS + 1):
        _submit_keycloak_form(page, username, password)
        try:
            _wait_for_post_login(page, password)
            return
        except (AssertionError, PlaywrightTimeout):
            if attempt == MAX_LOGIN_ATTEMPTS:
                raise
            page.goto(base_url)
            page.get_by_test_id("tenant-select-page").wait_for(
                state="visible", timeout=KC_TIMEOUT
            )
            page.get_by_test_id("global-admin-sign-in-button").click()


def logout(page: Page, base_url: str = BASE_URL) -> None:
    """Log out the current user."""
    user_menu_button = page.get_by_role("button", name="User Actions")
    try:
        user_menu_button.wait_for(state="visible", timeout=SHORT_TIMEOUT)
        user_menu_button.click()
        page.locator('[data-testid="sign-out-button"]').click()
    except (AssertionError, PlaywrightTimeout):
        page.goto(f"{base_url}/auth/signout")

    try:
        expect_logged_out(page)
    except (AssertionError, PlaywrightTimeout):
        pass
