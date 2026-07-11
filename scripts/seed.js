require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Internship = require('../models/Internship');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Connected to MongoDB for seeding...');

  // Seed Admin
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: 'InternHub Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  } else {
    console.log('ℹ️  Admin already exists, skipping.');
  }

  // Seed Demo Company
  let demoCompany = await Company.findOne({ email: 'demo@techcorp.com' });
  if (!demoCompany) {
    demoCompany = await Company.create({
      companyName: 'TechCorp Solutions',
      email: 'demo@techcorp.com',
      password: 'Company@123',
      industry: 'Software Development',
      website: 'https://techcorp.example.com',
      contactPerson: 'Jane Smith',
      bio: 'A leading software company building innovative solutions for the future.',
      isVerified: true,
    });
    console.log('✅ Demo company created: demo@techcorp.com / Company@123');
  } else {
    console.log('ℹ️  Demo company already exists, skipping.');
  }

  // Seed Demo Student
  const studentExists = await User.findOne({ email: 'student@demo.com' });
  if (!studentExists) {
    await User.create({
      name: 'Alex Rivera',
      email: 'student@demo.com',
      password: 'Student@123',
      role: 'student',
      university: 'State University of Technology',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      bio: 'Passionate Computer Science student looking for exciting internship opportunities.',
    });
    console.log('✅ Demo student created: student@demo.com / Student@123');
  } else {
    console.log('ℹ️  Demo student already exists, skipping.');
  }

  // Seed Demo Internships
  const internshipCount = await Internship.countDocuments();
  if (internshipCount === 0) {
    await Internship.insertMany([
      {
        company: demoCompany._id,
        title: 'Frontend Developer Intern',
        description: 'Join our dynamic team to build cutting-edge React applications. You will work closely with senior engineers to deliver high-quality UI components.',
        location: 'Remote',
        duration: '3 months',
        role: 'Frontend Developer',
        skills: ['React', 'TypeScript', 'CSS', 'REST APIs'],
        stipend: '₹15,000/month',
        openings: 3,
      },
      {
        company: demoCompany._id,
        title: 'Backend Engineer Intern',
        description: 'Work on scalable Node.js microservices and RESTful APIs. Great opportunity to learn modern backend architecture.',
        location: 'Bangalore',
        duration: '6 months',
        role: 'Backend Developer',
        skills: ['Node.js', 'MongoDB', 'Express', 'Docker'],
        stipend: '₹20,000/month',
        openings: 2,
      },
      {
        company: demoCompany._id,
        title: 'Data Science Intern',
        description: 'Analyze large datasets to drive business insights. Work with Python, pandas, and machine learning models.',
        location: 'Hyderabad',
        duration: '4 months',
        role: 'Data Scientist',
        skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
        stipend: '₹18,000/month',
        openings: 1,
      },
    ]);
    console.log('✅ 3 demo internships created');
  } else {
    console.log('ℹ️  Internships already exist, skipping.');
  }

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin   → admin@internhub.com   | Admin@123456');
  console.log('Company → demo@techcorp.com     | Company@123');
  console.log('Student → student@demo.com      | Student@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
});
