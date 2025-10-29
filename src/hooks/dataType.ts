import { ref } from "vue";

/**
 * 存储数据类型
 *   {
    label: '模型',
    key: 'model',
  },
  {
    label: '数据集',
    key: 'datas',
  },
*/
interface TypeItem {
    key: string,
    label: string,
}
const dataType = ref<TypeItem>({
    label: '模型',
    key: 'model',
})
export default function TypeInfo () {
    if (localStorage.getItem('dataType')) {
        dataType.value = JSON.parse(localStorage.getItem('dataType'))
    }
    const setTypeFn = (data: TypeItem) => {
        localStorage.removeItem('dataType')
        dataType.value.key = data.key;
        dataType.value.label = data.label;
        localStorage.setItem('dataType', JSON.stringify(dataType.value))
    }
    return {
        dataType,
        setTypeFn,
    }
} 