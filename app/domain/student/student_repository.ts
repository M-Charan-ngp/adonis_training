// app/domain/student/student_repository.ts
import Student from '#models/student'

export default class StudentRepository {
  private clean(data: any) {
    const plain = data.toJSON ? data.toJSON() : data
    
    const { createdAt, updatedAt, ...rest } = plain

    for (const key in rest) {
      if (rest[key] && typeof rest[key] === 'object') {
        if (Array.isArray(rest[key])) {
          rest[key] = rest[key].map((item: any) => {
            const { createdAt: _, updatedAt: __, ...itemRest } = item
            return itemRest
          })
        } else {
          const { createdAt: _, updatedAt: __, ...relRest } = rest[key]
          rest[key] = relRest
        }
      }
    }
    
    return rest
  }

  async getPaginatedData(page: number, limit: number, options: { department?: boolean, courses?: boolean }) {
    const query = Student.query()
    
    if (options.department) query.preload('department')
    if (options.courses) query.preload('courses')

    const result = await query.paginate(page, limit)
    const serialized = result.serialize()

    return {
      meta: serialized.meta,
      data: serialized.data.map((item: any) => this.clean(item))
    }
  }

  async findById(id: number, options: { department?: boolean, courses?: boolean }) {
    const query = Student.query().where('id', id)
    if (options.department) query.preload('department')
    if (options.courses) query.preload('courses')

    const student = await query.firstOrFail()
    return this.clean(student)
  }

  async create(data: any) {
    const student = await Student.create(data)
    return this.clean(student)
  }

  async update(id: number, data: any) {
    const student = await Student.findOrFail(id)
    student.merge(data)
    await student.save()
    return this.clean(student)
  }

  async delete(id: number) {
    const student = await Student.findOrFail(id)
    await student.delete()
    return true
  }
}