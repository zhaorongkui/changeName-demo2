/*
 * @Description:
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getLoginUser, getSettingLocale, getProductConfigInfo } from '@/api/login'
import { tranListToTreeData, getStatusTree,filterTreeByValidName } from '@/utils/array_func';
// import { getMenu } from '@/service/api/menu'
import { useI18n } from 'vue-i18n'
// import { getSedMenuList } from '@/service/api/menu'
// import useSedMenuInfo from '@/hooks/useSedMenuInfo'
import menuData from '@/mock/navigations';
import  routes  from '@/router/modules/index'
import * as buses from '@/utils/bus'
import { usePermissionStore } from '@/store/modules/permission'
import { flattedParse } from '@/utils'
import { getOrgTree } from '@/api/org'
// import { hasLocalStorage } from '@/utils';

// const { menuTreeList, setMenuList } = useSedMenuInfo()
// const CLIENT = 'PC'

// 扁平化数组
const flattenList = (list: any[]) => {
    return list.reduce((acc, item) => {
        if (item.detail === 1) {
            // 保留该项及其子项不做扁平化处理
            acc.push({
                component: item.component,
                displayName: item.displayName,
                detail: item.detail,
                id: item.id,
                meta: item.meta,
                moduleId: item.moduleId,
                name: item.name,
                ordering: item.ordering,
                parentId: item.parentId,
                grandfatherId: item.grandfatherId,
                path: item.path,
                redirect: item.redirect,
                type: item.type,
                behavior: item.behavior,
                bootstrapOnly: item.bootstrapOnly,
                code: item.code,
                children: item.children ? flattenList(item.children) : undefined, // 递归处理子项但保持层级
            });
        } else {
            // 正常处理该项
            acc.push({
                component: item.component,
                displayName: item.displayName,
                detail: item.detail,
                id: item.id,
                meta: item.meta,
                moduleId: item.moduleId,
                name: item.name,
                ordering: item.ordering,
                parentId: item.parentId,
                grandfatherId: item.grandfatherId,
                path: item.path,
                redirect: item.redirect,
                type: item.type,
                behavior: item.behavior,
                bootstrapOnly: item.bootstrapOnly,
                code: item.code,
                // 不保留children，后续会扁平化处理
            });
            // 扁平化处理子项
            if (item.children) {
                acc.push(...flattenList(item.children));
            }
        }
        return acc;
    }, []);
}

export const useAppStore = defineStore(
    'app',
    () => {
        const userInfo = ref()
        const sedRoutes = flattedParse(localStorage.getItem('sed-routes') || '[]') || []
        const token = ref('')
        const navigations = ref([])
        const getUserInfo = computed(() => userInfo.value)
        const getTenantId = computed(() => (userInfo.value?.tenantId || '') as string)
        const tenantId = window.localStorage.getItem('tenantId')
        const orgTreeData = ref([])
        const productionConfig = ref<any>({
            systemName: ['bewg', 'bewg_ws'].includes(tenantId!) ? '污水运营管理系统' : '水务运营管理系统', //系统名字
            systemLogoFilename: '', //系统图标,名字
            browserTab: '/logo-5.png',
            browserTabFilename: '/logo-5.png', //浏览器图标
        })
        const getStoreToken = computed(() => token.value)
        const setUserInfo = async () => {

            const recursionJson = (arr, value) => {
                arr.forEach((item) => {
                        item.code = value ? value + '-' + item.orgId : item.orgId;
                        item.leaf = false;
                        if (item.children && Array.isArray(item.children)) {
                            recursionJson(item.children, item.code);
                        }
                });
            };
            // 设置导航路由
            const setNavigations = (data) => {
                const { resources } = data;
                const list = flattenList(menuData).filter((t: any) => t.type == 1 || t.behavior == 'route');
                const menuList = list.filter((item) => {
                    return resources.some((newItem) => newItem.displayName === item.displayName);
                });
                navigations.value = tranListToTreeData(menuList);
                navigations.value.sort((a: any, b: any) => a.ordering - b.ordering);
            };
            const { data } = await getLoginUser()
            const newData = JSON.parse(JSON.stringify(data));
            delete data.orgs // 删除orgs属性
            userInfo.value = data
            localStorage.setItem('tenantId', data.tenantId)
            setNavigations(newData);
            getOrgTree({
                orgId: '1',
                isLogin: newData.roles?.find((item) => item.id === '2') ? '2' : '1',
            }).then((res) => {
                const data = res.data || [];
                const newTreeData = ref([]);
                getStatusTree(data, newTreeData.value);
                recursionJson(newTreeData.value, '');
                localStorage.setItem('selectListFactory', JSON.stringify(filterTreeByValidName(newTreeData.value) || []));
                buses.bus.emit(buses.ORGANIZATION_TREE_DATA_CHANGE);
            });
        }
        const setAvatar = (url: string) => {
            if (userInfo.value) {
                userInfo.value.avatar = url
            }
        }
        // // 设置导航路由
        // const setNavigations = (routes:any[]) => {
        //     const { GET_DEFAULT_MENU_LIST } = usePermissionStore()
        //     // navigations.value = processingRouterTree([...(staticRoutes), ...routes], GET_DEFAULT_MENU_LIST())
        //     // buses.bus.emit(buses.ROUTE_CREATED, true)
        //     // getSetLocale()
        //     return navigations.value
        // }

        // 获取权限路由
        const getNavigations = computed(() => {
            return navigations.value
        })

        // 获取权限按钮
        const getPermitionBtnCodes = computed(() => {
            return userInfo.value?.resources.filter(t => t.type != 1).map(t => t.code)
        })

        // 是否加载了router
        const isLoadRouters = ref<boolean>(false)
        const getIsLoadRouters = computed(() => {
            return isLoadRouters.value
        })
        const setIsLoadRouters = (payload: boolean) => {
            isLoadRouters.value = payload
        }

        // 当前访问的路由组，用于左侧菜单
        const routerGroup = ref('')
        const getRouterGroup = computed(() => {
            return routerGroup.value
        })
        const setRouterGroup = (payload: string) => {
            routerGroup.value = payload
        }

        // 语言
        const language = ref('zh-CN')
        // 从后端获取语言
        // const getSetLocale = async () => {
        //     const { data } = await getSettingLocale()
        //     setLanguage(data || 'zh-CN')
        // }
        // const { locale } = useI18n()
        // const setLanguage = (payload: string) => {
        //     language.value = payload
        //     locale.value = payload == 'zh-CN' ? 'ch' : 'en'
        // }
        // const getLanguage = computed(() => {
        //     return language.value
        // })

        const getProductConfig = async () => {
            const { data } = await getProductConfigInfo()
            const config = data.filter(t => t.clientAgent == 'PC')
            // 循环数组data,返回clentAgent为PC的对象
            productionConfig.value = config.length > 0 ? config[0] : productionConfig.value

        }
        const setStoreToken = (value: string) => {
            token.value = value
        }
       
        return {
            userInfo,
            navigations,
            getUserInfo,
            getTenantId,
            getNavigations,
            getPermitionBtnCodes,
            setUserInfo,
            // setNavigations,
            getIsLoadRouters,
            setIsLoadRouters,
            routerGroup,
            getRouterGroup,
            setRouterGroup,
            language,
            // getSetLocale,
            // setLanguage,
            // getLanguage,
            setAvatar,
            getProductConfig,
            productionConfig,
            setStoreToken,
            getStoreToken,
        }
    },
    {
        persist: {
            paths: ['userInfo', 'navigations', 'language'],
        },
    }
)
