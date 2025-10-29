import http from './axios'
import projectEnv from '@/config/runtimeEnv.js'
let baseUrl =  projectEnv.VITE_APP_BASEURL_SYSTEM
/**
 * 查询租户是否存在
 * @returns {}
 */
export const checkTenant = (params: { tenantId: string }) => {
  return http.request({
    url: '/login/tenant',
    method: 'get',
    params
  })
}

/**
 * 获取登录用户信息
 * @returns {}
 */
export const getLoginUser = () => {
  return http.request({
    url: baseUrl+ '/user',
    method: 'get'
  })
}

// 语言切换
export const updateLocale = (lang: string) => {
  return http.request({
    url: `/settings/info/locale`,
    method: 'post',
    params: { be_locale: lang }
  })
}

// 获取当前语言类型
export const getSettingLocale = () => {
  return http.request({
    url: `/settings/info/locale`,
    method: 'get'
  })
}
// 获取token
export const retrieveToken = async (loginId: string): Promise<TokenContainer | null> => {
  //   const resp = await request.get(`/login/retrieveToken?loginId=${loginId}`);
  const resp = await http.request({
    url:  '/login/retrieveToken',
    method: 'get',
    params: { loginId }
  })
  return resp?.data || null
}

export interface TokenContainer {
  accessToken: string
  idToken: string
}
export const remoteTenant = (queryStr: string) => {
    return http.request({
        url: `/login/tenant/getTenantByCodeOrAccount?codeOrAccount=${queryStr}`,
        method: 'get'
    })
}
// 获取产品配置
export const getProductConfigInfo = () => {
    return http.request({
        url: `/settings/info/parameter/getProductConfigurationsByProdId?prodId=sed`,
        method: 'get'
    })
}
