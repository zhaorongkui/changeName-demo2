/*
 * @Author: linyongcai
 * @Date: 2024-12-16 10:40:47
 * @FilePath: \sed-saas-frontend\src\utils\cache.ts
 * @Description: 字典数据缓存
 */

import { type GlobalResult } from '@/components/beService/types';
import { getItemsByName } from '@/service/dict';
import { type DictOptionItem } from '@/types/dict';
/**字典缓存 */
const dictCache: { [key: string]: DictOptionItem[] } = {};

/**
 * 获取字典项数据
 * @param code 字典code
 * @param orgId 字典code
 */
export const getDictItemsByCode = (code: string, orgId?: string) => {
  if (dictCache[code]) {
    return Promise.resolve<GlobalResult<DictOptionItem[]>>({
      code: 0,
      message: '',
      success: true,
      data: dictCache[code],
    });
  }
  return getItemsByName({ name: code, orgId: orgId ?? '' }).then((res) => {
    if (res.code === 0) {
      dictCache[code] = res.data;
    }
    return res;
  });
};
