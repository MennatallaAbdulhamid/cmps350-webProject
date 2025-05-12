// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');
  
  // Clear existing data
  await prisma.registration.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.coursePrerequisite.deleteMany({});
  await prisma.semesterOffering.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});
  
  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mycse.com',
      password: 'admin123', // Never use plaintext passwords in production
      name: 'Admin User',
      role: 'admin',
    },
  });
  
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@mycse.com',
      password: 'student123', 
      name: 'Student User',
      role: 'student',
    },
  });
  
  console.log('Created users:', { adminUser, studentUser });
  
  // Create courses
  const courses = [
    {
      code: 'CS101',
      name: 'Introduction to Programming',
      description: 'Basic programming concepts using Python',
      credits: 3,
      category: 'CS',
    },
    {
      code: 'CS102',
      name: 'Data Structures',
      description: 'Fundamental data structures and algorithms',
      credits: 3,
      category: 'CS',
    },
    {
      code: 'CE101',
      name: 'Digital Logic Design',
      description: 'Fundamentals of digital systems',
      credits: 3,
      category: 'Engineering',
    },
    // Add more courses as needed
  ];
  
  for (const course of courses) {
    await prisma.course.create({ data: course });
  }
  
  // Create students
  const students = [
    {
      studentId: 'S001',
      name: 'John Doe',
      email: 'john@example.com',
      yearOfStudy: 1,
      major: 'Computer Science',
    },
    {
      studentId: 'S002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      yearOfStudy: 2,
      major: 'Computer Engineering',
    },
    {
      studentId: 'S003',
      name: 'Alex Brown',
      email: 'alex@example.com',
      yearOfStudy: 3,
      major: 'Computer Science',
    },
    {
      studentId: 'S004',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      yearOfStudy: 4,
      major: 'Computer Engineering',
    },
  ];
  
  for (const student of students) {
    await prisma.student.create({ data: student });
  }
  
  // Add prerequisites
  await prisma.coursePrerequisite.create({
    data: {
      courseCode: 'CS102',
      prerequisiteCode: 'CS101',
    },
  });
  
  // Create semester offerings
  const offerings = [
    {
      courseCode: 'CS101',
      semester: 'Fall 2023',
    },
    {
      courseCode: 'CS102',
      semester: 'Spring 2024',
    },
    {
      courseCode: 'CE101',
      semester: 'Fall 2023',
    },
  ];
  
  for (const offering of offerings) {
    await prisma.semesterOffering.create({ data: offering });
  }
  
  // Create sections
  const sections = [
    {
      courseCode: 'CS101',
      number: 1,
      instructor: 'Dr. Smith',
      schedule: 'MW 10:00-11:15',
      location: 'B09-123',
      capacity: 30,
    },
    {
      courseCode: 'CS101',
      number: 2,
      instructor: 'Dr. Johnson',
      schedule: 'TR 13:00-14:15',
      location: 'B09-124',
      capacity: 30,
    },
    {
      courseCode: 'CS102',
      number: 1,
      instructor: 'Dr. Williams',
      schedule: 'MW 13:00-14:15',
      location: 'B09-125',
      capacity: 25,
    },
    {
      courseCode: 'CE101',
      number: 1,
      instructor: 'Dr. Brown',
      schedule: 'TR 10:00-11:15',
      location: 'B09-126',
      capacity: 20,
    },
  ];
  
  for (const section of sections) {
    await prisma.section.create({ data: section });
  }
  
  // Create registrations
  const registrations = [
    {
      studentId: 'S001',
      courseCode: 'CS101',
      sectionId: 1,
      status: 'in-progress',
      grade: null,
    },
    {
      studentId: 'S002',
      courseCode: 'CS101',
      sectionId: 2,
      status: 'completed',
      grade: 'A',
    },
    {
      studentId: 'S003',
      courseCode: 'CS102',
      sectionId: 3,
      status: 'in-progress',
      grade: null,
    },
    {
      studentId: 'S004',
      courseCode: 'CE101',
      sectionId: 4,
      status: 'completed',
      grade: 'B',
    },
  ];
  
  for (const registration of registrations) {
    await prisma.registration.create({ data: registration });
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });