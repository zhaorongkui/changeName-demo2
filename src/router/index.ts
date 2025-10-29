/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-21 13:21:20
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-25 09:05:23
 * @FilePath: \model-sandbox-frontend\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '@/layout/index.vue'
import modulesRoutes from './modules/index'

const tenantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            hidden: true
        }
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'), // 添加Layout组件
        name: 'Layout', // 关键：确保名称与动态添加时一致
        redirect: '/data-sandbox/dataset-management',
        // redirect: '/login',
        children: [] // 初始为空，用于动态添加
    },

  // ...modulesRoutes,

  //  刷新页面时动态路由报错的问题
  {
    path: '/:pathMatch(.*)*',
    meta: {
      title: '404',
      hidden: true
    },
    component: () => import('@/views/errorpage/404.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: tenantRoutes
})

export default router
