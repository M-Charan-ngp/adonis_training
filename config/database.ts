import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
console.log("config/database.ts");
const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    mysql2: {
        client: 'mysql2',
        connection: {
          host: env.get('DB_HOST'),
          port: env.get('DB_PORT'),
          user: env.get('DB_USER'),
          password: env.get('DB_PASSWORD'),
          database: env.get('DB_DATABASE_2'),
        },
        migrations:{
          naturalSort: true,
          paths: ['database/migrations_secondary']
        }
      },
  },
})

export default dbConfig
