import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

export default class AuthKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const apiKey = ctx.request.header('api-key')
    const SECRET_KEY = env.get("SECRET_KEY")
    if (!apiKey || apiKey !== SECRET_KEY) {
      return ctx.response.unauthorized({ error: 'Invalid or missing API Key' })
    }

    return next()
  }
}