"""Tests verifying super-admin (master realm) UI visibility.

Super-admin should see the Tenants page and nav item, but should NOT
see tenant-scoped nav items like Home, Processes, or Templates.
"""
import re

from playwright.sync_api import Page, expect


def test_super_admin_lands_on_tenants_page(super_admin_page: Page) -> None:
    """Super-admin should be redirected to /tenants after login."""
    expect(super_admin_page).to_have_url(re.compile(r"/tenants"), timeout=15_000)


def test_super_admin_tenant_page_visible(super_admin_page: Page) -> None:
    """The tenant management page should render for super-admin."""
    expect(
        super_admin_page.get_by_test_id("tenant-page")
    ).to_be_visible(timeout=15_000)


def test_super_admin_sees_tenants_nav(super_admin_page: Page) -> None:
    """Super-admin should see the Tenants nav item."""
    expect(
        super_admin_page.get_by_test_id("nav-tenants")
    ).to_be_visible(timeout=10_000)


def test_super_admin_no_home_nav(super_admin_page: Page) -> None:
    """Super-admin should NOT see the Home nav item."""
    expect(
        super_admin_page.get_by_test_id("nav-home")
    ).not_to_be_visible(timeout=5_000)


def test_super_admin_no_templates_nav(super_admin_page: Page) -> None:
    """Super-admin should NOT see the Templates nav item."""
    expect(
        super_admin_page.get_by_test_id("nav-templates")
    ).not_to_be_visible(timeout=5_000)
