export enum ConditionGroupType {
  AND = 'and',
  OR = 'or'
}

export enum OperatorType {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  GREATER_THAN_EQUAL = '>=',
  LESS_THAN = '<',
  LESS_THAN_EQUAL = '<=',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

export enum NodeType {
  ITEM = 'item',
  GROUP = 'group'
}

// 基础节点接口，所有条件相关节点都继承此接口
export interface BaseNode {
  id: string
  nodeType: NodeType
}

// 条件项节点
export interface ConditionItemNode extends BaseNode {
  nodeType: NodeType.ITEM
  field: string
  operator: OperatorType
  value: any
  valueType?: string // 值的类型，默认使用字段类型
}

// 条件组节点
export interface ConditionGroupNode extends BaseNode {
  nodeType: NodeType.GROUP
  type: ConditionGroupType // AND 或 OR
  children: Array<ConditionItemNode | ConditionGroupNode>
}

export interface ConditionItemNode {
  id: string
  field: string
  operator: OperatorType
  value: any
}

export interface ConditionGroupNode {
  type: ConditionGroupType
  conditions: ConditionItemNode[]
  groups: ConditionGroupNode[]
}

export interface FieldOption {
  label: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'date'
}

export const OPERATOR_OPTIONS = [
  { label: '等于', value: OperatorType.EQUAL },
  { label: '不等于', value: OperatorType.NOT_EQUAL },
  { label: '大于', value: OperatorType.GREATER_THAN },
  { label: '大于等于', value: OperatorType.GREATER_THAN_EQUAL },
  { label: '小于', value: OperatorType.LESS_THAN },
  { label: '小于等于', value: OperatorType.LESS_THAN_EQUAL },
  { label: '包含', value: OperatorType.CONTAINS },
  { label: '不包含', value: OperatorType.NOT_CONTAINS },
  { label: '开头是', value: OperatorType.STARTS_WITH },
  { label: '结尾是', value: OperatorType.ENDS_WITH },
  { label: '为空', value: OperatorType.IS_NULL },
  { label: '不为空', value: OperatorType.IS_NOT_NULL }
]

// 根据不同字段类型提供不同的操作符选项
export function getOperatorsByFieldType(type: string): { label: string; value: string }[] {
  switch (type) {
    case 'string':
      return [
        { label: '等于', value: OperatorType.EQUAL },
        { label: '不等于', value: OperatorType.NOT_EQUAL },
        { label: '包含', value: OperatorType.CONTAINS },
        { label: '不包含', value: OperatorType.NOT_CONTAINS },
        { label: '开头是', value: OperatorType.STARTS_WITH },
        { label: '结尾是', value: OperatorType.ENDS_WITH },
        { label: '为空', value: OperatorType.IS_NULL },
        { label: '不为空', value: OperatorType.IS_NOT_NULL }
      ]
    case 'number':
      return [
        { label: '等于', value: OperatorType.EQUAL },
        { label: '不等于', value: OperatorType.NOT_EQUAL },
        { label: '大于', value: OperatorType.GREATER_THAN },
        { label: '大于等于', value: OperatorType.GREATER_THAN_EQUAL },
        { label: '小于', value: OperatorType.LESS_THAN },
        { label: '小于等于', value: OperatorType.LESS_THAN_EQUAL },
        { label: '为空', value: OperatorType.IS_NULL },
        { label: '不为空', value: OperatorType.IS_NOT_NULL }
      ]
    case 'boolean':
      return [
        { label: '等于', value: OperatorType.EQUAL },
        { label: '不等于', value: OperatorType.NOT_EQUAL }
      ]
    case 'date':
      return [
        { label: '等于', value: OperatorType.EQUAL },
        { label: '不等于', value: OperatorType.NOT_EQUAL },
        { label: '大于', value: OperatorType.GREATER_THAN },
        { label: '大于等于', value: OperatorType.GREATER_THAN_EQUAL },
        { label: '小于', value: OperatorType.LESS_THAN },
        { label: '小于等于', value: OperatorType.LESS_THAN_EQUAL }
      ]
    default:
      return OPERATOR_OPTIONS
  }
}

// 生成唯一ID
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * 创建一个新的条件项节点
 */
export function createConditionItemNode(
  field: string = '',
  operator: OperatorType = OperatorType.EQUAL,
  value: any = '',
  valueType?: string
): ConditionItemNode {
  return {
    id: generateUniqueId(),
    nodeType: NodeType.ITEM,
    field,
    operator,
    value,
    valueType
  }
}

/**
 * 创建一个新的条件组节点
 */
export function createConditionGroupNode(
  type: ConditionGroupType = ConditionGroupType.AND,
  children: Array<ConditionItemNode | ConditionGroupNode> = []
): ConditionGroupNode {
  return {
    id: generateUniqueId(),
    nodeType: NodeType.GROUP,
    type,
    children
  }
}

/**
 * 将旧的条件组结构转换为新的节点结构
 */
export function convertOldGroupToNewStructure(oldGroup: ConditionGroupNode): ConditionGroupNode {
  const children: Array<ConditionItemNode | ConditionGroupNode> = []

  // 转换条件项
  if (oldGroup.conditions && oldGroup.conditions.length > 0) {
    for (const condition of oldGroup.conditions) {
      children.push({
        id: condition.id || generateUniqueId(),
        nodeType: NodeType.ITEM,
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      })
    }
  }

  // 递归转换子条件组
  if (oldGroup.groups && oldGroup.groups.length > 0) {
    for (const group of oldGroup.groups) {
      children.push(convertOldGroupToNewStructure(group))
    }
  }

  return {
    id: generateUniqueId(),
    nodeType: NodeType.GROUP,
    type: oldGroup.type,
    children
  }
}

/**
 * 将新的节点结构转换回旧的条件组结构（用于兼容）
 */
export function convertNewStructureToOldGroup(newNode: ConditionGroupNode): ConditionGroupNode {
  const conditions: ConditionItemNode[] = []
  const groups: ConditionGroupNode[] = []

  for (const child of newNode.children) {
    if (child.nodeType === NodeType.ITEM) {
      conditions.push({
        id: child.id,
        field: child.field,
        operator: child.operator,
        value: child.value
      })
    } else if (child.nodeType === NodeType.GROUP) {
      groups.push(convertNewStructureToOldGroup(child))
    }
  }

  return {
    type: newNode.type,
    conditions,
    groups
  }
}
