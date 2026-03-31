"""Tests verifying reviewer role UI visibility.

Reviewers should see Home (task management) but should NOT see
Processes, Process Instances, Templates, Tenants, or Configuration.
"""
from playwright.sync_api import Page, expect


def test_reviewer_sees_home_nav(reviewer_page: Page) -> None:
    """Reviewer should see the Home nav item (task management)."""
    expect(reviewer_page.get_by_test_id("nav-home")).to_be_visible(timeout=10_000)


def test_reviewer_no_processes_nav(reviewer_page: Page) -> None:
    """Reviewer should NOT see the Processes nav item."""
    expect(
        reviewer_page.get_by_test_id("nav-processes")
    ).not_to_be_visible(timeout=5_000)


def test_reviewer_no_process_instances_nav(reviewer_page: Page) -> None:
    """Reviewer should NOT see the Process Instances nav item."""
    expect(
        reviewer_page.get_by_test_id("nav-process-instances")
    ).not_to_be_visible(timeout=5_000)


def test_reviewer_no_templates_nav(reviewer_page: Page) -> None:
    """Reviewer should NOT see the Templates nav item."""
    expect(
        reviewer_page.get_by_test_id("nav-templates")
    ).not_to_be_visible(timeout=5_000)


def test_reviewer_no_tenants_nav(reviewer_page: Page) -> None:
    """Reviewer should NOT see the Tenants nav item."""
    expect(
        reviewer_page.get_by_test_id("nav-tenants")
    ).not_to_be_visible(timeout=5_000)


def test_reviewer_no_configuration_nav(reviewer_page: Page) -> None:
    """Reviewer should NOT see the Configuration nav item."""
    expect(
        reviewer_page.get_by_test_id("nav-configuration")
    ).not_to_be_visible(timeout=5_000)
