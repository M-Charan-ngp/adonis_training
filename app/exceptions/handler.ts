import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  
  protected debug = !app.inDev

  async handle(error: any, ctx: HttpContext) {
    // 1. Validation Errors (VineJS)
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(error.status).send({
        status: false,
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    // 2. Database Connection Issues
    if (error.code === 'ECONNREFUSED' || error.code === 'EREQUEST') {
      logger.error('DATABASE CONNECTION LOST')
      return ctx.response.status(503).send({
        status: false,
        message: 'The database is currently unreachable.',
      })
    }

    // 3. Lucid "Find or Fail" Errors
    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        status: false,
        message: 'The requested resource was not found in our database.',
      })
    }

    // 4. Missing Routes
    if (error.code === 'E_ROUTE_NOT_FOUND' || error.status === 404) {
      return ctx.response.status(404).send({
        status: false,
        message: 'The requested URL route does not exist.',
      })
    }

    // 5. Generic Authorization Errors
    if (error.status === 401) {
      return ctx.response.status(401).send({
        status: false,
        message: 'You are not authorized to access this resource.',
      })
    }

    // 6. JWT Specific: Expired
    if (error.name === 'TokenExpiredError') {
      return ctx.response.status(401).send({
        status: false,
        code: 'E_JWT_EXPIRED',
        message: 'Your session has expired. Please refresh your token.',
      })
    }
    // throwing error in the enrollment service for handling duplicate enrollment
    if (error.code === 'E_ALREADY_ENROLLED') {
      return ctx.response.status(400).send({
        status: false,
        code: 'E_ALREADY_ENROLLED',
        message: 'Course Already Enrolled for this student',
      })
    }

    // 7. JWT Specific: Invalid/Tampered
    if (error.name === 'JsonWebTokenError') {
      return ctx.response.status(401).send({
        status: false,
        code: 'E_INVALID_JWT',
        message: 'Invalid authentication token.',
      })
    }

    // 8. Default fallback (Internal Server Error)
    const status = error.status || 500
    return ctx.response.status(status).send({
      status: false,
      message: this.debug ? error.message : 'An unexpected error occurred.',
      ...(this.debug && { stack: error.stack }),
    })
  }

  async report(error: any, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}