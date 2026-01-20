import { DateTime } from 'luxon'
import { column } from '@adonisjs/lucid/orm'
import Secondary from './secondary.js'

export default class EnrollLog extends Secondary {
  
  public static table = 'enroll_logs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column()
  declare courseId: number

  @column()
  declare action: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}