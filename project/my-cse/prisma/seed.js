import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
console.log('Seeding database...');

    // Ensure the database is empty before seeding
  await prisma.preference.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.section.deleteMany()
  await prisma.semesterOffering.deleteMany()
  await prisma.coursePrerequisite.deleteMany()
  await prisma.course.deleteMany()
  await prisma.student.deleteMany()

    const dataDir = path.join(process.cwd(), 'app/data');
    const users        = await fs.readJSON(path.join(dataDir, 'users.json'))
    const students      = await fs.readJSON(path.join(dataDir, 'students.json'))
    const courses       = await fs.readJSON(path.join(dataDir, 'courses.json'))
    const prerequisites = await fs.readJSON(path.join(dataDir, 'course-prerequisites.json'))
    const offerings     = await fs.readJSON(path.join(dataDir, 'semester-offerings.json'))
    const sections      = await fs.readJSON(path.join(dataDir, 'sections.json'))
    const registrations = await fs.readJSON(path.join(dataDir, 'registrations.json'))
    const rawPrefs = await fs.readJSON(path.join(dataDir, 'preferences.json'))

    for (const user of users) {
        await prisma.user.create({ data: user })
    }
    for (const student of students) {
        await prisma.student.create({ data: student })
    }
    for (const course of courses) {
        await prisma.course.create({ data: course })
    }
    for (const prereq of prerequisites) {
        await prisma.coursePrerequisite.create({ data: prereq })
    }
    for (const offering of offerings) {
        await prisma.semesterOffering.create({ data: offering })
    }
    for (const section of sections) {
        await prisma.section.create({ data: section })
    }
    for (const registration of registrations) {
        await prisma.registration.create({ data: registration })
    }

    for (const { registrationComposite, sectionId } of rawPrefs) {
        const reg = await prisma.registration.findFirst({
          where: {
            studentId:  registrationComposite.studentId,
            courseCode: registrationComposite.courseCode,
            semester:   registrationComposite.semester
          }
        })
        if (!reg) {
          throw new Error(
            `Could not find registration for ${JSON.stringify(registrationComposite)}`
          )
        }
        await prisma.preference.create({
          data: {
            registrationId: reg.id,
            sectionId
          }
        })
      }

console.log('Seeding completed.');
}

seed()
.catch((e) => {
console.error('Seed failed:', e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});

