import type { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'
import { createDepartmentValidator, updateDepartmentValidator,getDepartmentQueryValidator } from '#validators/department'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'code.unique': 'This Department code is already registered',
  'name.required': 'Department name is required',
}

export default class DepartmentsController {
  
  //  List all departments
  async index({ request }: HttpContext) {
    const queryData = await request.validateUsing(getDepartmentQueryValidator)
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    let query = Department.query()
    query = queryData.students ? query.preload('students'):query;
    query = queryData.courses ? query.preload('courses'):query;

    const departments = await query.paginate(page,limit)
      return {
      status: true,
      data: departments
    }
  }

  // Create a department
  async store({ request }: HttpContext) {
      const data = await request.validateUsing(createDepartmentValidator, {
        messagesProvider: new SimpleMessagesProvider(messages),
      })
      const department = await Department.create(data)
      return {
        status: true,
        message: 'Student created successfully',
        data: department
      }
  }

  //  Show department
async show({ params, request }: HttpContext) {
  const queryData = await request.validateUsing(getDepartmentQueryValidator)
  const query = Department.query().where('id', params.id)
  if (queryData.students) {
    query.preload('students')
  }
  if (queryData.courses) {
    query.preload('courses')
  }
  const department = await query.firstOrFail()
  return {
    status: true,
    data: department
  }
}

  //   Update department
  async update({ params, request }: HttpContext) {
    const data = await request.validateUsing(updateDepartmentValidator, {
        meta: { departmentId: params.id }
    })
    const department = await Department.findOrFail(params.id)
    department.merge(data)
    await department.save()
    return {
      status: true,
      data: department
    }
  }


  //   Delete department
  async destroy({ params }: HttpContext) {
      const department = await Department.findOrFail(params.id)
      await department.delete()
      return { 
        status: true,
        message: 'Department deleted successfully' 
      }
  }
}

