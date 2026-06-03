import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Models
import User from '../models/User.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Skill from '../models/Skill.js';
import Activity from '../models/Activity.js';
import Testimonial from '../models/Testimonial.js';
import Article from '../models/Article.js';
import Image from '../models/Image.js';
import Video from '../models/Video.js';
import Message from '../models/Message.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Blog.deleteMany();
    await Skill.deleteMany();
    await Activity.deleteMany();
    await Testimonial.deleteMany();
    await Article.deleteMany();
    await Image.deleteMany();
    await Video.deleteMany();
    await Message.deleteMany();

    console.log('Existing data cleared.');

    // 1. Seed Admin User
    // The pre-save hook will hash 'admin123'
    const adminUser = await User.create({
      username: 'Masud Rana',
      email: 'masud@rana.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // Seed Standard User
    const standardUser = await User.create({
      username: 'Test User',
      email: 'test@user.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`Standard user created: ${standardUser.email}`);

    // 2. Seed Projects
    const projects = await Project.create([
      {
        title: 'NovaSaaS - Enterprise AI Dashboard',
        description: 'A premium SaaS dashboard featuring real-time AI usage statistics, predictive model metrics, and team collaboration controls.',
        content: '# NovaSaaS - AI Operations Control\n\nNovaSaaS is a next-generation control panel built for tracking AI agent metrics and cost optimization. It features live websocket updates, custom widget configuration, and dynamic server-side analytics.\n\n### Key Features\n- Real-time chart visualization with Tremor\n- JWT-based authentication & RBAC\n- Stripe billing integration with webhooks\n- Multi-tenant workflow controls',
        tags: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS'],
        githubLink: 'https://github.com/masudrana/novasaas',
        liveLink: 'https://novasaas.demo.com',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        featured: true,
        category: 'Fullstack',
      },
      {
        title: 'AuraPay - Crypto Wallet Extension',
        description: 'A Web3 wallet Chrome extension enabling seamless gasless transactions, instant token swapping, and NFT portfolio management.',
        content: '# AuraPay - The Gasless Web3 Wallet\n\nAuraPay bridges the gap between traditional users and decentralization. Using smart account contracts (ERC-4337), users can pay gas in stablecoins or enjoy sponsored gas transactions.',
        tags: ['React', 'Solidity', 'Ethers.js', 'TailwindCSS', 'Chrome Extension'],
        githubLink: 'https://github.com/masudrana/aurapay',
        liveLink: 'https://aurapay.demo.com',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80',
        featured: true,
        category: 'Frontend',
      },
      {
        title: 'Zenith - Collaborative Project Workspace',
        description: 'Real-time collaborative task planner with Kanban boards, whiteboard drafting, integrated chat room, and file attachment sharing.',
        content: '# Zenith Workspace\n\nBuilt for fully remote teams, Zenith consolidates boards, notes, and group audio chats into a single sleek screen. Powered by Socket.io for instantaneous sync.',
        tags: ['React', 'Express.js', 'Socket.io', 'Mongoose', 'TailwindCSS'],
        githubLink: 'https://github.com/masudrana/zenith',
        liveLink: 'https://zenith.demo.com',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        featured: true,
        category: 'Fullstack',
      },
      {
        title: 'Apex - Performance Analytics SDK',
        description: 'A lightweight npm library for tracking Core Web Vitals, user behaviors, and custom telemetry with sub-millisecond overhead.',
        content: '# Apex SDK\n\nIntegrate performance logs into your React or Next.js app in 2 lines of code. Sends asynchronous beacon reports directly to clickhouse clusters.',
        tags: ['TypeScript', 'Rollup', 'Jest', 'Web Vitals'],
        githubLink: 'https://github.com/masudrana/apex-sdk',
        liveLink: 'https://npmjs.com/package/apex-sdk',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        featured: false,
        category: 'Tools',
      }
    ]);
    console.log(`${projects.length} projects seeded.`);

    // 3. Seed Blogs
    const blogs = await Blog.create([
      {
        title: 'Demystifying Hydration Errors in Next.js 14 App Router',
        description: 'Why do hydration mismatch errors happen, and how can you structuralize your React components to prevent them forever?',
        content: '<p>If you have built applications with Next.js 14 App Router, you have likely run into the dreaded: <code>Error: Hydration failed because the initial UI does not match what was rendered on the server</code>.</p><h3>Why This Occurs</h3><p>Next.js pre-renders HTML on the server. During hydration, React compares the pre-rendered server DOM with the first-render DOM on the client. If they differ (due to dates, localstorage, window sizes), it errors.</p><h3>The Ultimate Cure</h3><p>Always use a mounted state guard or suppress hydration warning attributes where random elements exist.</p>',
        readingTime: '6 min read',
        tags: ['Next.js', 'React', 'SSR', 'WebDev'],
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        featured: true,
        category: 'Frontend',
      },
      {
        title: 'Mastering MongoDB Aggregate Pipelines for Advanced Dashboards',
        description: 'Ditch multiple separate find queries. Learn to construct single-stage aggregations for compound metrics calculations.',
        content: '<p>Aggregations can seem intimidating, but they are incredibly powerful once you understand the pipeline flow: <code>$match</code> -> <code>$group</code> -> <code>$project</code>.</p><p>By combining indexing with pipeline stages, you can execute fast analytics directly inside MongoDB database engine.</p>',
        readingTime: '8 min read',
        tags: ['MongoDB', 'Express', 'Database', 'Backend'],
        featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        category: 'Backend',
      },
      {
        title: 'Building a Custom JWT Refresh Token Rotation Flow in Node.js',
        description: 'Secure your APIs like a bank. Learn how to issue access and refresh tokens, rotation strategies, and token blacklisting.',
        content: '<p>Access tokens should be short-lived, while refresh tokens should be stored in HttpOnly cookies with automatic reuse detection to maximize session safety.</p>',
        readingTime: '10 min read',
        tags: ['Security', 'Node.js', 'Express', 'JWT'],
        featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        featured: false,
        category: 'Backend',
      }
    ]);
    console.log(`${blogs.length} blogs seeded.`);

    // 4. Seed Skills
    const skills = await Skill.create([
      // Frontend
      { name: 'React / Next.js', category: 'Frontend', percentage: 95, icon: 'Layout' },
      { name: 'TypeScript', category: 'Frontend', percentage: 90, icon: 'Code2' },
      { name: 'Tailwind CSS', category: 'Frontend', percentage: 95, icon: 'Paintbrush' },
      { name: 'Framer Motion', category: 'Frontend', percentage: 85, icon: 'Activity' },
      
      // Backend
      { name: 'Node.js / Express', category: 'Backend', percentage: 92, icon: 'Server' },
      { name: 'Socket.io', category: 'Backend', percentage: 80, icon: 'Zap' },
      
      // Database
      { name: 'MongoDB / Mongoose', category: 'Database', percentage: 90, icon: 'Database' },
      { name: 'PostgreSQL / Prisma', category: 'Database', percentage: 82, icon: 'HardDrive' },
      { name: 'Redis Caching', category: 'Database', percentage: 75, icon: 'Cpu' },
      
      // Tools
      { name: 'Git & GitHub', category: 'Tools', percentage: 90, icon: 'GitBranch' },
      { name: 'Docker Containers', category: 'Tools', percentage: 80, icon: 'Box' },
      
      // Deployment
      { name: 'Vercel / Netlify', category: 'Deployment', percentage: 95, icon: 'Globe' },
      { name: 'AWS (S3/EC2)', category: 'Deployment', percentage: 78, icon: 'Cloud' },
      { name: 'CI/CD Pipelines', category: 'Deployment', percentage: 82, icon: 'RefreshCw' },
    ]);
    console.log(`${skills.length} skills seeded.`);

    // 5. Seed Activities (Showcase Timeline)
    const activities = await Activity.create([
      {
        title: 'Keynote Speaker at TechCon 2025',
        description: 'Delivered a talk on "The Future of Serverless React and Edge Compute Frameworks" to an audience of over 500 developers.',
        date: new Date('2025-11-12'),
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        category: 'Public Speaking',
      },
      {
        title: 'Won First Place at HackDiff 2025',
        description: 'Led a team of 4 to design and develop AuraPay - a smart account wallet, taking home the grand prize for web3 integration.',
        date: new Date('2025-06-20'),
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        category: 'Hackathon',
      },
      {
        title: 'AWS Certified Solutions Architect',
        description: 'Successfully passed the AWS Solutions Architect - Associate exam, validating proficiency in designing secure distributed cloud systems.',
        date: new Date('2025-02-15'),
        image: 'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=800&q=80',
        category: 'Certification',
      }
    ]);
    console.log(`${activities.length} activities seeded.`);

    // 6. Seed Testimonials
    const testimonials = await Testimonial.create([
      {
        clientName: 'Sarah Jenkins',
        role: 'CTO at CloudBase Solutions',
        rating: 5,
        reviewText: 'Masud is a stellar engineer. He refactored our legacy React platform into Next.js, resulting in a 40% speed increase and substantial improvements in core web vitals. Highly professional and autonomous.',
        clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      },
      {
        clientName: 'Aris Thorne',
        role: 'Product Lead at Apex Labs',
        rating: 5,
        reviewText: 'His grasp of animations (Framer Motion) and bento layout systems is exceptional. Masud took our raw wireframes and delivered a premium, high-converting product UI. 10/10 recommendation.',
        clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      },
      {
        clientName: 'David Lee',
        role: 'Founder of Nova AI',
        rating: 5,
        reviewText: 'Masud integrated our Express.js backend with complex Mongoose pipelines. His clean, structured API setup saved our front-end team weeks of boilerplate development.',
        clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      }
    ]);
    console.log(`${testimonials.length} testimonials seeded.`);

    // 7. Seed Articles (Medium-style external cards)
    const articles = await Article.create([
      {
        title: '10 Advanced Tailwind Tricks for Sleek Glassmorphism UIs',
        description: 'Learn how to combine backdrop filters, box shadow spreads, and gradient borders to create state-of-the-art SaaS designs.',
        externalLink: 'https://medium.com',
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        readTime: '4 min read',
      },
      {
        title: 'Why We Migrated from PostgreSQL to MongoDB for Real-Time Analytics',
        description: 'An in-depth breakdown of schema flexibility, sub-document efficiency, and how document databases helped scale our analytics SDK.',
        externalLink: 'https://medium.com',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        readTime: '7 min read',
      },
      {
        title: 'Building Fluid Framer Motion Layout Transitions in Next.js',
        description: 'How to use AnimatePresence and layoutId to create smooth app-like routing transitions within Next.js App Router.',
        externalLink: 'https://medium.com',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        readTime: '5 min read',
      }
    ]);
    console.log(`${articles.length} articles seeded.`);

    // 8. Seed Images (Gallery)
    const images = await Image.create([
      {
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
        category: 'Office Work',
        description: 'Collaborative whiteboarding session during the design sprint for NovaSaaS dashboard layout.',
        featured: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        category: 'Hackathons',
        description: 'Presenting the final gasless crypto transaction interface to judges at HackDiff 2025.',
        featured: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        category: 'Tech Conferences',
        description: 'Answering questions post-keynote about edge functions scaling limits.',
        featured: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        category: 'Setup',
        description: 'My custom workspace setup featuring ergonomic layout and terminal configuration.',
        featured: true,
      }
    ]);
    console.log(`${images.length} images seeded.`);

    // 9. Seed Videos (Gallery)
    const videos = await Video.create([
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Building a Fullstack Next.js 14 App in 20 Minutes',
        platform: 'YouTube',
        description: 'A quick tutorial detailing layout patterns, fetching data from route handlers, and optimization tips.',
        featured: true,
      },
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'JWT Cookie Authentication Explained and Implemented',
        platform: 'YouTube',
        description: 'Breaking down HttpOnly security mechanisms, CSRF tokens, and credentials binding in Axios.',
        featured: true,
      },
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Framer Motion Bento Layout Animation Masterclass',
        platform: 'YouTube',
        description: 'Learn how to trigger spring entry animations, stagger children reveals, and morph cards smoothly.',
        featured: false,
      },
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'MongoDB Aggregations Demystified',
        platform: 'YouTube',
        description: 'Deep dive session showing match, group, lookup, and projection pipelines with live data datasets.',
        featured: false,
      }
    ]);
    console.log(`${videos.length} videos seeded.`);

    // 10. Seed Messages
    const messages = await Message.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry: SaaS Dashboard Project Collaboration',
        message: 'Hello Masud Rana, I saw your portfolio and was blown away by NovaSaaS. We have a similar dashboard project starting next month and would love to hire you as a consultant or contract developer. Please let me know your availability.',
        isRead: false,
      },
      {
        name: 'Clara Oswald',
        email: 'clara@tardis.co.uk',
        subject: 'Awesome Portfolio Design!',
        message: 'Just wanted to say that your portfolio layout looks extremely beautiful. The glassmorphism and bento grids are very premium! Keep up the amazing work.',
        isRead: true,
      }
    ]);
    console.log(`${messages.length} messages seeded.`);

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
