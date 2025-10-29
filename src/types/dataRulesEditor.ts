/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-04 17:36:16
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-11 09:08:48
 * @FilePath: \model-sandbox-frontend\src\types\dataRulesEditor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**指标公式的数据结构 */
export interface IndicatorMathElVo {
  /**前端用于回显公式中的参数标签 */
  marks?: string
  params: {
    /**公式的配置参数 */
    [key: string]: {
      /**指标code */
      indicatorCode: string
      /**指标名称 */
      indicatorName: string
      /**指标是否多值 */
      singleValue: boolean
    }
  }
  /**公式文本 */
  script: string
}
/**指标公式校验数据结构 */
export interface IndicatorVerifyScriptVo {
  /**校验的参数 */
  caseParams: { [params: string]: number }
  /**校验计算结果 */
  caseResult: string
  /**校验是否通过 */
  result: boolean
  request: IndicatorMathElVo
}
