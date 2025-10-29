// import request from './ax';

interface ParamData {
    [key1: string]: string | number | any | null;
}
import http from './axios'

/**
 * 获取登录日志列表
 * @returns {}
 */
export const getLoginLogs = (data: ParamData) => {
    return http.request({
        url:  '/audit/authn/page',
        method: 'post',
        data:data
    })
};

/**
 * 导出登录日志列表
 * @returns {}
 */
export const exportLoginLogs = (data: ParamData) => {
    // return http.postNP('/authn/excelExport', data, { responseType: 'blob' });
    return http.request({
        url: '/audit/authn/excelExport',
        method: 'post',
        data:data,
        responseType: 'blob',
    })
};

/**
 * 获取操作日志列表
 * @returns {}
 */
export const getOperationLogs = (data: ParamData) => {
    return http.request({
        url: '/audit/op/page',
        method: 'post',
        data:data
    })
};

/**
 * 导出操作日志列表
 * actionResult
 * product： iot
 * @returns {}
 */
export const exportOperatLogs = (data: ParamData) => {
    // return http.postNP('/op/excelExport', data, { responseType: 'blob' });
    return http.request({
        url: '/audit/op/excelExport',
        method: 'post',
        data:data,
        responseType: 'blob',
    })
};
