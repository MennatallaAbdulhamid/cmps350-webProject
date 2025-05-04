import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

class MyCSERepo {

    async getStudentById(studentId) {
        return await prisma.student.findUnique({
            where: { id: parseInt(studentId) },
            include: { user: true }
        })
    }

    async getAllCourses() {
        return await prisma.course.findMany({
            include: { prerequisites: true }
        })
    }

    async getCourseById(courseCode) {
        return await prisma.course.findUnique({
            where: { id: parseInt(courseCode) },
            include: { prerequisites: true }
        })
    }

    //get all courses for a given category
    async getCoursesByCategory(category) {
        return await prisma.course.findMany({
            where: { category: category },
            include: { prerequisites: true }
        })
    }

    async createCourse(courseData) {
        return await prisma.course.create({ data: courseData })
    }

    async updateCourse(courseCode, updatedData) {
        return await prisma.course.update({ data: updatedData, where: { id: parseInt(courseCode) } })
    }
    async deleteCourse(courseCode) {
        return await prisma.course.delete({
            where: { id: parseInt(courseCode) }
        })
    }
   //get offered courses for a given semester offering
    async getOfferedCourses(semesterOfferingId) {
        return await prisma.course.findMany({
            where: { semesterOfferingId: parseInt(semesterOfferingId) },
            include: { prerequisites: true }
        })
    }

    //get a section for a a given course 
    async getCourseSections(courseCode) {
        return await prisma.section.findMany({
            where: { courseCode: courseCode },
            include: { semesterOffering: true, registrations: true }
        })
    }

    //for a given sectionId, update the section data like availableSeats, schedule, etc.
    async updateSection(sectionId, updatedData) {
        return await prisma.section.update({ data: updatedData, where: { id: parseInt(sectionId) } })
    }
  
    //get all registrations for a given student
    async getStudentRegistrations(studentId) {
        return await prisma.registration.findMany({
            where: { studentId: parseInt(studentId) },
            include: { section: true, course: true }
        })
    }
    //get all preferences for a given student
    async getStudentPreferences(studentId) {
        return await prisma.preference.findMany({
            where: { studentId: parseInt(studentId) },
            include: { section: true, course: true }
        })
    }
    //get all completed courses for a given student
    async getStudentCompletedCourses(studentId) {
        return await prisma.registration.findMany({
            where: { studentId: parseInt(studentId), status: "completed" },
            include: { section: true, course: true }
        })
    }
    //get all pending courses for a given student
    async getStudentPendingCourses(studentId) {
        return await prisma.registration.findMany({
            where: { studentId: parseInt(studentId), status: "pending" },
            include: { section: true, course: true }
        })
    }
    //get all in progress courses for a given student
    async getStudentInProgressCourses(studentId) {
        return await prisma.registration.findMany({
            where: { studentId: parseInt(studentId), status: "in-progress" },
            include: { section: true, course: true }
        })
    }

    //get total credits for a given student
    async getStudentCompletedCredits(studentId) {
        const completedCourses = await this.getStudentCompletedCourses(studentId)
        const totalCredits = completedCourses.reduce((acc, course) => acc + course.course.credits, 0)
        return totalCredits
    }
    
    //get prerequisites for a given course
    async getCoursePrerequisites(courseCode) {
        return await prisma.coursePrerequisite.findMany({
            where: { courseCode: parseInt(courseCode) },
            include: { prerequisite: true }
        })
    }

    




}

export default new MyCSERepo()