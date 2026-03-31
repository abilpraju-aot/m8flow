# m8flow Browser Tests

Playwright E2E tests for the m8flow extension frontend.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python package manager)
- The m8flow frontend running at `http://localhost:7001` (or set `E2E_URL`)

## Setup

```bash
cd extensions/m8flow-frontend/test/browser
uv sync
uv run playwright install chromium
```

## Running Tests

```bash
# All tests
uv run pytest -v

# Specific test file
uv run pytest test_login.py -v

# Run headed (visible browser)
uv run pytest --headed

# Filter by keyword
uv run pytest -k "template" -v

# Against a different URL
E2E_URL=http://localhost:7001 uv run pytest -v
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `E2E_URL` | `http://localhost:7001` | Base URL of the frontend |
| `BROWSER_TEST_USERNAME` | `admin` | Login username |
| `BROWSER_TEST_PASSWORD` | `admin` | Login password |
