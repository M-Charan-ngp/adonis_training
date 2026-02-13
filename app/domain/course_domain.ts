import Course from '#models/course'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { CreateCourseDto, UpdateCourseDto } from '#validators/course'

export default class CourseDomain {
  async prepareForStorage(data: CreateCourseDto): Promise<Record<string, any>> {
    return {
      title: data.title,
      credits: data.credits,
      department_id: data.departmentId,
      course_code: data.courseCode.trim().toUpperCase(),
    }
  }

  async prepareForUpdate(data: UpdateCourseDto): Promise<Record<string, any>> {
    const payload: Record<string, any> = {}
    if (data.title) payload.title = data.title
    if (data.credits) payload.credits = data.credits
    if (data.departmentId) payload.department_id = data.departmentId
    if (data.courseCode) payload.course_code = data.courseCode.trim().toUpperCase()
    return payload
  }

  async transformSingle(course: Course) {
  const response: any = {
    courseId: course.id,
    title: course.title,
    credits: course.credits,
    courseCode: course.courseCode,
    departmentId: course.departmentId,
    displayName: `${course.courseCode} - ${course.title}`,
  }

  if (course.department) {
    const dept = course.department
    response.departmentInfo = {
      departmentId: dept.id,      
      departmentName: dept.name,  
      departmentCode: dept.code   
    }
  }
  if (course.students) {
    response.enrolledStudents = course.students.map((student) => ({         
      studentName: student.name, 
      rollNumber: student.regNo
    }))
  }

  return response
}

  async transformList(paginator: ModelPaginatorContract<Course>) {
    const serialized = paginator.toJSON()
    const items = await Promise.all(
      paginator.map((item) => this.transformSingle(item))
    )

    return {
      meta: {
        total: serialized.meta.total,
        perPage: serialized.meta.perPage,
        currentPage: serialized.meta.currentPage,
        lastPage: serialized.meta.lastPage,
      },
      items
    }
  }
}