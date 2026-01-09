import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import { createStudentValidator, 
  updateStudentValidator, 
  getStudentQueryValidator,
  putEnrollQueryValidator } from '#validators/student'
import { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  'rollNo.regex': 'The roll number not in the proper format: (e.g., 24ABC1234)',
  'rollNo.unique': 'This roll number is already registered',
  'departmentId.exists': 'The selected department does not exist',
}

export default class StudentsController {
  // Get all students
  async index({ response, request }: HttpContext) {
    // try {
  const queryData = await request.validateUsing(getStudentQueryValidator)
  const query = Student.query()

  if (queryData.department) {
    query.preload('department')
  }

  if (queryData.courses) {
    query.preload('courses')
  }

  const students = await query
  return response.ok(students)
    // } catch (error) {
    //   return response.internalServerError({ error: 'Could not fetch students' })
    // }
  }

  // Create a new student
  async store({ request, response }: HttpContext) {
    // try {
      const data = await request.validateUsing(createStudentValidator, {
        messagesProvider: new SimpleMessagesProvider(messages),
      })
      const student = await Student.create(data)
      return response.created(student)
    // } catch (error) {

    //   if (error.status === 422)
    //     return response.unprocessableEntity(error.messages)
    //   return response.badRequest({ error: 'Failed to create student', details: error.message })
    // }
  }



  // // Show a single student
  // async show({ params, response }: HttpContext) {
  //   // try {
  //     const student = await Student.query()
  //       .where('id', params.id)
  //       .preload('courses')
  //       .firstOrFail()

  //     return response.ok(student)
  //   // } catch (error) {
  //   //   return response.notFound({ error: 'Student not found' })
  //   // }
  // }

  async show({ params, request, response }: HttpContext) {
    const queryData = await request.validateUsing(getStudentQueryValidator)
    const query = Student.query().where('id', params.id)
    if (queryData.courses) {
      query.preload('courses')
    }
    if (queryData.department) {
      query.preload('department')
    }
    const student = await query.firstOrFail()

    return response.ok(student)
  }
  

  // Update student
  async update({ params, request, response }: HttpContext) {
    // try {
      const student = await Student.findOrFail(params.id)
      const data = await request.validateUsing(updateStudentValidator,{
        messagesProvider: new SimpleMessagesProvider(messages),
        meta: { studentId: student.id }
      })

      student.merge(data)
      await student.save()

      return response.ok(student)
    // } catch (error) {
    //   return response.status(error.status || 400).json({ error: 'Update failed', message: error.message })
    // }
  }

  // Delete student
  async destroy({ params, response }: HttpContext) {
    // try {
      const student = await Student.findOrFail(params.id)
      await student.delete()

      return response.ok({ message: 'Student deleted successfully' })
    // } catch (error) {
    //   return response.notFound({ error: 'Student not found or already deleted' })
    // }
  }

  // Enroll student in a course
  async enroll({ request, response, auth_user }: HttpContext) {
    const payload = await request.validateUsing(putEnrollQueryValidator)
    const student = await Student.findOrFail(auth_user.id)
    await student.related('courses').sync([payload.courseId], false)

    return response.ok({ 
      message: `You have successfully enrolled in the course.` 
    })
  }
}