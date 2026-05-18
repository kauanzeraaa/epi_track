import { createRouter, createWebHistory } from 'vue-router'
// Importing routes
import Home from '../views/Home.vue'
import Resources from '../views/Resources.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import UserLogon from '../views/UserLogon.vue'
import Layout from '../components/Layout.vue'
import Dashboard from '../views/Dashboard.vue'
import Alerts from '../views/Alerts.vue'
import Catalog from '../views/Catalog.vue'
import History from '../views/History.vue'
import Movements from '../views/Movements.vue'
import Profile from '../views/Profile.vue'
import RedefinirSenha from '../views/RedefinirSenha.vue'

const routes = [
  // ==========================================
  // ROTAS PÚBLICAS (Sem a Sidebar)
  // ==========================================
  { path: '/', component: Home },
  { path: '/resources', component: Resources },
  { path: '/contact', component: Contact },
  { path: '/login', component: Login },
  { path: '/logon', component: UserLogon },
  { path: '/redefinir-senha', component: RedefinirSenha },


  // ==========================================
  // ROTAS DO SISTEMA LOGADO (Com a Sidebar)
  // ==========================================
  {
    path: '/app',
    component: Layout,
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', component: Dashboard },
      { path: '/alerts', component: Alerts },
      { path: '/catalog', component: Catalog },
      { path: '/history', component: History },
      { path: '/movements', component: Movements },
      { path: '/profile', component: Profile },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router