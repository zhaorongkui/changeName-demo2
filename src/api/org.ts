
import request from '@/utils/request';
import type { Organization } from '@/types/org';
import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl =  projectEnv.VITE_APP_BASEURL_SYSTEM
interface ParamData {
    [key1: string]: string | number | any | null;
}

const prefix = projectEnv.VITE_BASE_PREFIX || '';
/**
 * 整棵组织树,带筛选条件
 * @returns {}
 */
export const getOrgTree = (data: ParamData): Promise<Result<Organization[]>> => {
    console.log(data,'data====')
    return http.request({
        url: baseUrl + '/user/org/trees',
        method: 'get',
        params: data
    })
};

// 获取子水厂的数据
export function getRealTimeTree(params): any {
    return http.request({
        url: baseUrl + `${prefix}/Cron/getRealTimeTree`,
        method: 'get',
    })
}

/**
 * 启用某组织
 * @param params { orgId: string }
 * @returns {}
 */
export const updateIotStatusById = (params: ParamData) => {
    return http.request({
        url: baseUrl + `/user/org/updateIotStatus?orgId=${params.orgId}&iotStatus=${params?.iotStatus}`,
        method: 'post',
        // data:params
    })
};

/**
 * 获取组织详情
 * @param id orgId
 * @returns {}
 */
export const getOrgById = (id: string) => {
    return http.request({
        url: baseUrl + `/user/org/${id}`,
        method: 'get',
    })
};
/**
 * 整棵组织树,带水厂
 * @returns {}
 */
export const getOrgAmdFactoryTree = () => {
    return http.request({
        url: baseUrl + `/sedlogin/getTbUserInfoUnVersion2`,
        method: 'get',
    })
}
/**
 * 获取水厂相关特殊配置项及项目标识信息
 * @param factoryNo
 * @returns
 */
export const getFacDescribeText = (factoryNo: string) => {
    return http.request({
        url: baseUrl + `/factory-setting/config/get`,
        method: 'get',
        params: factoryNo
    })

}
