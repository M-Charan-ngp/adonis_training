/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const DepartmentsController = () => import('#controllers/departments_controller')
const CoursesController = () => import('#controllers/courses_controller')
const StudentsController = () => import('#controllers/students_controller')
const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
console.log("start/routes.ts");

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(()=>{
    router.group(() => {
      router.post("login", [AuthController,"login"])
      router.post("refresh",[AuthController, "refresh"])
      router.resource('departments', DepartmentsController).apiOnly().where('id', router.matchers.number())
      router.resource('courses', CoursesController).apiOnly().where('id', router.matchers.number())
      router.resource('students', StudentsController).apiOnly().where('id', router.matchers.number())
    }).use(middleware.auth_key())

    router.group(() => {
      router.post('enroll', [StudentsController, 'enroll'])
      router.post('courses/:id/enroll-students', [CoursesController, 'enrollStudents']).where('id', router.matchers.number())
    }).use(middleware.jwtAuth())

  }
).prefix('/api')






