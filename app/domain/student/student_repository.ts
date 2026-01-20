// app/domain/student/student_repository.ts
import Student from '#models/student'

export default class StudentRepository {
  /**
   * Universal cleaner to strip timestamps from an object and its preloaded relations
   */
  private clean(data: any) {
    // If it's a Lucid Model, convert to JSON first
    const plain = data.toJSON ? data.toJSON() : data
    
    // Remove timestamps from the main object
    const { createdAt, updatedAt, ...rest } = plain

    // Automatically clean preloaded relationships like 'department' or 'courses'
    for (const key in rest) {
      if (rest[key] && typeof rest[key] === 'object') {
        if (Array.isArray(rest[key])) {
          // If relationship is hasMany (like courses), clean each item
          rest[key] = rest[key].map((item: any) => {
            const { createdAt: _, updatedAt: __, ...itemRest } = item
            return itemRest
          })
        } else {
          // If relationship is belongsTo (like department), clean the object
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
      // Use the universal clean method for every row
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