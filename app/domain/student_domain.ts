import Student from '#models/student'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { CreateStudentDto, UpdateStudentDto } from '#validators/student'

export default class StudentDomain {
  async prepareForStorage(data: CreateStudentDto): Promise<Record<string, any>> {
    return {
      name: data.name,
      reg_no: data.regNo.trim().toUpperCase(),
      department_id: data.departmentId,
      email: data.email,
      gender: data.gender,
      dob: data.dob,
      phone: data.phone,
    }
  }

  async prepareForUpdate(data: UpdateStudentDto): Promise<Record<string, any>> {
    const payload: Record<string, any> = {}
    if (data.name) payload.name = data.name
    if (data.regNo) payload.reg_no = data.regNo.trim().toUpperCase()
    if (data.departmentId) payload.department_id = data.departmentId
    if (data.email) payload.email = data.email
    if (data.gender) payload.gender = data.gender
    if (data.dob) payload.dob = data.dob
    if (data.phone) payload.phone = data.phone
    return payload
  }

  async transformSingle(student: Student) {
    const response: any = {
      id: student.id,
      name: student.name,
      regNo: student.regNo, 
      email: student.email,
      gender: student.gender,
      dob: student.dob, 
      phone: student.phone,
      departmentId: student.departmentId,
    }

    if (student.department) {
      response.departmentInfo = {
        id: student.department.id,
        name: student.department.name,
      }
    }

    if (student.subjects) {
      response.enrolledCourses = student.subjects.map((subject) => ({
        subjectId: subject.id,
        title: subject.title,
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