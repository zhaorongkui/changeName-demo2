<template>
  <div class="add-container">
    <el-button type="primary" @click="handleAdd">新增</el-button>
  </div>
  <div class="data-table-container">
    <be-table :is-lock="false" :table-data="tableData" :options="tableConfig" :columns="tableColumns"
      @command="onCommand"></be-table>
  </div>
  <!--  新增分类-->
  <addTypeDetail v-if="isShowAddDataSet" @close="handleCloseAddDataSet" @submit="handleSubmit" :selectData="tableData"></addTypeDetail>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import type { FormDataSet, TableConfig, DataTableItem } from '@/types/modelManagement'
import LinkedDataset from './linkedDataset.vue'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from "~/utils/constant";
const { t } = useI18n()
import addTypeDetail from './addTypeDetail.vue'
import { useDatasetStore } from '@/store/modules/datasetStore'
import { ElMessageBox } from "element-plus";
const datasetStore = useDatasetStore()
const props = defineProps({
  pageType: {
    type: String,
    default: ''
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isVersion: {  //是否是版本更新或者另存为新版本
    type: Boolean,
    default: false
  },
  currentType: {
    type: Object,
    default: () => { }
  }
})
let isShowAddDataSet = ref(false)
const tableData = ref<DataTableItem[]>([])
const tableColumns = computed(() => {
  return [


    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'businessObjectType',
      label: '所属系统/单元',
      align: 'center'
    },
    {
      prop: 'objectHierarchy',
      label: '对象层级',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      type: 'index',
      prop: 'index',
      label: '排序',
      align: 'center',
      width: 60
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: (row) => {
        const btns = [
          {
            name: '删除',
            command: 'del',
            type: 'primary',
            visibleWhen: (r) => true,
          },
          {
            name: '上移',
            command: 'moveUp',
            type: 'primary',
            visibleWhen: (r) => tableData.value.findIndex(item => item.id === r.id) !== 0,
          },
          {
            name: '下移',
            command: 'moveDown',
            type: 'primary',
            visibleWhen: (r) => (tableData.value.findIndex(item => item.id === r.id) !== tableData.value.length - 1),
          },
        ]
        return btns.filter((btn) => btn.visibleWhen(row));
      }
    }
  ]
})
const handleAdd = () => {
  isShowAddDataSet.value = true
}
const tableConfig = ref<TableConfig>({
  settingTable: false,
  tableId: 'add-dataset-table',
  height: '78vh',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 10
  },
  maxHeight: '78vh',
  rowKey: 'id'
})
/**
 * 关闭新增弹窗
 */
const handleCloseAddDataSet = () => {
  isShowAddDataSet.value = false
}
/**
 * 获取选择的数据
 */
const handleSubmit = (data) => {
  console.log(data, 'data===')
  handleCloseAddDataSet()
  const existingIds = new Set(tableData.value.map(item => item.id))
  const newDataToAdd = data.filter(item => !existingIds.has(item.id))
  tableData.value.push(...newDataToAdd)

}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //编辑
      handleDetail(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
    case 'preview': //预览
      handlePreview(row)
      break
    case 'moveUp': //上移
      handleMoveUp(row)
      break
    case 'moveDown': //下移
      handleMoveDown(row)
      break
  }
}
/**
 * 上移
 * @param row
 */
const handleMoveUp = async (row: TableDataItem) => {
  console.log(row, tableData.value);
  const index = tableData.value.findIndex(item => item.id === row.id)
  // 边界判断：如果是第一个元素，不执行操作
  if (index === 0) return;
  // 解构赋值交换位置（index 与 index-1 互换）
  [tableData.value[index], tableData.value[index - 1]] = [tableData.value[index - 1], tableData.value[index]];

}
/**
 * 下移
 * @param row
 */
const handleMoveDown = async (row: TableDataItem) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  // 边界判断：如果是第一个元素，不执行操作
  if (index === tableData.value.length - 1) return;
  // 解构赋值交换位置（index 与 index+1 互换）
  [tableData.value[index], tableData.value[index + 1]] = [tableData.value[index + 1], tableData.value[index]];

}
/**
 * 删除
 * @param row
 */
const handleDelete = async (row: TableDataItem) => {
  tableData.value = tableData.value.filter(item => item.id !== row.id)

}
watch(() => props.currentType, (val) => {
  if (val && props.isEdit) {
    tableData.value = val
  }
}, { deep: true })

defineExpose({
  tableData
})

</script>
<style scoped>
.add-container {
  margin-bottom: 20px;
}
</style>
