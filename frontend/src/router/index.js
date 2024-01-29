import { createRouter, createWebHashHistory } from 'vue-router'
import Bar from '../views/BarView.vue'
// import Newcapsule from '../views/NewCapsule.vue'
// import boxView from '../views/BoxView.vue'
import allView from '../views/AllView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: allView
  },
  // {
  //   path: '/capsule',
  //   name: 'capsule',
  //   component:Newcapsule
  // },
  {
    path: '/bar',
    name: 'bar',
    component:Bar
  },
  // {
  //   path: '/boxView',
  //   name: 'boxView',
  //   component:boxView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // },
  {
    // todo notfound component
    path: '/:catchAll(.*)',
    component: allView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async () => {
  // to：使用者要跳轉的路由
  // from：使用者前一個訪問的路由
  // 回傳 false 取消跳轉，true / undefined（預設）容許跳轉
  // console.log('to',to)
  // console.log('from',from)
  return true
})

export default router
