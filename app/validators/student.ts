import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const sharedSchema = {
  name: vine.string().trim().minLength(3).maxLength(100),
  departmentId: vine.number().exists(async (db, value) => {
    const match = await db.from('departments').where('id', value).first()
    return !!match
  }),
  gender: vine.string().trim().optional(), 
  dob: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  phone: vine.string().trim().maxLength(20).optional(),
}

export const createStudentValidator = vine.compile(
  vine.object({
    name: sharedSchema.name,
    departmentId: sharedSchema.departmentId,
    gender: sharedSchema.gender,
    dob: sharedSchema.dob,
    phone: sharedSchema.phone,
    email: vine.string().email().unique(async (db, value) => {
      const match = await db.from('students').where('email', value).first()
      return !match
    }),
    regNo: vine.string().trim()
      .regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/) 
      .unique(async (db, value) => {
        const match = await db.from('students').where('reg_no', value).first()
        return !match
      }),
  })
)

export const updateStudentValidator = vine.compile(
  vine.object({
    name: sharedSchema.name.optional(),
    departmentId: sharedSchema.departmentId.optional(),
    gender: sharedSchema.gender.optional(),
    dob: sharedSchema.dob.optional(),
    phone: sharedSchema.phone.optional(),
    email: vine.string().email().unique(async (db, value, field) => {
      const match = await db.from('students')
        .where('email', value)
        .whereNot('id', field.meta.studentId)
        .first()
      return !match
    }).optional(),
    regNo: vine.string().trim().unique(async (db, value, field) => {
      const match = await db.from('students')
        .where('reg_no', value)
        .whereNot('id', field.meta.studentId)
        .first()
      return !match
    }).optional(),
  })
)

export const getStudentQueryValidator = vine.compile(
  vine.object({
    courses: vine.boolean().parse((value) => value ?? false),
    department: vine.boolean().parse((value) => value ?? false),
    page: vine.number().parse((value) => value ?? 1),
    limit: vine.number().parse((value) => value ?? 10),
    search: vine.string().trim().optional(),
    sortBy: vine.enum(['id', 'name', 'regNo', 'createdAt']).parse((v) => v ?? 'id'),
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