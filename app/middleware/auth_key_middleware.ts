import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class AuthKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const apiKey = ctx.request.header('x-api-key')
    const SECRET_KEY = 'your_secret_key_here' // Ideally move to .env

    if (!apiKey || apiKey !== SECRET_KEY) {
      return ctx.response.unauthorized({ error: 'Invalid or missing API Key' })
    }

    return next()
  }
}