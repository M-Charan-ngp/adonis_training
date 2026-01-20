import Course from '#models/course'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { CourseQueryDto } from '#validators/course'

export default class CourseRepository {
  async list(
    includes: CourseQueryDto
  ): Promise<ModelPaginatorContract<Course>> {
    const query = Course.query()
    if (includes.department) query.preload('department')
    if (includes.students) query.preload('students')
    return await query.paginate(includes.page, includes.limit)
  }

  async getById(id: number, includes: CourseQueryDto): Promise<Course> {
    const query = Course.query().where('id', id)
    if (includes.department) query.preload('department')
    if (includes.students) query.preload('students')
    return await query.firstOrFail()
  }

  async store(dbReadyData: Record<string, any>): Promise<Course> {
    return await Course.create(dbReadyData)
  }

  async update(id: number, dbReadyData: Record<string, any>): Promise<Course> {
    const course = await Course.findOrFail(id)
    return await course.merge(dbReadyData).save()
  }

  async delete(id: number): Promise<void> {
    const course = await Course.findOrFail(id)
    await course.delete()
  }

  async syncStudents(id: number, studentIds: number[]): Promise<void> {
    const course = await Course.findOrFail(id)
    await course.related('students').sync(studentIds, false)
  }
}