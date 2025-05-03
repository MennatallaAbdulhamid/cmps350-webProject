import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding Started...");

  const students      = await fs.readJSON(path.join(process.cwd(), 'app/data/students.json'));
  const courses       = await fs.readJSON(path.join(process.cwd(), 'app/data/courses.json'));
  const prerequisites = await fs.readJSON(path.join(process.cwd(), 'app/data/course-prerequisites.json'));
  const offerings     = await fs.readJSON(path.join(process.cwd(), 'app/data/semester-offerings.json'));
  const sections      = await fs.readJSON(path.join(process.cwd(), 'app/data/sections.json'));
  const registrations = await fs.readJSON(path.join(process.cwd(), 'app/data/registrations.json'));
  const preferences   = await fs.readJSON(path.join(process.cwd(), 'app/data/preferences.json'));

  // 1. Create students
  for (const student of students) {
    await prisma.student.create({ data: student });
  }

  // 2. Create courses
  for (const course of courses) {
    await prisma.course.create({ data: course });
  }

  // 3. Create course prerequisites
  for (const prereq of prerequisites) {
    await prisma.coursePrerequisite.create({ data: prereq });
  }

  // 4. Create semester offerings
  for (const offer of offerings) {
    await prisma.semesterOffering.create({ data: offer });
  }

  // 5. Create sections
  for (const section of sections) {
    await prisma.section.create({ data: section });
  }

  // 6. Create registrations
  for (const reg of registrations) {
    await prisma.registration.create({ data: reg });
  }

  // 7. Create preferences (resolve registration IDs first)
  for (const pref of preferences) {
    const { registrationComposite, sectionId } = pref;
    const reg = await prisma.registration.findFirst({
      where: {
        studentId:  registrationComposite.studentId,
        courseCode: registrationComposite.courseCode,
        semester:   registrationComposite.semester,
      },
    });
    if (reg) {
      await prisma.preference.create({
        data: { registrationId: reg.id, sectionId },
      });
    }
  }

  console.log('Seeding Completed.');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
