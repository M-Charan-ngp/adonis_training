import Student from '#models/student'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { StudentQueryDto } from '#validators/student'

export default class StudentRepository {
  async list(includes: StudentQueryDto): Promise<ModelPaginatorContract<Student>> {
    const query = Student.query()
    
    if (includes.search) {
      query.where((q) => {
        q.where('name', 'like', `%${includes.search}%`)
        .orWhere('reg_no', 'like', `%${includes.search}%`)
      })
    }
    if (includes.department) query.preload('department')
    if (includes.courses) query.preload('subjects')
    const sortColumn = includes.sortBy === 'regNo' ? 'reg_no' : includes.sortBy
    query.orderBy(sortColumn as any, includes.sortOrder as any)
    return await query.paginate(includes.page, includes.limit)
  }

  async getById(id: number, includes: StudentQueryDto): Promise<Student> {
    const query = Student.query().where('id', id)
    
    if (includes.department) query.preload('department')
    if (includes.courses) query.preload('subjects')
    
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

  async checkEnrollment(studentId: number, subjectId: number): Promise<boolean> {
    const student = await Student.findOrFail(studentId)
    const enrollment = await student.related('subjects').query().where('courses.id', subjectId).first()
    return !!enrollment
  }

  async saveSyncEnrollment(studentId: number, subjectId: number): Promise<void> {
    const student = await Student.findOrFail(studentId)
    await student.related('subjects').sync([subjectId], false)
  }
}