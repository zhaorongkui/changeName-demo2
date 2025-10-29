/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-21 13:21:20
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 16:39:09
 * @FilePath: \model-sandbox-frontend\src\api\axios.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import projectEnv from '@/config/runtimeEnv.js'
import TokenInfo from '@/hooks/tokenStatus'
import { getToken } from '@/utils/auth'
import { useAppStore } from '@/store/modules/app';
import { logout } from '@/utils/logout';
import { useRouter } from 'vue-router'
const router = useRouter()
console.log('当前环境变量', projectEnv)
const { hasTokenUrl } = TokenInfo()
// axios二次封装的核心逻辑
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = projectEnv.VITE_USER_NODE_ENV ==='development' ?  baseUrl  :  baseUrl + '/api/v1'
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      header: {}
    }
    return config
  }
  //   getInsideConfig() {
  //       // ✅ 不设置 baseURL，让请求的 url 自己带上前缀，如 /api/xxx
  //       return {
  //           baseURL: '',
  //           headers: {}
  //       }
  //   }
  interception(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      function (config) {
        if (getToken()) {
          // 有token的时候给所有的接口添加token
          config.headers.Authorization = `Bearer ${getToken()}`
        } else if (hasTokenUrl.value.includes(url)) {
          // 没有token的时候，给特定的接口添加请求头部
          config.headers['X-Tenant-Id'] = 'bewg'
        }
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    instance.interceptors.response.use(
      function (response) {
        if (url.includes('/workflow/api/v1/xflowable/process/instance/image')) {
          // 工作流接口直接返回
          return response;
        }

        if (response.data.code !== 0 && response.data.message) {
          ElMessage.warning(response.data.message)
        }
        return response.data
      },
      function (error) {
          if (error.status === 401) {
              logout(useAppStore().getTenantId);
          }else if (error.status === 403) {
              router.push('/403');
          }
          console.log(error,'error')
        if (error.response.data.code === -1 || error.response.data.code === 100400 || error.response.data.code === 100500) {
          ElMessage.warning(error.response.data.message)
        }
          return Promise.reject(error)
      }
    )
  }

  request(options) {
    const instance = axios.create()
    options = { ...this.getInsideConfig(), ...options }
    this.interception(instance, options.url)
    return instance(options)
  }
  // request(options) {
  //     const instance = axios.create()
  //     const config = {
  //         ...this.getInsideConfig(),
  //         ...options,
  //         baseURL: '',
  //     }
  //     this.interception(instance, config.url)
  //     return instance(config)
  // }

}
export default new HttpRequest(projectEnv.VITE_APP_MODEL_SANDBOX)
// export default new HttpRequest()
