import { DateTime } from "luxon";
import { BaseModel,column,belongsTo } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Student from '#models/student'

export default class RefreshToken extends BaseModel {
    @column({isPrimary:true})
    declare id:number

    @column()
    declare studentId: number

    @column()
    declare token: string

    @column.dateTime()
    declare expiresAt: DateTime

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @belongsTo(()=>Student)
    declare student: BelongsTo<typeof Student>

    get isExpired(){
        return this.expiresAt < DateTime.now()
    }
}
