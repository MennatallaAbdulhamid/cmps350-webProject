import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class MyCSERepo {
  async getStudentById(studentId) {
    return await prisma.student.findUnique({
      where: { studentId },
    });
  }

  async getAllCourses() {
    return await prisma.course.findMany({
      include: { prerequisites: true },
    });
  }

  async getCourseByCode(courseCode) {
    return await prisma.course.findUnique({
      where: { code: courseCode },
      include: { prerequisites: true },
    });
  }

  async getCoursesByCategory(category) {
    return await prisma.course.findMany({
      where: { category },
      include: { prerequisites: true },
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

  async getOfferedCourses(semester) {
    return await prisma.semesterOffering.findMany({
      where: { semester },
      include: { course: true },
    });
  }

  async getCourseSections(courseCode) {
    return await prisma.section.findMany({
      where: { courseCode },
      include: { registrations: true },
    });
  }

  async updateSection(sectionId, updatedData) {
    return await prisma.section.update({
      where: { id: sectionId },
      data: updatedData,
    });
  }

  async getStudentRegistrations(studentId) {
    return await prisma.registration.findMany({
      where: { studentId },
      include: { section: true, course: true },
    });
  }

  async getStudentCompletedCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "completed",
      },
      include: { course: true },
    });
  }

  async getStudentCompletedCredits(studentId) {
    const completedCourses = await this.getStudentCompletedCourses(studentId);
    return completedCourses.reduce(
      (sum, reg) => sum + (reg.course?.credits || 0),
      0
    );
  }

  async getStudentInProgressCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "in-progress",
      },
      include: { course: true },
    });
  }

  async getStudentPendingCourses(studentId) {
    return await prisma.registration.findMany({
      where: {
        studentId,
        status: "pending",
      },
      include: { course: true },
    });
  }

  async getCoursePrerequisites(courseCode) {
    return await prisma.coursePrerequisite.findMany({
      where: { courseCode },
    });
  }
  
  async getTotalStudentsByYear() {
    return await prisma.student.groupBy({
      by: ['yearOfStudy'],  // Changed from 'year' to 'yearOfStudy'
      _count: { yearOfStudy: true }, // Changed from 'id' to 'yearOfStudy'
    });
  }

  async getUserByEmailAndPassword(email, password) {
    return await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });
  }
}

export default new MyCSERepo();