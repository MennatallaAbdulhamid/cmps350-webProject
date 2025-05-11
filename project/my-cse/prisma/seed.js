import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  
  await prisma.preference.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.section.deleteMany();
  await prisma.semesterOffering.deleteMany();
  await prisma.coursePrerequisite.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
// create the admin user 
  await prisma.user.create({
    data: {
      email: 'cseadmin@qu.edu.qa',
      password: 'admin123',
      role: 'admin',
    },
  });
    await prisma.admin.create({
    data: {
      adminId: 'admin20001555',
      name: 'Admin User',
      email: 'cseadmin@qu.edu.qa',
      password: 'admin123',
      userEmail: 'cseadmin@qu.edu.qa',
    },
  });
  console.log('Created admin user.');
  // Create 50 instructors
  const instructors = [];
  for (let i = 0; i < 50; i++) {
    const email = `instructor${i + 1}@qu.edu.qa`;
    const password = `password${i + 1}`;
    await prisma.user.create({
      data: {
        email,
        password,
        role: 'instructor',
      },
    });
    const instructorId = await prisma.instructor.create({
      data: {
        instructorId: `I${i + 1}`,
        name: faker.person.fullName(),
        email,
        password,
        userEmail: email,
      },
    });
    instructors.push(instructorId);
    if (i < 5) {
      console.log(`Created instructor: ${email} / ${password}`);
    }
  }
  console.log('Created 50 instructors.');

  // Create Users and Students
  for (let i = 0; i < 500; i++) {
    const email = `student${i + 1}@qu.edu.qa`;
    const password = `password${i + 1}`;
    await prisma.user.create({
      data: {
        email,
        password,
        role: 'student',
      },
    });

    await prisma.student.create({
      data: {
        studentId: `S${i + 1}`,
        name: faker.person.fullName(),
        email,
        password,
        yearOfStudy: faker.helpers.arrayElement([1, 2, 3, 4]),
        userEmail: email, // Link to User
      },
    });
    if (i < 5) {
      console.log(`Created student: ${email} / ${password}`);
    }
  }

  console.log('Created 500 students and users.');

  // Create 50 Courses
  const courses = [];
  for (let i = 0; i < 50; i++) {
    courses.push({
      code: faker.string.uuid(),
      name: faker.company.catchPhrase(),
      category: faker.helpers.arrayElement(['CS', 'Math', 'Physics', 'Engineering']),
      credits: faker.number.int({ min: 3, max: 6 }),
      description: faker.lorem.sentence(),
    });
  }
  await prisma.course.createMany({ data: courses });
  console.log('Created 50 courses.');

  // Create a section for each course
  const allCourses = await prisma.course.findMany();
  const sections = [];
  for (const course of allCourses) {
    const instructor = faker.helpers.arrayElement(instructors);
    const section = await prisma.section.create({
      data: {
        id: faker.string.uuid(),
        courseCode: course.code,
        instructorId: instructor.instructorId,
        capacity: faker.number.int({ min: 20, max: 40 }),
        schedule: faker.helpers.arrayElement(['Mon 9-11', 'Tue 10-12', 'Wed 1-3']),
        deadline: '2024-05-31',
        location: faker.helpers.arrayElement(['Room 101', 'Room 202', 'Lab 1']),
      },
    });
    sections.push(section);
  }
  console.log('Created sections.');

  const allStudents = await prisma.student.findMany();

  // Register each student in 3 random courses
  for (const student of allStudents) {
    const coursesForStudent = faker.helpers.arrayElements(allCourses, 3);
    for (const course of coursesForStudent) {
      // Find a section for this course
      const section = sections.find(sec => sec.courseCode === course.code);
      if (!section) continue;

      await prisma.registration.create({
        data: {
          studentId: student.studentId,
          courseCode: course.code,
          semester: '2023-2024',
          sectionId: section.id,
          status: 'completed',
          grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'F']),
        },
      });
    }
  }
  console.log('Created registrations.');
  // Create Semester Offerings for each course
for (const course of allCourses) {
  await prisma.semesterOffering.create({
    data: {
      courseCode: course.code,
      semester: faker.helpers.arrayElement(['2023-2024', '2024-2025']),
    },
  });
}
console.log('Created semester offerings.');

// Create random prerequisites for some courses
for (let i = 0; i < allCourses.length; i++) {
  // 30% chance to assign a prerequisite
  if (Math.random() < 0.3) {
    // Pick a random other course as prerequisite
    const prereq = faker.helpers.arrayElements(
      allCourses.filter(c => c.code !== allCourses[i].code), 1
    )[0];
    if (prereq) {
      await prisma.coursePrerequisite.create({
        data: {
          courseCode: allCourses[i].code,
          prerequisiteCode: prereq.code,
        },
      });
    }
  }
}
console.log('Created course prerequisites.');
  // Fetch all registrations and sections
const allRegistrations = await prisma.registration.findMany();
const allSections = await prisma.section.findMany();

// For each registration, create 1-2 preferences for random sections
for (const registration of allRegistrations) {
  // Pick 1 or 2 random sections 
  const preferredSections = faker.helpers.arrayElements(allSections, faker.number.int({ min: 1, max: 2 }));
  for (const section of preferredSections) {
    await prisma.preference.create({
      data: {
        registrationId: registration.id,
        sectionId: section.id,
      },
    });
  }
}
console.log('Created preferences.');
  console.log('Seeding completed.');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });