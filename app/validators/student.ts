import vine from '@vinejs/vine'

const sharedSchema = {
  name: vine.string().trim().minLength(3),
  departmentId: vine.number().exists(async (db, value) => {
    return await db.from('departments').where('id', value).first()
  }).optional(),
}

export const createStudentValidator = vine.compile(
  vine.object({
    ...sharedSchema,
    rollNo: vine.string().trim()
      .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/) 
      .unique(async (db, value) => {
        const match = await db.from('students').where('roll_no', value).first()
        return !match
      }),
  })
)

export const getStudentQueryValidator = vine.compile(
  vine.object({
    courses: vine.boolean().optional(),
    department: vine.boolean().optional(),
    page: vine.number().optional(),
    limit: vine.number().optional()
  })
)
export const putEnrollQueryValidator = vine.compile(
  
 vine.object({
    courseId: vine.number().exists(async (db, value) => {
      const match = await db.from('courses').where('id', value).first()
      console.log("enroll validator")
      return !!match
    })
  })
)
export const updateStudentValidator = vine.compile(
  vine.object({
    name: sharedSchema.name.optional(),
    departmentId: sharedSchema.departmentId.optional(),
    rollNo: vine.string()
      .trim()
      .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/)
      .unique(async (db, value, field) => {
        const match = await db.from('students')
          .select('id')
          .where('roll_no', value)
          .whereNot('id', field.meta.studentId || 0)
          .first()
        return !match
      })
      .optional()
  })
)