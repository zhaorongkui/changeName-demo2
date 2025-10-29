/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-21 13:21:20
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-06 10:37:16
 * @FilePath: \model-sandbox-frontend\src\hooks\tokenStatus.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue'
// 存储token的状态
const token = ref('')
// 定义不需要token的接口
const hasTokenUrl = ref<string[]>([
  '/datas/detail',
  '/datas/basic',
  '/datas/page',
  '/datas/list',
  '/datas/bindAssetInfo',
  '/datas/bindAsset',
  '/dict/getAllByCode',
  '/dict/getAllType',
  '/dict/getValueByCode',
  '/file/page',
  '/forum/page',
  '/forum/list',
  '/model/detail',
  '/model/basic',
  '/model/page',
  '/model/list',
  '/model/bindAssetInfo',
  '/model/bindAsset',
  '/tag/page',
  '/tag/list',
  '/tag/info',
  '/tagType/page',
  '/tagType/list',
  '/tagType/info',
  '/third/listBrief',
  '/third/getRaceDetail',
  '/third/queryInformation'
])
export default function TokenInfo() {
  if (localStorage.getItem('token')) {
    token.value = localStorage.getItem('token')
  } else {
    token.value = ''
  }
  const setToken = (tokenStr) => {
    localStorage.setItem('token', tokenStr)
    token.value = tokenStr
  }
  return {
    setToken,
    token,
    hasTokenUrl
  }
}
