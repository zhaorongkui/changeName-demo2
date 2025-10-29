<template>

  <el-dialog title="选择数据集" v-model="dialogVisible" width="80%" custom-class="limited-dialog" @close="handleClose" :close-on-click-modal="false">
    <div class=" detail-config " style="width: 100%; display: flex; flex-direction: column;">
      <div class="content-main">
        <!-- 查询条件区域 -->
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset" @on-clear="handleClear" />
        </div>

        <div class="data-table-container" v-loading="isLoading">
          <be-table
              :is-lock="false"
              :table-data="tableData"
              :columns="tableColumns"
              :options="tableConfig"
              @selection-change="selectionChange"
              @select-all="selectAll"
          />
        </div>

        <!-- 分页组件 -->
        <be-pager
            v-model:current-page="tableConfig.paginationConfig.currentPage"
            v-model:page-size="tableConfig.paginationConfig.pageSize"
            :total="tableConfig.paginationConfig.total"
            :list="tableData"
            :page-sizes="TABLE_LIST_PAGE_RANGE"
            @callback="handlePageChange"
        />
      </div>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import AdvancedSearch from "@/components/AdvancedSearch/index.vue";
import type {FormDataSet,TableConfig,DataTableItem} from '@/types/modelManagement'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import { getDatasetList,getSelector } from '@/api/dataSet.ts'
const { t } = useI18n()
const emits = defineEmits(['close','submit'])
const isLoading = ref(false)
const dialogVisible = ref(true);
const formData = ref<FormDataSet>({
  name: '',
  dataType: '',
  ldmName: ''
});
const pageKey = 'link-dataset'
/**
 * 分页参数
 */
const tableConfig = ref<TableConfig>({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height:'350px',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  maxHeight:'350px',
  rowKey: `${pageKey}Id`
})
const tableColumns = computed(() => {
  return [
    {
      type: 'selection',
      prop: 'selection',
      label: t('INDEX'),
      align: 'center',
      width: 40
    },
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
  ]
})
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'name',
    placeholder:'请输入',
    modelValue: formData.value.name,
  },

  {
    type: 'input',
    label: '业务实体',
    paramKey: 'ldmName',
    placeholder: '请输入',
    modelValue: formData.value.ldmName,
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataType',
    placeholder: '请选择',
    modelValue: formData.value.dataType,
    selectOptions:[]
  },
])
const tableData = ref([]);
const selectData = ref([])
/**
 * 关闭弹窗
 */
const handleClose = ()=> {
  emits('close')
}
/**
 * 确定
 */
const handleSubmit = ()=>{
  emits('submit',selectData.value)
  handleClose()
}

/**
 * 搜索
 * @param data
 */
const handleFilterSearch = (data: any) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })

  console.log(formData.value,'value')
  getDataPageList()
}
// 重置
const handleFilterReset = () => {
  formData.value = {
    name: '',
    dataType: '',
    ldmName: ''
  };
  getDataPageList()
}
// 清空某个搜索项
const handleClear = (parimaryKey: string)=> {
  formData.value[parimaryKey] = ''
}
/**
 * 全选
 * @param data
 */
const selectAll = (data)=> {
  console.log(data,'data===')
  selectData.value = data
}
/**
 * 单挑选择
 * @param data
 */
const selectionChange = (data)=>{
  selectData.value = data
}
// 获取数据集的列表
const getDataPageList = () => {
  isLoading.value = true
  getDatasetList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize:tableConfig.value.paginationConfig.pageSize,
    ldmName: formData.value.ldmName,
    dataType: formData.value.dataType,
    datasetName: formData.value.name,
    directory:1,
    applicationStatus:2
  })
      .then((res) => {
        if(res.success){
          tableData.value = res.data.records
          tableConfig.value.paginationConfig.total= res.data.total
        }

      })
      .finally(() => {
        isLoading.value = false
      })
}
getDataPageList()
// 获取数据分类下拉框的枚举值
const getSelectorData = () => {
  getSelector({field:["object_hierarchy",
      "data_type",
      "date_dim"]}).then(res=>{
    if(res.success){
      formItemList.value[2].selectOptions = res.data.data_type.map((item,index)=>{
        return {
          name: item,
          id: item,
        }
      })
    }
  })
}
getSelectorData()
/**
 * 分页
 */
const handlePageChange = ()=> {
  getDataPageList()
}
</script>
<style scoped lang="scss">
:deep(.searchView-content .el-form .el-form-item){
  flex-direction: row !important;
}
.form-item{
  flex-direction: row !important;
}
</style>





