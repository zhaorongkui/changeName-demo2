export interface TableDataItem {
  id: string // 模型ID
  modelName: string // 模型名称
  type: string // 模型类型
  description: string // 功能描述
  input: string // 输入数据
  output: string // 输出结果
  scenario: string // 应用场景
  metrics: string // 评估指标
  status: string // 发布状态
  createTime: string // 创建时间
  modelID: string // 当前版本
  updateTime: string // 最近更新时间
    modelDescription: string //模型描述
    creator: string //创建人
    versionCount: number //版本数量

}

