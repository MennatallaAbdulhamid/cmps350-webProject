// app/api/statistics/route.js
import { NextResponse } from 'next/server';
import mycseRepo from '@/app/repo/mycse-repo';

export async function GET() {
  try {
    // Basic counts
    const courses = await mycseRepo.getAllCourses();
    const totalCourses = courses.length;
    
    // Get all students
    const students = await prisma.student.findMany();
    const totalStudents = students.length;
    
    // Students per year
    const studentsPerYear = await mycseRepo.getTotalStudentsByYear();
    
    // Get registrations with course info
    const registrations = await prisma.registration.findMany({
      include: {
        course: true,
        student: true
      }
    });
    
    // Top courses by registration count
    const courseCounts = {};
    registrations.forEach(reg => {
      const courseCode = reg.courseCode;
      courseCounts[courseCode] = (courseCounts[courseCode] || 0) + 1;
    });
    
    const topCourses = Object.entries(courseCounts)
      .map(([code, count]) => {
        const course = courses.find(c => c.code === code);
        return {
          code,
          name: course?.name || code,
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    // Filter CS and CE courses
    const csCourses = courses.filter(c => c.category === 'CS');
    const ceCourses = courses.filter(c => c.category === 'Engineering');
    
    // CS courses with student count
    const csStudentsCourseData = csCourses.map(course => {
      const count = registrations.filter(r => r.courseCode === course.code).length;
      return {
        course: course.name,
        students: count
      };
    }).sort((a, b) => b.students - a.students).slice(0, 5);
    
    // CE courses with student count
    const ceStudentsCourseData = ceCourses.map(course => {
      const count = registrations.filter(r => r.courseCode === course.code).length;
      return {
        course: course.name,
        students: count
      };
    }).sort((a, b) => b.students - a.students).slice(0, 5);
    
    // Most taken courses by year
    const coursesByYear = {};
    registrations.forEach(reg => {
      const student = students.find(s => s.studentId === reg.studentId);
      if (student) {
        const year = student.yearOfStudy;
        if (!coursesByYear[year]) coursesByYear[year] = {};
        
        const courseCode = reg.courseCode;
        coursesByYear[year][courseCode] = (coursesByYear[year][courseCode] || 0) + 1;
      }
    });
    
    const mostTakenCoursesByYear = Object.entries(coursesByYear).map(([year, courses]) => {
      const mostTaken = Object.entries(courses)
        .sort((a, b) => b[1] - a[1])[0];
      
      const courseCode = mostTaken[0];
      const count = mostTaken[1];
      const course = courses.find(c => c.code === courseCode);
      
      return {
        year: parseInt(year),
        course: course?.name || courseCode,
        count
      };
    });
    
    // Course pass/fail data
    const courseGrades = {};
    registrations.forEach(reg => {
      if (!reg.grade) return;
      
      const courseCode = reg.courseCode;
      if (!courseGrades[courseCode]) courseGrades[courseCode] = { passes: 0, fails: 0, total: 0 };
      
      courseGrades[courseCode].total += 1;
      if (reg.grade === 'F') {
        courseGrades[courseCode].fails += 1;
      } else {
        courseGrades[courseCode].passes += 1;
      }
    });
    
    // Failure rate by category
    const failuresByCategory = {};
    courses.forEach(course => {
      const category = course.category;
      if (!failuresByCategory[category]) failuresByCategory[category] = { fails: 0, total: 0 };
      
      if (courseGrades[course.code]) {
        failuresByCategory[category].fails += courseGrades[course.code].fails;
        failuresByCategory[category].total += courseGrades[course.code].total;
      }
    });
    
    const failureRateCategoryData = Object.entries(failuresByCategory).map(([category, data]) => ({
      category,
      failureRate: data.total ? Math.round((data.fails / data.total) * 100) : 0
    }));
    
    // Most failed course by category
    const mostFailedCourseByCategory = Object.entries(
      registrations.reduce((acc, reg) => {
        if (reg.grade === 'F') {
          const course = courses.find(c => c.code === reg.courseCode);
          if (course) {
            const category = course.category;
            if (!acc[category]) acc[category] = {};
            if (!acc[category][reg.courseCode]) acc[category][reg.courseCode] = 0;
            acc[category][reg.courseCode]++;
          }
        }
        return acc;
      }, {})
    ).map(([category, courseFails]) => {
      const [courseCode, failures] = Object.entries(courseFails)
        .sort((a, b) => b[1] - a[1])[0];
      const course = courses.find(c => c.code === courseCode);
      return {
        category,
        course: course?.name || courseCode,
        failures
      };
    });
    
    // CS & CE pass rates
    const csCePassRateData = [...csCourses, ...ceCourses].map(course => {
      const grades = courseGrades[course.code] || { passes: 0, total: 0 };
      return {
        category: course.category,
        course: course.name,
        passRate: grades.total ? Math.round((grades.passes / grades.total) * 100) : 0
      };
    });
    
    // First year grade distribution
    const firstYearGrades = registrations.filter(reg => {
      const student = students.find(s => s.studentId === reg.studentId);
      return student && student.yearOfStudy === 1;
    }).reduce((acc, reg) => {
      if (reg.grade) {
        acc[reg.grade] = (acc[reg.grade] || 0) + 1;
      }
      return acc;
    }, {});
    
    const firstYearGradeDistribution = Object.entries(firstYearGrades).map(([grade, count]) => ({
      grade,
      count
    }));
    
    return NextResponse.json({
      totalStudents,
      totalCourses,
      studentsPerYear,
      topCourses,
      csStudentsCourseData,
      ceStudentsCourseData,
      mostTakenCoursesByYear,
      failureRateCategoryData,
      mostFailedCourseByCategory,
      csCePassRateData,
      firstYearGradeDistribution
    });
  } catch (error) {
    console.error('Statistics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}