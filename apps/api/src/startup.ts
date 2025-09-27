import { prisma } from './lib/db';
import { execSync } from 'child_process';

export async function setupDatabase() {
  try {
    console.log('🔍 Checking database setup...');
    
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
    // Don't throw error - let app start anyway
  }
}
