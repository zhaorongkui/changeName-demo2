import { EnumValue } from '@/utils/enum';

export const dictionaryState = {
  active: EnumValue.of(1, '启用'),
  locked: EnumValue.of(2, '锁定'),
  disabled: EnumValue.of(0, '停用'),
};

export const dictionaryType = {
  enum: EnumValue.of('枚举', 'e'),
  api: EnumValue.of('API', 'a'),
  xml: EnumValue.of('脚本', 'x'),
};

export const dictionaryValueSource = {
  enum: EnumValue.of('手工录入', 'e'),
  api: EnumValue.of('远程请求', 'a'),
  xml: EnumValue.of('脚本生成', 'x'),
};

export const dictionarySource = {
  enum: EnumValue.of(1, '自定义'),
  api: EnumValue.of(2, '内置'),
};
