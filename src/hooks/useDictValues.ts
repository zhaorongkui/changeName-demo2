import { ref } from 'vue';
import { getDictItems } from '@/api/dict'; // 导入接口
/**
 * 任务待办公共逻辑Hook
 * @param dictId 字典ID
 * @returns {List} { 返回的字典值 }
 */
export function useDictValues() {
    const dictValues = ref([]);
    // 获取字典项
    const getDictionaryValues = async (dictId) => {
        try {
            // 1. 发起接口请求，等待响应（确保 getDictItems 返回的是正确的响应对象）
            const res = await getDictItems({
                id: dictId,
                pageNum: 1,
                pageSize: 1000,
                keyword: '',
                asc: true,
                orderBy: '',
            })
            // 2. 校验响应数据（避免空数据导致res 异常）
            if (!res || !res.data) {
                dictValues.value = [];
                return [];
            }
            dictValues.value = res.data.records;
            return res.data.records;
        } catch (error) {
            // 错误捕获：方便调试，且避免页面卡死
            console.error('获取失败：', error.message);
            dictValues.value = [];
            return [];
        }
    };
    // 返回响应式数据和方法
    return {
        getDictionaryValues,
        dictValues
    };
};
