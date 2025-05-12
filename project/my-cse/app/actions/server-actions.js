import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MyCSERepo {
  // Authentication
  async getUserByEmailAndPassword(email, password) {
    return await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
      include: {
        student: true,
        instructor: true,
        admin: true
      }
    });
  }

  // Student operations
  async getStudentById(studentId) {
    return await prisma.student.findUnique({
      where: { studentId },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  }

  // Course operations
  async getAllCourses() {
    return await prisma.course.findMany({
      select: {
        code: true,
        name: true,
        category: true,
        credits: true,
        description: true
      }
    });
  }

  async getCourseById(courseCode) {
    return await prisma.course.findUnique({
      where: { code: courseCode },
      include: {
        prerequisites: true  
      }
    });
  }

  async getCoursesByCategory(category) {
    return await prisma.course.findMany({
      where: { category },
      select: {
        code: true,
        name: true,
        category: true,
        credits: true,
        description: true
      }
    });
  }

  async createCourse(courseData) {
    return await prisma.course.create({ data: courseData });
  }

  async updateCourse(courseCode, updatedData) {
    return await prisma.course.update({
      where: { code: courseCode },
      data: updatedData,
    });
  }

  async deleteCourse(courseCode) {
    return await prisma.course.delete({
      where: { code: courseCode },
    });
  }

  // Semester offerings
  async getOfferedCourses(semester) {
    return await prisma.semesterOffering.findMany({
      where: { semester },
      include: { 
        course: {
          select: {
            code: true,
            name: true,
            category: true,
            credits: true
          }
        } 
      }
    });
  }

  // Sections
  async getCourseSections(courseCode) {
    return await prisma.section.findMany({
      where: { courseCode },
      include: { 
        instructor: {
          select: {
            name: true
          }
        }
      }
    });
  }

  async getAllSections() {
    return await prisma.section.findMany({
      include: {
        course: {
          select: {
            code: true,
            name: true
          }
        },
        instructor: {
          select: {
            name: true
          }
        }
      }
    });
  }

  async updateSection(sectionId, updatedData) {
    return await prisma.section.update({
      where: { id: sectionId },
      data: updatedData,
    });
  }

  // Registrations
  async getStudentRegistrations(studentId) {
    return await prisma.registration.findMany({
      where: { studentId },
      include: { 
        section: true, 
        course: true 
      }
    });
  }

  async getCompletedCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "completed",
      },
      include: { 
        course: {
          select: {
            code: true,
            name: true,
            category: true,
            credits: true
          }
        } 
      }
    });
  }

  async getCompletedCredits(studentId) {
    const completedCourses = await this.getCompletedCourses(studentId);
    return completedCourses.reduce(
      (sum, reg) => sum + (reg.course?.credits || 0),
      0
    );
  }

  async getInProgressCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "in-progress",
      },
      include: { 
        course: {
          select: {
            code: true,
            name: true,
            category: true,
            credits: true
          }
        } 
      }
    });
  }

  async getPendingCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "pending",
      },
      include: { 
        course: {
          select: {
            code: true,
            name: true,
            category: true,
            credits: true
          }
        } 
      }
    });
  }

  async getAllCoursesForStudent(studentId) {
    return await prisma.registration.findMany({
      where: { studentId },
      include: {
        course: {
          select: {
            code: true,
            name: true,
            category: true,
            credits: true
          }
        },
        section: {
          select: {
            id: true,
            schedule: true,
            location: true
          }
        }
      }
    });
  }

  // Prerequisites
  async getCoursePrerequisites(courseCode) {
    return await prisma.coursePrerequisite.findMany({
      where: { courseCode },
    });
  }

  // Student preferences
  async getStudentPreferences(studentId) {
    return await prisma.registration.findMany({
      where: { studentId },
      include: {
        preferences: {
          include: {
            section: true
          }
        }
      }
    });
  }

  // Registration creation
  async createRegistration(data) {
    return await prisma.registration.create({
      data: {
        studentId: data.studentId,
        courseCode: data.courseCode,
        sectionId: data.sectionId,
        semester: data.semester || "2023-2024",
        status: data.status || "pending",
      }
    });
  }

  // Course registration data
  async getCourseRegistrationData(studentId, courseCode) {
    const student = await this.getStudentById(studentId);
    const course = await this.getCourseById(courseCode);
    const sections = await this.getCourseSections(courseCode);
    const unmet = await this.getCoursePrerequisites(courseCode);

    return { student, course, sections, unmet };
  }

  // Statistics
  async getTotalStudentsByYear() {
    return await prisma.student.groupBy({
      by: ['yearOfStudy'],
      _count: {
        studentId: true
      },
      orderBy: {
        yearOfStudy: 'asc'
      }
    });
  }
}

export default new MyCSERepo();