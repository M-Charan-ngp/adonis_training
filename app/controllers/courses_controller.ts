import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'

export default class CoursesController {

  async index({ response }: HttpContext) {
    const courses = await Course.query().preload('department')
    return response.ok(courses)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['title', 'courseCode', 'credits', 'departmentId'])
    const course = await Course.create(data)
    return response.created(course)
  }

  async show({ params, response }: HttpContext) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('department')
      .preload('students')
      .firstOrFail()
    
    return response.ok(course)
  }

  async update({ params, request, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    const data = request.only(['title', 'courseCode', 'credits', 'departmentId'])
    
    course.merge(data)
    await course.save()
    
    return response.ok(course)
  }

  async destroy({ params, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await course.delete()
    
    return response.ok({ message: 'Course deleted successfully' })
  }
}