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

  // Create testimonials
  const testimonials = [
    {
      name: 'Sarah Cohen',
      role: 'Community Leader',
      quote: 'Chetana Education Society has transformed our community. Their dedication to empowering children through education is truly inspiring and has made a real difference in countless lives.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'David Levy',
      role: 'Volunteer Coordinator',
      quote: 'Working with Chetana Education Society has been the most rewarding experience of my life. Every day we see the impact of our collective efforts in transforming children\'s futures.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Rachel Green',
      role: 'Program Beneficiary',
      quote: 'The educational support I received from Chetana Education Society changed everything for my family. My children now have access to quality education and a brighter future.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { 
        name: testimonial.name,
        role: testimonial.role 
      }
    });
    
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }
  console.log('✅ Created testimonials');

  // Create success stories
  const stories = [
    {
      title: 'Rebuilding Lives After Crisis',
      slug: createSlug('Rebuilding Lives After Crisis'),
      excerpt: 'How we helped 50 families rebuild their lives after a devastating natural disaster through our emergency relief program.',
      content: `<h2>A Story of Resilience</h2>
      <p>When disaster struck the coastal region, leaving hundreds of families homeless and without basic necessities, our emergency response team was among the first to arrive on the scene.</p>
      <p>Within 24 hours, we had established temporary shelters and began distributing food, clean water, and medical supplies to those in need. But our work didn't stop there.</p>
      <h3>Long-term Recovery</h3>
      <p>Over the following months, we worked closely with 50 families to help them rebuild not just their homes, but their lives. Our comprehensive recovery program included:</p>
      <ul>
        <li>Temporary housing assistance</li>
        <li>Job placement services</li>
        <li>Psychological support and counseling</li>
        <li>Educational support for children</li>
        <li>Small business loans for entrepreneurs</li>
      </ul>
      <p>Today, all 50 families have stable housing and sustainable income sources. Many have gone on to help other families in similar situations, creating a ripple effect of compassion and support.</p>`,
      coverUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=400&fit=crop'
    },
    {
      title: 'Education Opens Doors',
      slug: createSlug('Education Opens Doors'),
      excerpt: 'Our scholarship program has enabled 200 children from underprivileged backgrounds to access quality education and build brighter futures.',
      content: `<h2>Breaking the Cycle of Poverty</h2>
      <p>Education is the most powerful tool for breaking the cycle of poverty. That's why our scholarship program focuses on providing comprehensive educational support to children from underprivileged backgrounds.</p>
      <p>Over the past three years, we've supported 200 children with full scholarships, including tuition, books, uniforms, and nutritious meals.</p>
      <h3>Success Stories</h3>
      <p>Among our scholarship recipients:</p>
      <ul>
        <li>85% have improved their academic performance by at least two grade levels</li>
        <li>95% have continued their education beyond primary school</li>
        <li>30 students have received additional scholarships for higher education</li>
        <li>15 graduates are now working in professional fields</li>
      </ul>
      <p>These numbers represent real lives transformed, families lifted out of poverty, and communities strengthened through education.</p>`,
      coverUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop'
    }
  ];

for (const story of stories) {
  const existing = await prisma.successStory.findFirst({
    where: { slug: story.slug }
  });
  
  if (!existing) {
    await prisma.successStory.create({ data: story });
  }
}

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

  // Create milestones
  const milestones = [
    {
      title: 'Founded Chetana Education Society',
      description: 'Our organization was established with a mission to empower communities through quality education and sustainable development.',
      achievedOn: new Date('2018-03-15')
    },
    {
      title: 'Reached 1,000 Beneficiaries',
      description: 'A major milestone as we expanded our programs to serve over 1,000 individuals across multiple communities.',
      achievedOn: new Date('2019-08-22')
    },
    {
      title: 'Launched Education Initiative',
      description: 'Started our comprehensive education program, providing scholarships and learning resources to underprivileged children.',
      achievedOn: new Date('2020-01-10')
    },
    {
      title: 'Emergency Response Program',
      description: 'Established rapid response capabilities for natural disasters and humanitarian crises.',
      achievedOn: new Date('2021-06-30')
    },
    {
      title: '5,000 Lives Impacted',
      description: 'Reached a significant milestone of directly impacting over 5,000 lives through our various programs.',
      achievedOn: new Date('2023-12-01')
    }
  ];

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
  console.log('✅ Created milestones');

  // Create news items
  const newsItems = [
    {
      title: 'Annual Fundraising Gala Raises Record Amount',
      slug: createSlug('Annual Fundraising Gala Raises Record Amount'),
      type: 'NEWS' as const,
      date: new Date('2024-01-15'),
      body: `<p>Our annual fundraising gala was a tremendous success, raising over $250,000 for our programs. The event brought together supporters, volunteers, and community leaders for an evening of celebration and commitment to our mission.</p>
      <p>The funds raised will directly support our education initiatives, emergency response programs, and community development projects throughout the coming year.</p>`,
      heroUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      ])
    },
    {
      title: 'Community Volunteer Day - Join Us!',
      slug: createSlug('Community Volunteer Day - Join Us!'),
      type: 'EVENT' as const,
      date: new Date('2024-03-20'),
      body: `<p>Join us for our quarterly Community Volunteer Day! We'll be working together to clean up local parks, plant trees, and beautify community spaces.</p>
      <p><strong>When:</strong> Saturday, March 20th, 9:00 AM - 4:00 PM<br>
      <strong>Where:</strong> Central Community Park<br>
      <strong>What to bring:</strong> Work gloves, water bottle, and enthusiasm!</p>
      <p>Lunch will be provided for all volunteers. This is a great opportunity to give back to the community while meeting like-minded individuals.</p>`,
      heroUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
      gallery: JSON.stringify([])
    },
    {
      title: 'New Partnership with Local Schools',
      slug: createSlug('New Partnership with Local Schools'),
      type: 'NEWS' as const,
      date: new Date('2024-02-10'),
      body: `<p>We're excited to announce a new partnership with five local schools to expand our educational support programs. This collaboration will provide additional resources, mentoring, and after-school programs for students in need.</p>
      <p>The partnership includes:</p>
      <ul>
        <li>After-school tutoring programs</li>
        <li>Mentorship opportunities</li>
        <li>College preparation workshops</li>
        <li>Career guidance sessions</li>
      </ul>`,
      heroUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      gallery: JSON.stringify([])
    }
  ];

  for (const newsItem of newsItems) {
    const existing = await prisma.newsItem.findFirst({
      where: { slug: newsItem.slug }
    });
    
    if (!existing) {
      await prisma.newsItem.create({ data: newsItem });
    }
  }
  console.log('✅ Created news items');

  // Create blog posts
  const blogPosts = [
    {
      title: 'The Power of Community: How Small Actions Create Big Change',
      slug: createSlug('The Power of Community: How Small Actions Create Big Change'),
      author: 'Maria Rodriguez',
      excerpt: 'Exploring how individual acts of kindness and community involvement can create lasting positive change in society.',
      content: `<h2>Small Actions, Big Impact</h2>
      <p>In a world that often feels overwhelming with its challenges, it's easy to wonder if individual actions really matter. The answer is a resounding yes – and our work in communities across the region proves it every day.</p>
      
      <h3>The Ripple Effect</h3>
      <p>When Sarah, a local teacher, decided to volunteer just two hours a week tutoring children, she couldn't have imagined the chain reaction that would follow. Not only did her students' grades improve, but their confidence soared. Parents began getting more involved in their children's education, and other teachers started volunteering their time too.</p>
      
      <p>This is the power of community in action – one person's commitment inspiring others to get involved, creating a ripple effect that transforms entire neighborhoods.</p>
      
      <h3>Building Stronger Communities Together</h3>
      <p>Community strength doesn't happen overnight. It's built through:</p>
      <ul>
        <li>Consistent small actions by dedicated individuals</li>
        <li>Organizations that provide structure and support</li>
        <li>Networks that connect people with shared values</li>
        <li>Recognition and celebration of community achievements</li>
      </ul>
      
      <p>Every volunteer hour, every donation, every act of kindness contributes to a stronger, more resilient community. Together, we're proving that positive change is not only possible – it's happening right now.</p>`,
      coverUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop',
      order: 3,
      publishedAt: new Date('2024-01-20')
    },
    {
      title: 'Education as a Catalyst for Social Change',
      slug: createSlug('Education as a Catalyst for Social Change'),
      author: 'Dr. James Wilson',
      excerpt: 'How quality education serves as the foundation for breaking cycles of poverty and building stronger communities.',
      content: `<h2>Education: The Great Equalizer</h2>
      <p>Education has long been recognized as the great equalizer – the force that can level playing fields and open doors that might otherwise remain closed. In our work with underserved communities, we've witnessed firsthand how access to quality education transforms not just individual lives, but entire families and communities.</p>
      
      <h3>Breaking Generational Cycles</h3>
      <p>When we provide a child with access to quality education, we're not just investing in that one student – we're investing in their entire family's future. Educated individuals are more likely to:</p>
      <ul>
        <li>Secure stable, well-paying employment</li>
        <li>Make informed health and financial decisions</li>
        <li>Participate actively in their communities</li>
        <li>Support their own children's educational journey</li>
      </ul>
      
      <h3>The Multiplier Effect</h3>
      <p>Our scholarship program has demonstrated this multiplier effect beautifully. Students who receive educational support don't just graduate – they become leaders, entrepreneurs, teachers, and advocates in their communities. They return to help others, creating a sustainable cycle of positive change.</p>
      
      <p>This is why education remains at the heart of our mission. It's not just about individual success – it's about community transformation and social progress.</p>`,
      coverUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      order: 2,
      publishedAt: new Date('2024-01-10')
    },
    {
      title: 'Sustainable Development: Building for the Future',
      slug: createSlug('Sustainable Development: Building for the Future'),
      author: 'Elena Petrov',
      excerpt: 'Our approach to sustainable development ensures that today\'s solutions create lasting positive impact for future generations.',
      content: `<h2>Thinking Beyond Today</h2>
      <p>True development isn't just about solving immediate problems – it's about creating solutions that will continue to benefit communities for generations to come. This is the philosophy that guides all of our development projects.</p>
      
      <h3>Environmental Responsibility</h3>
      <p>Every project we undertake considers its environmental impact. From using locally-sourced materials in construction projects to implementing renewable energy solutions, we ensure that our work contributes to a healthier planet.</p>
      
      <h3>Economic Sustainability</h3>
      <p>We focus on creating economic opportunities that can sustain themselves long after our direct involvement ends. This includes:</p>
      <ul>
        <li>Supporting local entrepreneurship through microfinance</li>
        <li>Providing vocational training for in-demand skills</li>
        <li>Developing local supply chains and markets</li>
        <li>Building local capacity for project management</li>
      </ul>
      
      <h3>Community Ownership</h3>
      <p>Perhaps most importantly, we ensure that communities have ownership over their development process. When people have a voice in shaping their future, they're more invested in maintaining and expanding positive changes.</p>
      
      <p>Sustainable development is about more than just meeting immediate needs – it's about empowering communities to thrive independently and continue growing long into the future.</p>`,
      coverUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
      order: 1,
      publishedAt: new Date('2024-01-05')
    }
  ];

  for (const blogPost of blogPosts) {
    const existing = await prisma.blogPost.findFirst({
      where: { slug: blogPost.slug }
    });
    
    if (!existing) {
      await prisma.blogPost.create({ data: blogPost });
    }
  }
  console.log('✅ Created blog posts');

  // Gallery images are now managed through the admin interface
  console.log('✅ Gallery images can be added through admin panel');

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
