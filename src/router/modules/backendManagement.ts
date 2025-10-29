/*
 * @Author: 你的名字
 * @Date: 2025-08-15
 * @Description: 后台管理路由模块
 */
import Layout from '@/layout/index.vue'
import { h } from 'vue'

export const backendManagementRoutes = [
    {
        path: '/backend-management',
        name: 'backend-management',
        // redirect: '/backend-management/user-list',
        redirect: '/backend-management/sensitive-data',
        component: Layout,
        meta: {
            title: '后台管理',
            icon: 'icon-color-caidan',
            auth: true
        },
        children: [
            // 敏感数据管理路由
            {
                path: '/backend-management/sensitive-data',
                name: 'sensitive-data',
                component: () => import('~/views/backend-management/sensitive-data/index.vue'),
                meta: {
                    title: '敏感数据管理'
                }
            },

            // 审核管理路由
            {
                path: '/backend-management/review-management',
                name: 'review-management',
                redirect: '/backend-management/review-management/review-dataset-apply',
                meta: {
                    title: '审核管理'
                },
                children: [
                    {
                        path: 'review-dataset-apply',
                        name: 'review-dataset-apply',
                        component: () => import('~/views/backend-management/review-dataset-apply/index.vue'),
                        meta: {
                            title: '数据集申请审核'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'review-dataset-applay-detail',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            },
                            {
                                path: 'check',
                                name: 'review-dataset-applay-check',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '审核',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'review-dataset-upload',
                        name: 'review-dataset-upload',
                        component: () => import('~/views/backend-management/review-dataset-upload/index.vue'),
                        meta: {
                            title: '数据集上传审核'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'review-dataset-upload-detail',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            },
                            {
                                path: 'check',
                                name: 'review-dataset-upload-check',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '审核',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'review-data-open',
                        name: 'review-data-open',
                        component: () => import('~/views/backend-management/review-data-open/index.vue'),
                        meta: {
                            title: '数据公开审核'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'review-data-open-detail',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            },
                            {
                                path: 'check',
                                name: 'review-data-open-check',
                                component: () => import('@/views/backend-management/review-management/detail.vue'),
                                meta: {
                                    title: '审核',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'review-model-release',
                        name: 'review-model-release',
                        component: () => import('~/views/backend-management/review-model-release/index.vue'),
                        meta: {
                            title: '模型发布审核'
                        },
                        children: [
                            {
                                path: 'check',
                                name: 'review-model-release-check',
                                component: () => import('@/views/model-management/model-plaza/detail.vue'),
                                meta: {
                                    title: '审核',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'review-model-deploy',
                        name: 'review-model-deploy',
                        component: () => import('~/views/backend-management/review-model-deploy/index.vue'),
                        meta: {
                            title: '模型部署审核'
                        },
                        children: [
                            {
                                path: 'check',
                                name: 'review-model-deploy-check',
                                component: () => import('@/views/model-management/model-plaza/detail.vue'),
                                meta: {
                                    title: '审核',
                                    hidden: true
                                },
                            }
                        ]
                    },

                ]
            },

            {
                path: '/data-sandbox/data-open',  // /backend-management
                name: 'data-open',
                component: () => import('@/views/data-sandbox/data-open/index.vue'),
                meta: {
                    title: '数据公开'
                },
                children: [
                    {
                        path: 'detail',
                        name: 'data-open-detail',
                        component: () => import('@/views/data-sandbox/dataset-management/detail.vue'),
                        meta: {
                            title: '详情',
                            hidden: true
                        },
                    }
                ]

            },
            {
                path: '/model-management/model-assessment',
                name: 'backend-model-assessment',
                component: () => import('@/views/backend-management/data-catalog/model-evaluate/index.vue'),
                meta: {
                    title: '模型评估'
                }
            },
            {
                path: '/backend-management/tag',
                name: 'tag',
                redirect: '/backend-management/tag/type',
                meta: {
                    title: '标签管理'
                },
                children: [
                    {
                        path: 'type',
                        name: 'tag-type',
                        component: () => import('~/views/tag-management/tag-type.vue'),
                        meta: {
                            title: '标签类型'
                        },
                    },
                    {
                        path: 'set',
                        name: 'tag-set',
                        component: () => import('~/views/tag-management/tag-set.vue'),
                        meta: {
                            title: '标签设置'
                        }
                    },
                ]
            },
            {
                path: '/backend-management/usage-statistics',
                name: 'usage-statistics',
                component: () => import('@/views/backend-management/usage-statistics/index.vue'),
                meta: {
                    title: '用量统计'
                }
            },
            // 数据目录管理路由
            {
                path: '/backend-management/data-catalog-mg',
                name: 'data-catalog-mg',
                redirect: '/backend-management/data-catalog-mg/business-entity',
                meta: {
                    title: '数据目录管理'
                },
                children: [
                    {
                        path: 'business-entity',
                        name: 'business-entity-mg',
                        component: () => import('~/views/backend-management/data-catalog/business-entity/index.vue'),
                        meta: {
                            title: '业务实体管理'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'business-entity-mg-detail',
                                component: () => import('@/views/data-sandbox/data-catalog/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'logical-data-model',
                        name: 'logical-data-model',
                        component: () => import('~/views/backend-management/data-catalog/logical-data-model/index.vue'),
                        meta: {
                            title: '逻辑数据模型管理'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'logical-data-model-detail',
                                component: () => import('@/views/data-sandbox/data-catalog/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'data-classification',
                        name: 'data-classification',
                        component: () => import('~/views/backend-management/data-catalog/data-classification/index.vue'),
                        meta: {
                            title: '数据分类管理'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'data-classification-detail',
                                component: () => import('@/views/data-sandbox/data-catalog/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'business-analysis-topic',
                        name: 'business-analysis-topic',
                        component: () => import('~/views/backend-management/data-catalog/business-analysis-topic/index.vue'),
                        meta: {
                            title: '业务分析主题管理'
                        },
                        children: [
                            {
                                path: 'detail',
                                name: 'business-analysis-topic-detail',
                                component: () => import('@/views/data-sandbox/data-catalog/detail.vue'),
                                meta: {
                                    title: '详情',
                                    hidden: true
                                },
                            }
                        ]
                    },
                    {
                        path: 'metadata-management',
                        name: 'metadata-management',
                        component: () => import('~/views/backend-management/data-catalog/metadata-management/index.vue'),
                        meta: {
                            title: '元数据管理'
                        },
                    },
                    {
                        path: 'report-management',
                        name: 'report-management',
                        component: () => import('~/views/backend-management/data-catalog/reportManagement/index.vue'),
                        meta: {
                            title: '报表管理'
                        },
                    },
                ]
            },
            // {
            //     path: '/backend-management/tag-set',
            //     name: 'tag-set',
            //     component: () => import('~/views/tag-management/tag-set.vue'),
            //     meta: {
            //         title: '标签设置'
            //     }
            // },
        ]
    }
]
