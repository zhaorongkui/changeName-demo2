/*
 * @Author: linyongcai
 * @Date: 2024-12-19 15:18:47
 * @FilePath: \formula-editor\formula-editor\src\types.ts
 * @Description: 页面描述
 */

import type { Position } from 'codemirror'
export type fieldTypeVo = 'string' | 'number' | 'array'

/**字段描述 */
export interface FieldDataVo {
  name: string
  value?: fieldTypeVo
  enCode: string
  children?: FieldDataVo[]
}

/**公式用法 */
export interface FormulaBaseUseVo {
  /**公式名称 */
  name: string
  /**公式code */
  enCode: string
  /**公式的提示文本 */
  tip: string
  /**公式示例 */
  example: string
  /**公式说明 */
  usage: string
  /**公式类型 */
  type?: 'custom'
  /**公式类型为custom时存在，需要替换的公式变量 */
  replace?: string[]
}
/**公式分类数据结构 */
export interface BaseFormulaVo {
  /**公式分类名称 */
  name: string
  /**公式分类编码 */
  enCode: string
  /**公式列表 */
  formula: FormulaBaseUseVo[]
}
/**参数配置数据结构 */
export interface ParamsFieldVo {
  key: string
  value: string
  name?: string
  /**是否是多值 0不是  1是 */
  singleValue: '0' | '1'
  /**新增类型 1:新增  2:修改 */
  addType?: 1 | 2
  /** 前端生成的唯一标识 */
  uid?: string
}
export interface CodemirrorMarksVo {
  enCode: string
  from: Position
  to: Position
  uid: string
}
