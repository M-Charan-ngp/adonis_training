// app/domain/student/student_service.ts
import { inject } from '@adonisjs/core'
import StudentRepository from './student_repository.js'



@inject()
export default class StudentService {
  constructor(protected repository: StudentRepository) {}

  async fetchAllStudents(queryData: any) {
    const page = queryData.page || 1
    const limit = queryData.limit || 10

    const result = await this.repository.getPaginatedData(page, limit, {
      department: !!queryData.department,
      courses: !!queryData.courses
    })

    // Safely process the already cleaned data
    result.data = result.data.map((student: any) => ({
      ...student,
      rollNo: student.rollNo?.toUpperCase(),
    }))

    return result
  }

  async fetchOneStudent(id: number, queryData: any) {
    const student = await this.repository.findById(id, {
      department: !!queryData.department,
      courses: !!queryData.courses
    })

    return {
      ...student,
      welcome_message: `Welcome back, ${student.name}`,
      rollNo: student.rollNo?.toUpperCase()
    }
  }

  async createStudent(data: any) {
    return await this.repository.create(data)
  }

  async updateStudent(id: number, data: any) {
    return await this.repository.update(id, data)
  }

  async deleteStudent(id: number) {
    return await this.repository.delete(id)
  }
}