import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
 
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(error.status).send({
        status: 'fail',
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'EREQUEST') {
      logger.error('DATABASE CONNECTION LOST')
      return ctx.response.status(503).send({
        status: 'error',
        message: 'Service temporarily unavailable (Database Error).',
      })
    }

    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        status: 'error',
        message: 'The requested resource was not found in our database.',
      })
    }

    if (error.code === 'E_ROUTE_NOT_FOUND' || error.status === 404) {
      return ctx.response.status(404).send({
        status: 'error',
        message: 'The requested URL route does not exist.',
      })
    }

    if (error.code === 'E_UNAUTHORIZED_ACCESS' || error.status === 401) {
      return ctx.response.status(401).send({
        status: 'error',
        message: 'You are not authorized to access.',
      })
    }

    const status = error.status || 500
    return ctx.response.status(status).send({
      status: 'error',
      message: this.debug ? error.message : 'An internal server error occurred',
      ...(this.debug && { stack: error.stack }),
    })
  }

  async report(error: any, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}