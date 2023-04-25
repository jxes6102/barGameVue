import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Bar from '../views/BarView.vue'
import Newcapsule from '../views/NewCapsule.vue'
import allhistory from '../views/allHistory.vue'
import boxView from '../views/BoxView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/capsule',
    name: 'capsule',
    component:Newcapsule
  },
  {
    path: '/bar',
    name: 'bar',
    component:Bar
  },
  {
    path: '/allhistory',
    name: 'allhistory',
    component:allhistory
  },
  {
    path: '/boxView',
    name: 'boxView',
    component:boxView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
