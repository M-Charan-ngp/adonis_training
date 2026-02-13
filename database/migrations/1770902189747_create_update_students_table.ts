import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('roll_no', 'reg_no')

      table.string('gender', 20).nullable()
      table.date('dob').nullable() 
      table.string('phone', 10).nullable()
      table.string('email').unique().notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('reg_no', 'roll_no')
      table.dropColumns('gender', 'dob', 'phone', 'email')
    })
  }
}