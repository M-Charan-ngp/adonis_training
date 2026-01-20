import Student from '#models/student'
import EnrollLog from '#models/enroll_log'

export default class EnrollmentRepository {
  /**
   * Check if the relationship already exists in the pivot table
   */
  async isStudentEnrolled(studentId: number, courseId: number) {
    const student = await Student.findOrFail(studentId)
    const enrollment = await student
      .related('courses')
      .query()
      .where('courses.id', courseId)
      .first()
    
    return !!enrollment
  }

   // Performs the enrollment and logs the action
    async saveEnrollment(studentId: number, courseId: number) {
        const student = await Student.findOrFail(studentId)
    
        await student.related('courses').sync([courseId], false)

        await EnrollLog.create({
      studentId,
      courseId,
      action: 'enrolled'
    })

    return true
  }
}