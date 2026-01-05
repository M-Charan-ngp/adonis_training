import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Department from '#models/department'
import Student from '#models/student'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare courseCode: string

  @column()
  declare credits: number

  @column()
  declare departmentId: number

  @belongsTo(() => Department)
  declare department: BelongsTo<typeof Department>

  @manyToMany(() => Student, {
    pivotTable: 'enrollments',
    pivotForeignKey: 'course_id',
    pivotRelatedForeignKey: 'student_id',
  })
  declare students: ManyToMany<typeof Student>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}