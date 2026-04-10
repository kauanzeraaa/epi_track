import { createRouter, createWebHistory } from 'vue-router'

// Importing routes
import Home from '../views/Home.vue'
import Resources from '../views/Resources.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import UserLogon from '../views/UserLogon.vue'
import Dashboard from '../views/Dashboard.vue'

// Defining route access
const routes = [
  { path: '/', component: Home},
  { path: '/resources', component: Resources},
  { path: '/contact', component: Contact},
  { path: '/login', component: Login},
  { path: '/logon', component: UserLogon},
  { path: '/dashboard', component: Dashboard}
]

const router =  createRouter({
  history: createWebHistory(),
  routes
})

export default router