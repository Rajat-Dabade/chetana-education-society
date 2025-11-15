#!/bin/bash
# Quick deployment script for VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install
cd apps/api && npm install && cd ..
cd apps/web && npm install && cd ..

# Build API
echo "🔨 Building API..."
cd apps/api
npm run build
cd ../..

# Build Frontend
echo "🔨 Building Frontend..."
cd apps/web
npm run build
cd ../..

# Restart API (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting API..."
    pm2 restart chetana-api || pm2 start ecosystem.config.js
fi

# Reload Nginx (if available)
if command -v nginx &> /dev/null; then
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
fi

echo "✅ Deployment complete!"

