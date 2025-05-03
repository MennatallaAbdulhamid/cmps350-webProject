import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
console.log('Seeding database...');


const dataDir = path.join(process.cwd(), 'app', 'data');


const students      = await fs.readJSON(path.join(dataDir, 'students.json'));
const courses       = await fs.readJSON(path.join(dataDir, 'courses.json'));
const prerequisites = await fs.readJSON(path.join(dataDir, 'course-prerequisites.json'));
const offerings     = await fs.readJSON(path.join(dataDir, 'semester-offerings.json'));
const sections      = await fs.readJSON(path.join(dataDir, 'sections.json'));
const registrations = await fs.readJSON(path.join(dataDir, 'registrations.json'));
const preferences   = await fs.readJSON(path.join(dataDir, 'preferences.json'));


await prisma.student.createMany({ data: students });
await prisma.course.createMany({ data: courses });
await prisma.coursePrerequisite.createMany({ data: prerequisites });
await prisma.semesterOffering.createMany({ data: offerings });
await prisma.section.createMany({ data: sections });
await prisma.registration.createMany({ data: registrations });
await prisma.preference.createMany({ data: preferences });

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

