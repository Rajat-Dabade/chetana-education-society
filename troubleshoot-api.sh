#!/bin/bash
# API Troubleshooting Script
# Run this on your VPS to diagnose API connection issues

echo "🔍 API Troubleshooting Script"
echo "================================"
echo ""

# Check if API is running
echo "1. Checking if API is running..."
if pm2 list | grep -q "chetana-api"; then
    echo "✅ API process found in PM2"
    pm2 status chetana-api
    echo ""
    echo "📋 Recent API logs:"
    pm2 logs chetana-api --lines 20 --nostream
else
    echo "❌ API process NOT found in PM2"
    echo "   Start it with: pm2 start ecosystem.config.js"
fi
echo ""

# Check if API is listening on port 4000
echo "2. Checking if API is listening on port 4000..."
if netstat -tuln | grep -q ":4000" || ss -tuln | grep -q ":4000"; then
    echo "✅ Port 4000 is in use"
else
    echo "❌ Port 4000 is NOT in use - API might not be running"
fi
echo ""

# Test API directly
echo "3. Testing API directly (bypassing nginx)..."
if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "✅ API responds on localhost:4000"
    curl -s http://localhost:4000/api/health | head -5
else
    echo "❌ API does NOT respond on localhost:4000"
    echo "   The API server might not be running"
fi
echo ""

# Check nginx configuration
echo "4. Checking nginx configuration..."
if [ -f /etc/nginx/sites-available/chetana-education ]; then
    echo "✅ Nginx config file exists"
    echo ""
    echo "📋 API proxy configuration:"
    grep -A 15 "location /api" /etc/nginx/sites-available/chetana-education || echo "❌ No /api location block found!"
else
    echo "❌ Nginx config file NOT found at /etc/nginx/sites-available/chetana-education"
fi
echo ""

# Test nginx configuration
echo "5. Testing nginx configuration..."
if sudo nginx -t 2>&1; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors!"
fi
echo ""

# Check nginx status
echo "6. Checking nginx status..."
sudo systemctl status nginx --no-pager -l | head -10
echo ""

# Test API through nginx
echo "7. Testing API through nginx..."
if curl -s http://localhost/api/health > /dev/null; then
    echo "✅ API responds through nginx"
    curl -s http://localhost/api/health | head -5
else
    echo "❌ API does NOT respond through nginx"
    echo "   Check nginx error logs: sudo tail -f /var/log/nginx/error.log"
fi
echo ""

# Check nginx error logs
echo "8. Recent nginx errors (last 10 lines):"
sudo tail -10 /var/log/nginx/error.log 2>/dev/null || echo "No error log found"
echo ""

echo "================================"
echo "✅ Troubleshooting complete!"
echo ""
echo "Common fixes:"
echo "1. If API not running: pm2 start ecosystem.config.js"
echo "2. If nginx config wrong: sudo nano /etc/nginx/sites-available/chetana-education"
echo "3. If nginx not proxying: Check 'location /api' block has 'proxy_pass http://localhost:4000;'"
echo "4. After fixing: sudo nginx -t && sudo systemctl reload nginx"

