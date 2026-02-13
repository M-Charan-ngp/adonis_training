import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const courseSchema = {
  title: vine.string().trim().minLength(3).maxLength(200),
  credits: vine.number().min(1).max(6),
  departmentId: vine.number().exists(async (db, value) => {
    const match = await db.from('departments').where('id', value).first()
    return !!match
  })
}

export const createCourseValidator = vine.compile(
  vine.object({
    title: courseSchema.title,
    credits: courseSchema.credits,
    departmentId: courseSchema.departmentId,
    courseCode: vine.string().trim()
      .regex(/^[A-Z]{2}[0-9]{3}$/)
      .unique(async (db, value) => {
        const match = await db.from('courses').where('course_code', value).first()
        return !match
      }),
  })
)



export const getCourseQueryValidator = vine.compile(
  vine.object({
    students: vine.boolean().parse((value) => value ?? false),
    department: vine.boolean().parse((value) => value ?? false),
    page: vine.number().parse((value) => value ?? 1),
    limit: vine.number().parse((value) => value ?? 10)
  })
)

export const bulkEnrollValidator = vine.compile(
  vine.object({
    studentIds: vine.array(
      vine.number().exists(async (db, value) => {
        const match = await db.from('students').where('id', value).first()
        return !!match
      })
    ).minLength(1)
  })
)

export const updateCourseValidator = vine.compile(
  vine.object({
    title: courseSchema.title.optional(),
    credits: courseSchema.credits.optional(),
    departmentId: courseSchema.departmentId.optional(),
    courseCode: vine.string().trim().toUpperCase().regex(/^[A-Z]{2,4}[0-9]{3}$/)
      .unique(async (db, value, field) => {
        const match = await db.from('courses')
          .select('id')
          .where('course_code', value)
          .whereNot('id', field.meta.courseId)
          .first()
        return !match
      }).optional()
  })
)

export type CreateCourseDto = Infer<typeof createCourseValidator>
export type UpdateCourseDto = Infer<typeof updateCourseValidator>
export type CourseQueryDto = Infer<typeof getCourseQueryValidator>
export type EnrollStudentsDto = Infer<typeof bulkEnrollValidator>