#!/bin/bash
# Quick deployment script for VPS
# Usage: ./deploy.sh

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to project root directory
cd "$SCRIPT_DIR"

echo "🚀 Starting deployment..."
echo "📁 Working directory: $(pwd)"

# Verify we're in the correct directory
if [ ! -d "apps/api" ] || [ ! -d "apps/web" ]; then
    echo "❌ Error: apps/api or apps/web directory not found!"
    echo "   Make sure you're running this script from the project root."
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing API dependencies..."
cd apps/api
npm install
cd "$SCRIPT_DIR"

echo "📦 Installing Web dependencies..."
cd apps/web
npm install
cd "$SCRIPT_DIR"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd apps/api
npm run prisma:generate
cd "$SCRIPT_DIR"

# Build API
echo "🔨 Building API..."
cd apps/api
npm run build
cd "$SCRIPT_DIR"

# Build Frontend
echo "🔨 Building Frontend..."
cd apps/web
npm run build
cd "$SCRIPT_DIR"

# Restart API (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting API..."
    pm2 restart chetana-api || pm2 start ecosystem.config.js
else
    echo "⚠️  PM2 not found, skipping API restart"
fi

# Reload Nginx (if available)
if command -v nginx &> /dev/null; then
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
else
    echo "⚠️  Nginx not found, skipping reload"
fi

echo "✅ Deployment complete!"

