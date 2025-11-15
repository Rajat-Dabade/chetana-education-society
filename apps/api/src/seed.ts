import { PrismaClient } from '@prisma/client';
import { hashPassword } from './lib/auth';
import { createSlug } from './lib/utils';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load JSON data files
const dataDir = path.join(__dirname, 'data');
const visionMission = JSON.parse(fs.readFileSync(path.join(dataDir, 'vision-mission.json'), 'utf-8'));
const founderStory = JSON.parse(fs.readFileSync(path.join(dataDir, 'founder-story.json'), 'utf-8'));
const navodayaAchievers = JSON.parse(fs.readFileSync(path.join(dataDir, 'navodaya-achievers.json'), 'utf-8'));
const successStories = JSON.parse(fs.readFileSync(path.join(dataDir, 'success-stories.json'), 'utf-8'));

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('ChangeMe123!');
  await prisma.adminUser.upsert({
    where: { email: 'admin@ngo.org' },
    update: {},
    create: {
      email: 'admin@ngo.org',
      password: adminPassword
    }
  });
  console.log('✅ Created admin user');

  // Create site settings with vision, mission, and founder story
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {
      siteName: 'Chetana Education Society',
      primaryHex: '#0038B8',
      vision: visionMission.vision,
      mission: JSON.stringify(visionMission.mission),
      founderStory: founderStory.content,
      whoWeAre: founderStory.whoWeAre
    },
    create: {
      id: 1,
      siteName: 'Chetana Education Society',
      primaryHex: '#0038B8',
      vision: visionMission.vision,
      mission: JSON.stringify(visionMission.mission),
      founderStory: founderStory.content,
      whoWeAre: founderStory.whoWeAre
    }
  });
  console.log('✅ Created site settings with vision, mission, and founder story');

  // Add success stories from JSON files (real content from docs)
for (const story of successStories.stories) {
  const existing = await prisma.successStory.findFirst({
    where: { slug: story.slug }
  });
  
  if (!existing) {
    await prisma.successStory.create({ 
      data: {
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        content: story.content
      }
    });
  }
}
console.log('✅ Created success stories');

  // Create milestones - only Navodaya achievers from docs
  const milestones: Array<{ title: string; description: string; achievedOn: Date }> = [];

  // Add Navodaya achievers as milestones
  for (const achiever of navodayaAchievers.achievers) {
    const yearParts = achiever.year.split('-');
    const year = parseInt(yearParts[0]);
    milestones.push({
      title: `${achiever.name} - Navodaya Achiever`,
      description: `Selected for Jawahar Navodaya Vidyalaya in ${achiever.year}`,
      achievedOn: new Date(`${year}-06-01`)
    });
  }

  for (const milestone of milestones) {
    const existing = await prisma.milestone.findFirst({
      where: { 
        title: milestone.title,
        achievedOn: milestone.achievedOn 
      }
    });
    
    if (!existing) {
      await prisma.milestone.create({ data: milestone });
    }
  }
  console.log('✅ Created milestones (Navodaya achievers)');

  console.log('🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@ngo.org');
  console.log('🔑 Admin password: ChangeMe123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
