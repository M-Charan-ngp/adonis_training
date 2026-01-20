import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const sharedSchema = {
  name: vine.string().trim().minLength(3).maxLength(100),
  departmentId: vine.number().exists(async (db, value) => {
    const match = await db.from('departments').where('id', value).first()
    return !!match
  }),
}


export const createStudentValidator = vine.compile(
  vine.object({
    name: sharedSchema.name,
    departmentId: sharedSchema.departmentId,
    email: vine.string().email().unique(async (db, value) => {
      const match = await db.from('students').where('email', value).first()
      return !match
    }),
    rollNo: vine.string().trim()
      .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/) 
      .unique(async (db, value) => {
        const match = await db.from('students').where('roll_no', value).first()
        return !match
      }),
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


export const getStudentQueryValidator = vine.compile(
  vine.object({
    courses: vine.boolean().parse((value) => value ?? false),
    department: vine.boolean().parse((value) => value ?? false),
    page: vine.number().parse((value) => value ?? 1),
    limit: vine.number().parse((value) => value ?? 10),
    search: vine.string().trim().optional(),
    sortBy: vine.enum(['id', 'name', 'roll_no', 'createdAt']).parse((v) => v ?? 'id'),
    sortOrder: vine.enum(['asc', 'desc']).parse((v) => v ?? 'asc'),
  })
)


export const putEnrollQueryValidator = vine.compile(
  vine.object({
    courseId: vine.number().exists(async (db, value) => {
      const match = await db.from('courses').where('id', value).first()
      return !!match
    })
  })
)


export type CreateStudentDto = Infer<typeof createStudentValidator>
export type UpdateStudentDto = Infer<typeof updateStudentValidator>
export type StudentQueryDto = Infer<typeof getStudentQueryValidator>
export type PutEnrollDto = Infer<typeof putEnrollQueryValidator>