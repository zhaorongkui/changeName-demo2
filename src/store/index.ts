/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-05 15:44:39
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 16:10:01
 * @FilePath: \model-sandbox-frontend\src\store\index.ts
 * @Description:
 * */
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(createPersistedState())

export default store
