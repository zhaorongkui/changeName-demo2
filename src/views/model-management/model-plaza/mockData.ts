// 树节点接口定义
export interface TreeNode {
    id: string | number
    label: string
    children?: TreeNode[]
    count?: number
    level?: number
    type?: string,
    orgId?: number | string,
}


// 模型类型选项
export const modelTypeOptions = [
    { value: 1, label: '机器学习' },
    { value: 2, label: '智能体' },
    { value: 3, label: '数据规则模型' }
]




