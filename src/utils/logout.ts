/*
 * @Author: lihuihui
 * @Date: 2025-03-21 11:05:26
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-24 15:42:00
 * @Description: 请填写简介
 */
import { removeToken } from './auth';
import projectEnv from '@/config/runtimeEnv.js';
import { PRODUCT_ID } from '@/constants/config'
import { jwtDecode } from 'jwt-decode';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
function clearAllCookies() {
    const cookies = document.cookie.split(';')
    const domain = window.location.hostname

    cookies.forEach(cookie => {
        const parts = cookie.split('=')
        const name = parts[0].trim()

        // 清除根路径和当前路径的 cookie
        document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        document.cookie = `${name}=; path=${window.location.pathname}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    })
}
// 登出
export const logout = (tenantId: string, type?: string) => {
    let idToken = localStorage.getItem('id_token')
    if (!tenantId) {
        const jwtObj = parseJwt(idToken) || {};
        tenantId = jwtObj?.tenant || '';
    }
    let tenantLocal = tenantId || localStorage.getItem('tenantId')
    removeToken() // 清除token
    localStorage.clear();
    clearAllCookies() // 清除所有cookie
    window.sessionStorage.clear() // 清除sessionStorage
    if (!tenantLocal && idToken) {
        // 从idToken中解析出tenant
        const { tenant = '' } = parseJwt(idToken) || {}
        tenantLocal = tenant
    }
    let BASE_API =  projectEnv.VITE_APP_MODEL_SANDBOX
    const backUrl = `${window.location.origin}/#/`;
    console.log(BASE_API,`${BASE_API}/login/signout?tenantId=${tenantLocal}&idToken=${idToken}&productId=${PRODUCT_ID}&post_logout_redirect_uri=${BASE_API}/login/signin`)
    if (idToken && tenantLocal) { // 没有这两个的任何一个都不要调用logout接口，否则就回进入报错页面，直接重定向到企业登录页面
        // 判断退出登录还是切换企业
        if (type === '切换企业') {
            localStorage.clear()
            window.location.href = `${BASE_API}/login/signoutTenant?tenantId=${tenantLocal}&idToken=${idToken}&productId=${PRODUCT_ID}&clientIdentifier=pc`
        } else {
            window.location.href = `${BASE_API}/login/signout?tenantId=${tenantLocal}&idToken=${idToken}&productId=common&post_logout_redirect_uri=${BASE_API}/login/signin&target=${window.btoa(backUrl)}`
        }
    } else {
        ElMessage.warning('登录信息错误，请重新登录')
        localStorage.clear()
        clearAllCookies()
        router.push('/login')
    }
}

function parseJwt(token) {
  try {
    const result = jwtDecode(token);
    return result;
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
}
