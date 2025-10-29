/*
 * @Author: linyongcai
 * @Date: 2025-01-20 10:39:12
 * @FilePath: \sed-saas-frontend\src\store\modules\permission.ts
 * @Description: 页面描述
 */
// 菜单数据

import { defineStore } from 'pinia'
import { ref, computed,nextTick } from 'vue'
import { useAppStore } from './app'
import { generateNavs } from '@/utils/array_func'
import router from '@/router/index'
import { cloneDeep } from 'lodash'
import { compilerRoutes } from '@/utils/routerHelper'

export const usePermissionStore = defineStore('permission', () => {
    const appStore = useAppStore()
    const isRoutesLoaded = ref(false) // 子应用的路由加载状态标志
    const pendingRoute = ref<string | null>(null) // 等待跳转的目标路由
    const routes = ref<PlantRouteRecordRaw[]>([])
    const addRoutes = ref<PlantRouteRecordRaw[]>([])
    const idToken = ref<string | null>(null)
    // 默认的菜单权限
    const defaultMenuList = ref<string[]>([])
    // 默认的按钮权限
    const defaultButtonList = ref<string[]>([])

    const SET_ROUTES_LOADED = (val: boolean) => {
        isRoutesLoaded.value = val
    }
    const GET_ROUTES_LOADED = () => {
        return isRoutesLoaded.value
    }
    const SET_ID_TOKEN = (val: string) => {
        idToken.value = val // 用于退出登录, 当浏览器缓存出现问题的时候(容量不足导致自动清空), store中的token可以backup
    }
    const GET_ID_TOKEN = () => {
        return idToken.value
    }
    const SET_PEDDING_ROUTE = (path: string) => {
        localStorage.setItem('pendingRoute', path)
        pendingRoute.value = path
    }
    const LOAD_PENDING_ROUTE = () => {
        if (pendingRoute.value || localStorage.getItem('pendingRoute')) {
            const path = pendingRoute.value || localStorage.getItem('pendingRoute') || '/'
            setTimeout(() => {
                router.replace({ path })
                localStorage.removeItem('pendingRoute')
                pendingRoute.value = null
            }, 0)
        }
    }
    // 获取默认菜单列表
    const GET_DEFAULT_MENU_LIST = () => {
        return defaultMenuList.value
    }
    // 设置默认菜单列表
    const SET_DEFAULT_MENU_LIST = (list: string[]) => {
        defaultMenuList.value = list
    }
    // 获取默认按钮列表
    const GET_DEFAULT_BUTTON_LIST = () => {
        return defaultButtonList.value
    }
    // 设置默认按钮列表
    const SET_DEFAULT_BUTTON_LIST = (list: string[]) => {
        defaultButtonList.value = list
        window.localStorage.setItem('SET_BUTTON_MAP', JSON.stringify(list));
    }
    // 获取当前所有权限路由
    const getRoutes = computed(() => {
        return routes.value
    })
    // 获取当前全部路由
    const getAllRoutes = computed(() => {
        return router.getRoutes()
    })

    // 获取路由组List，用于 topview 导航
    const getAddRoutes = computed(() => {
        const copyRoute = cloneDeep(addRoutes.value)
        copyRoute.forEach(t => {
            generateNavs(t, t.name)
        })
        return copyRoute
    })

    // 获取当前访问组路由, 用于左侧menu展示
    const getViewRoutes = computed(() => {
        const viewRoutes = routes.value.find((t) => t.name == appStore.getRouterGroup)!;
        if (viewRoutes) {
            generateNavs(viewRoutes, appStore.getRouterGroup);
        }
        return viewRoutes || {};
    })

    // 获取当前访问组路由名称 用于top展示
    const getCurrentRouteGroupName = computed(() => {
        return routes.value.find(t => t.name == appStore.getRouterGroup)?.meta?.title || ''
    })

    // // 登录获取的菜单在这里补充登录和404等
    // const generateRoutes = (resource) => {
    //     console.log(resource,'resource=====')
    //     if (resource.length) {
    //         addRoutes.value = compilerRoutes(resource)
    //     }
    //     const routerMap = [...addRoutes.value]
    //     routes.value = [...routes.value, ...addRoutes.value]
    //     return routerMap
    // }
    // 登录获取的菜单在这里补充登录和404等
    const generateRoutes = (resource: Resource[] = []) => {
        if (resource.length) {
            addRoutes.value = compilerRoutes(resource);
            // addRoutes.value.push(...staticRoutus);
        }
        addRoutes.value.forEach((t) => {
            t.component = () => import('@/layout/index.vue');
            t.children?.push({
                path: '/403',
                component: () => import('@/views/errorPage/403.vue'),
                name: '403',
                meta: {
                    title: '',
                },
            });
        });

        const routerMap = [
            ...addRoutes.value,
            {
                path: '/:path(.*)*',
                component: () => import('@/views/errorPage/404.vue'),
                name: 'NotFound',
            },
        ];
        routes.value = [...routes.value, ...routerMap];
        return routerMap;
    };

    return {
        getRoutes,
        generateRoutes,
        getAddRoutes,
        getAllRoutes,
        getCurrentRouteGroupName,
        getViewRoutes,
        SET_ROUTES_LOADED,
        SET_PEDDING_ROUTE,
        LOAD_PENDING_ROUTE,
        GET_ROUTES_LOADED,
        SET_ID_TOKEN,
        GET_ID_TOKEN,
        GET_DEFAULT_MENU_LIST,
        SET_DEFAULT_MENU_LIST,
        GET_DEFAULT_BUTTON_LIST,
        SET_DEFAULT_BUTTON_LIST,
    }
})
