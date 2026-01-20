// app/controllers/auth_controller.ts
import Student from '#models/student'
import RefreshToken from '#models/refresh_token'
import { JwtService } from '#services/jwt_service'
import { rollNumberValidator } from '#validators/auth'
import { DateTime } from 'luxon'
import { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(rollNumberValidator)
    console.log(data.rollNo)

    const query = Student.query().where('roll_no', data.rollNo)
    const student = await query.firstOrFail()
    console.log(student.id)
    if (!student) {
      return response.notFound({ 
        message: 'No student found with this Roll Number.' 
      })
    }
    console.log("student verified") 
    const token = JwtService.sign({ 
      id: student.id, 
      rollNo: student.rollNo 
    })
    console.log("jwt created")
    const refreshTokenValue = string.random(64)

    await RefreshToken.create({
      studentId: student.id,
      token: refreshTokenValue,
      expiresAt: DateTime.now().plus({ days: 30 })
    })
    response.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: '30d'
    })
    console.log("cookie loaded")
    return response.ok({
      message: 'Login successful',
      token: token,
      studentName: student.name
    })
  }

async refresh({ request, response }: HttpContext) {
  const tokenValue = request.cookie('refreshToken')

  if (!tokenValue) {
    return response.unauthorized({ message: 'Session expired' })
  }

  const storedToken = await RefreshToken.query()
    .where('token', tokenValue)
    .where('expires_at', '>', DateTime.now().toSQL())
    .preload('student')
    .first()

  if (!storedToken) {
    return response.unauthorized({ message: 'Invalid session' })
  }

  const student = storedToken.student
  const newAccessToken = JwtService.sign({ 
    id: student.id, 
    rollNo: student.rollNo 
  })

  return response.ok({
    token: newAccessToken
  })
}
}