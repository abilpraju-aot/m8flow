"""Playwright API route mocking helpers for browser tests.

Uses ``page.route()`` to intercept backend API calls and return
deterministic JSON responses, removing the dependency on seeded data.

Covers templates, tenants, and process groups.
"""
from __future__ import annotations

import copy
import json
import re
from typing import Any
from urllib.parse import urlparse, parse_qs

from playwright.sync_api import Page, Route

# ===================================================================
# Template mock data -- m8flow tenant
# ===================================================================

MOCK_TEMPLATE_PRIVATE: dict[str, Any] = {
    "id": 1,
    "templateKey": "test-template-private",
    "version": "V1",
    "name": "Private Test Template",
    "description": "A private test template",
    "tags": ["test"],
    "category": "Testing",
    "tenantId": "m8flow",
    "visibility": "PRIVATE",
    "files": [
        {"fileType": "bpmn", "fileName": "process.bpmn"},
        {"fileType": "json", "fileName": "form.json"},
    ],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700000000,
    "createdBy": "admin",
    "updatedAtInSeconds": 1700000000,
    "modifiedBy": "admin",
}

MOCK_TEMPLATE_TENANT: dict[str, Any] = {
    "id": 2,
    "templateKey": "test-template-tenant",
    "version": "V1",
    "name": "Tenant Test Template",
    "description": "A tenant-wide test template",
    "tags": ["shared"],
    "category": "Shared",
    "tenantId": "m8flow",
    "visibility": "TENANT",
    "files": [{"fileType": "bpmn", "fileName": "workflow.bpmn"}],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700001000,
    "createdBy": "admin",
    "updatedAtInSeconds": 1700001000,
    "modifiedBy": "admin",
}

MOCK_TEMPLATE_PUBLIC: dict[str, Any] = {
    "id": 3,
    "templateKey": "test-template-public",
    "version": "V1",
    "name": "Public Test Template",
    "description": "A public test template visible to all",
    "tags": ["public"],
    "category": "Public",
    "tenantId": "m8flow",
    "visibility": "PUBLIC",
    "files": [{"fileType": "bpmn", "fileName": "public-process.bpmn"}],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700002000,
    "createdBy": "admin",
    "updatedAtInSeconds": 1700002000,
    "modifiedBy": "admin",
}

MOCK_TEMPLATE_PUBLISHED: dict[str, Any] = {
    "id": 4,
    "templateKey": "test-template-published",
    "version": "V1",
    "name": "Published Test Template",
    "description": "A published template",
    "tags": ["released"],
    "category": "Production",
    "tenantId": "m8flow",
    "visibility": "TENANT",
    "files": [
        {"fileType": "bpmn", "fileName": "released.bpmn"},
        {"fileType": "json", "fileName": "form.json"},
    ],
    "isPublished": True,
    "status": "PUBLISHED",
    "createdAtInSeconds": 1700003000,
    "createdBy": "admin",
    "updatedAtInSeconds": 1700003000,
    "modifiedBy": "admin",
}

MOCK_TEMPLATE_V2: dict[str, Any] = {
    "id": 5,
    "templateKey": "test-template-published",
    "version": "V2",
    "name": "Published Test Template",
    "description": "Draft of V2",
    "tags": ["released"],
    "category": "Production",
    "tenantId": "m8flow",
    "visibility": "TENANT",
    "files": [{"fileType": "bpmn", "fileName": "released.bpmn"}],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700004000,
    "createdBy": "admin",
    "updatedAtInSeconds": 1700004000,
    "modifiedBy": "admin",
}

ALL_MOCK_TEMPLATES: list[dict[str, Any]] = [
    MOCK_TEMPLATE_PRIVATE,
    MOCK_TEMPLATE_TENANT,
    MOCK_TEMPLATE_PUBLIC,
    MOCK_TEMPLATE_PUBLISHED,
]

# ===================================================================
# Template mock data -- acme tenant (cross-tenant isolation)
# ===================================================================

MOCK_ACME_TEMPLATE_PRIVATE: dict[str, Any] = {
    "id": 101,
    "templateKey": "acme-template-private",
    "version": "V1",
    "name": "Acme Private Template",
    "description": "Private template owned by Acme Corp",
    "tags": ["acme", "internal"],
    "category": "Internal",
    "tenantId": "acme",
    "visibility": "PRIVATE",
    "files": [{"fileType": "bpmn", "fileName": "acme-private.bpmn"}],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700100000,
    "createdBy": "acme-admin",
    "updatedAtInSeconds": 1700100000,
    "modifiedBy": "acme-admin",
}

MOCK_ACME_TEMPLATE_TENANT: dict[str, Any] = {
    "id": 102,
    "templateKey": "acme-template-tenant",
    "version": "V1",
    "name": "Acme Tenant Template",
    "description": "Tenant-wide template shared within Acme Corp",
    "tags": ["acme", "shared"],
    "category": "Acme Shared",
    "tenantId": "acme",
    "visibility": "TENANT",
    "files": [{"fileType": "bpmn", "fileName": "acme-shared.bpmn"}],
    "isPublished": False,
    "status": "DRAFT",
    "createdAtInSeconds": 1700101000,
    "createdBy": "acme-admin",
    "updatedAtInSeconds": 1700101000,
    "modifiedBy": "acme-admin",
}

MOCK_ACME_TEMPLATE_PUBLIC: dict[str, Any] = {
    "id": 103,
    "templateKey": "acme-template-public",
    "version": "V1",
    "name": "Acme Public Template",
    "description": "Public template from Acme Corp visible to all tenants",
    "tags": ["acme", "public"],
    "category": "Acme Public",
    "tenantId": "acme",
    "visibility": "PUBLIC",
    "files": [{"fileType": "bpmn", "fileName": "acme-public.bpmn"}],
    "isPublished": True,
    "status": "PUBLISHED",
    "createdAtInSeconds": 1700102000,
    "createdBy": "acme-admin",
    "updatedAtInSeconds": 1700102000,
    "modifiedBy": "acme-admin",
}

ALL_ACME_TEMPLATES: list[dict[str, Any]] = [
    MOCK_ACME_TEMPLATE_PRIVATE,
    MOCK_ACME_TEMPLATE_TENANT,
    MOCK_ACME_TEMPLATE_PUBLIC,
]

# What an m8flow user would see: own templates + PUBLIC from acme
M8FLOW_USER_VISIBLE_TEMPLATES: list[dict[str, Any]] = [
    MOCK_TEMPLATE_PRIVATE,
    MOCK_TEMPLATE_TENANT,
    MOCK_TEMPLATE_PUBLIC,
    MOCK_TEMPLATE_PUBLISHED,
    MOCK_ACME_TEMPLATE_PUBLIC,
]

# ===================================================================
# Tenant mock data
# ===================================================================

MOCK_TENANT_M8FLOW: dict[str, Any] = {
    "id": "t-m8flow-001",
    "name": "M8Flow",
    "slug": "m8flow",
    "status": "ACTIVE",
    "createdBy": "super-admin",
    "modifiedBy": "super-admin",
    "createdAtInSeconds": 1699000000,
    "updatedAtInSeconds": 1699000000,
}

MOCK_TENANT_ACME: dict[str, Any] = {
    "id": "t-acme-001",
    "name": "Acme Corp",
    "slug": "acme",
    "status": "ACTIVE",
    "createdBy": "super-admin",
    "modifiedBy": "super-admin",
    "createdAtInSeconds": 1699500000,
    "updatedAtInSeconds": 1699500000,
}

MOCK_TENANT_INACTIVE: dict[str, Any] = {
    "id": "t-old-001",
    "name": "Old Company",
    "slug": "old-company",
    "status": "INACTIVE",
    "createdBy": "super-admin",
    "modifiedBy": "super-admin",
    "createdAtInSeconds": 1698000000,
    "updatedAtInSeconds": 1698500000,
}

ALL_MOCK_TENANTS: list[dict[str, Any]] = [
    MOCK_TENANT_M8FLOW,
    MOCK_TENANT_ACME,
    MOCK_TENANT_INACTIVE,
]

# ===================================================================
# Process group mock data
# ===================================================================

MOCK_PROCESS_GROUP: dict[str, Any] = {
    "id": "test-group",
    "display_name": "Test Process Group",
    "description": "A test process group for E2E tests",
    "process_models": [],
    "process_groups": [],
}

MOCK_PROCESS_GROUP_HR: dict[str, Any] = {
    "id": "hr-processes",
    "display_name": "HR Processes",
    "description": "Human Resources process group",
    "process_models": [],
    "process_groups": [],
}

ALL_MOCK_PROCESS_GROUPS: list[dict[str, Any]] = [
    MOCK_PROCESS_GROUP,
    MOCK_PROCESS_GROUP_HR,
]

# ===================================================================
# Pagination helper
# ===================================================================

DEFAULT_PAGINATION: dict[str, Any] = {
    "count": 0,
    "page": 1,
    "pages": 1,
    "per_page": 10,
    "total": 0,
}


def _make_pagination(items: list[Any]) -> dict[str, Any]:
    return {
        **DEFAULT_PAGINATION,
        "count": len(items),
        "total": len(items),
    }


# ===================================================================
# Internal helpers
# ===================================================================

_TEMPLATE_DETAIL_RE = re.compile(r"/v1\.0/m8flow/templates/(\d+)(?:\?|$)")
_TENANT_DETAIL_RE = re.compile(r"/v1\.0/m8flow/tenants/([^/?]+)(?:\?|$)")


def _json_response(route: Route, body: Any, status: int = 200) -> None:
    route.fulfill(
        status=status,
        content_type="application/json",
        body=json.dumps(body),
    )


def _filter_templates(
    templates: list[dict[str, Any]], url: str
) -> list[dict[str, Any]]:
    """Apply query-param filters that the gallery page sends."""
    qs = parse_qs(urlparse(url).query)
    result = list(templates)

    if "visibility" in qs:
        vis = qs["visibility"][0].upper()
        result = [t for t in result if t["visibility"] == vis]

    if "search" in qs:
        term = qs["search"][0].lower()
        result = [
            t
            for t in result
            if term in t["name"].lower()
            or term in (t.get("description") or "").lower()
        ]

    if "category" in qs:
        cat = qs["category"][0]
        result = [t for t in result if t.get("category") == cat]

    if "template_key" in qs:
        key = qs["template_key"][0]
        result = [t for t in result if t["templateKey"] == key]

    if "published_only" in qs and qs["published_only"][0].lower() == "true":
        result = [t for t in result if t.get("isPublished")]

    return result


def _filter_tenants(
    tenants: list[dict[str, Any]], url: str
) -> list[dict[str, Any]]:
    """Apply query-param / search filtering for the tenant list."""
    qs = parse_qs(urlparse(url).query)
    result = list(tenants)

    if "search" in qs:
        term = qs["search"][0].lower()
        result = [
            t
            for t in result
            if term in t["name"].lower() or term in t["slug"].lower()
        ]

    return result


# ===================================================================
# Template mocking
# ===================================================================


def mock_template_gallery(
    page: Page,
    templates: list[dict[str, Any]] | None = None,
) -> None:
    """Intercept GET /v1.0/m8flow/templates (list endpoint) only."""
    source = templates if templates is not None else ALL_MOCK_TEMPLATES

    def _handle_list(route: Route) -> None:
        url = route.request.url
        if _TEMPLATE_DETAIL_RE.search(url):
            route.fallback()
            return

        filtered = _filter_templates(source, url)
        _json_response(route, {
            "results": filtered,
            "pagination": _make_pagination(filtered),
        })

    page.route("**/v1.0/m8flow/templates*", _handle_list)


def mock_template_detail(
    page: Page,
    template: dict[str, Any] | None = None,
    all_versions: list[dict[str, Any]] | None = None,
) -> None:
    """Intercept GET/PUT /v1.0/m8flow/templates/<id> (detail endpoint)."""
    tpl = template if template is not None else MOCK_TEMPLATE_PRIVATE
    versions = all_versions if all_versions is not None else [tpl]

    def _handle_detail(route: Route) -> None:
        url = route.request.url
        method = route.request.method

        m = _TEMPLATE_DETAIL_RE.search(url)
        if not m:
            route.fallback()
            return

        if method == "GET":
            if "template_key" in url:
                _json_response(route, {"results": versions})
            else:
                _json_response(route, tpl)
        elif method == "PUT":
            body = route.request.post_data
            updates = json.loads(body) if body else {}
            updated = {**tpl, **updates}
            if updates.get("is_published"):
                updated["isPublished"] = True
                updated["status"] = "PUBLISHED"
            _json_response(route, updated)
        else:
            route.fallback()

    page.route("**/v1.0/m8flow/templates/*", _handle_detail)


def mock_template_api(
    page: Page,
    templates: list[dict[str, Any]] | None = None,
    template_detail: dict[str, Any] | None = None,
    all_versions: list[dict[str, Any]] | None = None,
) -> None:
    """Set up all template API route interceptors at once."""
    mock_template_detail(page, template_detail, all_versions)
    mock_template_gallery(page, templates)


# ===================================================================
# Tenant mocking
# ===================================================================


def mock_tenants_api(
    page: Page,
    tenants: list[dict[str, Any]] | None = None,
) -> None:
    """Intercept GET/PUT/DELETE /v1.0/m8flow/tenants endpoints."""
    source = tenants if tenants is not None else ALL_MOCK_TENANTS
    tenant_map = {t["id"]: copy.deepcopy(t) for t in source}

    def _handle_tenant_detail(route: Route) -> None:
        url = route.request.url
        method = route.request.method

        m = _TENANT_DETAIL_RE.search(url)
        if not m:
            route.fallback()
            return

        tenant_id = m.group(1)
        tenant = tenant_map.get(tenant_id)

        if method == "GET":
            if tenant:
                _json_response(route, tenant)
            else:
                _json_response(route, {"message": "Tenant not found"}, status=404)
        elif method == "PUT":
            if not tenant:
                _json_response(route, {"message": "Tenant not found"}, status=404)
                return
            body = route.request.post_data
            updates = json.loads(body) if body else {}
            tenant.update(updates)
            _json_response(route, tenant)
        elif method == "DELETE":
            if tenant:
                tenant["status"] = "DELETED"
                _json_response(route, None, status=204)
            else:
                _json_response(route, {"message": "Tenant not found"}, status=404)
        else:
            route.fallback()

    def _handle_tenant_list(route: Route) -> None:
        url = route.request.url
        if _TENANT_DETAIL_RE.search(url):
            route.fallback()
            return

        active = [t for t in tenant_map.values() if t["status"] != "DELETED"]
        filtered = _filter_tenants(active, url)
        _json_response(route, filtered)

    page.route("**/v1.0/m8flow/tenants/*", _handle_tenant_detail)
    page.route("**/v1.0/m8flow/tenants*", _handle_tenant_list)


# ===================================================================
# Process group mocking
# ===================================================================


def mock_process_groups_api(
    page: Page,
    groups: list[dict[str, Any]] | None = None,
) -> None:
    """Intercept GET /process-groups (API fetch only, not page navigation)."""
    source = groups if groups is not None else ALL_MOCK_PROCESS_GROUPS

    def _handle_groups(route: Route) -> None:
        if route.request.resource_type == "document":
            route.fallback()
            return
        _json_response(route, {
            "results": source,
            "pagination": _make_pagination(source),
        })

    page.route("**/process-groups*", _handle_groups)


# ===================================================================
# Permissions mocking
# ===================================================================

_SAMPLE_BPMN = (
    '<?xml version="1.0" encoding="UTF-8"?>'
    '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">'
    "<bpmn:process id=\"Process_1\" isExecutable=\"true\">"
    '<bpmn:startEvent id="Start"/>'
    "</bpmn:process>"
    "</bpmn:definitions>"
)

_SAMPLE_FORM_JSON = json.dumps({
    "title": "Mock Form",
    "components": [{"type": "textfield", "key": "name", "label": "Name"}],
})


def mock_permissions_api(page: Page) -> None:
    """Intercept POST /v1.0/permissions-check and grant all requested permissions."""

    def _handle(route: Route) -> None:
        body = route.request.post_data
        if body:
            data = json.loads(body)
            reqs = data.get("requests_to_check", {})
            results: dict[str, Any] = {}
            for url, methods in reqs.items():
                if isinstance(methods, dict):
                    results[url] = {m: True for m in methods}
                elif isinstance(methods, list):
                    results[url] = {m: True for m in methods}
                else:
                    results[url] = methods
            _json_response(route, {"results": results})
        else:
            _json_response(route, {"results": {}})

    page.route("**/permissions-check*", _handle)


# ===================================================================
# Template export mocking
# ===================================================================

_EMPTY_ZIP = b"PK\x05\x06" + b"\x00" * 18


def mock_template_export_api(page: Page) -> None:
    """Intercept GET /v1.0/m8flow/templates/<id>/export and return a ZIP blob."""

    def _handle(route: Route) -> None:
        route.fulfill(
            status=200,
            content_type="application/zip",
            body=_EMPTY_ZIP,
            headers={
                "Content-Disposition": 'attachment; filename="template-export.zip"',
            },
        )

    page.route("**/v1.0/m8flow/templates/*/export", _handle)


# ===================================================================
# Viewer-specific permissions mocking
# ===================================================================


def mock_viewer_permissions_api(page: Page) -> None:
    """Like mock_permissions_api but denies PUT on template URLs."""

    def _handle(route: Route) -> None:
        body = route.request.post_data
        if body:
            data = json.loads(body)
            reqs = data.get("requests_to_check", {})
            results: dict[str, Any] = {}
            for url, methods in reqs.items():
                if isinstance(methods, dict):
                    results[url] = {
                        m: ("templates" not in url or m != "PUT")
                        for m in methods
                    }
                elif isinstance(methods, list):
                    results[url] = {
                        m: ("templates" not in url or m != "PUT")
                        for m in methods
                    }
                else:
                    results[url] = methods
            _json_response(route, {"results": results})
        else:
            _json_response(route, {"results": {}})

    page.route("**/permissions-check*", _handle)


# ===================================================================
# Template file content mocking
# ===================================================================


def mock_template_files_api(page: Page) -> None:
    """Intercept GET /v1.0/m8flow/templates/<id>/files/<filename>."""

    def _handle_file(route: Route) -> None:
        url = route.request.url
        if url.endswith(".bpmn") or url.endswith(".dmn"):
            route.fulfill(
                status=200,
                content_type="application/xml",
                body=_SAMPLE_BPMN,
            )
        else:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=_SAMPLE_FORM_JSON,
            )

    page.route("**/v1.0/m8flow/templates/*/files/*", _handle_file)


# ===================================================================
# Process model creation mocking
# ===================================================================


def mock_create_process_model_api(page: Page) -> None:
    """Intercept POST /v1.0/m8flow/templates/<id>/create-process-model."""

    def _handle(route: Route) -> None:
        if route.request.method != "POST":
            route.fallback()
            return

        body = json.loads(route.request.post_data or "{}")
        group_id = body.get("process_group_id", "unknown-group")
        model_id = body.get("process_model_id", "unknown-model")
        full_id = f"{group_id}/{model_id}"

        _json_response(route, {
            "process_model": {
                "id": full_id,
                "display_name": body.get("display_name", ""),
            },
            "template_info": {
                "id": 1,
                "process_model_identifier": full_id,
                "source_template_id": 1,
                "source_template_key": "test-template-private",
                "source_template_version": "V1",
                "source_template_name": "Private Test Template",
                "m8f_tenant_id": "m8flow",
                "created_by": "admin",
                "created_at_in_seconds": 1700000000,
                "updated_at_in_seconds": 1700000000,
            },
        })

    page.route("**/v1.0/m8flow/templates/*/create-process-model", _handle)


# ===================================================================
# Combined mocking
# ===================================================================


def mock_all_apis(
    page: Page,
    templates: list[dict[str, Any]] | None = None,
    template_detail: dict[str, Any] | None = None,
    all_versions: list[dict[str, Any]] | None = None,
    tenants: list[dict[str, Any]] | None = None,
    process_groups: list[dict[str, Any]] | None = None,
) -> None:
    """Set up route interceptors for templates, tenants, process groups, and permissions."""
    mock_permissions_api(page)
    mock_template_api(page, templates, template_detail, all_versions)
    mock_template_files_api(page)
    mock_template_export_api(page)
    mock_tenants_api(page, tenants)
    mock_process_groups_api(page, process_groups)
    mock_create_process_model_api(page)


# ===================================================================
# Utilities
# ===================================================================


def make_template(overrides: dict[str, Any] | None = None) -> dict[str, Any]:
    """Create a copy of MOCK_TEMPLATE_PRIVATE with optional overrides."""
    tpl = copy.deepcopy(MOCK_TEMPLATE_PRIVATE)
    if overrides:
        tpl.update(overrides)
    return tpl


def make_tenant(overrides: dict[str, Any] | None = None) -> dict[str, Any]:
    """Create a copy of MOCK_TENANT_M8FLOW with optional overrides."""
    tpl = copy.deepcopy(MOCK_TENANT_M8FLOW)
    if overrides:
        tpl.update(overrides)
    return tpl


def generate_templates(count: int = 15) -> list[dict[str, Any]]:
    """Generate *count* unique mock templates for pagination tests."""
    return [
        make_template({
            "id": 1000 + i,
            "templateKey": f"gen-template-{i}",
            "name": f"Generated Template {i}",
            "description": f"Auto-generated template #{i}",
            "category": "Generated",
        })
        for i in range(count)
    ]
