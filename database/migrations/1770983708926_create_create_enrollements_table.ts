import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE')
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table.unique(['student_id', 'course_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}