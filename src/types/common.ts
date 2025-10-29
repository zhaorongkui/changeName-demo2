export interface PageResult<T> {
  total: number
  size: number
  current: number
  pages: number
  records: T[]
}

export interface Organization {
  name: string
  orgId: string
  id?: string
  parentOrgId?: string
  parentOrgName?: string
  parentId?: string
  orgType: number | null
  parentOrgType?: number | null
  status?: number
  source?: number
  principal?: string
  principalName?: string
  userCnt?: number
  thirdPartyUserCnt?: number
  deptType?: string //部门性质
  orgLevel?: string // 组织层级
  parentOrgLevel?: string | undefined // 上级组织层级
  thirdCode?: string // 三方编码
  grantedUserCnt?: number
  tags?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  updatedBy?: string
  checked?: CheckboxValueType
  disabled?: boolean
  ancestors?: string[]
  children?: Organization[]
}

export interface ParamData {
  [key1: string]: string | number | any | null
}
