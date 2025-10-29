/*
 * @Description: 角色管理相关API
 */

import request from '@/utils/request';

interface ParamData {
    [key1: string]: string | number | any | null;
}
import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl =  projectEnv.VITE_APP_BASEURL_SYSTEM
/**
 * 获取角色
 * @returns {}
 */
export const getRolesWithGroupApi = (params: ParamData = {}) => {
    return http.request({
        url: baseUrl + '/user/role',
        method: 'get',
    })
};
/**
 * 根据角色id获取角色信息
 * @returns {}
 */
export const getRoleInfoWithId = (id: number | string) => {
    return http.request({
        url: baseUrl +`/user/role/${id}`,
        method: 'get',
    })
};
/**
 * 启用角色
 * @returns {}
 */
export const enabledRoleApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/enabled?roleId=${data.roleId}`,
        method: 'post',
    })
};
/**
 * 停用角色
 * @returns {}
 */
export const disabledRoleApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/disabled?roleId=${data.roleId}`,
        method: 'post',
    })
};
/**
 * 添加角色
 * @returns {}
 */
export const addRoleApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + '/user/role',
        method: 'post',
        data:data
    })
};

/**
 * 编辑角色 更新角色 ,可批量修改角色
 * @param 角色数组
 * @returns {}
 */
export const updateRoleApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + '/user/role',
        method: 'put',
        data:data
    })
};

/**
 * 删除角色
 * @returns {}
 */
export const deleteRoleApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + '/user/role',
        method: 'delete',
        data:data
    })
};
/**
 * 根据角色id获取某个角色已授权的下级角色（可管理范围）
 * @returns {}
 */
export const getRoleOfGranted = (id: number | string) => {
    return http.request({
        url: baseUrl + `/user/role/${id}/granted`,
        method: 'get',
    })
};

/**
 * 获取当前角色被赋予的全部菜单
 * @returns {}
 */
export const getRoleMenusApi = (id: number | string | undefined) => {
    return http.request({
        url: baseUrl + `/user/resource/menu/for/role/${id}`,
        method: 'get',
    })
};

/**
 * 给角色授权菜单权限
 * @returns {}
 */
export const resourcesToRoleApi = (params: ParamData, data: string[]) => {
    return http.request({
        url: baseUrl + `/user/role/resources?roleId=${params.roleId}&unassign=${params.unassign}`,
        method: 'post',
        data:data,
        param:params
    })
};

/**
 * 查询所有授权了某个资源的角色
 * @param params  name 角色名称
 * @returns {}
 */
export const getRoleForResourceById = (resourceId: string) => {
    return http.request({
        url: baseUrl + `/user/role/for/resource/${resourceId}`,
        method: 'get',
    })
};

/**
 * 给角色赋予资源权限
 * @param params  name 角色名称
 * @returns {}
 */
export const deleteRoleResource = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/resources?roleId=${data.roleIds}`,
        method: 'delete',
        params:data,
    })
};

/**
 * 新增一个角色组
 * @returns {}
 */
export const addRoleGroupApi = (param: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/group`,
        method: 'post',
        data:param,
    })

};

/**
 * 更新一个角色组
 * @returns {}
 */
export const updateRoleGroupApi = (param: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/group`,
        method: 'put',
        data:param,
    })
};

/**
 * 获取角色组
 * @returns {}
 */
export const getRoleGroupApi = () => {
    return http.request({
        url: baseUrl + `/user/role/group`,
        method: 'get',
    })
};
/**
 * 获取角色组
 *@param id 角色组id
 */
export const getRoleGroupDetailApi = (id: number) => {
    return http.request({
        url: baseUrl + `/user/role/group/${id}`,
        method: 'get',
    })
};
/**
 * 删除一个角色组
 * @returns {}
 */
export const deleteRoleGroupApi = (roleGroup: ParamData) => {

    return http.request({
        url: baseUrl + `/user/role/group?force=true`,
        method: 'delete',
        data:roleGroup,
    })
};

/**
 * 角色名称和角色code判重判断
 * @param code string  角色Code 非必填
 * @param name string  角色名称 非必填
 * @param id string  角色id ,新增校验的时候不传   编辑校验的时候传id
 * @returns {}
 */
export const roleSingularApi = (param: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/singular`,
        method: 'get',
        params:param,
    })
};

/**
 * 角色组判重判断
 * @param name  string  角色组名称 非必填
 * @param id string  角色组id ,新增校验的时候不传   编辑校验的时候传id
 * @returns {}
 */
export const roleGroupSingularApi = (param: ParamData) => {
    return http.request({
        url: baseUrl + `/user/role/singular/group`,
        method: 'get',
        params:param,
    })
};
