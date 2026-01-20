import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import { createCourseValidator, 
  updateCourseValidator,
  getCourseQueryValidator,
  enrollStudentsValidator } from '#validators/course'
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
  const page = request.input('page', 1)
  const limit = request.input('limit', 10)

  let query = Course.query()
  if (queryData.department) {
    query.preload('department')
  }
  if (queryData.students) {
    query.preload('students')
  }
  const courses = await query.paginate(page, limit)
  const serialized = courses.serialize()
  
  const cleanData = serialized.data.map((course: any) => {
    const { createdAt, updatedAt, ...rest } = course
    return rest
  })

  return response.status(200).send({
    status: true,
    data: {
      meta: serialized.meta,
      data: cleanData
    }
  })
}

  // add course
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createCourseValidator, {
      messagesProvider: new SimpleMessagesProvider(messages),
    })
    const course = await Course.create(data)
    return response.created(course)
  }

// Show a single course
  async show({ params, request, response }: HttpContext) {
    const queryData = await request.validateUsing(getCourseQueryValidator)

    let query = Course.query().where('id', params.id)
    query = queryData.students ? query.preload('students') : query;
    query = queryData.department ? query.preload('department') : query;

    const course = await query.firstOrFail()
    return response.ok(course)
  }

  // Update course
  async update({ params, request, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    const data = await request.validateUsing(updateCourseValidator, {
      meta: { courseId: params.id }
    })

    course.merge(data)
    await course.save()

    return response.ok(course)
  }


  async enrollStudents({ params, request, response }: HttpContext) {
    
    const payload = await request.validateUsing(enrollStudentsValidator)
    const course = await Course.findOrFail(params.id)
    await course.related('students').sync(payload.studentIds, false)
    return response.ok({ message: 'Students enrolled successfully.' })
}

  // Delete Course
  async destroy({ params, response }: HttpContext) {
    const course = await Course.findOrFail(params.id)
    await course.delete()
    return response.ok({ message: 'Course deleted successfully' })
  }
}