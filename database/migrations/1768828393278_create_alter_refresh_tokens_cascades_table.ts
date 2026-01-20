import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'refresh_tokens'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // 1. Drop the existing foreign key constraint
      // Note: Adonis usually names constraints as 'tablename_columnname_foreign'
      table.dropForeign('student_id')

      // 2. Re-add the foreign key with ON DELETE CASCADE
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE') 
        .alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('student_id')
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .alter()
    })
  }
}