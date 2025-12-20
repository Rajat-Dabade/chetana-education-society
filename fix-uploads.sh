#!/bin/bash
# Quick fix script for uploads 404 error
# Run this on your VPS: bash fix-uploads.sh

echo "🔧 Fixing uploads directory and nginx configuration..."

# 1. Ensure uploads directory exists
echo "📁 Creating uploads directory..."
mkdir -p /var/www/chetana-education-society/apps/api/uploads

# 2. Fix permissions (nginx runs as www-data)
echo "🔐 Fixing permissions..."
sudo chown -R www-data:www-data /var/www/chetana-education-society/apps/api/uploads
sudo chmod -R 755 /var/www/chetana-education-society/apps/api/uploads

# 3. Update nginx config
echo "📝 Updating nginx configuration..."
NGINX_CONFIG="/etc/nginx/sites-available/chetana-education"

# Backup current config
sudo cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"

# Check if config needs updating
if ! grep -q "location /uploads/" "$NGINX_CONFIG"; then
    echo "⚠️  Nginx config needs updating. Please update it manually:"
    echo "   sudo nano $NGINX_CONFIG"
    echo ""
    echo "   Replace the /uploads location block with:"
    echo ""
    echo "   location /uploads/ {"
    echo "       alias /var/www/chetana-education-society/apps/api/uploads/;"
    echo "       expires 30d;"
    echo "       add_header Cache-Control \"public\";"
    echo "       access_log off;"
    echo "   }"
    echo ""
    echo "   location = /uploads {"
    echo "       return 301 /uploads/;"
    echo "   }"
    echo ""
    echo "   Then run: sudo nginx -t && sudo systemctl reload nginx"
else
    echo "✅ Nginx config looks good"
fi

# 4. Test nginx
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx config has errors. Please fix them first."
    exit 1
fi

# 5. Verify files
echo ""
echo "📋 Current uploads directory contents:"
ls -lah /var/www/chetana-education-society/apps/api/uploads/

echo ""
echo "✅ Fix complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Try accessing an uploaded image: http://YOUR_IP/uploads/FILENAME.png"
echo "   2. Check nginx error logs if still failing: sudo tail -f /var/log/nginx/error.log"
echo "   3. Verify file exists: ls -la /var/www/chetana-education-society/apps/api/uploads/"

