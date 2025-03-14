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
const GatewaysController = () => import('#controllers/gateways_controller')
const TransactionsController = () => import('#controllers/transactions_controller')

// Test Route
router.get('/ping', async () => {
  return {
    ping: 'pong',
  }
})

// Root Route
router.get('/', async () => {
  return {
    status: 'online',
  }
})

// Public Routes
router.post('login', [AuthController, 'store'])
router.post('purchase', [TransactionsController, 'purchase'])

// Private Routes
router
  .group(() => {
    router.post('logout', [AuthController, 'destroy'])

    // User Routes
    router.resource('users', UsersController).apiOnly()

    // Client Routes
    router.resource('clients', ClientsController).apiOnly()
    router.get('clients/:id/transactions', [ClientsController, 'transactions'])

    // Product Routes
    router.resource('products', ProductsController).apiOnly()

    // Gateways Routes
    router.resource('gateways', GatewaysController).apiOnly()
    router.patch('gateways/:id/active', [GatewaysController, 'updateActive'])
    router.patch('gateways/:id/priority', [GatewaysController, 'updatePriority'])

    // Transactions Routes
    router.resource('transactions', TransactionsController).apiOnly()
    router.post('transactions/:id/refund', [TransactionsController, 'refund'])
  })
  .use(middleware.auth())
