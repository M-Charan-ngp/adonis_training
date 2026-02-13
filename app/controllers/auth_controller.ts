import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { JwtService } from '#services/jwt_service'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * SIGNUP ACTION
   */
  async signup({ request, response }: HttpContext) {
    const { name, email, password, role } = request.only(['name', 'email', 'password', 'role'])

    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.badRequest({ message: 'Email already registered' })
    }
    const hashedPassword = await hash.make(password)
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' 
    })

    return { 
      message: 'Account created successfully', 
      user: { name: user.name, email: user.email, role: user.role } 
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    console.log(user);
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
    const token = JwtService.sign({ 
      id: user.id, 
      name: user.name, 
      role: user.role 
    })

    return {
      message: 'Login successful',
      token: token,
    }
  }
}