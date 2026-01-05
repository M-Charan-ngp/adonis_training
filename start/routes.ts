/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const PostsController = () => import('#controllers/posts_controller')
const DepartmentsController = () => import('#controllers/departments_controller')
const CoursesController = () => import('#controllers/courses_controller')
const StudentsController = () => import('#controllers/students_controller')
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})


router.resource('posts', PostsController).apiOnly

router.group(() => {
  router.resource('departments', DepartmentsController).apiOnly()
  router.resource('courses', CoursesController).apiOnly()
  router.resource('students', StudentsController).apiOnly()
  
  // Custom enrollment route
  router.post('enroll', [StudentsController, 'enroll'])
}).prefix('/api')
.use(middleware.auth_key())

// router.get('/post/:name/*',({params})=>{
//   return params
// })
// router
//   .get('/posts/:id?', ({ params }) => {
//     if(!params.id){
//       return 'All Users'
//     }
//       return params.id
//   })
//   .where('id', {
//     match: /^[0-9]+$/,
//   })
// router.get('/about', () => {
//   return 'This is the about page.'
// })
// router.get('/posts/:id/comments/:commentId', ({ params }) => {
//   console.log(params);
// })
// router.get('/posts/:id/comments/:commentId?', ({ params }) => {
//   if (!params.id) {
//     if (!params.commentId) {
//       return 'showing all comments of all post'
//     }
//     return `Showing comments of commentId: ${params.commentId}`
//   }
//   if (!params.commentId) {
//     return `showing all comments of post ${params.id}`
//   }
//   return `Showing post with id ${params.id} and commentId ${params.commentId}`
// })




// router.get('/docs/:category/*', ({ params }) => {
//   console.log(params);
// })