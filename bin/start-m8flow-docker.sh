#!/bin/bash

# M8Flow Docker Startup Script
# This script starts the full M8Flow stack using Docker

set -e

echo "🐳 Starting M8Flow with Docker..."

# Navigate to docker directory
cd "$(dirname "$0")/../docker"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from sample..."
    cp sample.env .env
    echo "✓ Created .env file. You may want to edit it with your settings."
fi

# Start services
echo "🚀 Starting Docker services..."
docker-compose up -d

echo ""
echo "✓ M8Flow is starting!"
echo ""
echo "Services:"
echo "  Frontend: http://localhost:7001"
echo "  Backend:  http://localhost:8000"
echo "  MySQL:    localhost:3306"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"

