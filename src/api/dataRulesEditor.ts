/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-04 17:11:34
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-04 17:36:41
 * @FilePath: \model-sandbox-frontend\src\api\dataRulesEditor.ts
 * @Description:
 *  */
import { ElMessage } from 'element-plus'
import http from './axios'
import type { IndicatorMathElVo, IndicatorVerifyScriptVo } from '@/types/dataRulesEditor'

const prefix = ''
export const verifyScriptFun = (data: IndicatorMathElVo) => {
  return http
    .request<IndicatorVerifyScriptVo>({
      url: `${prefix}/settings/indicator/info/script/verify`,
      method: 'post',
      data
    })
    .then((res) => {
      if (res.code !== 0) {
        ElMessage.error(res.message)
      }
      return res
    })
}
