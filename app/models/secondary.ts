import { BaseModel } from '@adonisjs/lucid/orm'

export default class Secondary extends BaseModel {
  public static connection = 'mysql2'
  
}