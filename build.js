const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting Vercel build process...');

try {
  // Check if we're in the right directory
  console.log('📍 Current directory:', process.cwd());
  console.log('📁 Directory contents:', fs.readdirSync('.'));

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Check if apps/web exists
  const webDir = path.join(process.cwd(), 'apps', 'web');
  if (!fs.existsSync(webDir)) {
    console.error('❌ apps/web directory not found!');
    console.log('Available directories:', fs.readdirSync('.'));
    process.exit(1);
  }

  // Build frontend
  console.log('🏗️ Building frontend...');
  console.log('📍 Web directory:', webDir);
  
  // Install web dependencies
  console.log('📦 Installing web dependencies...');
  execSync('npm install', { 
    cwd: webDir,
    stdio: 'inherit' 
  });

  // Build web app
  console.log('🔨 Building web app...');
  execSync('npm run build', { 
    cwd: webDir,
    stdio: 'inherit' 
  });

  console.log('✅ Build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
