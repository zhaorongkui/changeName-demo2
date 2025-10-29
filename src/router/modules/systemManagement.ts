/*
 * @Author: 你的名字
 * @Date: 2025-08-15
 * @Description: 系统管理路由模块
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const systemManagementRoutes: RouteRecordRaw[] = [
  {
    path: '/system-management',
    name: 'system-management',
    component: Layout,
      redirect: '/system-management/organization',
    meta: {
      title: '系统管理',
      icon: 'icon-color-caidan',
      auth: true
    },
    children: [
      {
        path: 'organization',
        name: 'organization-management',
        component: () => import('~/views/system-management/organization/index.vue'),
        meta: { title: '组织管理' }
      },
      {
        path: 'user',
        name: 'user-management',
        component: () => import('~/views/system-management/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'role-management',
        component: () => import('~/views/system-management/role/index.vue'),
        meta: { title: '角色管理' },
          children:[
              {
                  path: 'authorize',
                  name: 'authorize',
                  component: () => import('~/views/system-management/authorizedUser/index.vue'),
                  meta: { title: '用户授权',hidden: true }
              },
          ]
      },
      {
        path: 'dict',
        name: 'dict-management',
        component: () => import('~/views/system-management/dict/index.vue'),
        meta: { title: '数据字典管理' }
      },
        {
            path: 'logManager',
            name: 'logManager',
            redirect: '/system-management/logManager/loginLog',
            meta: { title: '日志管理' },
            children: [
                {
                    path: 'loginLog',
                    name: 'loginLog',
                    component: () => import('~/views/system-management/loginLog/index.vue'),
                    meta: { title: '登录日志' }
                },
                {
                    path: 'operatLog',
                    name: 'operatLog',
                    component: () => import('~/views/system-management/operatLog/index.vue'),
                    meta: { title: '操作日志' }
                },
            ]
        },

    ]
  }
]
