// app/controllers/auth_controller.ts
import Student from '#models/student'
import { JwtService } from '#services/jwt_service'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { rollNo } = request.only(['rollNo'])
    const student = await Student.findBy('roll_no', rollNo)
    if (!student) {
      return response.notFound({ 
        message: 'No student found with this Roll Number.' 
      })
    }
    const token = JwtService.sign({ 
      id: student.id, 
      rollNo: student.rollNo 
    })
    return response.ok({
      message: 'Login successful',
      token: token,
      studentName: student.name
    })
  }
}