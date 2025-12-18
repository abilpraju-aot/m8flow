# Keycloak Docker Setup

This folder contains the Docker Compose configuration for running Keycloak locally with PostgreSQL.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your desired credentials:**
   ```bash
   # Change these values in .env
   KEYCLOAK_ADMIN_USER=admin
   KEYCLOAK_ADMIN_PASSWORD=your-secure-password
   KEYCLOAK_DB_PASSWORD=your-db-password
   ```

3. **Start Keycloak:**
   The start script will automatically create the `spiffworkflow` network if it doesn't exist.
   
   **Note:** If you run `docker-compose up -d` directly without the start script, make sure the network exists first:
   ```bash
   docker network create spiffworkflow
   ```

4. **Start Keycloak:**
   ```bash
   ./start-keycloak.sh
   ```
   Or manually:
   ```bash
   docker-compose up -d
   ```

5. **Access Keycloak Admin Console:**
   - URL: http://localhost:7002 (or your configured KEYCLOAK_PORT)
   - Username: From `KEYCLOAK_ADMIN_USER` in `.env`
   - Password: From `KEYCLOAK_ADMIN_PASSWORD` in `.env`

## Environment Variables

All configuration is done through environment variables. See `.env.example` for all available options:

- `KEYCLOAK_ADMIN_USER` - Keycloak admin username (default: admin)
- `KEYCLOAK_ADMIN_PASSWORD` - Keycloak admin password (default: admin)
- `KEYCLOAK_VERSION` - Keycloak image version (default: 26.0.7)
- `KEYCLOAK_PORT` - Keycloak web interface port (default: 7002)
- `KEYCLOAK_DB_NAME` - PostgreSQL database name (default: keycloak)
- `KEYCLOAK_DB_USER` - PostgreSQL username (default: keycloak)
- `KEYCLOAK_DB_PASSWORD` - PostgreSQL password (default: keycloak)
- `KEYCLOAK_DB_PORT` - PostgreSQL port (default: 7004)
- `KEYCLOAK_LOGLEVEL` - Logging level (default: INFO)

## Stop Keycloak

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f keycloak
docker-compose logs -f keycloak-db
```

## Reset Keycloak (removes all data)

```bash
docker-compose down -v
docker-compose up -d
```

## Configuration

The realm configuration is automatically imported from `realm-exports/spiffworkflow-local-realm.json` on initial startup. The realm will be imported if it doesn't already exist.

## Backend Configuration

To use Keycloak with the backend, set these environment variables:

```bash
export SPIFFWORKFLOW_BACKEND_AUTH_CONFIGS__0__identifier="keycloak"
export SPIFFWORKFLOW_BACKEND_AUTH_CONFIGS__0__label="Keycloak Login"
export SPIFFWORKFLOW_BACKEND_AUTH_CONFIGS__0__uri="http://localhost:7002/realms/spiffworkflow-local"
export SPIFFWORKFLOW_BACKEND_AUTH_CONFIGS__0__client_id="spiffworkflow-backend"
export SPIFFWORKFLOW_BACKEND_AUTH_CONFIGS__0__client_secret="JXeQExm0JhQPLumgHtIIqf52bDalHz0q"
```

## Security Notes

- **Never commit `.env` file to version control**
- Change default passwords in production
- Use strong passwords for `KEYCLOAK_ADMIN_PASSWORD` and `KEYCLOAK_DB_PASSWORD`
- The `.env` file is already in `.gitignore`

