import Department from '#models/department'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { DepartmentQueryDto } from '#validators/department'

export default class DepartmentRepository {
  /**
   * Fetches a paginated list of departments.
   * The 'includes' parameter is strictly typed from the validator.
   */
  async list(
    includes: DepartmentQueryDto
  ): Promise<ModelPaginatorContract<Department>> {
    const query = Department.query()

    if (includes.students) {
      query.preload('students')
    }
    if (includes.courses) {
      query.preload('courses')
    }

    return await query.paginate(includes.page, includes.limit)
  }

  async getById(id: number, includes: DepartmentQueryDto): Promise<Department> {
    const query = Department.query().where('id', id)

    if (includes.students) {
      query.preload('students')
    }
    if (includes.courses) {
      query.preload('courses')
    }

    return await query.firstOrFail()
  }

  async store(dbReadyData: Partial<Department>): Promise<Department> {
    return await Department.create(dbReadyData)
  }

  async update(id: number, dbReadyData: Partial<Department>): Promise<Department> {
    const department = await Department.findOrFail(id)
    return await department.merge(dbReadyData).save()
  }

  async delete(id: number): Promise<void> {
    const department = await Department.findOrFail(id)
    await department.delete()
  }
}