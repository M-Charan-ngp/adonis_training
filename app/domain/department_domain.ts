import Department from '#models/department'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { CreateDepartmentDto, UpdateDepartmentDto } from '#validators/department'

export default class DepartmentDomain {

  async prepareForStorage(data: CreateDepartmentDto): Promise<Partial<Department>> {
    return {
      name: data.name,
      code: data.code.trim().toUpperCase(),
    }
  }

  async prepareForUpdate(data: UpdateDepartmentDto): Promise<Partial<Department>> {
    const payload: Partial<Department> = {}
    if (data.name) payload.name = data.name
    if (data.code) payload.code = data.code.trim().toUpperCase()
    return payload
  }

  async transformSingle(department: Department) {
    const result: any = {
      id: department.id,
      department_name: department.name,
      department_code: department.code,
      created_at: department.createdAt.toISODate(),
    }

    if (department.students) {
      result.student_list = department.students.map((s) => ({
        rollNumber: s.regNo,
        name: s.name,
      }))
    }

    if (department.courses) {
      result.course_list = department.courses.map((c) => ({
        courseCode: c.courseCode,
        title: c.title,
      }))
    }

    return result
  }

  async transformList(paginator: ModelPaginatorContract<Department>) {
    const serialized = paginator.toJSON()
    
    const items = await Promise.all(
      paginator.map((item) => this.transformSingle(item))
    )

    return {
      items: items,
      pagination: {
        total: serialized.meta.total,
        current_page: serialized.meta.currentPage,
        per_page: serialized.meta.perPage,
        last_page: serialized.meta.lastPage,
      }
    }
  }
}