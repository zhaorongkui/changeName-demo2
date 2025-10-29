/*
 * @Author: lihuihui
 * @Date: 2025-03-21 10:43:23
 * @LastEditors: lihuihui
 * @LastEditTime: 2025-03-28 16:05:07
 * @Description: 公共请求封装
 */
import projectEnv from '@/config/runtimeEnv.js';
import { BeTools } from 'bewg-ui-vue3/dist/bewg-ui-vue3.js';
import router from '@/router';
import { useAppStore } from '@/store/modules/app';
import { ElMessage } from 'element-plus';
import { logout } from './logout';
const Request = BeTools.Service;

/**
 *
 * request.get        url: string, params?: any, config?: any
 * request.getOnly    url: string, config?: any
 *
 * request.post       url: string, data?: any, params?: any, config?: any
 * request.postNP     url: string, data?: any, config?: any
 * request.postOnly   url: string, config?: any
 *
 * request.put        url: string, data?: any, params?: any, config?: any
 * request.putNP      url: string, data?: any, config?: any
 * request.putOnly    url: string, config?: any
 *
 * request.delete     url: string, data?: any, params?: any, config?: any
 * request.deleteNP   url: string, data?: any, config?: any
 * request.deleteOnly url: string, config?: any
 *
 */
const request = new Request({
  baseURL: projectEnv.VITE_BASE_URL, // 可以获取环境变量中配置的地址、proxy/nginx代理的前缀等
  withCredentials: true,
  tokenStore: 'localStorage',
  timeout: 30000, // 30S
  validateStatus: function (status: number) {
    // 所有响应都视为成功，都会传递给.then()
    if (status >= 200 && status <= 299) {
      return true;
    } else {
      return false;
    }
  },
  // 拦截器可选参数，如果传入进行拦截
  interceptors: {
    requestInterceptors: (config: any) => {
      if (projectEnv.VITE_PRODUCT_ID) {
        config.headers['X-Product-Id'] = projectEnv.VITE_PRODUCT_ID;
      }
      const tenantId = localStorage.getItem('tenantId');
      if (tenantId) {
        config.headers['X-Tenant-Id'] = tenantId;
      }
      return config;
    },

    requestInterceptorsCatch: (err: any) => {
      return err;
    },

    responseInterceptors: (res: any) => {
      return res;
    },

    responseInterceptorsCatch: (error: any) => {
      const { response } = error;
      if (response?.status == 401) {
        logout(useAppStore().getTenantId);
      } else if (response?.status == 403) {
        router.push('/403');
      } else {
        if (response?.data) {
          ElMessage.error(`提示：${response.data.message}`);
        } else {
          ElMessage.error(`Error with ${error.code}\n提示：${error.message}`);
        }
      }
      return response;
    },
  },
});

export default request;
