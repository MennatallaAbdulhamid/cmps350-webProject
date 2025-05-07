'use server'
import mycseRepo from "../repo/mycse-repo"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function getAllCoursesAction() {
    return await mycseRepo.getAllCourses()
}
export async function getCourseByIdAction(courseCode) {
    return await mycseRepo.getCourseById(courseCode)
}
export async function getCoursesByCategoryAction(category) {
    return await mycseRepo.getCoursesByCategory(category)
}
export async function getOfferedCoursesAction(semesterOfferingId) {
    return await mycseRepo.getOfferedCourses(semesterOfferingId)
}
export async function getCourseSectionsAction(courseCode) {
    return await mycseRepo.getCourseSections(courseCode)
}

// get completed courses for a given student
export async function getCompletedCoursesAction(studentId) {
    return await mycseRepo.getCompletedCourses(studentId)
}
// get all courses for a given student
export async function getAllCoursesForStudentAction(studentId) {
    return await mycseRepo.getAllCoursesForStudent(studentId)
}
//get in progress courses for a given student
export async function getInProgressCoursesAction(studentId) {
    return await mycseRepo.getInProgressCourses(studentId)
}
// get pending courses for a given student
export async function getPendingCoursesAction(studentId) {
    return await mycseRepo.getPendingCourses(studentId)
}
//student’s total completed credits
export async function getCompletedCreditsAction(studentId) {
    return await mycseRepo.getCompletedCredits(studentId)
}
// get course prerequisites for a given course
export async function getCoursePrerequisitesAction(courseCode) {
    return await mycseRepo.getCoursePrerequisites(courseCode)
}// get all sections for a given course
export async function getAllSectionsAction(courseCode) {
    return await mycseRepo.getAllSections(courseCode)
} 
export async function getDegreeProgressAction(studentId) {
    const completedCredits = await repo.getStudentCompletedCredits(studentId)
    const requiredCredits  = 120
    return { completedCredits, requiredCredits }
  }

//getCourseRegistrationData
export async function getCourseRegistrationData(studentId, courseCode) {
    const student = await mycseRepo.getStudentById(studentId)
    const course = await mycseRepo.getCourseById(courseCode)
    const sections = await mycseRepo.getCourseSections(courseCode)
    const unmet = await mycseRepo.getCoursePrerequisites(courseCode)

    return { student, course, sections, unmet }
}
//getStudentById
export async function getStudentById(studentId) {
    return await mycseRepo.getStudentById(studentId)
}
//getStudentRegistrations
export async function getStudentRegistrations(studentId) {
    return await mycseRepo.getStudentRegistrations(studentId)
}
//getStudentPreferences
export async function getStudentPreferences(studentId) {
    return await mycseRepo.getStudentPreferences(studentId)
}

export async function registerSection(formData) {
    const studentId  = parseInt(formData.get('studentId'), 10)
    const courseCode = parseInt(formData.get('courseCode'), 10)
    const sectionId  = parseInt(formData.get('sectionId'), 10)
  
    // 1) decrement seats
    const secs   = await repo.getCourseSections(courseCode)
    const target = secs.find(s => s.id === sectionId)
    await repo.updateSection(sectionId, {
      availableSeats: target.availableSeats - 1
    })
  
    // 2) create registration
    await repo.createRegistration({
      studentId,
      sectionId,
      status: 'enrolled'
    })
  
    // 3) refresh this page’s data
    revalidatePath(`/course-registration?courseCode=${courseCode}`)
  }