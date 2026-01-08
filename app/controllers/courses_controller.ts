import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { createCourseValidator, updateCourseValidator,getCourseQueryValidator } from '#validators/course'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'courseCode.regex': 'The course code not in the proper format: (e.g., CS101)',
  'courseCode.unique': 'This course code is already registered',
  'departmentId.exists': 'The selected department does not exist',
}

export default class CoursesController {
  // List all courses

async index({ request, response }: HttpContext) {
  const queryData = await request.validateUsing(getCourseQueryValidator)
  const query = Course.query()
  if (queryData.department) {
    query.preload('department')
  }
  if (queryData.students) {
    query.preload('students')
  }
  const courses = await query
  return response.ok(courses)
}

  // add course
  async store({ request, response }: HttpContext) {
    // try {
      const data = await request.validateUsing(createCourseValidator, {
        messagesProvider: new SimpleMessagesProvider(messages),
      })
      const course = await Course.create(data)
      return response.created(course)
    // } catch (error) {
    //   if (error.status === 422) 
    //     return response.unprocessableEntity(error.messages)

    //   return response.badRequest({
    //     error: 'Course creation failed',
    //     message: error.message,
    //   })
    // }
  }

  /**
   * Show a single course
   */
async show({ params, request, response }: HttpContext) {
  const queryData = await request.validateUsing(getCourseQueryValidator)

  const query = Course.query().where('id', params.id)

  if (queryData.students) {
    query.preload('students')
  }
  if (queryData.department) {
    query.preload('department')
  }

  const course = await query.firstOrFail()
  return response.ok(course)
}

  // Update course
  async update({ params, request, response }: HttpContext) {
    // try {
      const course = await Course.findOrFail(params.id)
    const data = await request.validateUsing(updateCourseValidator, {
      meta: { courseId: params.id }
    })

      course.merge(data)
      await course.save()

      return response.ok(course)
    // } catch (error) {
    //   return response.status(error.status || 400).json({
    //     error: 'Update failed',
    //     message: error.message,
    //   })
    // }
  }

  // Delete Course
  async destroy({ params, response }: HttpContext) {
    // try {
      const course = await Course.findOrFail(params.id)
      await course.delete()

      return response.ok({ message: 'Course deleted successfully' })
    // } catch (error) {
    //   return response.notFound({ error: 'Course not found or already deleted' })
    // }
  }
}