import { EnumValue } from '@/utils/enum';

export const roleType = {
  normal: EnumValue.of(1, '普通角色'),
  subAdmin: EnumValue.of(2, '子管理员角色'),
  admin: EnumValue.of(3, '超级管理员角色'),
};
export const roleSource = {
  system: EnumValue.of(1, '内置'),
  customize: EnumValue.of(2, '自定义'),
};
export const roleStatus = {
  active: EnumValue.of(1, '启用'),
  locked: EnumValue.of(2, '停用'),
};
