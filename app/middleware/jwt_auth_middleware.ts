import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { JwtService } from '#services/jwt_service'
import Student from '#models/student'


export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ message: 'Missing or invalid token' })
    }

    const token = authHeader.split(' ')[1]
    const payload = JwtService.verify(token) as { id: number; rollNo: string }
    console.log(payload.rollNo)

    if (!payload) {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }
    const studentExists = await Student.find(payload.id)
    if (!studentExists) {
      return ctx.response.unauthorized({ message: 'Student record not found' })
    }
    ctx.auth_user = payload
    
    return next()
  }
}