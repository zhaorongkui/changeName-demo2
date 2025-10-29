import http from './axios'

import { ParamData, PageResult, Organization } from '~/types/common'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl = projectEnv.VITE_APP_BASEURL
const prefix = '/commonApi'

export const getOrgTree = (): Organization[] => {
  return http.request({
    url: `${prefix}/user/org/trees`,
    method: 'get'
  })
}

/**
 * 根据组织名称模糊搜索
 * @param params { name: string }
 * @returns {}
 */

export const getOrgTreeByName = (params: { name?: string }): PageResult<Organization> => {
  return http.request({
    url: '/user/org/names',
    method: 'get',
    params
  })
}
/**
 * 属性树
 * @returns {}
 */

export const getfieldTree = (params: { keyWord?: string }): PageResult<Organization> => {
  return http.request({
    url: baseUrl + '/dataApplication/field',
    method: 'post',
    data: params
  })
}
// 获取产品配置
export const getProductConfigApi = (params) => {
    // return request.get(`/settings/info/parameter/getProductConfigurationsByProdId`, params);
    return http.request({
        url: '/settings/info/parameter/getProductConfigurationsByProdId',
        method: 'get',
        params
    })
};
// 获取数据来源
export const getDataSourceList = (dataSource) => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/dataSourceList?dataSource=${dataSource}`,
        method: 'get',  
    })
};
// 获取业务域
export const getBusinessDomainList = (businessDomain) => {
    return http.request({
        url: baseUrl + `/provider/ailabLogicalDataModel/businessDomainList?businessDomain=${businessDomain}`,
        method: 'get',  
    })
};

// // 获取字典类型
// export const getAllType = () => {
//     return http.request({
//         url: baseUrl + `/apiLabModel/getAllType`,
//         method: 'get',
//     })
// };

// 获取字典类型详情
export const getAllByCode = (params) => {
    return http.request({
        url: baseUrl + `/apiLabModel/getAllByCode?type=${params.type}`,
        method: 'get',
    })
};

// 获取训练详情-结果
export const getTrainResult = (params) => {
    return http.request({
        url: baseUrl + `/modelTrain/detail?id=${params}`,
        method: 'get',
    })
};