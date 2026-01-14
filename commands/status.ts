import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class DbCheck extends BaseCommand {
  static commandName = 'db:check'
  static description = 'Check the health and connection status of the database'

  async run() {
    this.logger.await('Attempting to connect to the database...')

    try {
      const start = Date.now()
      await db.connection().rawQuery('SELECT 1')
      
      const duration = Date.now() - start
      const rawConnection = db.getRawConnection(db.primaryConnectionName)
      const config = rawConnection?.config

      this.logger.success('Database connection established successfully!')

      this.logger.info(`${this.colors.blue('Dialect:')} ${config?.client}`)
      //this.logger.info(`${this.colors.blue('Database:')} ${config?.connection.database || 'N/A'}`)
      this.logger.info(`${this.colors.blue('Latency:')} ${duration}ms`)

    } catch (error) {
      this.logger.error('Failed to connect to the database.')
      this.logger.error(error.message)
      this.exitCode = 1
    }
  }
}