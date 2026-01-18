import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/Login.vue'
import Orders from '../views/Orders/Orders.vue'
import OrderForm from '../views/Orders/OrderForm.vue'
import Customers from '../views/Customers/Customers.vue'
import CustomerForm from '../views/Customers/CustomerForm.vue'
import CustomerOrders from '../views/Customers/CustomerOrders.vue'
import { authService } from '../services/authService'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/create',
    name: 'OrderCreate',
    component: OrderForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id/edit',
    name: 'OrderEdit',
    component: OrderForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/create',
    name: 'CustomerCreate',
    component: CustomerForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id/edit',
    name: 'CustomerEdit',
    component: CustomerForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id/orders',
    name: 'CustomerOrders',
    component: CustomerOrders,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard di autenticazione globale
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Se la rotta richiede autenticazione ma l'utente non è autenticato
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    // Se l'utente è già autenticato e prova ad andare al login, reindirizza agli ordini
    next({ name: 'Orders' })
  } else {
    next()
  }
})

export default router