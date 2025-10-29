/*
 * @Description: 组织
 */
// 因为这里使用了import, 导致ts以为这是个模块而不是声明全局类型的文件, 所以使用这些类型, 依然需要手动import的
import type { CheckboxValueType } from 'element-plus';
import type { SearchFormItem } from '@/types/search.ts';
interface Organization {
  name: string;
  orgId: string;
  id?: string;
  parentOrgId?: string;
  parentOrgName?: string;
  parentId?: string;
  orgType: number | null;
  depth?: number;
  deptType: number | string;
  status?: number;
  iotStatus: number;
  source?: number;
  principal?: string;
  userCnt?: number;
  thirdPartyUserCnt?: number;
  grantedUserCnt?: number;
  tags?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  checked?: CheckboxValueType;
  disabled?: boolean;
  ancestors?: string[];
  children?: Organization[];
  orgLevel: string;
  isLeaf?: boolean;
}

interface FormOrganization extends Organization {
  orgTags: string[] | null;
  notify?: number | null;
  notifyPerson: User[];
  creationNoticeReceivers: User[];
  orgPerson: User[];
  remark?: '' | null;
  parentOrgName?: string;
}

interface OrganizeType {
  id: string;
  name: string;
  type: number;
  parentId?: string;
  $treeNodeId?: number;
  children?: OrganizeType[];
}

interface CommonColumn {
  type?: string;
  prop: string;
  lang?: string;
  label: string;
  align?: string;
  sortable?: boolean;
  minWidth?: number;
  edit?: boolean;
  required?: boolean;
  width?: number | null;
  format?: (value: any, row: Organization) => string | number | null;
  buttons?: (row: Organization) => any;
  search?: SearchFormItem;
}
interface ColumnOperate {
  type?: string;
  name: string;
  lang?: string;
  command?: string;
  code?: string;
  children?: ColumnOperate[];
}

// 用户
interface User {
  id: string;
  name: string;
  username: string;
  userAccount: string;
  jobNumber: string;
  position: string;
  authRole: string;
  status: number;
  orgId: string;
  orgName: string;
  orgs: Organization[];
  authorizedRoles: any[];
  resources: Resource[];
  authorizedRoles: any[];
  roles: Role[];
  [key1: string]: string | number;
}

interface IconStyle {
  backgroundColor: string;
  color: string;
}

// 菜单
interface Resource {
  ordering?: number;
  isChecked?: boolean;
  id: string;
  parentId: string;
  behavior: string;
  name: string;
  displayName: string;
  path?: string;
  code: string;
  moduleId?: string;
  moduleName?: string;
  icon?: string;
  iconStyle?: IconStyle;
  scope?: string;
  updatedAt?: string;
  type: number;
  level?: number;
  ancestors: string[];
  meta: RouteMeta;
  component: string;
  redirect: string;
  children?: Resource[];
  bootstrapOnly: boolean;
}

// 角色
interface Role {
  isChecked?: boolean;
  id: string;
  code: string;
  name: string;
  status: number;
  type: number;
  source: number;
  remark: string;
  groupId: string;
  groupName: string;
}
interface GroupRole {
  id: number;
  name: string;
  ordering: number;
  roles: Role[];
  source?: string | null;
  tenantId?: string | null;
}
interface Tree {
  [key: string]: any;
}
