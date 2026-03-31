"""Centralized configuration for all browser tests.

Every configurable value (URLs, credentials, timeouts, browser settings)
lives here so test files and helpers can ``from helpers.config import ...``
instead of scattering env lookups and magic numbers.
"""
import os

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
BASE_URL = os.getenv("E2E_URL", "http://localhost:7001")

# ---------------------------------------------------------------------------
# Default login (tenant-admin)
# ---------------------------------------------------------------------------
DEFAULT_USERNAME = os.getenv("BROWSER_TEST_USERNAME", "admin")
DEFAULT_PASSWORD = os.getenv("BROWSER_TEST_PASSWORD", "admin")
DEFAULT_TENANT = os.getenv("BROWSER_TEST_TENANT", "m8flow")

# ---------------------------------------------------------------------------
# Role credentials
# ---------------------------------------------------------------------------
ROLE_PASSWORD = os.getenv("BROWSER_TEST_ROLE_PASSWORD", "aot123")
SUPER_ADMIN_USERNAME = os.getenv("BROWSER_TEST_SUPER_ADMIN_USERNAME", "super-admin")
SUPER_ADMIN_PASSWORD = os.getenv("BROWSER_TEST_SUPER_ADMIN_PASSWORD", ROLE_PASSWORD)

ROLE_USERS = {
    "editor": {"username": "editor", "password": ROLE_PASSWORD},
    "viewer": {"username": "viewer", "password": ROLE_PASSWORD},
    "reviewer": {"username": "reviewer", "password": ROLE_PASSWORD},
}

# ---------------------------------------------------------------------------
# Timeouts (milliseconds)
# ---------------------------------------------------------------------------
KC_TIMEOUT = 30_000
POST_LOGIN_TIMEOUT = 30_000
APP_READY_TIMEOUT = 30_000
NAV_TIMEOUT = 45_000
PAGE_DATA_TIMEOUT = 15_000
ELEMENT_TIMEOUT = 10_000
SHORT_TIMEOUT = 5_000

# ---------------------------------------------------------------------------
# Retry
# ---------------------------------------------------------------------------
MAX_LOGIN_ATTEMPTS = 2

# ---------------------------------------------------------------------------
# Browser context
# ---------------------------------------------------------------------------
VIEWPORT = {"width": 1280, "height": 720}
