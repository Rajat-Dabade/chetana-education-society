import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Starting cleanup of dummy data...');

  // Remove dummy testimonials (keep only real ones if any)
  const dummyTestimonials = [
    'Sarah Cohen',
    'David Levy',
    'Rachel Green'
  ];
  
  for (const name of dummyTestimonials) {
    await prisma.testimonial.deleteMany({
      where: { name }
    });
  }
  console.log('✅ Removed dummy testimonials');

  // Remove dummy success stories (keep only real ones from docs)
  const dummyStorySlugs = [
    'rebuilding-lives-after-crisis',
    'education-opens-doors'
  ];
  
  for (const slug of dummyStorySlugs) {
    await prisma.successStory.deleteMany({
      where: { slug }
    });
  }
  console.log('✅ Removed dummy success stories');

  // Remove dummy milestones (keep only Navodaya achievers)
  const dummyMilestoneTitles = [
    'Founded Chetana Education Society',
    'Reached 1,000 Beneficiaries',
    'Launched Education Initiative',
    'Emergency Response Program',
    '5,000 Lives Impacted'
  ];
  
  for (const title of dummyMilestoneTitles) {
    await prisma.milestone.deleteMany({
      where: { title }
    });
  }
  console.log('✅ Removed dummy milestones');

  // Remove all dummy news items
  const dummyNewsSlugs = [
    'annual-fundraising-gala-raises-record-amount',
    'community-volunteer-day-join-us',
    'new-partnership-with-local-schools'
  ];
  
  for (const slug of dummyNewsSlugs) {
    await prisma.newsItem.deleteMany({
      where: { slug }
    });
  }
  console.log('✅ Removed dummy news items');

  // Remove all dummy blog posts
  const dummyBlogSlugs = [
    'the-power-of-community-how-small-actions-create-big-change',
    'education-as-a-catalyst-for-social-change',
    'sustainable-development-building-for-the-future'
  ];
  
  for (const slug of dummyBlogSlugs) {
    await prisma.blogPost.deleteMany({
      where: { slug }
    });
  }
  console.log('✅ Removed dummy blog posts');

  console.log('🎉 Cleanup completed successfully!');
}

cleanup()
  .catch((e) => {
    console.error('❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

