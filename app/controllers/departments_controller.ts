import type { HttpContext } from '@adonisjs/core/http'
import { 
  createDepartmentValidator, 
  getDepartmentQueryValidator, 
  updateDepartmentValidator 
} from '#validators/department'
import DepartmentRepository from '#repositories/department_repository'
import DepartmentDomain from '#domain/department_domain'

export default class DepartmentsController {
  protected repository = new DepartmentRepository()
  protected domain = new DepartmentDomain()

  async index({ request }: HttpContext) {
    const queryData = await request.validateUsing(getDepartmentQueryValidator)
    const rawData = await this.repository.list(queryData)
    
    const data = await this.domain.transformList(rawData)
    return { status: true, data }
  }

  async store({ request }: HttpContext) {
    const validatedData = await request.validateUsing(createDepartmentValidator)
    const dbReadyData = await this.domain.prepareForStorage(validatedData)
    const department = await this.repository.store(dbReadyData)
    const data = await this.domain.transformSingle(department)
    
    return { 
      status: true, 
      message: 'Department created successfully', 
      data 
    }
  }

  async show({ params, request }: HttpContext) {
    const queryData = await request.validateUsing(getDepartmentQueryValidator)

    const rawDepartment = await this.repository.getById(params.id, queryData)
    const data = await this.domain.transformSingle(rawDepartment)

    return { status: true, data }
  }

  async update({ params, request }: HttpContext) {
    const validatedData = await request.validateUsing(updateDepartmentValidator, {
      meta: { departmentId: params.id }
    })

    const dbReadyData = await this.domain.prepareForUpdate(validatedData)
    const updatedRecord = await this.repository.update(params.id, dbReadyData)
    const data = await this.domain.transformSingle(updatedRecord)

    return { status: true, data }
  }

  async destroy({ params }: HttpContext) {
    await this.repository.delete(params.id)
    return { 
      status: true, 
      message: 'Department deleted successfully' 
    }
  }
}