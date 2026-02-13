import EnrollLog from '#models/enroll_log'

export default class EnrollmentService {

  async logEnrollment(studentId: number, courseId: number): Promise<void> {
    await EnrollLog.create({
      studentId,
      courseId,
      action: 'enrolled',
    })
  }
}