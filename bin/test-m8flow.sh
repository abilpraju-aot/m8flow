#!/bin/bash

# M8Flow Test Runner
# Runs all M8Flow tests (frontend unit tests and extensions)

set -e

echo "🧪 Running M8Flow Tests..."

# Navigate to frontend
cd "$(dirname "$0")/../spiffworkflow-frontend"

# Run frontend tests
echo ""
echo "📋 Running frontend unit tests..."
npm test

# Run extension tests specifically
echo ""
echo "📋 Running M8Flow extension tests..."
npm test -- extensions/frontend/tests/

echo ""
echo "✓ All tests passed!"

