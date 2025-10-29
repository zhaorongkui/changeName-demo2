<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-30 09:59:02
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-04 09:49:02
 * @FilePath: \model-sandbox-frontend\src\views\model-management\editor\components\datasetDetail\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    :class="{
      'detail-toggle-open': detailToggle,
      'detail-toggle-close': !detailToggle,
      'dataset-detail-border': nodePropertyVisible
    }"
    class="dataset-detail"
  >
    <div class="toggle-btn" @click="handleToggle">
      <el-icon v-if="!detailToggle" class="toggle-btn-icon up"><DArrowLeft /></el-icon>
      <el-icon v-else class="toggle-btn-icon down"><DArrowLeft /></el-icon>
    </div>
    <div v-if="detailToggle" class="content-main">
      <div class="data-table-container">
        <el-table
          :data="tableData"
          size="small"
          class="table-content"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        >
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column v-for="field in fieldList" :key="field.key" :label="`${field.key}`" width="100">
            <el-table-column :prop="field.key" :label="`${field.label}`"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-pagination
        class="inline-block justify-end mt-1"
        size="small"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue'
import { DArrowLeft } from '@element-plus/icons-vue'
import { clone } from 'lodash-es'

const props = defineProps<{
  visible: boolean
  defaultData: Array<Record<string, any> | null>
}>()

const nodePropertyVisible = computed(() => props.visible)

const detailToggle = ref(true)
const handleToggle = () => {
  detailToggle.value = !detailToggle.value
}

const fieldList = ref([
  { key: 'm_code', label: '数值', type: 'number', typeName: '数值' },
  { key: 'm_time', label: '时间', type: 'date', typeName: '时间' },
  { key: 'm_text', label: '文本', type: 'text', typeName: '文本' },
  { key: '1#_flow_in', label: '1号进水口', type: 'number', typeName: '数值' },
  { key: '1#_flow_out', label: '1号出水口', type: 'number', typeName: '数值' },
  { key: '2#_flow_in', label: '2号进水口', type: 'number', typeName: '数值' },
  { key: '2#_flow_out', label: '2号出水口', type: 'number', typeName: '数值' },
  { key: '3#_flow_in', label: '3号进水口', type: 'number', typeName: '数值' },
  { key: '3#_flow_out', label: '3号出水口', type: 'number', typeName: '数值' },
  { key: 'total_flow_in', label: '总进水', type: 'number', typeName: '数值' },
  { key: 'total_flow_out', label: '总出水', type: 'number', typeName: '数值' }
])

const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loadTableData = () => {
  // 模拟加载数据
}
// 分页事件处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadTableData()
}

watch(
  () => props.defaultData,
  (newVal) => {
    console.log('watch defaultData:', newVal)
    tableData.value = newVal
  },
  { immediate: true, deep: true }
)

defineExpose({
  close: () => {
    detailToggle.value = false
  },
  open: () => {
    detailToggle.value = true
  }
})
</script>
<style lang="scss">
.dataset-detail {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  &.detail-toggle-open {
    padding: 0 12px 12px;
    .toggle-btn {
      top: 0.5rem;
    }
  }
  &.detail-toggle-close {
    .toggle-btn {
      top: 0;
    }
  }
  &.dataset-detail-border {
    border-top: 1px solid #e5e7eb;
  }
  .data-table-container {
    max-height: 180px;
  }
}
.toggle-btn {
  width: 56px;
  height: 20px;
  position: absolute;
  z-index: 101;
  top: 0.5rem;
  left: 50%;
  transform: translate(-50%, -100%);
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  color: rgb(78, 89, 105);
  background-color: #f5f5f7;
  border-top: 1px solid var(--color-border-2);
  border-left: 1px solid var(--color-border-2);
  border-right: 1px solid var(--color-border-2);
  box-shadow: 0 -2px 6px 0 rgb(229, 230, 235);
  text-align: center;
  line-height: 20px;
  .toggle-btn-icon {
    // 翻转
    font-size: 18px;
    &.up {
      transform: rotate(90deg);
    }
    &.down {
      transform: rotate(-90deg);
    }
  }
}
</style>
