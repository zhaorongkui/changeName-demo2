/*
 * @Author: lihuihui
 * @Date: 2025-03-31 13:16:00
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-31 13:16:01
 * @Description: 用户管理相关API
 */
import request from '@/utils/request';
import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl =  projectEnv.VITE_APP_BASEURL_SYSTEM
interface ParamData {
    [key1: string]: string | number | any | null;
}

/**
 * 获取用户列表
 * @param params 查询参数
 */
export const getUsersList = (params: {
    currPage: number;
    pageSize: number;
    orgId: string | number;
    keyword: string;
    includeSubOrgs: boolean;
}) => {
    return http.request({
        url: baseUrl + '/user/q',
        method: 'post',
        data:params
    })
};

/**
 * 获取用户的机构列表
 * @returns {}
 */
export const getUserByUserNameApi = (params: ParamData = {}) => {
    return http.request({
        url: baseUrl + `/user/getUserByUsername?username=${params.username}`,
        method: 'get',
    })
};

/**
 * 取消用户授权
 * @param userIds 1，2，3[]
 */
export const removeUserGrant = (data: ParamData) => {
    // return request.deleteNP(`/user/grants?userId=${data.userIds}`, data.list, {
    //     requestOptions: {
    //         repeatRequestCancel: true,
    //         loading: true,
    //     },
    // });
    return http.request({
        url: baseUrl + `/user/grants?userId=${data.userIds}`,
        method: 'delete',
        data: data.list,
    })
};

/**
 * 添加用户授权
 * @param userIds 1，2，3[]
 */
export const addUserGrant = (data: ParamData) => {
    // return request.postNP(`/user/grants?userId=${data.userIds}&unbindExisting=${data.unbindExisting}`, data.list, {
    //     requestOptions: {
    //         repeatRequestCancel: true,
    //         loading: true,
    //     },
    // });
    return http.request({
        url: baseUrl + `/user/grants?userId=${data.userIds}&unbindExisting=${data.unbindExisting}`,
        method: 'post',
        data: data.list,
    })
};

/**
 * ，用户授权
 * @returns {}
 */
export const grantsToUserApi = (param: ParamData, data: ParamData): Promise<Result<any>> => {
    return http.request({
        url: baseUrl + `/user/grants?userId=${param.userId}&unbindExisting=${param.unbindExisting}`,
        method: 'post',
        params:param,
        data: data,
    })
    // return request.request({
    //     method: 'POST',
    //     url: '/user/grants',
    //     params: param,
    //     data: data,
    // });
};
