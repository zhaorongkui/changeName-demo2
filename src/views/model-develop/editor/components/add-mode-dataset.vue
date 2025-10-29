<template>
  <div class="add-container">
    <el-button type="primary" @click="handleAdd">新增</el-button>
  </div>
  <div class="data-table-container">
  <be-table :is-lock="false" :table-data="tableData" :options="tableConfig" :columns="tableColumns"  @command="onCommand" ></be-table>
  </div>
<!--  新增关联数据集弹窗-->
  <LinkedDataset v-if="isShowAddDataSet" @close="handleCloseAddDataSet"  @submit="handleSubmit" :selectedTableData="tableData"></LinkedDataset>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
import type {FormDataSet,TableConfig,DataTableItem} from '@/types/modelManagement'
import LinkedDataset from './linkedDataset.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
const { t } = useI18n()
import { useDatasetStore } from '@/store/modules/datasetStore'
const datasetStore = useDatasetStore()
const props = defineProps({
  pageType:{
    type: String,
    default: ''
  },
  isEditMode:{
    type: Boolean,
    default: false
  },
  isVersion:{  //是否是版本更新或者另存为新版本
    type: Boolean,
    default: false
  },
  currentModeldetail:{
    type:Object,
    default: () => {}
  }
})
let isShowAddDataSet =ref(false)
const tableData = ref<DataTableItem[]>([])
const tableColumns = computed(() => {
  return [

    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },
    {
      prop: 'datasetsId',
      label: '数据集ID',
      align: 'center'
    },
    {
      prop: 'name',
      label: '数据集名称',
      align: 'center'
    },
    {
      prop: 'dataVolume',
      label: '数据规模',
      align: 'center'
    },
    {
      prop: 'ldmName',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'orgDimension',
      label: '组织维度',
      align: 'center'
    },
    {
      prop: 'timeRange',
      label: '时间范围',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      fixed:'right',
      buttons:(row)=>{
        const btns = [
          {
            name: '删除',
            command: 'del',
            type: 'primary',
            visibleWhen: (r) => true,
          },
        ]
        return btns.filter((btn) => btn.visibleWhen(row));
      }
    }
  ]
})
const handleAdd = ()=> {
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
const handleCloseAddDataSet = ()=> {
  isShowAddDataSet.value = false
}
/**
 * 获取选择的数据
 */
const handleSubmit = (data)=>{
  handleCloseAddDataSet()
  tableData.value = data
  // const existingIds = new Set(tableData.value.map(item => item.id))
  // const newDataToAdd = data.filter(item => !existingIds.has(item.id))
  // tableData.value.push(...newDataToAdd)
  datasetStore.getDatasetList([...tableData.value])

}
const onCommand = (command, row) => {
  switch (command) {
    case 'del': //删除
      handleDelete(row)
      break
  }
}
const handleDelete = (row)=> {
  tableData.value = tableData.value.filter(item => item.id != row.id)
  datasetStore.getDatasetList([...tableData.value])
}
watch(()=>props.currentModeldetail,(val)=>{
  if(val){
    tableData.value = val.dataSetList
    datasetStore.getDatasetList(tableData.value)
  }
},{deep:true})
onMounted(()=>{
})
defineExpose({
  tableData
})

</script>
<style scoped>
.add-container{
  margin-bottom: 20px;
}
</style>
