
import http from './axios'
import { PageResult } from '~/types/common'
import { DatasetType } from '~/types/dataSandbox'
import { getBaseUrl} from '@/utils/constant'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL
/**
 *  数据集广场-获取目录、主题
 * @param params 查询参数
 * @returns
 */
export const getContentsTopicList = (params: { type?: number; }) => {
    return http.request({
        url: baseUrl + '/dataDirectory/list',
        method: 'post',
        data: params
    })
}
/**
 *  数据集广场-获取数据集列表
 * @param params 查询参数
 * @returns
 */
export const getDatasetList = (params: { 
    dataType: string,
    ldmName: number | string,
    datasetName: string,
    pageNum: number,
    pageSize: number,
    applicationStatus?: string | number; 
    keyWord?: string; status?: number | null, 
    orgId?: Array<string | number>, 
    directory?: string | number | null, 
    topicName?: string | number | null, 
    type?: string | number | null }) => {
    return http.request({
        url: baseUrl + '/datasetSquare/list',
        method: 'post',
        data: params
    })
}

/**
 * 数据集广场-获取数据集详情
 * @params id 数据集ID
 * @returns
 */
export const getDatasetDetail = (params: { id: string | number }) => {
    return http.request({
        url: baseUrl + `/datasetSquare/detail`,
        method: 'post',
        data: params
    })
}
/**
 * 数据集广场-获取数据集详情-字段信息
 * @params id 数据集ID
 * @returns
 */
export const getDatasetDetailField = (params: { pageNum: number, pageSize: number, keyWord?: string; objectId: string | number, datasetsId?: string | number, }) => {
    return http.request({
        url: baseUrl + `/datasetSquare/field`,
        method: 'post',
        data: params
    })
}
/**
 * 数据集广场-获取数据集详情-数据资源
 * @params id 数据集ID
 * @returns
 */
export const getDatasetDetailPreview = (params: { pageNum: number, pageSize: number, keyWord?: string; objectId: string | number, datasetsId: string | number | null, kind?: number }) => {
    return http.request({
        url: baseUrl + `/datasetSquare/resources`,
        method: 'post',
        data: params
    })
}

/**
 * 数据目录 -获取数据目录列表
 * @params id 数据集ID
 * @returns
 */
export const getdataCatalog = (params: {
    pageNum: number, pageSize: number, businessObject?: string; businessObjectType?: number | string, objectHierarchy?: number | string, dataType?: number | string, dateDim?: number | string,
    dataModelName?: string | number | null,
    businessScenarios?: string | number | null,
    directory?: string | number | null,
    type?: string | number | null,
    topicName?: string | number | null
}) => {
    return http.request({
        url: baseUrl + `/dataDirectory/businessObject`,
        method: 'post',
        data: params
    })
}
/**
 * 数据目录 -获逻辑数据模型列表
 * @params 
 * @returns
 */
export const getAilabLogicalData = (params: {
    currentPage: number, pageSize: number,
    entity?: string;
    businessDomain?: number | string,
    dataSource?: number | string,
    businessDefinition?: number | string,
    businessRules?: number | string,
    responsibleDepartment?: string | number | null,
    lifecycleStatus?: string | number | null,
    accessPermissions?: string | number | null,
    versionInfo?: string | number | null
}) => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/page`,
        method: 'post',
        data: params
    })
}
/**
 *  数据目录-参数下拉值获取
 * @param params 查询参数
 * @returns
 */
export const getSelector = (params: { field?: string[]; }) => {
    return http.request({
        url: baseUrl + '/dataDirectory/selector',
        method: 'post',
        data: params
    })
}

/**
 * 数据集广场-获取数据集详情
 * @params id 数据集ID
 * @returns
 */
export const getBusinessDetail = (params: { dataListId: string | number, pageNum: number, pageSize: number, keyWord?: string, }) => {
    return http.request({
        url: baseUrl + `/dataDirectory/businessDetail`,
        method: 'post',
        data: params
    })
}
/**
 * 数据集广场-获取数据集字段详情-全局搜索
 * @params id 数据集ID
 * @returns
 */
export const getSelectColumnList = (params: {  pageNum: number, pageSize: number, keyWord?: string, }) => {
    return http.request({
        url: baseUrl + `/dataDirectory/selectColumnList`,
        method: 'post',
        data: params
    })
}
/**
 *  数据申请-获取业务实体列表
 * @param params 查询参数
 * @returns
 */
export const getbusinessObjectList = (params: {
    pageNum: number, pageSize: number, directory?: string | number, businessObject?: string, dataType?: string | number | null,
    dateDim?: string | number | null,
    businessObjectType?: string | number | null,
    fieldAttribute?: string | number | null,
    objectHierarchy?: string | number | null
}) => {
    return http.request({
        url: baseUrl + '/dataDirectory/businessObject',
        method: 'post',
        data: params
    })
}
/**
 *  数据申请-创建业务实体
 * @param params 请求参数
 * @returns
 */
export const creatbusinessObject = (params: {
    name: string,
    datasetDesc: string,
    orgId: string,
    explanation?: string, // 申请说明
    ldmIds: Array<string | number>,
    creator: string,
    beginTime: string,
    endTime: string,
}) => {
    return http.request({
        url: baseUrl + '/dataApplication/add',
        method: 'post',
        data: params
    })
}
/**
 *  数据申请-上传第一步
 * @param params 请求参数
 * @returns
 */
export const dataApplicationUpload = (params: {
    file: any,
    name?: string,
    encoding: string,
    orgId: string,
    explanation?: string, // 申请说明
    ldmIds: Array<string | number>,
    hasHeader: boolean,
    beginTime: string,
    endTime: string,
}) => {
    return http.request({
        url: baseUrl + '/dataApplication/upload',
        method: 'post',
        data: params
    })
}
/**
 *  数据申请-上传第二步
 * @param params 请求参数
 * @returns
 */
export const saveFieldUpload = (params: {
    row: Array<any>,
    file: any,
    name?: string,
    encoding: string,
    orgId: string,
    explanation?: string, // 申请说明
    ldmIds: Array<string | number>,
    hasHeader: boolean,
    beginTime: string,
    endTime: string,
}) => {
    return http.request({
        url: baseUrl + '/dataApplication/saveField',
        method: 'post',
        data: params
    })
}
