import { number } from 'echarts'
import http from './axios'
import { PageResult } from '~/types/common'
import { DatasetType } from '~/types/dataSandbox'
import { getBaseUrl} from '@/utils/constant'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL
/**
 *  逻辑数据模型管理-新增弹框列表
 * @param params 请求参数
 * @returns
 */
export const ailabLogicalSaveOrUpdate = (params) => {
    return http.request({
        url: baseUrl + '/provider/ailabLogicalDataModel/saveOrUpdate',
        method: 'post',
        data: params
    })
}
/**
 * 业务实体新增
 * @param params 请求参数
 * @returns
 */
export const saveOrUpdateUpdate = (params: {
    id?: string | number,
    catalogName: string | number,
    parentCatalogId: string | number,
    status: string | number,
    accessPermissions: string | number,

}) => {
    return http.request({
        url: baseUrl + '/dataDirectory/saveOrUpdate',
        method: 'post',
        data: params
    })
}
/**
 *  业务实体列表
 * @param params 查询参数
 * @returns
 */
export const getDataDirectoryList = (params: {
    leftId: number | string,
    currentPage: number,
    pageSize: number,
    status?: number | string,
    businessObject?: number | string,
    businessObjectType?: number | string,
    objectHierarchy?: number | string
}) => {
    return http.request({
        url: baseUrl + '/dataDirectory/page',
        method: 'post',
        data: params
    })
}
/**
 * 删除业务实体数据
 * @param id
 * @returns {}
 */

export const dataDirectoryDelete = (id: number | string) => {
    return http.request({
        url: baseUrl + `/dataDirectory/delete?id=${id}`,
        method: 'get'
    })
}
/**
 * 逻辑数据模型管理详情
 * @param id
 * @returns {}
 */

export const ailabLogicalDataModelDetail = (id: number | string) => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/detail?id=${id}`,
        method: 'get'
    })
}
/**
 * 删除数据模型管理
 * @param id
 * @returns {}
 */

export const ailabLogicalDataModelDelete = (id: number | string) => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/delete?id=${id}`,
        method: 'get'
    })
}
/**
 * 数据分类管理，编辑-回显详情
 * @param id
 * @returns {}
 */

export const selectDetailById = (id: number | string) => {
    return http.request({
        url: baseUrl + `/dataDirectory/selectDetailById?id=${id}`,
        method: ''
    })
}
/**
 * 审批、审核更改到期时间
 * @param params
 * @returns {}
 */

export const updataDuedate = (params) => {
    return http.request({
        url: baseUrl + `/datasetSquare/duedate`,
        method: 'post',
        data: params
    })
}
/**
 * 审批、审核更改脱敏字段接口
 * @param params
 * @returns {}
 */

export const updataDesensitizeField = (params) => {
    return http.request({
        url: baseUrl + `/datasetSquare/field/desensitize`,
        method: 'post',
        data: params
    })
}
/**
 * 获取业务实体 下拉
 * @param name
 * @returns {}
 */

export const getSelectBusinessObjectType = () => {
    return http.request({
        url: baseUrl + `/dataDirectory/dataCatalogList`,
        method: 'post',
        data: {}
    })
}
/**
 * 获取所数据模型 下拉数据
 * @param name
 * @returns {}
 */

export const selectAilabLogicalDataModel = () => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/list`,
        method: 'post',
        data: {}
    })
}
/**
 * 获取分类管理，新增-详情,指标树数据
 * @param name
 * @returns {}
 */
export const getTableAndColumnTreeData = (param) => {
    return http.request({
        url: baseUrl + `/dataDirectory/tableAndColumnTree`,
        method: 'post',
        data: param
    })
}

/**
 *  数据源下拉数据获取
 * @param params 
 * @returns
 */
export const getDataSourceSelect = (params) => {
    return http.request({
        url: baseUrl + '/provider/ailabLogicalDataModel/dataSourceSelect',
        method: 'post',
        data: params
    })
}
/**
 *  实体名称下拉数据获取
 * @param params 
 * @returns
 */
export const getDataSourceTableSelect = (params) => {
    return http.request({
        url: baseUrl + '/provider/ailabLogicalDataModel/dataSourceTableSelect',
        method: 'post',
        data: params
    })
}
/**
 *  获取字段列表数量
 * @param params 
 * @returns
 */
export const getDataSourceTableColumnSelect = (params) => {
    return http.request({
        url: baseUrl + '/provider/ailabLogicalDataModel/dataSourceTableColumnSelect',
        method: 'post',
        data: params
    })
}
/**
 *  数据类型新增
 * @param params 新建参数
 * @returns
 */
export const saveOrUpdateDataType = (params) => {
    console.log(params, 'params===9999999类型')
    return http.request({
        url: baseUrl + '/dataDirectory/saveOrUpdateDataType',
        method: 'post',
        data: params
    })
}
/**
 * 删除数据类型
 * @param id
 * @returns {}
 */

export const deleteDataType = (id: number | string) => {
    return http.request({
        url: baseUrl + `/sensitive/delete?id=${id}`,
        method: 'get'
    })
}
/**
 * 获取所属系统/单元 下拉数据
 * @param name
 * @returns {}
 */

export const selectBusinessObjectType = (name: string) => {
    return http.request({
        url: baseUrl + `/dataDirectory/selectBusinessObjectType?objectHierarchy=${name}`,
        method: 'get'
    })
}
/**
 *  敏感管理-右侧列表
 * @param params 查询参数
 * @returns
 */
export const getDesensitizeList = (params: { currentPage: number, pageSize: number, busId?: string | number; fieldNameOrDesc?: number | string }) => {
    return http.request({
        url: baseUrl + '/sensitive/desensitizeList',
        method: 'post',
        data: params
    })
}
/**
 *  敏感管理-新增弹框列表
 * @param params 查询参数
 * @returns
 */
export const getDataCatalogueList = (params: {
    currentPage: number, pageSize: number, businessObject?: string | number; dataType?: number | string,
    objectHierarchy?: number | string,
    fieldName?: number | string

}) => {
    return http.request({
        url: baseUrl + '/sensitive/dataCatalogueList',
        method: 'post',
        data: params
    })
}
/**
 *  敏感管理-新增弹框列表
 * @param params 查询参数
 * @returns
 */
export const addDataCatalogue = (params) => {
    return http.request({
        url: baseUrl + '/sensitive/addDataCatalogue',
        method: 'post',
        data: params
    })

}
/**
 *  数据集公开，下架
 * @param params 
 * @returns
 */
export const dataSetDown = (params) => {
    return http.request({
        url: baseUrl + '/openData/applyDown',
        method: 'post',
        data: params
    })

}
/**
 *  敏感管理-更新列表
 * @param params 查询参数
 * @returns
 */
export const updateDesensitize = (params: { id: number | string, desensitize: number | string }) => {
    return http.request({
        url: baseUrl + '/sensitive/updateDesensitize',
        method: 'post',
        data: params
    })

}
/**
 * 删除敏感信息
 * @param id
 * @returns {}
 */

export const deleteCatalogue = (id: number | string) => {
    return http.request({
        url: baseUrl + `/sensitive/delete?id=${id}`,
        method: 'get'
    })
}
/**
 *  数据集申请审核列表
 * @param params 查询参数
 * @returns
 */
export const getApplicationApprovalList = (params: {
    workFlowList: Array<string | number>,
    pageNum: number,
    pageSize: number,
    datasetName?: number | string,
    orgIds?: Array<string | number>,
    beginTime: string,
    endTime: string,
    reviewStatus?: number | null,
}) => {
    return http.request({
        url: baseUrl + '/applicationApproval/page',
        method: 'post',
        data: params
    })

}
/**
 *  数据集上传审核列表
 * @param params 查询参数
 * @returns
 */
export const getUploadApprovalList = (params: {
    pageNum: number, pageSize: number, datasetName?: number | string,
    workFlowList: Array<string | number>,
    orgIds?: Array<string | number>,
    beginTime: string,
    endTime: string,
    reviewStatus?: number | null,
}) => {
    return http.request({
        url: baseUrl + '/uploadApproval/page',
        method: 'post',
        data: params
    })

}
/**
 *  数据集公开列表
 * @param params 查询参数
 * @returns
 */
export const getopenDataList = (params: {
    currentPage: number, pageSize: number, datasetName?: number | string,
    orgIds?: Array<string | number>,
    beginTime: string,
    endTime: string,
    reviewStatus?: number | string,
}) => {
    return http.request({
        url: baseUrl + '/openData/page',
        method: 'post',
        data: params
    })

}
/**
 *  公开数据-新增公开数据,数据集名称下拉
 * @param params 新建参数
 * @returns
 */
export const getDataSetList = (params: { datasetName?: number | string, }) => {
    return http.request({
        url: baseUrl + '/openData/dataSetList',
        method: 'post',
        data: params
    })

}
/**
 *  公开数据-新增公开数据
 * @param params 新建参数
 * @returns
 */
export const addopenDataSave = (params) => {
    return http.request({
        url: baseUrl + '/openData/saveData',
        method: 'post',
        data: params
    })

}
/**
 *  数据公开审核列表
 * @param params 查询参数
 * @returns
 */
export const getopenDataApprovalList = (params: {
    currentPage: number, pageSize: number, datasetName?: number | string,
    workFlowList: Array<string | number>,
    orgIds?: Array<string | number>,
    beginTime: string,
    endTime: string,
    reviewStatus?: number | string,
}) => {
    return http.request({
        url: baseUrl + '/openDataApproval/page',
        method: 'post',
        data: params
    })

}
/**
 *  数据公开审核列表 
 * @param params 查询参数
 * @returns
 */
export const getmodelApprovalList = (params: {
    currentPage: number,
    pageSize: number,
    modelName?: number | string,
    workFlowList: Array<string | number>,
    orgIds?: Array<string | number>,
    modelType: string | number,
    pageType: string | number,
    reviewStatus?: number | string,
}) => {
    return http.request({
        url: baseUrl + '/modelApproval/page',
        method: 'post',
        data: params
    })

}
/**
 * 模型发布审核、部署审核、试用详情
 * @param id
 * @returns {}
 */

export const modelApprovalDetail = (modelId: number | string) => {
    return http.request({
        url: baseUrl + `/modelApproval/detail?modelId=${modelId}`,
        method: 'get'
    })
}

/**
 *  报表管理列表
 * @param params 查询参数
 * @returns
 */
export const getReportList = (params: {
    pageNum: number,
    pageSize: number,
    reportName?: number | string,
    reportType: string | number,
    dataType: string | number,
    status?: number | string,
}) => {
    return http.request({
        url: baseUrl + '/provider/report/page',
        method: 'post',
        data: params
    })

}
/**
 *  新增报表
 * @param params 查询参数
 * @returns
 */
export const getSaveOrUpdate = (params) => {
    return http.request({
        url: baseUrl + '/provider/report/saveOrUpdate',
        method: 'post',
        data: params
    })

}
/**
 *  编辑-回显-基本信息详情
 * @param params 查询参数
 * @returns
 */
export const getBasicInfo = (params) => {
    return http.request({
        url: baseUrl + `/provider/report/basicInfo?id=${params}`,
        method: 'get',
    })
}
/**
 *  编辑-回显-分类详情
 * @param params 查询参数
 * @returns
 */
export const getTypeInfo = (params) => {
    return http.request({
        url: baseUrl + `/provider/report/typeInfo?id=${params}`,
        method: 'get',
    })
}
/**
 *  删除
 * @param params 查询参数
 * @returns
 */
export const getDelType = (params) => {
    return http.request({
        url: baseUrl + `/provider/report/delete?id=${params}`,
        method: 'get',
    })
}

/**
 *  元数据列表
 * @param params 查询参数
 * @returns
 */
export const getMetaList = (params) => {
    return http.request({
        url: baseUrl + '/provider/meta/page',
        method: 'post',
        data: params
    })

}
/**
 *  获取元数据详情
 * @param params 查询参数
 * @returns
 */
export const getMetaDetail = (params) => {
    return http.request({
        url: baseUrl + `/provider/meta/detail?id=${params}`,
        method: 'get',
    })
}
/**
 *  获取元数据数据来源
 * @param params 查询参数
 * @returns
 */
export const getMetaDataSource = (params) => {
    return http.request({
        url: baseUrl + `/provider/meta/dataSourceList?dataSource=1`,
        method: 'get',
    })
}
/**
 *  获取元数据-业务维度
 * @param params 查询参数
 * @returns
 */
export const getBusinessList = (params) => {
    return http.request({
        url: baseUrl + `/provider/meta/businessList?business=1`,
        method: 'get',
    })
}

/**
 *  业务分析主题管理列表
 * @param params 查询参数
 * @returns
 */
export const getBusinessData = (params) => {
    return http.request({
        url: baseUrl + '/provider/business/page',
        method: 'post',
        data: params
    })

}
/**
 *  业务分析主题管理列表-删除
 * @param params 查询参数
 * @returns
 */
export const getBusinessDataDel = (params) => {
    return http.request({
        url: baseUrl + `/provider/business/delete?id=${params}`,
        method: 'get',

    })

}
/**
 *  业务分析主题管理列表-新增、编辑
 * @param params 查询参数
 * @returns
 */
export const getSaveOrUpdateBu = (params) => {
    return http.request({
        url: baseUrl + '/provider/business/saveOrUpdate',
        method: 'post',
        data: params
    })

}
/**
 *  业务分析主题管理列表-获取关联列表
 * @param params 查询参数
 * @returns
 */
export const getBusinessReportsList = (params) => {
    return http.request({
        url: baseUrl + `/provider/business/reportsList?reports=`,
        method: 'get',

    })
}
/**
 *  业务分析主题管理列表-获取详情
 * @param params 查询参数
 * @returns
 */
export const getBusinessDetail = (params) => {
    return http.request({
        url: baseUrl + `/provider/business/detail?id=${params}`,
        method: 'get',

    })

}