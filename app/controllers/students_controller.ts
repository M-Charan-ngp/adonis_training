import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'

export default class StudentsController {

  async index({ response }: HttpContext) {
    const students = await Student.query().preload('department').preload('courses')
    return response.ok(students)
  }

 
  async store({ request, response }: HttpContext) {
    const data = request.all()
    
    const student = await Student.create({
      rollNo: data.rollNo,
      name: data.name,
      departmentId: data.departmentId
    })

    return response.created(student)
  }

  async show({ params, response }: HttpContext) {
    try {
      const student = await Student.query()
        .where('id', params.id)
        .preload('department')
        .preload('courses')
        .firstOrFail()
        
      return response.ok(student)
    } catch (error) {
      return response.notFound({ error: 'Student not found' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    const data = request.all()

    student.merge(data)
    await student.save()

    return response.ok(student)
  }

  async destroy({ params, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    await student.delete()

    return response.ok({ message: 'Student deleted successfully' })
  }

  public async enroll({ request, response }: HttpContext) {
    const { studentId, courseId } = request.only(['studentId', 'courseId'])
    const student = await Student.findOrFail(studentId)
    
    await student.related('courses').attach([courseId])
    
    return response.ok({ message: 'Enrolled successfully' })
  }
}