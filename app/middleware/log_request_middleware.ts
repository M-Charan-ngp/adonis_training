import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LogRequestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    console.log(`[SERVER] ${ctx.request.method()}: ${ctx.request.url()}`)
    const output = await next()
    console.log("request Finished")
    return output
  }
}
