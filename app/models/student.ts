import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import RefreshToken from '#models/refresh_token'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Department from '#models/department'
import Course from '#models/course'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare regNo: string

  @column()
  declare name: string

  @column()
  declare gender: string

  @column.date()
  declare dob: DateTime

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare departmentId: number

  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @manyToMany(() => Course, {
    pivotTable: 'enrollments',
    pivotForeignKey: 'student_id',
    pivotRelatedForeignKey: 'course_id',
  })
  declare subjects: ManyToMany<typeof Course>

  @hasMany(() => RefreshToken)
  declare refreshTokens: HasMany<typeof RefreshToken>
 
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(Student);
}