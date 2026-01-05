import type { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'

export default class DepartmentsController {
  async index({ response }: HttpContext) {
    const departments = await Department.all()
    return response.ok(departments)
  }
  
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'code'])
    const department = await Department.create(data)
    return response.created(department)
  }

  async show({ params, response }: HttpContext) {
    const department = await Department.query()
      .where('id', params.id)
      .preload('students')
      .preload('courses')
      .firstOrFail()
    
    return response.ok(department)
  }

  async update({ params, request, response }: HttpContext) {
    const department = await Department.findOrFail(params.id)
    const data = request.only(['name', 'code'])
    
    department.merge(data)
    await department.save()
    
    return response.ok(department)
  }

  async destroy({ params, response }: HttpContext) {
    const department = await Department.findOrFail(params.id)
    await department.delete()
    
    return response.ok({ message: 'Department deleted successfully' })
  }
}