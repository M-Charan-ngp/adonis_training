import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestPathLogMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const start = Date.now()
    console.log(`Incoming Request: [${ctx.request.method()}] ${ctx.request.url()}`)
    const output = await next();
    const duration = Date.now() - start
    console.log(`Response Sent: [${ctx.response.getStatus()}] ${ctx.request.url()} (${duration}ms)`)
    ctx.response.header('X-App-Name', 'AdonisStudentAPI')
    return output
  }
}