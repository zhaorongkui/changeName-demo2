/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 14:47:00
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-22 14:47:00
 * @FilePath: \model-sandbox-frontend\src\router\modules\modelEvaluation.ts
 * @Description: 模型评估路由模块
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const modelEvaluationRoutes: RouteRecordRaw[] = [
  {
    path: '/model-evaluation',
    name: 'model-evaluation',
    redirect: '/model-evaluation/run-analysis',
    component: Layout,
    meta: {
      title: '模型评估',
      icon: 'icon-color-caidan',
      auth: true
    },
    children: [
      {
        path: '/model-evaluation/run-analysis',
        name: 'run-analysis',
        component: () => import('@/views/model-evaluation/run-analysis/index.vue'),
        meta: {
          title: '运行分析'
        }
      },
      {
        path: '/model-evaluation/evaluation-rules',
        name: 'evaluation-rules',
        component: () => import('@/views/model-evaluation/evaluation-rules/index.vue'),
        meta: {
          title: '评估规则'
        }
      },
      {
        path: '/model-evaluation/model-assessment',
        name: 'model-assessment',
        component: () => import('@/views/model-evaluation/model-assessment/index.vue'),
        meta: {
          title: '模型评价'
        }
      }
    ]
  }
]
