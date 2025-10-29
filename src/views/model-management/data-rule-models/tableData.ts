
// 表格数据接口定义
export interface TableDataItem {
  id: string | number // 规则ID
  ruleName: string // 规则名称
  modelVersion?: string // 版本号
  versionAlias?: string // 版本别名
  businessScope?: string // 业务维度
  timeDimension?: string // 时间维度
  creatorOrg?: string // 创建组织
  creator?: string // 创建人
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
  description: string // 规则描述
  metrics: string[] // 判断指标
  businessObject: string // 业务对象
  dataset: string // 数据集名称
  formula?: string // 公式内容
}

