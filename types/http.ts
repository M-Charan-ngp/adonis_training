import { HttpContext } from '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth_user: {
      id: number
      rollNo: string
    }
  }
}