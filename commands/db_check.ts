import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class DbCheck extends BaseCommand {
  static commandName = 'db:check'
  static description = 'Check the db connection status of the database and tables present in the database'
  static options = {
    startApp: true,
  }

  async run() {
  this.logger.await('Fetching list of tables from the database...')

  try {
    const connection = db.connection('mysql2')
    const [rows] = await connection.rawQuery('SHOW TABLES')
    
    if (!rows || rows.length === 0) {
      this.logger.info('Connection successful, but the database is empty (no tables found).')
      return
    }

    this.logger.success(`Found ${rows.length} table(s):`)
    rows.forEach((row: any) => {
      const tableName = Object.values(row)[0]
      this.logger.info(`  ${this.colors.cyan('->')} ${tableName}`)
    })

  } catch (error) {
    this.logger.error('Failed to retrieve tables.')
    this.logger.error(`Message: ${error.message}`)
    this.exitCode = 1
  }
}
}