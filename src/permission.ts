import router from './router';
import { useAppStore } from './store/modules/app';
import layoutStore from '@/store/modules/layout';
import { usePermissionStore } from './store/modules/permission';
import { ElMessage } from 'element-plus';
import projectEnv from '@/config/runtimeEnv';
import NProgress from 'nprogress'; // 页面加载进度条
import 'nprogress/nprogress.css';
import { getToken, setToken } from '@/utils/auth';
import { type RouteLocationNormalized } from 'vue-router';
import { hasLocalStorage } from './utils';
import * as buses from '@/utils/bus';
import { retrieveToken } from '@/api/login';
// import useTypeInfo from '@/hooks/iotManager';
NProgress.configure({ showSpinner: false });

const redirectUrl = `${window.location.origin}/#${router.currentRoute.value.query?.redirect || '/'}`;
const whiteList = ['Login', 'NotFound','404'];

router.beforeEach(async (to: RouteLocationNormalized, _from, next) => {
    NProgress.start();
    const loginId = (to.query?.loginId as string) || '';
    const appStore = useAppStore();
    const { generateRoutes } = usePermissionStore();
    if (loginId && !getToken()) {
        const tokenContainer = await retrieveToken(loginId);
        if (tokenContainer) {
            // 存储token和id_token
            setToken(tokenContainer.accessToken);
            localStorage.setItem('id_token', tokenContainer.idToken);
            buses.bus.emit(buses.TOKEN_ID_SAVED, true);
            // 获取用户信息并存储
            await appStore.setUserInfo();
        }
    }

    if (to.query.from === 'roleManage') {
        to.meta.activeMenu = '/settings/role';
    }

    if (whiteList.indexOf(to.name as string) !== -1) {
        return  next();
    } else {
        const hasToken = getToken();
        if (hasToken) {
            // 有token 并且 有获取到的菜单
            if (!hasLocalStorage('app')) {
                appStore.setIsLoadRouters(false);
                await appStore.setUserInfo();
            }
            // eslint-disable-next-line no-empty-pattern
            // const {} = useTypeInfo();

            /**
             * 如果获取到路由数据，去加载路由或者跳转路由
             * 如果没有获取到路由数据，直接跳转工作台
             */
            if (appStore.getNavigations.length) {
                const routers = generateRoutes(appStore.getNavigations)
                if (appStore.getIsLoadRouters) {
                    // 跳转路由
                    if (to.path === '/login') {
                        next({ path: '/' });
                        NProgress.done();
                    } else {
                        appStore.setRouterGroup(to.meta?.group || '');
                        const navName = routers.find((t) => t.name == to.meta.group)?.title || '导航';
                        // if (navName) {
                        //     layoutStore().setSystemNavName(navName);
                        // }
                        next();
                        NProgress.done();
                    }
                } else {
                    routers.forEach((item: any) => {
                        // 避免重复注册已存在的路由
                        if (item?.name && router.hasRoute(item.name)) {
                            return;
                        }
                        router.addRoute(item as any);
                    });

                    appStore.setIsLoadRouters(true);
                    next({ ...to, replace: true });
                    NProgress.done();

                }
            } else {
                appStore.setIsLoadRouters(false);
                next();
                NProgress.done();
            }
        } else {
            appStore.setIsLoadRouters(false)
            if (to.path === '/' && to.query.tenantId) {
                const redirectPath = appStore.getNavigations[0]?.path ?? '/'
                const redirectUrl = `${window.location.origin}/#${redirectPath}`
                //?tenantId=bewg,快捷入口
                let BASE_API = projectEnv.VITE_BASE_URL // 'http://10.195.6.251:15000';
                if (BASE_API === '/') {
                    BASE_API = `${location.protocol}//${location.host}`
                }
                window.location.href = `${BASE_API}/login/signin?target=${window.btoa(redirectUrl)}&tenantId=${to.query.tenantId}`
                window.localStorage.setItem('tenantId', to.query.tenantId as string)
            } else if (to.path === '/login' || whiteList.indexOf(to.name as string) !== -1) {
                next()
            } else {
                // 这里应该把用户希望进入的地址记录下来，然后跳转登录页的时候，把用户希望进入的地址作为redirect参数传递给登录页
                // const redirectPath = appStore.getNavigations[0]?.path ?? '/'
                const { fullPath } = to
                if (to.query?.tenant) {
                    next(`/login?redirect=${encodeURIComponent(fullPath)}&tenant=${to.query.tenant}`)
                } else {
                    console.log(fullPath,'fullpath')
                    console.log(to.path,'topath')
                    return  next(`/login?redirect=${encodeURIComponent(fullPath)}`);
                }
            }
            NProgress.done()
        }
    }
});

router.onError((error) => {
    const pattern = /Loading chunk (\w+) failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        ElMessage({
            type: 'error',
            message: '服务器版本已更新,请按F5手动刷新...',
            duration: 4000,
        });
    }
});

router.afterEach(() => {
    NProgress.done();
});
