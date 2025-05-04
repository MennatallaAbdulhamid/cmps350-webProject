import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

class MyCSERepo {
    async getAllStudents() {
        return await prisma.student.findMany({
            include: { user: true }
        })
    }

    async getStudentById(studentId) {
        return await prisma.student.findUnique({
            where: { id: parseInt(studentId) },
            include: { user: true }
        })
    }

    async createStudent(studentData) {
        return await prisma.student.create({ data: studentData })
    }

    async updateStudent(studentId, updatedData) {
        return await prisma.student.update({ data: updatedData, where: { id: parseInt(studentId) } })
    }

    async deleteStudent(studentId) {
        return await prisma.student.delete({
            where: { id: parseInt(studentId) }
        })
    }
    async getAllCourses() {
        return await prisma.course.findMany({
            include: { prerequisites: true }
        })
    }

    async getCourseById(courseId) {
        return await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            include: { prerequisites: true }
        })
    }
    async createCourse(courseData) {
        return await prisma.course.create({ data: courseData })
    }

    async updateCourse(courseId, updatedData) {
        return await prisma.course.update({ data: updatedData, where: { id: parseInt(courseId) } })
    }
    async deleteCourse(courseId) {
        return await prisma.course.delete({
            where: { id: parseInt(courseId) }
        })
    }
    async getAllSemesterOfferings() {
        return await prisma.semesterOffering.findMany({
            include: { course: true, sections: true }
        })
    }
    

}

export default new MyCSERepo()