"""Tests verifying viewer role UI visibility.

Viewers should see Processes, Process Instances, and Templates (read-only).
They should NOT see Home (no PUT /tasks/*), Tenants, Configuration,
or the template import button.
"""
from playwright.sync_api import Page, expect


def test_viewer_sees_processes_nav(viewer_page: Page) -> None:
    """Viewer should see the Processes nav item."""
    expect(viewer_page.get_by_test_id("nav-processes")).to_be_visible(timeout=10_000)


def test_viewer_sees_process_instances_nav(viewer_page: Page) -> None:
    """Viewer should see the Process Instances nav item."""
    expect(
        viewer_page.get_by_test_id("nav-process-instances")
    ).to_be_visible(timeout=10_000)


def test_viewer_sees_templates_nav(viewer_page: Page) -> None:
    """Viewer should see the Templates nav item (read-only access)."""
    expect(
        viewer_page.get_by_test_id("nav-templates")
    ).to_be_visible(timeout=10_000)


def test_viewer_no_home_nav(viewer_page: Page) -> None:
    """Viewer should NOT see the Home nav item (no task management)."""
    expect(
        viewer_page.get_by_test_id("nav-home")
    ).not_to_be_visible(timeout=5_000)


def test_viewer_no_import_template_button(viewer_page: Page) -> None:
    """Viewer should NOT see the import button on the templates page."""
    page = viewer_page
    page.get_by_test_id("nav-templates").click()
    expect(
        page.get_by_test_id("template-gallery-page")
    ).to_be_visible(timeout=15_000)
    expect(
        page.get_by_test_id("import-template-button")
    ).not_to_be_visible(timeout=5_000)


def test_viewer_no_tenants_nav(viewer_page: Page) -> None:
    """Viewer should NOT see the Tenants nav item."""
    expect(
        viewer_page.get_by_test_id("nav-tenants")
    ).not_to_be_visible(timeout=5_000)


def test_viewer_no_configuration_nav(viewer_page: Page) -> None:
    """Viewer should NOT see the Configuration nav item."""
    expect(
        viewer_page.get_by_test_id("nav-configuration")
    ).not_to_be_visible(timeout=5_000)
