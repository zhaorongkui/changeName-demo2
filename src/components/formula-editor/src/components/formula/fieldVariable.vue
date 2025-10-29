<!--
 * @Author: linyongcai
 * @Date: 2024-12-20 16:56:33
 * @FilePath: \formula-editor\formula-editor\src\components\formula\fieldVariable.vue
 * @Description: 字段列表
-->
<template>
  <div class="field-variable">
    <div class="field-search">
      <el-input placeholder="搜索变量"
        v-model="searchVariable"
        clearable />
    </div>
    <el-scrollbar class="field-variable-content">
      <el-tree :data="fieldList"
        ref="fieldTreeRef"
        node-key="enCode"
        default-expand-all
        :filter-node-method="filterNodeMethod">
        <template #="{ data, node }">
          <div class="field-item">
            <span>{{ data.name }}</span>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>

  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from 'vue';
import { TreeInstance } from "element-plus";
import { FieldDataVo } from '../../types'

const props = defineProps({
  fieldList: {
    type: Array<FieldDataVo>,
    default: () => [],
  },
})
const emits = defineEmits(['fieldSelect'])
const fieldTreeRef = ref<TreeInstance>();
// 搜索值
const searchVariable = ref('');
const searchTimer = shallowRef<number>();

/**树过滤方法 */
const filterNodeMethod = (value: string, data: FieldDataVo) => {
  if (!value) return true
  return data.name.includes(value)
}
watch(() => searchVariable.value, () => {
  clearTimeout(searchTimer.value)
  searchTimer.value = window.setTimeout(() => {
    fieldTreeRef.value?.filter(searchVariable.value);
  }, 300)
})
</script>
