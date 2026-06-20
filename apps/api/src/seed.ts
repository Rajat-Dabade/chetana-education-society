import { PrismaClient } from '@prisma/client';
import { hashPassword } from './lib/auth';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load JSON data files
const dataDir = path.join(__dirname, 'data');
const visionMission = JSON.parse(fs.readFileSync(path.join(dataDir, 'vision-mission.json'), 'utf-8'));
const founderStory = JSON.parse(fs.readFileSync(path.join(dataDir, 'founder-story.json'), 'utf-8'));
const navodayaAchievers = JSON.parse(fs.readFileSync(path.join(dataDir, 'navodaya-achievers.json'), 'utf-8'));
const successStories = JSON.parse(fs.readFileSync(path.join(dataDir, 'success-stories.json'), 'utf-8'));
const milestonesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'milestones.json'), 'utf-8'));
const blogPostsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'blog-posts.json'), 'utf-8'));

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

  // Add success stories from JSON files
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

  // Create milestones from milestones.json (CES history timeline)
  for (const milestone of milestonesData.milestones) {
    const achievedOn = new Date(`${milestone.year}-06-01`);
    const existing = await prisma.milestone.findFirst({
      where: { title: milestone.title }
    });

    if (!existing) {
      await prisma.milestone.create({
        data: {
          title: milestone.title,
          description: milestone.description,
          achievedOn
        }
      });
    }
  }
  console.log('✅ Created milestones (CES history timeline)');

  // Add Navodaya achievers as milestones
  for (const achiever of navodayaAchievers.achievers) {
    const yearParts = achiever.year.split('-');
    const year = parseInt(yearParts[0]);
    const title = `${achiever.name} - Navodaya Achiever`;
    const existing = await prisma.milestone.findFirst({
      where: { title }
    });

    if (!existing) {
      await prisma.milestone.create({
        data: {
          title,
          description: `Selected for Jawahar Navodaya Vidyalaya in ${achiever.year}`,
          achievedOn: new Date(`${year}-06-01`)
        }
      });
    }
  }
  console.log('✅ Created Navodaya achiever milestones');

  // Add blog posts
  for (const post of blogPostsData.posts) {
    const existing = await prisma.blogPost.findFirst({
      where: { slug: post.slug }
    });

    if (!existing) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug: post.slug,
          author: post.author,
          excerpt: post.excerpt,
          content: post.content,
          order: post.order || 0
        }
      });
    }
  }
  console.log('✅ Created blog posts');

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
