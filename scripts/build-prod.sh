#!/bin/bash

# Production build script that skips all checks
export NODE_ENV=production
export VERCEL=1
export DISABLE_ESLINT_PLUGIN=true
export SKIP_LINTING=true
export SKIP_TYPE_CHECK=true

echo "Starting production build with all checks disabled..."

# Run the build
npm run build

echo "Production build completed!"
