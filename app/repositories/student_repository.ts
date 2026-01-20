import Student from '#models/student'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { StudentQueryDto } from '#validators/student'

export default class StudentRepository {
  async list(includes: StudentQueryDto): Promise<ModelPaginatorContract<Student>> {
  const query = Student.query()
  if (includes.search) {
    query.where((q) => {
      q.where('name', 'like', `%${includes.search}%`)
       .orWhere('roll_no', 'like', `%${includes.search}%`)
    })
  }
  if (includes.department) query.preload('department')
  if (includes.courses) query.preload('courses')
  query.orderBy(includes.sortBy as any, includes.sortOrder as any)

  return await query.paginate(includes.page, includes.limit)
}

  async getById(id: number, includes: StudentQueryDto): Promise<Student> {
    const query = Student.query().where('id', id)
    if (includes.department) query.preload('department')
    if (includes.courses) query.preload('courses')
    return await query.firstOrFail()
  }

  async store(dbReadyData: Partial<Student>): Promise<Student> {
    return await Student.create(dbReadyData)
  }

  async update(id: number, dbReadyData: Partial<Student>): Promise<Student> {
    const student = await Student.findOrFail(id)
    return await student.merge(dbReadyData).save()
  }

  async delete(id: number): Promise<void> {
    const student = await Student.findOrFail(id)
    await student.delete()
  }

  async checkEnrollment(studentId: number, courseId: number): Promise<boolean> {
    const student = await Student.findOrFail(studentId)
    const enrollment = await student.related('courses').query().where('courses.id', courseId).first()
    return !!enrollment
  }

  async saveSyncEnrollment(studentId: number, courseId: number): Promise<void> {
    const student = await Student.findOrFail(studentId)
    await student.related('courses').sync([courseId], false)
  }
}