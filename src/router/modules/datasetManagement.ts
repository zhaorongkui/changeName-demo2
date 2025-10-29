/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 14:30:00
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 15:24:53
 * @FilePath: \model-sandbox-frontend\src\router\modules\datasetManagement.ts
 * @Description: 数据集管理路由模块
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const datasetManagementRoutes: RouteRecordRaw[] = [
  {
    path: '/data-sandbox',
    name: '/data-sandbox',
    redirect: '/data-sandbox/dataset-management',
    component: Layout,
    meta: {
      title: '数据沙箱',
      icon: 'icon-color-caidan',
      auth: true
    },
    children: [
      {
        path: 'dataset-management',
        name: 'dataset-management',
        component: () => import('@/views/data-sandbox/dataset-management/index.vue'),
        meta: {
          title: '数据集广场'
        },
        children: [
          {
            path: 'detail', // 改为相对路径
            name: 'dataset-management-detail',
            component: () => import('@/views/data-sandbox/dataset-management/detail.vue'),
            meta: {
              title: '详情',
              hidden: true
            }
          },
        ]
      },
      {
        path: 'data-catalog',
        name: 'data-catalog',
        component: () => import('@/views/data-sandbox/data-catalog/index.vue'),
        // component: () => import('@/views/data-sandbox/data-catalog/DataPublic.vue'),
        meta: {
          title: '数据目录'
        },
        children: [
          {
            path: 'detail', // 改为相对路径
            name: 'dataset-data-catalog-detail',
            component: () => import('@/views/data-sandbox/data-catalog/detail.vue'),
            meta: {
              title: '详情',
              hidden: true
            }
          },
        ]
      },
      {
        path: 'resource-application',
        name: 'resource-application',
        component: () => import('@/views/data-sandbox/resource-application/index.vue'),
        meta: {
          title: '数据申请'
        },
        children: [
          {
            path: 'detail', // 改为相对路径
            name: 'resource-application-detail',
            component: () => import('@/views/data-sandbox/dataset-management/detail.vue'),
            meta: {
              title: '详情',
              hidden: true
            }
          },
        ]
      }
    ]
  }
]
