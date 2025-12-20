# 🚀 Deployment Guide for Hostinger VPS

Complete step-by-step guide to deploy your NGO website on Hostinger VPS.

## 📋 Prerequisites

- Hostinger VPS with root/SSH access
- VPS IP address (or domain name if you have one)
- Basic knowledge of Linux commands

> **Note:** You can deploy using your VPS IP address. You can add a domain later and update the configuration.

---

## 🔧 Step 1: Initial Server Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh root@your-domain.com
```

### 1.2 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Required Software

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install Build Tools (for native modules)
sudo apt install -y build-essential

# Verify installations
node --version  # Should show v20.x.x
npm --version
psql --version
nginx -v
pm2 --version
```

---

## 🗄️ Step 2: Database Setup (PostgreSQL)

### 2.1 Create PostgreSQL Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE chetana_education;
CREATE USER chetana_user WITH PASSWORD 'your_secure_password_here';

# Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE chetana_education TO chetana_user;

# Grant schema permissions (important for Prisma)
\c chetana_education
GRANT ALL ON SCHEMA public TO chetana_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chetana_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chetana_user;

# Make the user the owner of the schema (alternative approach)
ALTER SCHEMA public OWNER TO chetana_user;

\q
```

**If you already created the user and getting permission errors, run:**

```bash
sudo -u postgres psql -d chetana_education

# Then run:
GRANT ALL ON SCHEMA public TO chetana_user;
ALTER SCHEMA public OWNER TO chetana_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO chetana_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO chetana_user;
\q
```

### 2.2 Update Prisma Schema for PostgreSQL

**Important:** Change the database provider in `apps/api/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 📦 Step 3: Clone and Setup Project

### 3.1 Create Application Directory

```bash
mkdir -p /var/www
cd /var/www
```

### 3.2 Clone Repository

**Option 1: Using Personal Access Token (Recommended for VPS)**

1. **Create a GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: "VPS Deployment"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Clone using token:**
   ```bash
   git clone https://YOUR_TOKEN@github.com/Rajat-Dabade/chetana-education-society.git
   cd chetana-education-society
   ```
   Replace `YOUR_TOKEN` with your actual token.

**Option 2: Using SSH Keys (More Secure)**

1. **Generate SSH key on VPS:**
   ```bash
   ssh-keygen -t ed25519 -C "vps-deployment"
   # Press Enter to accept default location
   # Press Enter twice for no passphrase (or set one)
   ```

2. **Copy public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the entire output
   ```

3. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "VPS Server"
   - Paste your public key
   - Click "Add SSH key"

4. **Clone using SSH:**
   ```bash
   git clone git@github.com:Rajat-Dabade/chetana-education-society.git
   cd chetana-education-society
   ```

**Option 3: Clone Publicly (If repository is public)**

If your repository is public, you can clone without authentication:
```bash
git clone https://github.com/Rajat-Dabade/chetana-education-society.git
cd chetana-education-society
```

### 3.3 Install Dependencies

```bash
# Install root dependencies
npm install

# Install API dependencies
cd apps/api
npm install

# Install Web dependencies
cd ../web
npm install
cd ../..
```

---

## 🔐 Step 4: Environment Variables

### 4.1 Create API Environment File

```bash
cd /var/www/chetana-education-society/apps/api
nano .env
```

Add the following content:

**If using IP address (no domain yet):**
```env
# Database
DATABASE_URL="postgresql://chetana_user:your_secure_password_here@localhost:5432/chetana_education?schema=public"

# JWT Secret (generate a strong random string)
JWT_SECRET="your_super_secret_jwt_key_here_generate_random_string"

# Server
NODE_ENV=production
PORT=4000

# CORS (use your VPS IP address)
FRONTEND_URL=http://YOUR_VPS_IP_ADDRESS
# Example: FRONTEND_URL=http://123.45.67.89
```

**If using domain:**
```env
# Database
DATABASE_URL="postgresql://chetana_user:your_secure_password_here@localhost:5432/chetana_education?schema=public"

# JWT Secret (generate a strong random string)
JWT_SECRET="your_super_secret_jwt_key_here_generate_random_string"

# Server
NODE_ENV=production
PORT=4000

# CORS (your domain)
FRONTEND_URL=https://yourdomain.com
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### 4.2 Create Web Environment File

```bash
cd /var/www/chetana-education-society/apps/web
nano .env
```

Add:

**If using IP address (no domain yet):**
```env
VITE_API_URL=http://YOUR_VPS_IP_ADDRESS/api
# Example: VITE_API_URL=http://123.45.67.89/api
```

**If using domain:**
```env
VITE_API_URL=https://yourdomain.com/api
```

> **Note:** Replace `YOUR_VPS_IP_ADDRESS` with your actual VPS IP (e.g., `123.45.67.89`)

---

## 🏗️ Step 5: Build and Setup Database

### 5.1 Update Prisma Schema for PostgreSQL

```bash
cd /var/www/chetana-education-society/apps/api
# Edit prisma/schema.prisma and change provider to "postgresql"
nano prisma/schema.prisma
```

### 5.2 Generate Prisma Client and Push Schema

```bash
cd /var/www/chetana-education-society/apps/api
npm run prisma:generate
npx prisma db push
```

### 5.3 Seed Database

```bash
npm run seed
```

This will create:
- Admin user (admin@ngo.org / ChangeMe123!)
- Site settings with vision, mission, founder story
- Success stories (Mahi Rajarkar, Vidhi Lokhande)
- Navodaya achievers as milestones

### 5.4 Build API

```bash
cd /var/www/chetana-education-society/apps/api
npm run build
```

### 5.5 Build Frontend

```bash
cd /var/www/chetana-education-society/apps/web
npm run build
```

---

## 🚀 Step 6: Setup PM2 for API

### 6.1 Create PM2 Ecosystem File

```bash
cd /var/www/chetana-education-society
nano ecosystem.config.js
```

Add:

```javascript
module.exports = {
  apps: [{
    name: 'chetana-api',
    script: './apps/api/dist/index.js',
    cwd: '/var/www/chetana-education-society',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/api-error.log',
    out_file: './logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

### 6.2 Create Logs and Uploads Directories

```bash
# Create logs directory
mkdir -p /var/www/chetana-education-society/logs

# Create uploads directory with proper permissions
mkdir -p /var/www/chetana-education-society/apps/api/uploads
chmod 755 /var/www/chetana-education-society/apps/api/uploads
chown -R $USER:$USER /var/www/chetana-education-society/apps/api/uploads
```

### 6.3 Start API with PM2

```bash
cd /var/www/chetana-education-society
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the command it outputs to enable PM2 on system boot
```

### 6.4 Verify API is Running

```bash
pm2 status
pm2 logs chetana-api
curl http://localhost:4000/api/health
```

---

## 🌐 Step 7: Configure Nginx

### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/chetana-education
```

Add:

**If using IP address (no domain yet):**
```nginx
# Frontend and API Server (using IP address)
server {
    listen 80;
    server_name YOUR_VPS_IP_ADDRESS;  # Replace with your actual IP, e.g., 123.45.67.89

    root /var/www/chetana-education-society/apps/web/dist;
    index index.html;

    # Serve uploaded files (MUST come FIRST - before regex locations)
    # This prefix location takes precedence over regex locations
    location ^~ /uploads/ {
        alias /var/www/chetana-education-society/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }
    
    # Handle /uploads without trailing slash
    location = /uploads {
        return 301 /uploads/;
    }

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (won't match /uploads/ because of ^~ above)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for file uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        # Increase body size for file uploads
        client_max_body_size 50M;
    }
}
```

**If using domain:**
```nginx
# API Server (Backend)
server {
    listen 80;
    server_name api.yourdomain.com;  # or yourdomain.com/api

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for file uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        # Increase body size for file uploads
        client_max_body_size 50M;
    }
}

# Frontend Server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/chetana-education-society/apps/web/dist;
    index index.html;

    # Serve uploaded files (MUST come FIRST - before regex locations)
    # This prefix location takes precedence over regex locations
    location ^~ /uploads/ {
        alias /var/www/chetana-education-society/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }
    
    # Handle /uploads without trailing slash
    location = /uploads {
        return 301 /uploads/;
    }

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (won't match /uploads/ because of ^~ above)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for file uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        # Increase body size for file uploads
        client_max_body_size 50M;
    }
}
```

### 7.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/chetana-education /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Step 8: Setup SSL with Let's Encrypt (Optional - Only if you have a domain)

> **Note:** SSL certificates require a domain name. If you're using only IP address, skip this step. You can add SSL later when you get a domain.

### 8.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 8.2 Get SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# If using separate API subdomain:
sudo certbot --nginx -d api.yourdomain.com
```

### 8.3 Auto-renewal (already configured by certbot)

```bash
sudo certbot renew --dry-run
```

### 8.4 Adding Domain Later

When you get a domain name:

1. Point your domain to your VPS IP (A record)
2. Update `.env` files:
   - `apps/api/.env`: Change `FRONTEND_URL` to your domain
   - `apps/web/.env`: Change `VITE_API_URL` to your domain
3. Update Nginx config: Change `server_name` to your domain
4. Rebuild frontend: `cd apps/web && npm run build`
5. Restart services: `pm2 restart chetana-api && sudo systemctl reload nginx`
6. Run certbot to get SSL certificate

---

## 📁 Step 9: Setup File Uploads Directory

### 9.1 Create Uploads Directory

```bash
mkdir -p /var/www/chetana-education-society/apps/api/uploads
chmod 755 /var/www/chetana-education-society/apps/api/uploads
```

### 9.2 Update Nginx to Serve Uploads

> **Note:** This is already included in the Nginx config above. If you need to add it separately, add this to your server block:

```nginx
# Serve uploaded files
location /uploads {
    alias /var/www/chetana-education-society/apps/api/uploads;
    expires 30d;
    add_header Cache-Control "public";
}
```

---

## 🔄 Step 10: Updating Your Application

### Current Setup: Manual Deployment

**By default, the VPS does NOT automatically pull code from GitHub.** You need to manually pull and deploy updates.

### Option 1: Manual Deployment (Recommended for now)

When you push code to GitHub, you need to manually update the VPS:

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Navigate to project directory
cd /var/www/chetana-education-society

# Pull latest code
git pull origin main

# Run deployment script
./deploy.sh
```

Or run the commands manually:

```bash
cd /var/www/chetana-education-society
git pull origin main
npm install
cd apps/api && npm install && npm run build && cd ../..
cd apps/web && npm install && npm run build && cd ../..
pm2 restart chetana-api
sudo systemctl reload nginx
```

### Option 2: Setup Auto-Deployment with GitHub Webhook (Advanced)

For automatic deployment when you push to GitHub, you can set up a webhook:

#### 10.1 Create Deployment Script

The `deploy.sh` script should already exist. If not, create it:

```bash
cd /var/www/chetana-education-society
nano deploy.sh
```

Add:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
# If using token: git pull https://YOUR_TOKEN@github.com/Rajat-Dabade/chetana-education-society.git main
# If using SSH: git pull origin main
git pull origin main

# Install dependencies
npm install
cd apps/api && npm install && cd ..
cd apps/web && npm install && cd ..

# Generate Prisma client
npm run prisma:generate

# Build API
cd apps/api
npm run build
cd ../..

# Build Frontend
cd apps/web
npm run build
cd ../..

# Restart API
pm2 restart chetana-api

# Reload Nginx
sudo systemctl reload nginx

echo "✅ Deployment complete!"
```

Make it executable:

```bash
chmod +x deploy.sh
```

#### 10.2 Setup GitHub Webhook (Optional - Advanced)

1. **Install a webhook receiver on your VPS:**
   ```bash
   npm install -g github-webhook-handler
   ```

2. **Create a webhook server script:**
   ```bash
   nano /var/www/chetana-education-society/webhook-server.js
   ```
   
   Add:
   ```javascript
   const http = require('http');
   const spawn = require('child_process').spawn;
   const createHandler = require('github-webhook-handler');
   
   const handler = createHandler({ path: '/webhook', secret: 'your_webhook_secret_here' });
   
   http.createServer((req, res) => {
     handler(req, res, (err) => {
       res.statusCode = 404;
       res.end('no such location');
     });
   }).listen(7777);
   
   handler.on('push', (event) => {
     console.log('Received push event');
     const deploy = spawn('sh', ['/var/www/chetana-education-society/deploy.sh']);
     deploy.stdout.on('data', (data) => console.log(data.toString()));
     deploy.stderr.on('data', (data) => console.error(data.toString()));
   });
   ```

3. **Run webhook server with PM2:**
   ```bash
   pm2 start /var/www/chetana-education-society/webhook-server.js --name webhook
   pm2 save
   ```

4. **Configure GitHub webhook:**
   - Go to your GitHub repository → Settings → Webhooks
   - Add webhook: `http://YOUR_VPS_IP:7777/webhook`
   - Content type: `application/json`
   - Secret: `your_webhook_secret_here`
   - Events: Just the `push` event

**Note:** For production, use HTTPS and secure the webhook endpoint properly.

### Option 3: Simple Cron Job (Check for updates periodically)

You can set up a cron job to automatically pull and deploy every hour/day:

```bash
# Edit crontab
crontab -e

# Add this line to check for updates every hour (at minute 0)
0 * * * * cd /var/www/chetana-education-society && git fetch && git diff --quiet origin/main || ./deploy.sh

# Or check once per day at 2 AM
0 2 * * * cd /var/www/chetana-education-society && git fetch && git diff --quiet origin/main || ./deploy.sh
```

This will only deploy if there are new changes.

---

## 🛠️ Step 11: Useful Commands

### PM2 Commands

```bash
pm2 status              # Check status
pm2 logs chetana-api    # View logs
pm2 restart chetana-api # Restart API
pm2 stop chetana-api    # Stop API
pm2 delete chetana-api  # Remove from PM2
```

### Nginx Commands

```bash
sudo systemctl status nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t           # Test configuration
```

### Database Commands

```bash
# Connect to database
sudo -u postgres psql -d chetana_education

# Backup database
pg_dump -U chetana_user chetana_education > backup.sql

# Restore database
psql -U chetana_user chetana_education < backup.sql
```

---

## 🔍 Step 12: Verify Everything Works

1. **Check API Health:**
   ```bash
   # If using IP:
   curl http://YOUR_VPS_IP_ADDRESS/api/health
   
   # If using domain:
   curl https://yourdomain.com/api/health
   ```

2. **Check Frontend:**
   - **If using IP:** Visit `http://YOUR_VPS_IP_ADDRESS` in your browser
   - **If using domain:** Visit `https://yourdomain.com`
   - Should see your NGO website

3. **Check Admin Login:**
   - **If using IP:** Visit `http://YOUR_VPS_IP_ADDRESS/admin/login`
   - **If using domain:** Visit `https://yourdomain.com/admin/login`
   - Login: `admin@ngo.org` / `ChangeMe123!`

4. **Check File Uploads:**
   - Login to admin panel
   - Try uploading an image
   - Verify it's accessible

---

## 🐛 Troubleshooting

### API Not Starting

```bash
# Check logs
pm2 logs chetana-api

# Check if port is in use
sudo lsof -i :4000

# Restart PM2
pm2 restart chetana-api
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U chetana_user -d chetana_education -h localhost
```

### Nginx Errors

```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

### Permission Issues

```bash
# Fix uploads directory permissions
sudo chown -R $USER:$USER /var/www/chetana-education-society/apps/api/uploads
chmod -R 755 /var/www/chetana-education-society/apps/api/uploads
```

### Uploads 404 Error

If you get a 404 error when accessing uploaded images, follow these steps:

1. **Verify uploads directory exists and has files:**
   ```bash
   ls -la /var/www/chetana-education-society/apps/api/uploads
   # Should show your uploaded files
   ```

2. **Check file permissions (CRITICAL):**
   ```bash
   # Nginx runs as www-data, so it needs read access
   sudo chown -R www-data:www-data /var/www/chetana-education-society/apps/api/uploads
   sudo chmod -R 755 /var/www/chetana-education-society/apps/api/uploads
   ```

3. **Verify nginx configuration is correct:**
   ```bash
   sudo nano /etc/nginx/sites-available/chetana-education
   ```
   
   Make sure you have:
   ```nginx
   # Serve uploaded files (MUST come FIRST - before regex locations)
   location ^~ /uploads/ {
       alias /var/www/chetana-education-society/apps/api/uploads/;
       expires 30d;
       add_header Cache-Control "public";
       access_log off;
   }
   
   location = /uploads {
       return 301 /uploads/;
   }
   ```
   
   **Important**: 
   - The `/uploads/` location MUST come BEFORE the regex location block (for static assets)
   - The `^~` prefix makes it take precedence over regex locations
   - The `/uploads/` location MUST come BEFORE `/api` location block

4. **Test and reload nginx:**
   ```bash
   sudo nginx -t
   # If test passes:
   sudo systemctl reload nginx
   ```

5. **Check nginx error logs in real-time:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   # Then try accessing the image URL in another terminal
   # Look for permission denied or file not found errors
   ```

6. **Test file access directly:**
   ```bash
   # Test if nginx can read the file
   sudo -u www-data cat /var/www/chetana-education-society/apps/api/uploads/YOUR_FILENAME.png
   # Replace YOUR_FILENAME.png with an actual uploaded file
   ```

7. **Check if file was actually uploaded:**
   ```bash
   # After uploading, verify file exists
   ls -lh /var/www/chetana-education-society/apps/api/uploads/
   # Check file size and permissions
   ```

8. **Alternative: Let API serve files directly (if nginx still fails):**
   
   If nginx continues to fail, you can proxy `/uploads` to the API:
   ```nginx
   location /uploads {
       proxy_pass http://localhost:4000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
   }
   ```
   
   This makes the Express app serve the files instead of nginx.

---

## 📝 Important Notes

1. **Change Admin Password:** After first login, change the default password (`ChangeMe123!`) through the admin panel.

2. **Database Backups:** Set up regular backups:
   ```bash
   # Add to crontab (daily backup at 2 AM)
   0 2 * * * pg_dump -U chetana_user chetana_education > /var/backups/chetana_$(date +\%Y\%m\%d).sql
   ```

3. **Firewall:** Make sure ports 80, 443, and 22 are open:
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

4. **Update Prisma Schema:** Remember to change `provider = "sqlite"` to `provider = "postgresql"` in `apps/api/prisma/schema.prisma` before deployment.

---

## ✅ Deployment Checklist

- [ ] Node.js 20.x installed
- [ ] PostgreSQL installed and database created
- [ ] Project cloned from GitHub
- [ ] Dependencies installed
- [ ] Environment variables configured (using IP or domain)
- [ ] Prisma schema updated to PostgreSQL
- [ ] Database schema pushed
- [ ] Database seeded
- [ ] API built
- [ ] Frontend built
- [ ] PM2 configured and API running
- [ ] Nginx configured (for IP or domain)
- [ ] SSL certificate installed (only if using domain)
- [ ] File uploads directory created
- [ ] Firewall configured
- [ ] Everything tested and working

---

## 🎉 You're Done!

Your NGO website should now be live!

- **If using IP:** `http://YOUR_VPS_IP_ADDRESS`
- **If using domain:** `https://yourdomain.com`

For updates, simply run:
```bash
cd /var/www/chetana-education-society
./deploy.sh
```

## 📊 Data Preservation During Updates

### ✅ What's Safe (Your Data is Preserved)

1. **Running `./deploy.sh`**: 
   - ✅ Only updates code, builds, and restarts the API
   - ✅ Does NOT modify database schema
   - ✅ Does NOT run seed script
   - ✅ **All your existing data (blogs, news, milestones, uploads, etc.) is preserved**

2. **Seed Script** (`npm run seed`):
   - ✅ Uses `upsert` operations (updates if exists, creates if not)
   - ✅ Checks for existing records before creating
   - ✅ Only adds new data, never deletes existing data
   - ✅ Safe to run multiple times

### ⚠️ What to Watch Out For

1. **Schema Changes**:
   - If you modify the Prisma schema (add/remove columns, change types), the API startup will run `prisma db push`
   - By default, this is **safe** and preserves data
   - If you set `ACCEPT_DATA_LOSS=true` in environment, it may drop columns (data loss)
   - **Recommendation**: Review schema changes carefully before deploying

2. **Manual Database Operations**:
   - Running `prisma db push --accept-data-loss` manually will cause data loss
   - Always backup before major schema changes

### 🔒 Best Practices

1. **Backup before major updates**:
   ```bash
   pg_dump -U chetana_user chetana_education > backup_$(date +%Y%m%d).sql
   ```

2. **Test schema changes locally first**

3. **Review what changed** before running deploy:
   ```bash
   git diff HEAD~1 apps/api/prisma/schema.prisma
   ```

**Summary**: Your existing data (blogs, news, milestones, uploads, admin content) will be preserved when running `./deploy.sh`. The script only updates code and restarts services.

---

## 🌐 Adding a Domain Later

When you purchase a domain:

1. **Point domain to VPS:**
   - Add A record: `@` → `YOUR_VPS_IP_ADDRESS`
   - Add A record: `www` → `YOUR_VPS_IP_ADDRESS`

2. **Update environment variables:**
   ```bash
   # Update apps/api/.env
   FRONTEND_URL=https://yourdomain.com
   
   # Update apps/web/.env
   VITE_API_URL=https://yourdomain.com/api
   ```

3. **Update Nginx config:**
   ```bash
   sudo nano /etc/nginx/sites-available/chetana-education
   # Change server_name from IP to yourdomain.com
   ```

4. **Rebuild frontend:**
   ```bash
   cd /var/www/chetana-education-society/apps/web
   npm run build
   ```

5. **Restart services:**
   ```bash
   pm2 restart chetana-api
   sudo systemctl reload nginx
   ```

6. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

