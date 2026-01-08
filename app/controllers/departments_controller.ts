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
  async index({ request,response }: HttpContext) {
    // try {
    const queryData = await request.validateUsing(getDepartmentQueryValidator)
    const query = Department.query()
    if (queryData.students) {
      query.preload('students')
    }
    if (queryData.courses) {
      query.preload('courses')
    }
    const departments = await query
      return response.ok(departments)
    // } catch (error) {
    //   return response.internalServerError({ error: 'Could not fetch departments' })
    // }
  }

  // Create a department
  async store({ request, response }: HttpContext) {
    // try {
      const data = await request.validateUsing(createDepartmentValidator, {
        messagesProvider: new SimpleMessagesProvider(messages),
      })
      const department = await Department.create(data)
      return response.created(department)
    // } catch (error) {
      // if (error.status === 422) 
      //   return response.unprocessableEntity(error.messages)
      
      // return response.badRequest({ 
      //   error: 'Failed to create department', 
      //   message: error.message 
      // })
    // }
  }

  //  Show department
async show({ params, request, response }: HttpContext) {
  const queryData = await request.validateUsing(getDepartmentQueryValidator)
  const query = Department.query().where('id', params.id)
  if (queryData.students) {
    query.preload('students')
  }
  if (queryData.courses) {
    query.preload('courses')
  }
  const department = await query.firstOrFail()
  return response.ok(department)
}

  //   Update department
  async update({ params, request, response }: HttpContext) {
    // try {
      const department = await Department.findOrFail(params.id)
      const data = await request.validateUsing(updateDepartmentValidator, {
                              meta: { departmentId: params.id }
                          })

      department.merge(data)
      await department.save()
      return response.ok(department)
    // } catch (error) {
    //   return response.status(error.status || 400).json({ 
    //     error: 'Update failed', 
    //     message: error.message 
    //   })
    // }
  }


  //   Delete department
  async destroy({ params, response }: HttpContext) {
    // try {
      const department = await Department.findOrFail(params.id)
      await department.delete()

      return response.ok({ message: 'Department deleted successfully' })
    // } catch (error) {
    //   return response.notFound({ error: 'Department not found' })
    // }
  }
}

