import vine from '@vinejs/vine'


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
    students: vine.boolean().optional(),
    courses: vine.boolean().optional(),
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