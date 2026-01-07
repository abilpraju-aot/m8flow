# M8Flow Docker Configuration

Docker setup for local development and production deployment of M8Flow.

## Quick Start

### Development Mode

1. **Copy environment file:**
   ```bash
   cp sample.env .env
   ```

2. **Start services:**
   ```bash
   docker-compose up
   ```

3. **Access the application:**
   - Frontend: http://localhost:7001
   - Backend: http://localhost:8000

### Production Mode

1. **Build production images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Services

### Development Services

- **mysql** - MySQL 8.0 database
- **backend** - SpiffArena backend with M8Flow extensions
- **frontend** - React frontend with M8Flow UI extensions

### Production Services

- **backend** - Production backend with Gunicorn
- **frontend** - Production frontend with Nginx

## Configuration

### Environment Variables

See `sample.env` for available configuration options.

Key variables:
- `M8FLOW_ENABLE_MULTI_TENANCY` - Enable multi-tenancy features
- `M8FLOW_ENABLE_INTEGRATIONS` - Enable advanced integrations
- `MYSQL_PASSWORD` - Database password
- `BACKEND_PORT` - Backend port (default: 8000)
- `FRONTEND_PORT` - Frontend port (default: 7001)

### Volume Mounts

Development mode mounts source directories for hot reload:
- `spiffworkflow-frontend/src` - Frontend source
- `extensions/frontend` - M8Flow extensions
- `integration/frontend` - Integration layer

## Common Tasks

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

### Restart Services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart frontend
```

### Stop Services

```bash
docker-compose down
```

### Clean Up

```bash
# Stop and remove containers, networks
docker-compose down

# Also remove volumes (WARNING: deletes database)
docker-compose down -v
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh

# MySQL shell
docker-compose exec mysql mysql -u spiffuser -p
```

### Run Tests

```bash
# Backend tests
docker-compose exec backend poetry run pytest

# Frontend tests
docker-compose exec frontend npm test
```

## Development Workflow

### Making Frontend Changes

1. Edit files in `extensions/frontend/` or `spiffworkflow-frontend/src/`
2. Changes auto-reload in browser (Vite HMR)
3. Test your changes at http://localhost:7001

### Making Backend Changes

1. Edit files in `extensions/backend/` or `spiffworkflow-backend/src/`
2. Restart backend service:
   ```bash
   docker-compose restart backend
   ```
3. Test your changes via API at http://localhost:8000

### Database Migrations

```bash
# Generate migration
docker-compose exec backend poetry run alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend poetry run alembic upgrade head

# Rollback migration
docker-compose exec backend poetry run alembic downgrade -1
```

## Troubleshooting

### Port Already in Use

If ports 7001 or 8000 are already in use:

1. Edit `.env` file:
   ```
   FRONTEND_PORT=3000
   BACKEND_PORT=5000
   ```

2. Restart services:
   ```bash
   docker-compose down
   docker-compose up
   ```

### Database Connection Errors

1. Check MySQL is running:
   ```bash
   docker-compose ps mysql
   ```

2. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

3. Wait for health check to pass (may take 30-60 seconds)

### Extension Not Loading

1. Check volume mounts:
   ```bash
   docker-compose config
   ```

2. Verify files are mounted:
   ```bash
   docker-compose exec frontend ls -la /app/extensions/frontend
   ```

3. Check logs for errors:
   ```bash
   docker-compose logs -f frontend
   ```

### Frontend Build Errors

1. Clear npm cache:
   ```bash
   docker-compose exec frontend npm cache clean --force
   ```

2. Reinstall dependencies:
   ```bash
   docker-compose exec frontend npm install
   ```

3. Rebuild container:
   ```bash
   docker-compose build --no-cache frontend
   docker-compose up frontend
   ```

## Production Deployment

### Build Production Images

```bash
docker-compose -f docker-compose.prod.yml build
```

### Push to Registry

```bash
# Tag images
docker tag m8flow-backend:latest your-registry/m8flow-backend:latest
docker tag m8flow-frontend:latest your-registry/m8flow-frontend:latest

# Push images
docker push your-registry/m8flow-backend:latest
docker push your-registry/m8flow-frontend:latest
```

### Deploy to Server

```bash
# On server
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps
```

Health check endpoints:
- Backend: http://localhost:8000/v1.0/status
- Frontend: http://localhost:7001/health

## Performance Tuning

### Production Settings

Edit `docker-compose.prod.yml`:

```yaml
backend:
  command: gunicorn --bind 0.0.0.0:8000 --workers 4 --timeout 120 app:app
  # Adjust workers based on CPU cores (2-4 x cores)
```

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## Security

### Production Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Use HTTPS (configure reverse proxy)
- [ ] Enable authentication (configure OIDC)
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs

### Secrets Management

For production, use Docker secrets or external secrets manager:

```bash
# Create secret
echo "supersecretpassword" | docker secret create db_password -

# Use in docker-compose.yml
secrets:
  db_password:
    external: true
```

## Backup and Restore

### Backup Database

```bash
docker-compose exec mysql mysqldump -u spiffuser -p spiffworkflow > backup.sql
```

### Restore Database

```bash
docker-compose exec -T mysql mysql -u spiffuser -p spiffworkflow < backup.sql
```

## Next Steps

- [Docker Development Guide](../docs/getting-started/docker-development.md)
- [Deployment Guide](../docs/getting-started/deployment.md)
- [Frontend Development Guide](../docs/getting-started/frontend-development.md)

