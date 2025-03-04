/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')

// Test route
router.get('/ping', async () => {
  return {
    ping: 'pong',
  }
})

// Public Routes
router.post('login', [AuthController, 'store'])

// Private Routes
router
  .group(() => {
    router.post('logout', [AuthController, 'destroy'])

    // User Routes
    router.resource('users', UsersController).apiOnly()

    // Client Routes
    router.resource('clients', ClientsController).apiOnly()

    // Product Routes
    router.resource('products', ProductsController).apiOnly()
  })
  .use(middleware.auth())
