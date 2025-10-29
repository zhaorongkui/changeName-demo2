import request from '@/utils/request';
import type { DictListItem, DictOptionItem } from '@/types/dict';
import { ElMessage } from 'element-plus';
interface ParamData {
    [key1: string]: string | number | any | null;
}
import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL_SYSTEM
// 获取字典列表

export const getDictList = (data: {
    pageNum: number;
    pageSize: number;
    keyword?: string;
    asc?: boolean;
    orderBy?: string;
}) => {
    return http.request({
        url: baseUrl + '/settings/dict/q?asc=false',
        method: 'get',
        params:data
    })
};
// 获取字典项
export const getDictItems = (data:  {
    id: number;
    pageNum: number;
    pageSize: number;
    keyword: string;
    asc?: boolean;
    orderBy?: string;
}) => {
    return http.request({
        url: baseUrl + `/settings/dict/${data.id}/q`,
        method: 'get',
        params:data
    })
};

// 字典删除
export const deleteDict = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/settings/dict`,
        method: 'delete',
        data:data
    })
};
// 字典项删除
export const deleteDictItem = (data: ParamData[]) => {
    return http.request({
        url: baseUrl + `/settings/dict/values`,
        method: 'delete',
        data:data
    })
};


// 新增字典项
export const addDict = (data:  any) => {
    return http.request({
        url: baseUrl + `/settings/dict/values`,
        method: 'post',
        data:data
    })
};

// 更新字典项状态
export const updateDict = (data:  any) => {
    return http.request({
        url: baseUrl + `/settings/dict/values`,
        method: 'put',
        data:data
    })
};

// 字典列表，新增字典
export const addDictionaryApi = (data:  ParamData) => {
    return http.request({
        url: baseUrl + `/settings/dict`,
        method: 'post',
        data:data
    })
};

// 字典列表，编辑字典
export const updateDictionaryApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/settings/dict`,
        method: 'put',
        data:data
    })
};

/**
 * 字典名称字典编码重复校验
 * @param name  字典编码
 * @param displayName 字典名称
 * @param orgId 组织id
 * @param id string  字典id ,新增校验的时候不传   编辑校验的时候传id
 * @returns {}
 */
export const dictSingularApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/settings/dict/singular`,
        method: 'get',
        params:data,
    })
};
/**
 * 字典项名称 字典项编码重复校验
 * @param typeId   字典类型id
 * @param id 字典项id (区分新增还是修改)
 * @param displayValue 字典项名称
 * @param textValue 字典项编码
 * @param intValue 值编码 暂未用
 * @returns {}
 */
export const dictValueSingularApi = (data: ParamData) => {
    return http.request({
        url: baseUrl + `/settings/dict/value/singular`,
        method: 'get',
        params:data
    })
};
/**
 * 获取字典项 个数
 * @param typeId   字典类型id
 */
export function getDictValuesCount(data: any) {
    return http.request({
        url: baseUrl + `/settings/dict/values/count`,
        method: 'get',
        params:data
    })
}
