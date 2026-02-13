import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { JwtService } from '#services/jwt_service'
import User from '#models/user' 

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ message: 'Missing or invalid token' })
    }

    const token = authHeader.split(' ')[1]
    const payload = JwtService.verify(token) as { id: number; name: string; role: string }

    if (!payload || !payload.id) {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }
    const user = await User.find(payload.id)
    
    if (!user) {
      return ctx.response.unauthorized({ message: 'User record not found' })
    }
    ctx.user = user 
    
    return next()
  }
}