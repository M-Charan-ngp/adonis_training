import type { HttpContext } from '@adonisjs/core/http'
import { 
  createCourseValidator, 
  updateCourseValidator, 
  getCourseQueryValidator, 
  enrollStudentsValidator 
} from '#validators/course'
import CourseRepository from '#repositories/course_repository'
import CourseDomain from '#domain/course_domain'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class CoursesController {
  protected repository = new CourseRepository()
  protected domain = new CourseDomain()

  private messages = {
    'courseCode.regex': 'The course code not in the proper format: (e.g., CS101)',
    'courseCode.unique': 'This course code is already registered',
    'departmentId.exists': 'The selected department does not exist',
  }

  async index({ request }: HttpContext) {
    const queryData = await request.validateUsing(getCourseQueryValidator)
    
    const rawData = await this.repository.list(queryData)

    const data = await this.domain.transformList(rawData)
    return { status: true, data }
  }

  async store({ request }: HttpContext) {

  const validatedData = await request.validateUsing(createCourseValidator, {
      messagesProvider: new SimpleMessagesProvider(this.messages),
    })
  const dbReadyData = await this.domain.prepareForStorage(validatedData)
  const course = await this.repository.store(dbReadyData)
  const data = await this.domain.transformSingle(course)

  return { status: true, message: 'Course created successfully.' , data }
}

  async show({ params, request }: HttpContext) {
    const queryData = await request.validateUsing(getCourseQueryValidator)
    
    const rawCourse = await this.repository.getById(params.id, queryData)
    const data = await this.domain.transformSingle(rawCourse)

    return { status: true, data }
  }

  async update({ params, request }: HttpContext) {
    const validatedData = await request.validateUsing(updateCourseValidator, {
      meta: { courseId: params.id },
      messagesProvider: new SimpleMessagesProvider(this.messages),
    })

    const dbReadyData = await this.domain.prepareForUpdate(validatedData)
    const updatedCourse = await this.repository.update(params.id, dbReadyData)
    const data = await this.domain.transformSingle(updatedCourse)

    return { status: true, message: 'Course updated successfully.' , data }
  }

  async enrollStudents({ params, request }: HttpContext) {
    const payload = await request.validateUsing(enrollStudentsValidator)
    
    await this.repository.syncStudents(params.id, payload.studentIds)
    
    return { status: true, message: 'Students enrolled successfully.' }
  }

  async destroy({ params }: HttpContext) {
    await this.repository.delete(params.id)
    return { status: true, message: 'Course deleted successfully' }
  }
}