import { useAppStore } from '@/store/modules/app';
import _ from 'lodash';

export const hasPermission = (value, def = true) => {
  // 不传值，不做鉴权
  if (!value) {
    return def;
  }

  // 传入单个权限码数值，判断权限码数组中是否包含，包含则返回true
  const allCodeList = useAppStore().getPermitionBtnCodes || [];
  if (!Array.isArray(value)) {
    return allCodeList.includes(value);
  }

  // 传入权限码数组，与store中的权限码数组取交集，如果存在交集则返回true
  return _.intersection(value, allCodeList).length > 0;
};
