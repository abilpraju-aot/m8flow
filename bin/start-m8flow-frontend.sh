#!/bin/bash

# M8Flow Frontend Startup Script
# This script starts the M8Flow frontend with proper configuration

set -e

echo "🚀 Starting M8Flow Frontend..."

# Navigate to frontend directory
cd "$(dirname "$0")/../spiffworkflow-frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if M8Flow config exists
if [ ! -f "vite.config.m8flow.ts" ]; then
    echo "❌ Error: vite.config.m8flow.ts not found!"
    echo "Run from the m8flow root directory."
    exit 1
fi

# Start with M8Flow configuration
echo "✓ Starting Vite dev server with M8Flow extensions..."
npm start -- --config vite.config.m8flow.ts

