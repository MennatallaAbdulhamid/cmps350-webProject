// app/actions/statistics-actions.js
'use server'

import { prisma } from "@/lib/prisma"

export async function getStatisticsData() {
  try {
    // Start with just the most basic query to isolate the issue
    console.log("Starting statistics data fetch...");
    
    // Return mock data without any database queries for now
    return {
      totalStudents: 500,
      totalCourses: 50,
      studentsPerYear: [
        { yearOfStudy: 1, _count: { yearOfStudy: 125 } },
        { yearOfStudy: 2, _count: { yearOfStudy: 125 } },
        { yearOfStudy: 3, _count: { yearOfStudy: 125 } },
        { yearOfStudy: 4, _count: { yearOfStudy: 125 } }
      ],
      topCourses: [
        { code: "CS101", name: "Introduction to Programming", count: 120 },
        { code: "CS102", name: "Data Structures", count: 100 },
        { code: "CS103", name: "Algorithms", count: 80 }
      ],
      csStudentsCourseData: [
        { course: "Introduction to Programming", students: 120 },
        { course: "Data Structures", students: 100 },
        { course: "Algorithms", students: 80 }
      ],
      ceStudentsCourseData: [
        { course: "Digital Circuits", students: 90 },
        { course: "Computer Architecture", students: 85 },
        { course: "Signals and Systems", students: 70 }
      ],
      mostTakenCoursesByYear: [
        { year: 1, course: "Introduction to Programming", count: 100 },
        { year: 2, course: "Data Structures", count: 80 },
        { year: 3, course: "Algorithms", count: 60 },
        { year: 4, course: "Capstone Project", count: 50 }
      ],
      failureRateCategoryData: [
        { category: "CS", failureRate: 15 },
        { category: "Engineering", failureRate: 20 },
        { category: "Math", failureRate: 25 }
      ],
      mostFailedCourseByCategory: [
        { category: "CS", course: "Algorithms", failures: 25 },
        { category: "Engineering", course: "Signals and Systems", failures: 30 },
        { category: "Math", course: "Calculus II", failures: 35 }
      ],
      csCePassRateData: [
        { category: "CS", course: "Introduction to Programming", passRate: 90 },
        { category: "CS", course: "Data Structures", passRate: 85 },
        { category: "CS", course: "Algorithms", passRate: 75 },
        { category: "Engineering", course: "Digital Circuits", passRate: 80 },
        { category: "Engineering", course: "Computer Architecture", passRate: 78 },
        { category: "Engineering", course: "Signals and Systems", passRate: 70 }
      ],
      firstYearGradeDistribution: [
        { grade: "A", count: 150 },
        { grade: "B", count: 200 },
        { grade: "C", count: 100 },
        { grade: "D", count: 50 },
        { grade: "F", count: 25 }
      ]
    };
  } catch (error) {
    // Log detailed error information
    console.error('Statistics action detailed error:', error);
    throw new Error(`Failed to fetch statistics data: ${error.message}`);
  }
}