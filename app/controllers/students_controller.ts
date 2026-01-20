// app/controllers/students_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import StudentService from '#domain/student/student_service'
import EnrollmentService from '#domain/enrollement/enrollment_service'
import { 
  createStudentValidator, 
  updateStudentValidator, 
  getStudentQueryValidator, 
  putEnrollQueryValidator
} from '#validators/student'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'rollNo.regex': 'The roll number is not in the proper format (e.g., 24ABC1234).',
  'rollNo.unique': 'This roll number is already registered.',
  'departmentId.exists': 'The selected department does not exist.',
}

@inject()
export default class StudentsController {
  constructor(
    protected studentService: StudentService,
    protected enrollmentService: EnrollmentService
  ) {}
  // Fetch all students with pagination
  async index({ request }: HttpContext) {
    const queryData = await request.validateUsing(getStudentQueryValidator)
    const result = await this.studentService.fetchAllStudents(queryData)
    
    return {
      status: true,
      data: result
    }
  }


  // Create a new student record

  async store({ request }: HttpContext) {
    const data = await request.validateUsing(createStudentValidator, {
      messagesProvider: new SimpleMessagesProvider(messages),
    })
    
    const student = await this.studentService.createStudent(data)
    
    return {
      status: true,
      message: 'Student created successfully',
      data: student
    }
  }


  // Fetch a single student's details

  async show({ params, request, }: HttpContext) {
    const queryData = await request.validateUsing(getStudentQueryValidator)
    const student = await this.studentService.fetchOneStudent(params.id, queryData)
    
    return {
      status: true,
      data: student
    }
  }


  // Update an existing student record

  async update({ params, request }: HttpContext) {
    const data = await request.validateUsing(updateStudentValidator, {
      messagesProvider: new SimpleMessagesProvider(messages),
      meta: { studentId: params.id }
    })

    const student = await this.studentService.updateStudent(params.id, data)
    
    return {
      status: true,
      message: 'Student updated successfully',
      data: student
    }
  }

  // Delete a student record
  async destroy({ params }: HttpContext) {
    await this.studentService.deleteStudent(params.id)
    
    return {
      status: true,
      message: 'Student deleted successfully'
    }
  }

  // enroll student
  async enroll({ request, auth_user }: HttpContext) {
    console.log("enroll Function")
    const payload = await request.validateUsing(putEnrollQueryValidator)
    
    await this.enrollmentService.enroll(auth_user.id, payload.courseId)

    return {
      status: true,
      message: 'Enrollment Success.'
    }
  }
}