import EnrollLog from '#models/enroll_log'

export default class EnrollmentService {
  /**
   * Handled as a service because it involves external-style logging 
   * (e.g., auditing actions)
   */
  async logEnrollment(studentId: number, courseId: number): Promise<void> {
    await EnrollLog.create({
      studentId,
      courseId,
      action: 'enrolled',
    })
  }
}