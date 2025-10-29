<template>
  <div class="params-input-node-property">
    <div class="content-main">
      <div class="data-info" style="margin-top: 12px">
        <el-descriptions title="数据集" :column="4" size="small">
          <el-descriptions-item label="数据集ID">DS001</el-descriptions-item>
          <el-descriptions-item label="数据集名称">污水厂曝气系统运行数据集202X</el-descriptions-item>
          <el-descriptions-item label="申请人"> 张工 </el-descriptions-item>
          <el-descriptions-item label="申请时间"> 2025-07-21 </el-descriptions-item>
          <el-descriptions-item label="发布时时间">2025-07-20</el-descriptions-item>
          <el-descriptions-item label="业务范围"> 曝气系统 </el-descriptions-item>
          <el-descriptions-item label="时间范围"> 2020-2023年 </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="data-table-container">
        <el-table
          ref="dataTableRef"
          :data="tableData"
          size="small"
          class="table-content"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
          @select="handleSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            v-for="field in fieldList"
            :key="field.key"
            :prop="field.key"
            :label="`${field.key}/${field.label}`"
            min-width="100"
          />
        </el-table>
      </div>
      <el-pagination
        class="inline-block justify-end mt-1"
        size="small"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { on } from 'events'
import { onMounted, ref } from 'vue'
const emit = defineEmits(['update'])
const props = defineProps({
  properties: {
    type: Object,
    default: () => ({})
  }
})

// 定义字段列表  可能是从后端获取的
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
const dataTableRef = ref(null)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loadTableData = () => {
  // 模拟加载数据

  // 数据预览
  tableData.value = [
    {
      m_code: 123,
      m_time: '2023-10-01',
      m_text: '示例文本',
      '1#_flow_in': 100,
      '1#_flow_out': 90,
      '2#_flow_in': 110,
      '2#_flow_out': 95,
      '3#_flow_in': 120,
      '3#_flow_out': 115,
      total_flow_in: 330,
      total_flow_out: 300
    },
    {
      m_code: 456,
      m_time: '2023-10-02',
      m_text: '另一个示例',
      '1#_flow_in': 200,
      '1#_flow_out': 180,
      '2#_flow_in': 210,
      '2#_flow_out': 195,
      '3#_flow_in': 220,
      '3#_flow_out': 215,
      total_flow_in: 630,
      total_flow_out: 590
    },
    {
      m_code: 789,
      m_time: '2023-10-03',
      m_text: '更多示例',
      '1#_flow_in': 300,
      '1#_flow_out': 280,
      '2#_flow_in': 310,
      '2#_flow_out': 295,
      '3#_flow_in': 320,
      '3#_flow_out': 315,
      total_flow_in: 930,
      total_flow_out: 890
    }
  ]
}
loadTableData()
// 分页事件处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadTableData()
}

/**
 * 选择数据
 */
const handleSelectChange = (selection) => {
  console.log('选中数据:', selection)
  // 可以在这里处理选中的数据
}

const getSelectData = () => {
  // 获取选中数据
  const selectedData = dataTableRef.value.getSelectionRows().map((row) => ({ ...row }))
  console.log('选中数据:', selectedData)
  return {
    'params-input': selectedData
  }
}

/**
 * TODO 这里要加 初始化数据 数据回显的逻辑
 * toggleRowSelection
 *  */

const echoSelectedData = (data) => {
  if (!data || !data['params-input']) return
  const selectedRows = data['params-input']
  console.log('回显选中数据:', selectedRows)
  selectedRows.forEach((row) => {
    const index = tableData.value.findIndex((item) => item.m_code === row.m_code)
    if (index !== -1) {
      dataTableRef.value.toggleRowSelection(tableData.value[index], true)
    }
  })
}

onMounted(() => {
  // 初始化时回显数据
  echoSelectedData(props.properties)
})

defineExpose({
  getSelectData
})
</script>
<style lang="scss">
.params-input-node-property {
  display: flex;
  .data-table-container {
  }
}
</style>
