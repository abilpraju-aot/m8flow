"""Process-model-specific fixtures providing mock data.

Sets up both template and process group mocks so that the create-from-template
flow has deterministic data and does not skip due to missing seeded data.
"""
import pytest
from playwright.sync_api import Page

from helpers.mocks import (
    mock_template_api,
    mock_template_files_api,
    mock_process_groups_api,
    mock_permissions_api,
    mock_create_process_model_api,
    mock_all_apis,
    MOCK_TEMPLATE_PRIVATE,
    MOCK_TEMPLATE_PUBLIC,
    ALL_MOCK_TEMPLATES,
    MOCK_PROCESS_GROUP,
    MOCK_PROCESS_GROUP_HR,
    ALL_MOCK_PROCESS_GROUPS,
)


@pytest.fixture
def mocked_process_model_page(authenticated_page: Page) -> Page:
    """Page with template + process group APIs mocked for create-from-template."""
    mock_permissions_api(authenticated_page)
    mock_template_api(authenticated_page, templates=ALL_MOCK_TEMPLATES)
    mock_template_files_api(authenticated_page)
    mock_process_groups_api(authenticated_page, groups=ALL_MOCK_PROCESS_GROUPS)
    mock_create_process_model_api(authenticated_page)
    return authenticated_page


@pytest.fixture
def mocked_import_page(authenticated_page: Page) -> Page:
    """Page with process group API mocked for import-dialog tests."""
    mock_permissions_api(authenticated_page)
    mock_process_groups_api(authenticated_page, groups=ALL_MOCK_PROCESS_GROUPS)
    return authenticated_page


@pytest.fixture
def mocked_full_page(authenticated_page: Page) -> Page:
    """Page with all API routes mocked (templates, tenants, process groups)."""
    mock_all_apis(authenticated_page)
    return authenticated_page
