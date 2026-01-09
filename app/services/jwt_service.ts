import jwt from 'jsonwebtoken'
import env from '#start/env'

export class JwtService {
  static sign(payload: any) {
    return jwt.sign(payload, env.get('SECRET_KEY'), { expiresIn: '1d' })
  }

  static verify(token: string) {
    try {
      return jwt.verify(token, env.get('SECRET_KEY'))
    } catch {
      return null
    }
  }
}