'use server'
import mycseRepo from "../repo/mycse-repo"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function getAllCoursesAction() {
    return await mycseRepo.getAllCourses()
}
export async function getCourseByIdAction(courseId) {
    return await mycseRepo.getCourseById(courseId)
}

