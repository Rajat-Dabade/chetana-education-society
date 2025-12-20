import { prisma } from './lib/db';
import { execSync } from 'child_process';

export async function setupDatabase() {
  try {
    console.log('🔍 Setting up database at runtime...');
    
    // First, push schema to create/update tables
    // Only use --accept-data-loss in development or if explicitly set
    const acceptDataLoss = process.env.ACCEPT_DATA_LOSS === 'true';
    const pushCommand = acceptDataLoss 
      ? 'npx prisma db push --accept-data-loss'
      : 'npx prisma db push';
    
    console.log('📦 Syncing database schema...');
    execSync(pushCommand, { 
      stdio: 'inherit', 
      cwd: __dirname + '/..' 
    });
    
    // Check if admin user exists (indicates database is seeded)
    const adminExists = await prisma.adminUser.findFirst();
    
    if (!adminExists) {
      console.log('🌱 Database is empty, running seed...');
      
      // Run seed using child process
      execSync('npm run seed', { stdio: 'inherit', cwd: __dirname + '/..' });
      
      console.log('✅ Database seeded successfully!');
    } else {
      console.log('✅ Database already set up, skipping seed.');
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('⚠️ App will continue without database setup');
    // Don't throw error - let app start anyway
  }
}
