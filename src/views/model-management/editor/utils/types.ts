export interface NodeAttribute {
  id: string
  status: 'default' | 'success' | 'failed' | 'running'
  label?: string
  type?: string // 节点类型
  properties?: Record<string, any>
  // 'params-input'?: Record<string, any>
  // 'params-output'?: Record<string, any>
}

export interface PropertyUpdateData {
  label?: string
  properties: Record<string, any>
}
