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
console.log('start/routes.ts')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('login', [AuthController, 'login'])
        router.post('register', [AuthController, 'signup'])
      })
      .use(middleware.auth_key())

    router
      .group(() => {
        router.post('enroll', [StudentsController, 'enroll'])
        router
          .post('courses/:id/enroll-students', [CoursesController, 'enrollStudents'])
          .where('id', router.matchers.number())
      })
      .use(middleware.jwtAuth())
      router
        .group(()=> {
          router
          .group(() => {
            router.get('/', [DepartmentsController, 'index'])
            router.post('/', [DepartmentsController, 'store'])
            router
              .get('/:id', [DepartmentsController, 'show'])
              .where('id', router.matchers.number())
            router
              .put('/:id', [DepartmentsController, 'update'])
              .where('id', router.matchers.number())
            router
              .patch('/:id', [DepartmentsController, 'update'])
              .where(':id', router.matchers.number())
            router
              .delete('/:id', [DepartmentsController, 'destroy'])
              .where('id', router.matchers.number())
          })
          .prefix('departments')

        router
          .group(() => {
            router.get('/', [CoursesController, 'index'])
            router.post('/', [CoursesController, 'store'])
            router
              .get('/:id', [CoursesController, 'show'])
              .where('id', router.matchers.number())
            router
              .put('/:id', [CoursesController, 'update'])
              .where('id', router.matchers.number())
            router
              .patch('/:id', [CoursesController, 'update'])
              .where('id', router.matchers.number())
            router
              .delete('/:id', [CoursesController, 'destroy'])
              .where('id', router.matchers.number())
          })
          .prefix('courses')

        router
          .group(() => {
            router.get('/', [StudentsController, 'index'])
            router.post('/', [StudentsController, 'store'])
            router
              .get('/:id', [StudentsController, 'show'])
              .where('id', router.matchers.number())
            router
              .put('/:id', [StudentsController, 'update'])
              .where('id', router.matchers.number())
            router
              .patch('/:id', [StudentsController, 'update'])
              .where('id', router.matchers.number())
            router
              .delete('/:id', [StudentsController, 'destroy'])
              .where('id', router.matchers.number())
          })
          .prefix('students')
        }).use(middleware.jwtAuth())
      
  })
  .prefix('/api')
