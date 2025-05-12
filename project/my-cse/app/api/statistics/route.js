// app/api/statistics/route.js
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalStudents = await prisma.student.count();
    const totalCourses = await prisma.course.count();

    const topCoursesRaw = await prisma.registration.groupBy({
      by: ['courseCode'],
      _count: { courseCode: true },
      orderBy: { _count: { courseCode: 'desc' } },
      take: 3,
    });

    const topCourses = await Promise.all(
      topCoursesRaw.map(async (entry) => {
        const course = await prisma.course.findUnique({
          where: { code: entry.courseCode },
        });
        return {
          name: course?.name || entry.courseCode,
          count: entry._count.courseCode,
        };
      })
    );

 const studentsPerCourse = await prisma.course.findMany({
  where: { category: 'CS' }, 
  select: {
    name: true,
    registrations: { select: { id: true } }
  }
});

const  csStudentsCourseData= studentsPerCourse
   .map(course => ({
    course: course.name.length > 20 ? course.name.slice(0, 9) + '...' : course.name,
    students: course.registrations.length
  }))
  .sort((a, b) => b.students - a.students)
  .slice(0, 20); 

const allCategories = await prisma.course.findMany({
      select: {
        category: true,
        registrations: {
          select: { grade: true },
        },
      },
    });

const ceCourses = await prisma.course.findMany({
  where: { category: 'Engineering' }, 
  select: {
    name: true,
    registrations: { select: { id: true } }
  }
});
const ceStudentsCourseData = ceCourses
  .map(course => ({
    course: course.name.length > 20 ? course.name.slice(0, 9) + '...' : course.name,
    students: course.registrations.length
  }))
  .sort((a, b) => b.students - a.students)
  .slice(0, 20); 

const csCeCourses = await prisma.course.findMany({
  where: {
    OR: [
      { category: 'CS' },
      { category: 'Engineering' } 
    ]
  },
  select: {
    name: true,
    category: true,
    registrations: { select: { grade: true } }
  }
});
// Calculate pass rates for CS and CE courses
const csCePassRateData = csCeCourses.map(course => {
  const total = course.registrations.length;
  const passed = course.registrations.filter(r => r.grade !== 'F').length;
  return {
    course: course.name.length > 15 ? course.name.slice(0, 10) + '...' : course.name,
    category: course.category,
    passRate: total > 0 ? (passed / total) * 100 : 0
  };
}).sort((a, b) => b.passRate - a.passRate);
 const categoryMap = {};

allCategories.forEach(course => {
  if (!categoryMap[course.category]) {
    categoryMap[course.category] = { total: 0, failures: 0 };
  }
  categoryMap[course.category].total += course.registrations.length;
  categoryMap[course.category].failures += course.registrations.filter(r => r.grade === 'F').length;
});

// Grade distribution for first-year students
const firstYearStudents = await prisma.student.findMany({
  where: { yearOfStudy: 1 },
  select: { studentId: true }
});
const firstYearStudentIds = firstYearStudents.map(s => s.studentId);

const firstYearRegistrations = await prisma.registration.findMany({
  where: {
    studentId: { in: firstYearStudentIds },
    course: {
      category: { in: ['CS', 'Engineering'] }
    }
  },
  select: { grade: true }
});

const gradeCounts = { A: 0, B: 0, C: 0, D: 0 };
firstYearRegistrations.forEach(r => {
  if (gradeCounts[r.grade] !== undefined) gradeCounts[r.grade]++;
});
const firstYearGradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
  grade,
  count
}));
// Most taken course by students in each year 
async function getMostTakenCourseByYear(year) {
  const registrations = await prisma.registration.findMany({
    where: {
      student: { yearOfStudy: year }
    },
    select: { courseCode: true }
  });
  const courseCounts = {};
  registrations.forEach(r => {
    courseCounts[r.courseCode] = (courseCounts[r.courseCode] || 0) + 1;
  });
  let maxCourse = null, maxCount = 0;
  for (const [courseCode, count] of Object.entries(courseCounts)) {
    if (count > maxCount) {
      maxCourse = courseCode;
      maxCount = count;
    }
  }
  if (!maxCourse) return null;
  const course = await prisma.course.findUnique({ where: { code: maxCourse } });
  return { year, course: course?.name || maxCourse, count: maxCount };
}

const mostTakenCoursesByYear = await Promise.all([
  getMostTakenCourseByYear(1),
  getMostTakenCourseByYear(2),
  getMostTakenCourseByYear(3),
  getMostTakenCourseByYear(4),
]);

// Calculate failure rates per category
const failureRateCategoryData = Object.entries(categoryMap).map(([category, { total, failures }]) => ({
  category,
  failureRate: total > 0 ? (failures / total) * 100 : 0
}));
    const studentsPerYear = await prisma.student.groupBy({
        by: ['yearOfStudy'],
        _count: { yearOfStudy: true },
      });



// Most failed course by category
const categories = ['CS', 'Engineering', 'Math', 'Physics'];
const mostFailedCourseByCategory = [];

for (const category of categories) {
  const courses = await prisma.course.findMany({
    where: { category },
    select: { code: true, name: true }
  });

  let maxFailures = 0;
  let mostFailedCourse = null;

  for (const course of courses) {
    const failures = await prisma.registration.count({
      where: {
        courseCode: course.code,
        grade: 'F'
      }
    });
    if (failures > maxFailures) {
      maxFailures = failures;
      mostFailedCourse = { category, course: course.name, failures };
    }
  }

  if (mostFailedCourse) {
    mostFailedCourseByCategory.push(mostFailedCourse);
  }
}

      
    return Response.json({
      totalStudents,
      totalCourses,
      topCourses,
      csStudentsCourseData,
      ceStudentsCourseData,
      csCePassRateData,
      firstYearGradeDistribution,
      mostTakenCoursesByYear,
      failureRateCategoryData,
      mostFailedCourseByCategory,
      studentsPerYear,
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
