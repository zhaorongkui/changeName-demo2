/*
 * @Author: linyongcai
 * @Date: 2024-12-19 13:46:38
 * @FilePath: \formula-editor\formula-editor\src\index.ts
 * @Description: 页面描述
 */

import FormulaEditor from './components/formula/index.vue'

export * from './types'

export type FormulaEditorInstance = InstanceType<typeof FormulaEditor>
export { FormulaEditor }
