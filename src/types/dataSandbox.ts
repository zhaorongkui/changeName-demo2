/*
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-08-15 10:41:38
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-27 15:52:51
 * @FilePath: \model-sandbox-frontend\src\types\dataSandbox.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
// 标签类型
export interface RawTag {
  id: number
  tagName: string
  tagTypeId: number
  tagTypeName: string
  [key: string]: any
}

export interface TreeNode {
  name: string
  id: string | number
    currentId: string
    parenId: string
  children?: TreeNode[]
  [key: string]: any
}

/**
 * 数据集详情类型
 */
export interface BaseInfo {
    name: string;
    datasetsId: string;
    orgDimension: string;
    beginTime: string;
    endTime: string;
    deadline: string;
    type: number;
    businessObject: string;
    timeRange: string;
    ldmList: Array<{
        id: number;
        dataListId: string;
        businessObject: string;
        businessObjectType: string;
        dataType: string;
        propertyCount: number;
        objectHierarchy: string;
        dateDim: string;
        dataTag: string;
        businessTopic: string;
        createTime: string;
        updateTime: string;
        fieldList: any;
    }>;
}

/**
 * 数据集类型
 */
export interface DatasetType {
  id: string
  datasetId: string
  name: string
  version: string
  publishTime: string
  updateUser?: string
  updateTime?: string
  lastUpdateTime?: string
  description?: string
  factoryName?: string
  organization?: string
  dateRange?: any
  dataType?: string
  businessObject?: string
  businessDomain?: string
  businessCategory?: string
  logicalBusinessObject?: string
  dataTags?: string[]
  downloadCount?: number
  approvalStatus?: string
  openStatus?: string // 新增字段：公开状态
  orgDimension?: string // 组织维度
  dataId?: string | number// 数据集id
  orgId?: string[] | string,
  orgName?: string,
  beginTime?: string,
  endTime?: string,
  datasetUse?: string, //数据集用途
  orgNameId?: string, // 组织名称id
  openOrganization?: string // 开放组织
  openScope?: string // 开放范围
  expirationTime?: string // 到期时间
  openPurpose?: string // 开放目的
  metadata?: Array<{
    fieldName: string
    description: string
    dataType: string
    unit: string
    classTag: string
  }>
}

/**
 * 业务对象类型
 */
export interface BusinessObjectType {
  id?: string
  code?: string
  name?: string
    datasetId?: string
  businessDomain?: string
  dataTag?: string
  time_Dimension?: string
  propertyCount?: number
  description?: string
  lastUpdateData?: string
  businessObject?: string // 业务实体
    businessObjectType?: string // 所属系统/单元
    objectHierarchy?: string // 对象层级
    dataType?: string // 数据分类
    dateDim?: string // 数据更新频率
    updateTime?: number // 最近更新时间
  businessApplicationScenario?: string // 业务应用场景
    dataCategory?: string
    dataUpdateFrequency?: string
    indicatorCount?: number
}
