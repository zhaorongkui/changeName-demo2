/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-15 16:21:32
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-27 14:24:34
 * @FilePath: \model-sandbox-frontend\src\i18n\i18n.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createI18n } from 'vue-i18n'
import en from './language/en/index'
import ch from './language/zhCn/index'
import { hasLocalStorage } from '@/utils'

const language = () => {
  if (hasLocalStorage('app')) {
    const appStr = localStorage.getItem('app')
    try {
      const appObj = appStr ? JSON.parse(appStr) : {}
      return appObj.language || 'zh-CN'
    } catch (e) {
      return 'zh-CN'
    }
  }
  return 'zh-CN'
}
const langMap = {
  'zh-CN': 'ch',
  'en-US': 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: langMap[language()], // set locale
  fallbackWarn: false,
  missingWarn: false,
  messages: {
    ch,
    en
  }, // set locale messages
  globalInjection: true
  // If you need to specify other options, you can set other options
  // ...
})

export default i18n
