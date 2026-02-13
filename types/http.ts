import { HttpContext } from '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    user: {
      name: string
      email: string
      role:string
    }
  }
}