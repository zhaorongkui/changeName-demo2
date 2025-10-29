/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 14:45:00
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 17:14:39
 * @FilePath: \model-sandbox-frontend\src\router\modules\modelManagement.ts
 * @Description: 模型管理路由模块
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const modelManagementRoutes: RouteRecordRaw[] = [
  {
    path: '/model-management',
    name: 'model-management',
    redirect: '/model-management/model-plaza',
    component: Layout,
    meta: {
      title: '模型实验室',
      icon: 'icon-color-caidan',
      auth: true
    },
    children: [
      {
        path: '/model-management/model-plaza',
        name: 'model-plaza',
        component: () => import('@/views/model-management/model-plaza/index.vue'),
        meta: {
          title: '模型广场'
        },
          children:[
              {
                  path: 'model-detail',
                  name: 'model-plaza-detail',
                  component: () => import('@/views/model-management/model-plaza/detail.vue'),
                  meta: {
                      title: '模型详情',
                      hidden: true
                  }
              },

          ]
      },
      // {
      //   path: '/model-management/model-detail',
      //   name: 'model-detail',
      //   component: () => import('@/views/model-management/model-plaza/detail.vue'),
      //   meta: {
      //     title: '模型详情',
      //     hidden: true
      //   }
      // },

      {
        path: '/model-management/model-detail-view',
        name: 'model-detail-view',
        component: () => import('@/views/model-management/viewModeldetail.vue'),
        meta: {
          title: '查看模型',
          hidden: true
        }
      },
        // {
        //     path: '/model-management/model-detail-view-test',
        //     name: 'model-detail-view-test',
        //     component: () => import('@/views/model-management/editor/index.vue'),
        //     meta: {
        //         title: '测试菜单',
        //     }
        // },
      {
        path: '/model-management/model-develop',
        name: 'model-develop',
        redirect: '/model-management/model-develop/agent',
        meta: {
          title: '模型开发',
          icon: 'icon-color-caidan',
          auth: true
        },
        children: [
          // {
          //   path: '/model-develop/list',
          //   name: 'model-develop-list',
          //   component: () => import('~/views/model-develop/editor/list.vue'),
          //   meta: {
          //     title: '模型列表'
          //   }
          // },

          {
            path: 'agent',
            name: 'model-develop-agent',
            component: () => import('@/views/model-develop/agent/agent/index.vue'),
            meta: {
              title: '智能体',
              target: '_blank',
              url: 'https://dify.ai/'
            },
              children:[
                  {
                      path: 'model-detail',
                      name: 'model-agent-detail',
                      component: () => import('@/views/model-management/model-plaza/detail.vue'),
                      meta: {
                          title: '模型详情',
                          hidden: true
                      }
                  },

              ]
          },
          {
            path: 'machine',
            name: 'machine',
              redirect: '/model-management/model-develop/machine/learning',
              meta: {
                  title: '机器学习模型',
              },
              children: [
                  {
                      path: 'learning',
                      name: 'model-develop-machine-learning',
                      component: () => import('@/views/model-develop/machine-learning/index.vue'),
                      meta: {
                          title: '模型列表',
                          target: '_blank',
                          url: 'https://www.huaweicloud.com/product/modelarts.html'
                      },
                      children:[
                          {
                              path: 'model-detail',
                              name: 'model-learning-detail',
                              component: () => import('@/views/model-management/model-plaza/detail.vue'),
                              meta: {
                                  title: '模型详情',
                                  hidden: true
                              }
                          },

                      ]
                  },
                  {
                      path: 'train',
                      name: 'model-train-parent',
                      component: () => import('@/views/model-evaluation/model-train/index.vue'),
                      meta: { title: '模型训练' },
                      // redirect: 'list',
                      // children: [
                      //     {
                      //         path: 'list',
                      //         name: 'model-train-list',
                      //         component: () => import('@/views/model-evaluation/model-train/index.vue'),
                      //         meta: { title: '模型训练列表' },
                      //     },
                      //     {
                      //         path: 'usage',
                      //         name: 'model-train-usage',
                      //         component: import('@/views/backend-management/usage-statistics/index.vue'),
                      //         meta: { title: '用量统计' },
                      //     },
                      // ],
                  }
              ]
          },
          {
            path: 'mode-data-rule',
            name: 'mode-data-rule',
            component: () => import('@/views/model-management/data-rule-models/index.vue'),
            meta: {
              title: '数据规则模型'
            },
              children:[
                  {
                      path: 'model-detail',
                      name: 'model-rule-detail',
                      component: () => import('@/views/model-management/model-plaza/detail.vue'),
                      meta: {
                          title: '模型详情',
                          hidden: true
                      }
                  },

              ]
          },
            {
                path: 'model-ontrial',
                name: 'model-ontrial',
                component: () => import('@/views/model-evaluation/model-ontrial/index.vue'),
                meta: {
                    title: '模型试用列表'
                }
            },
        ]
      },


      // {
      //   path: '/model-management/model-release',
      //   name: 'model-release',
      //   component: () => import('@/views/model-evaluation/model-release/index.vue'),
      //   meta: {
      //     title: '模型发布'
      //   }
      // },
      {
        path: '/model-management/model-deploy',
        name: 'model-deploy',
        component: () => import('@/views/model-evaluation/model-deploy/index.vue'),
        meta: {
          title: '模型部署'
        },
          children:[
              {
                  path: 'check',
                  name: 'model-deploy-check',
                  component: () => import('@/views/model-management/model-plaza/detail.vue'),
                  meta: {
                      title: '查看',
                      hidden: true
                  },
              }

          ]
      },

      {
        path: '/model-management/editor',
        name: 'model-editor',
        component: () => import('@/views/model-management/editor/index.vue'),
        meta: {
          title: '模型编辑器',
          hidden: true
        }
      }
    ]
  }
]
