#!/bin/bash
set -e

echo "🔧 Starting Vercel build process..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Navigate to web directory and build
echo "🏗️ Building frontend..."
if [ -d "apps/web" ]; then
  cd apps/web
  npm install
  npm run build
  echo "✅ Frontend build completed!"
else
  echo "❌ apps/web directory not found!"
  ls -la
  exit 1
fi
