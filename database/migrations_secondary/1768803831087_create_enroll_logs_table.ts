import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
protected tableName = 'enroll_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.integer('student_id').unsigned().notNullable()
      
      table.integer('course_id').unsigned().notNullable()
      
      table.string('action').notNullable().defaultTo('enrolled')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}