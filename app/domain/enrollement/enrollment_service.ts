import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import EnrollmentRepository from './enrollment_repository.js'

@inject()
export default class EnrollmentService {
  constructor(protected repository: EnrollmentRepository) {}

  async enroll(studentId: number, courseId: number) {
    
    const alreadyEnrolled = await this.repository.isStudentEnrolled(studentId, courseId)
    console.log('enroll Service after check')
    console.log(alreadyEnrolled)
    if (alreadyEnrolled) {
      throw new Exception('Student is already enrolled in this course', {
        status: 400,
        code: 'E_ALREADY_ENROLLED'
      })
    }

    return await this.repository.saveEnrollment(studentId, courseId)
  }
}