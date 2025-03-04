import type { HttpContext } from '@adonisjs/core/http'
import { roleVerify } from '../helpers/role_verify.js'
import { ROLES } from '../constants/roles.js'
import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'

export default class ProductsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!roleVerify(user, [...ROLES], response)) {
      return
    }

    const products = await Product.query().select('id', 'name', 'amount', 'created_at')

    return products
  }

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!

    if (
      !roleVerify(
        user,
        ROLES.filter((role) => role !== 'USER'),
        response
      )
    ) {
      return
    }

    const { name, amount } = await request.validateUsing(createProductValidator)
    const newProduct = await Product.create({ name, amount })

    return response.created(newProduct)
  }

  /**
   * Show individual record
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (!roleVerify(user, [...ROLES], response)) {
        return
      }

      const showProdct = await Product.findByOrFail('id', params.id)
      return response.ok(showProdct)
    } catch (error) {
      return response.notFound('Product not found')
    }
  }

  /**
   * Edit individual record
   */
  //async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!

      if (
        !roleVerify(
          user,
          ROLES.filter((role) => role !== 'USER'),
          response
        )
      ) {
        return
      }

      const { name, amount } = await request.validateUsing(updateProductValidator)
      const uptProduct = await Product.findByOrFail('id', params.id)
      uptProduct.merge({ name, amount })
      uptProduct.save()

      return response.ok(uptProduct)
    } catch (error) {
      return response.notFound({ message: 'Product not found' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      if (
        !roleVerify(
          user,
          ROLES.filter((role) => role !== 'USER'),
          response
        )
      ) {
        return
      }

      const delProduct = await Product.findByOrFail('id', params.id)
      delProduct.delete()

      return response.ok({ mesage: 'Product deleted' })
    } catch (error) {
      return response.notFound({ message: 'Product not found' })
    }
  }
}
