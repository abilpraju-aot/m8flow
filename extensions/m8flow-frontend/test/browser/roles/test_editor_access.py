"""Tests verifying editor role UI visibility.

Editors should see Home, Processes, Process Instances, and Templates
(including the import button). They should NOT see Tenants or Configuration.
"""
from playwright.sync_api import Page, expect


def test_editor_sees_home_nav(editor_page: Page) -> None:
    """Editor should see the Home nav item."""
    expect(editor_page.get_by_test_id("nav-home")).to_be_visible(timeout=10_000)


def test_editor_sees_processes_nav(editor_page: Page) -> None:
    """Editor should see the Processes nav item."""
    expect(editor_page.get_by_test_id("nav-processes")).to_be_visible(timeout=10_000)


def test_editor_sees_process_instances_nav(editor_page: Page) -> None:
    """Editor should see the Process Instances nav item."""
    expect(
        editor_page.get_by_test_id("nav-process-instances")
    ).to_be_visible(timeout=10_000)


def test_editor_sees_templates_nav(editor_page: Page) -> None:
    """Editor should see the Templates nav item."""
    expect(
        editor_page.get_by_test_id("nav-templates")
    ).to_be_visible(timeout=10_000)


def test_editor_can_import_template(editor_page: Page) -> None:
    """Editor should see the import button on the templates page."""
    page = editor_page
    page.get_by_test_id("nav-templates").click()
    expect(
        page.get_by_test_id("template-gallery-page")
    ).to_be_visible(timeout=15_000)
    expect(
        page.get_by_test_id("import-template-button")
    ).to_be_visible(timeout=10_000)


def test_editor_no_tenants_nav(editor_page: Page) -> None:
    """Editor should NOT see the Tenants nav item."""
    expect(
        editor_page.get_by_test_id("nav-tenants")
    ).not_to_be_visible(timeout=5_000)


def test_editor_no_configuration_nav(editor_page: Page) -> None:
    """Editor should NOT see the Configuration nav item."""
    expect(
        editor_page.get_by_test_id("nav-configuration")
    ).not_to_be_visible(timeout=5_000)
