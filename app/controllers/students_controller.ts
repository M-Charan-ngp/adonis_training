import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import { Exception } from '@adonisjs/core/exceptions'
import StudentRepository from '#repositories/student_repository'
import StudentDomain from '#domain/student_domain'
import Student from '#models/student'
import EnrollmentService from '#services/enrollment_service'
import { 
  createStudentValidator, 
  updateStudentValidator, 
  getStudentQueryValidator, 
  putEnrollQueryValidator 
} from '#validators/student'

export default class StudentsController {
  protected repository = new StudentRepository()
  protected domain = new StudentDomain()
  protected enrollmentService = new EnrollmentService()

  private messages = {
    'regNo.regex': 'The roll number is not in the proper format (e.g., 24ABC1234).',
    'regNo.unique': 'This roll number is already registered.',
    'email.unique': 'This email address is already in use.',
    'departmentId.exists': 'The selected department does not exist.',
  }

  async index({ request }: HttpContext) {
    const query = await request.validateUsing(getStudentQueryValidator)
    const raw = await this.repository.list(query)
    const data = await this.domain.transformList(raw)
    return { status: true, data }
  }

  async store({ request }: HttpContext) {
    const validated = await request.validateUsing(createStudentValidator, {
      messagesProvider: new SimpleMessagesProvider(this.messages),
    })
    const dbData = await this.domain.prepareForStorage(validated)
    const student = await this.repository.store(dbData)
    const data = await this.domain.transformSingle(student)
    return { status: true, message: 'Student created successfully', data }
  }

  async show({ params, request }: HttpContext) {
    const queryData = await request.validateUsing(getStudentQueryValidator)
    const student = await this.repository.getById(params.id, queryData)
    const data = await this.domain.transformSingle(student)
    return { status: true, data }
  }

  async enroll({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(putEnrollQueryValidator)
    const user = auth.user as Student
    const studentId = user.id

    const alreadyEnrolled = await this.repository.checkEnrollment(studentId, payload.courseId)
    if (alreadyEnrolled) {
      throw new Exception('Student is already enrolled in this course', { status: 400 })
    }
    await this.repository.saveSyncEnrollment(studentId, payload.courseId)
    await this.enrollmentService.logEnrollment(studentId, payload.courseId)

    return { status: true, message: 'Enrollment successful' }
  }

  async update({ params, request }: HttpContext) {
    const validated = await request.validateUsing(updateStudentValidator, {
      messagesProvider: new SimpleMessagesProvider(this.messages),
      meta: { studentId: params.id }
    })
    const dbData = await this.domain.prepareForUpdate(validated)
    const student = await this.repository.update(params.id, dbData)
    const data = await this.domain.transformSingle(student)
    return { status: true, message: 'Student updated successfully', data }
  }

  async destroy({ params }: HttpContext) {
    await this.repository.delete(params.id)
    return { status: true, message: 'Student deleted successfully' }
  }
}