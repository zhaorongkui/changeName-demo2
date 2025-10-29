import request from '@/utils/request';
interface ParamData {
    [key1: string]: string | number | any | null;
}
import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL_SYSTEM
/**
 * 获取所有的菜单列表
 * @returns {}
 */
export const getMenuAll = (param: ParamData) => {
    return http.request({
        url: baseUrl + '/user/resource/menu/all',
        method: 'get',
    })
};

/**
 * 获取菜单列表， 自己能访问的和有权授权给其他人的
 * @returns {}
 */
export const getMenu = () => {
    return request.getOnly('/user/resource/menu', {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};

/**
 * 获取用户权限下的菜单列表, 有权授权给其他人的
 * @returns {}
 */
export const getMenus = (param: ParamData) => {
    return request.get('/user/resource/menu/authorized', param, {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};

/**
 * 获取菜单详情
 * @returns {}
 */
export const getMenuById = (id: string) => {
    return request.getOnly(`/user/resource/menu/${id}`, {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};

/**
 * 获取菜单详情
 * @returns {}
 */
export const getResourceInfo = () => {
    return request.getOnly(`/user/app/info`, {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};

/**
 * 删除某一个菜单
 * @param id
 * @returns {}
 */
export const removeMenuResource = (resource: ParamData) => {
    return request.deleteNP(`/user/resource/menu`, resource, {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};

/**
 * 查询某个角色下的已授权资源
 * @param roleId 角色ID
 * @returns {}
 */
export const getAuthRoleResources = (roleId: string) => {
    return request.getOnly(`/user/resource/menu/for/role/${roleId}`, {
        requestOptions: {
            repeatRequestCancel: true,
            loading: true,
        },
    });
};
