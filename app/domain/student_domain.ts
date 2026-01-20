import Student from '#models/student'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { CreateStudentDto, UpdateStudentDto } from '#validators/student'

export default class StudentDomain {
  async prepareForStorage(data: CreateStudentDto): Promise<Record<string, any>> {
    return {
      name: data.name,
      roll_no: data.rollNo.trim().toUpperCase(),
      department_id: data.departmentId,
    }
  }

  async prepareForUpdate(data: UpdateStudentDto): Promise<Record<string, any>> {
    const payload: Record<string, any> = {}
    if (data.name) payload.name = data.name
    if (data.rollNo) payload.roll_no = data.rollNo.trim().toUpperCase()
    if (data.departmentId) payload.department_id = data.departmentId
    return payload
  }

  /** OUTBOUND: snake_case -> camelCase Display */
  async transformSingle(student: Student) {
    const response: any = {
      studentId: student.id,
      name: student.name,
      rollNo: student.rollNo,
      departmentId: student.departmentId,
    }

    if (student.department) {
      response.departmentInfo = {
        id: student.department.id,
        name: student.department.name,
      }
    }

    if (student.courses) {
      response.enrolledCourses = student.courses.map((course) => ({
        courseId: course.id,
        title: course.title,
        courseCode: course.courseCode,
      }))
    }

    return response
  }

  async transformList(paginator: ModelPaginatorContract<Student>) {
    const items = await Promise.all(paginator.map((item) => this.transformSingle(item)))
    return {
      meta: paginator.toJSON().meta,
      items,
    }
  }
}