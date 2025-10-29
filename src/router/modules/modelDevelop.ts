/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 14:46:00
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 15:24:34
 * @FilePath: \model-sandbox-frontend\src\router\modules\modelDevelop.ts
 * @Description: 模型开发路由模块
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const modelDevelopRoutes: RouteRecordRaw[] = [
  {
    path: '/model-develop',
    name: 'model-develop',
    redirect: '/model-develop/agent',
    component: Layout,
    meta: {
      title: '模型开发',
      icon: 'icon-color-caidan',
      auth: true
    },
    children: [
      {
        path: '/model-develop/list',
        name: 'model-develop-list',
        component: () => import('~/views/model-develop/editor/list.vue'),
        meta: {
          title: '模型列表'
        }
      },

      {
        path: '/model-develop/agent',
        name: 'model-develop-agent',
        component: () => import('@/views/model-develop/agent/index.vue'),
        meta: {
          title: '智能体'
        },
        children: [
          {
            path: '/model-develop/agent/workflow',
            name: 'model-develop-workflow',
            component: () => import('@/views/model-develop/agent/workflow/index.vue'),
            meta: {
              title: '工作流'
            }
          },
          {
            path: '/model-develop/agent/agent',
            name: 'model-develop-agent-item',
            component: () => import('@/views/model-develop/agent/agent/index.vue'),
            meta: {
              title: '智能体',
              target: '_blank',
              url: 'https://dify.ai/'
            }
          },
          {
            path: '/model-develop/agent/mcp',
            name: 'model-develop-mcp',
            component: () => import('@/views/model-develop/agent/mcp/index.vue'),
            meta: {
              title: 'MCP'
            }
          }
        ]
      },
      {
        path: '/model-develop/machine-learning',
        name: 'model-develop-machine-learning',
        component: () => import('@/views/model-develop/machine-learning/index.vue'),
        meta: {
          title: '机器学习模型',
          target: '_blank',
          url: 'https://www.huaweicloud.com/product/modelarts.html'
        }
      }
    ]
  }
]
