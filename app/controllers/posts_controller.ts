import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    console.log("hi");
  }


  async store({ request }: HttpContext) {
    return `stored ${JSON.stringify(request)}`
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return JSON.stringify(params)
  }

  async update({ params, request }: HttpContext) {
    console.log(` ${params}`)
    console.log(request.body);
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    console.log(`deleted ${params}`);
  }
}