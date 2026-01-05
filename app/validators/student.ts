import vine from '@vinejs/vine'

export const createStudentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),

    rollNo: vine.string().trim()
      .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/) 
      .unique(async (db, value) => {
        const match = await db.from('students').where('roll_no', value).first()
        return !match
      }),
    departmentId: vine.number().exists(async (db, value) => {
      return await db.from('departments').where('id', value).first()
    }),
  })
)