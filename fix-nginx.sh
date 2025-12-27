#!/bin/bash
# Fix Nginx Configuration Issues
# Run this on your VPS to fix broken symlinks and configuration

echo "🔧 Fixing Nginx Configuration..."
echo "================================"
echo ""

# Check for broken symlinks
echo "1. Checking for broken symlinks in sites-enabled..."
BROKEN_LINKS=$(find /etc/nginx/sites-enabled -type l ! -exec test -e {} \; -print 2>/dev/null)

if [ -n "$BROKEN_LINKS" ]; then
    echo "❌ Found broken symlinks:"
    echo "$BROKEN_LINKS"
    echo ""
    echo "Removing broken symlinks..."
    find /etc/nginx/sites-enabled -type l ! -exec test -e {} \; -delete
    echo "✅ Broken symlinks removed"
else
    echo "✅ No broken symlinks found"
fi
echo ""

# Check if correct symlink exists
echo "2. Checking for correct configuration symlink..."
if [ -f "/etc/nginx/sites-available/chetana-education" ]; then
    echo "✅ Config file exists at /etc/nginx/sites-available/chetana-education"
    
    if [ -L "/etc/nginx/sites-enabled/chetana-education" ]; then
        echo "✅ Symlink already exists"
    else
        echo "⚠️  Symlink missing, creating it..."
        sudo ln -s /etc/nginx/sites-available/chetana-education /etc/nginx/sites-enabled/chetana-education
        echo "✅ Symlink created"
    fi
else
    echo "❌ Config file NOT found at /etc/nginx/sites-available/chetana-education"
    echo "   You need to create it first!"
    exit 1
fi
echo ""

# List all symlinks in sites-enabled
echo "3. Current symlinks in sites-enabled:"
ls -la /etc/nginx/sites-enabled/
echo ""

# Test nginx configuration
echo "4. Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    echo ""
    echo "5. Reloading nginx..."
    if sudo systemctl reload nginx; then
        echo "✅ Nginx reloaded successfully"
    else
        echo "❌ Failed to reload nginx"
        echo "   Try: sudo systemctl restart nginx"
    fi
else
    echo "❌ Nginx configuration still has errors"
    echo "   Please check the configuration file:"
    echo "   sudo nano /etc/nginx/sites-available/chetana-education"
    exit 1
fi
echo ""

# Test API through nginx
echo "6. Testing API through nginx..."
sleep 2
if curl -s http://localhost/api/health | grep -q "ok"; then
    echo "✅ API is working through nginx!"
    curl -s http://localhost/api/health
else
    echo "❌ API still not working through nginx"
    echo "   Check nginx error logs: sudo tail -f /var/log/nginx/error.log"
fi
echo ""

echo "================================"
echo "✅ Fix complete!"

