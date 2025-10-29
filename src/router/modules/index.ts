/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-22 13:44:10
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-22 15:25:00
 * @FilePath: \model-sandbox-frontend\src\router\modules\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RouteRecordRaw } from 'vue-router'

import { backendManagementRoutes } from './backendManagement'
import { datasetManagementRoutes } from './datasetManagement'
import { modelManagementRoutes } from './modelManagement'
import { modelDevelopRoutes } from './modelDevelop'
import { modelEvaluationRoutes } from './modelEvaluation'
import { systemManagementRoutes } from './systemManagement'

const routes: RouteRecordRaw[] = [
  ...datasetManagementRoutes,
  ...modelManagementRoutes,
  ...backendManagementRoutes,
  ...systemManagementRoutes
  // ...modelDevelopRoutes,
  // ...modelEvaluationRoutes
]

export default routes
