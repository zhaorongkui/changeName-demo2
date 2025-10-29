
export interface TableDataItem {
  modelId: string // 模型modelId
  modelName: string // 模型名称
  modelType: string // 模型类型
  notes: string // 功能描述
  inputParameters: string // 输入数据
  outputParameters: string // 输出结果
  applicableScenario: string // 应用场景
  metrics: string // 评估指标
  releaseStatus: string // 发布状态
  createdAt: string // 创建时间
  modelVersion: string // 当前版本
  lastUpdated: string // 最近更新时间
    datasetList?: any // 关联数据集
    paramsListInput?: any//输入参数
    paramsListOutPut?: any //输出参数
    evaluationMetricsData?:any //评估指标
    owner?:string
    developLanguage?:string
    updateTime?:string
    id?:string | number
}
