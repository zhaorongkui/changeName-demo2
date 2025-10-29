export interface DictBaseInfo {
  createdAt: string;
  createdBy: string;
  id: number;
  orgId: string;
  parentId: number;
  remark: string;
  sortOrder: number;
  source: DictMapItem;
  state: DictMapItem<DictStatusEnum>;
  tenantId: string;
  updatedAt: string;
  updatedBy: string;
}

// 字典列表
export interface DictListItem extends DictBaseInfo {
  displayName: string;
  name: string;
  valueProvider: string;
  valueProviderType: DictMapItem;
}

export enum DictStatusEnum {
  NORMAL = 1,
  STOPPED = 2,
}

export interface DictMapItem<T = string> {
  code: T;
  name: string;
}

// 字典项
export interface DictOptionItem extends DictBaseInfo {
  displayValue: string;
  id: number;
  intValue: number;
  textValue: string;
  typeId: number;
  name: string;
}
