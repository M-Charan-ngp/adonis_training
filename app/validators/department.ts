import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const departmentSchema = {
  name: vine.string().trim().minLength(2).maxLength(100),
  code: vine.string().trim().toUpperCase().minLength(2).maxLength(10)
}

export const createDepartmentValidator = vine.compile(
  vine.object({
    ...departmentSchema,
    code: departmentSchema.code.unique(async (db, value) => {
      const match = await db.from('departments').where('code', value).first()
      return !match
    })
  })
)

export const getDepartmentQueryValidator = vine.compile(
  vine.object({
    students: vine.boolean().parse((value) => value ?? false),
    courses: vine.boolean().parse((value) => value ?? false),
    page: vine.number().parse((value) => value ?? 1),
    limit: vine.number().parse((value) => value ?? 10)
  })
)

export const updateDepartmentValidator = vine.compile(
  vine.object({
    name: departmentSchema.name.optional(),
    code: departmentSchema.code.unique(async (db, value, field) => {
      const match = await db.from('departments')
        .where('code', value)
        .whereNot('id', field.meta.departmentId)
        .first()
      return !match
    }).optional()
  })
)

export const deleteDepartmentValidator = vine.compile(
  vine.object({
    name: departmentSchema.name.optional(),
    code: departmentSchema.code.unique(async (db, value, field) => {
      const match = await db.from('departments')
        .where('code', value)
        .whereNot('id', field.meta.departmentId)
        .first()
      return !match
    }).optional()
  })
)

export type CreateDepartmentDto = Infer<typeof createDepartmentValidator>
export type UpdateDepartmentDto = Infer<typeof updateDepartmentValidator>
export type DepartmentQueryDto = Infer<typeof getDepartmentQueryValidator>