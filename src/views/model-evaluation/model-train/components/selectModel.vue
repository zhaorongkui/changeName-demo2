<template>
  <el-dialog
      v-model="dialogVisible"
      title="选择模型"
      width="70%"
      :show-back-btn="true"
      @close="handleClose"
      :close-on-click-modal="false"
  >
  <div class="base-model detail-config" >
    <div class="content-wrapper">
      <div class="content-main">
        <div class="search-container">
          <div class="table-search">
            <el-form :inline="true" :model="formData" class="demo-form-inline" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="formData.searchWord" style="width: 240px" placeholder="搜索模型名称、模型ID" clearable
                          :prefix-icon="Search" @change="onSearch" />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button  @click="handleReset">重置</el-button>

          </div>
        </div>
        <div class="data-table-container" v-loading="loading">
          <el-table :data="tableData" style="width: 100%" max-height="400px">
            <el-table-column type="index" label="序号"  width="60" />
            <el-table-column label="模型名称" width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <el-radio
                    v-model="selectedRowId"
                    :label="row.modelName"
                    @change="handleRadioChange(row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="modelType" label="模型分类" width="120"/>
            <el-table-column prop="notes" label="模型描述" width="220"/>
            <el-table-column prop="paramInStr" label="输入参数" width="300" />
            <el-table-column prop="paramOutStr" label="输出参数" width="200"/>
            <el-table-column prop="applicableScenario" label="应用场景" width="200" />
            <el-table-column prop="paramEva" label="评估指标" width="200"/>
            <el-table-column prop="createTime" label="创建时间" width="200"/>
            <el-table-column prop="version" label="当前版本" width="120"/>
            <el-table-column prop="updateTime" label="更新时间" />
          </el-table>
        </div>
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

  </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitSelectModel">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed,  onMounted, ref } from 'vue'
import {  type TableDataItem } from './tableData'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import {getModelMachineList, getModelMachineDel, getModelMachineRelease} from "~/api/modelManage";
const { t } = useI18n()
const dialogVisible = ref(true)
const isEditMode = ref<boolean>(false)
const loading = ref(false)
const emits = defineEmits(['close','submitSelectModel'])
const pageKey = 'model-develop-machine-learning'
const selectedRowId = ref(null)
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `${pageKey}Id`
})

// 搜索条件对象
const formData = ref({
  searchWord: ''
})
/**
 * 搜索
 */
const onSearch = () => {
  // 搜索逻辑
  loadTableData()
}
// 表格数据和分页
const tableData = ref<TableDataItem[]>([])

// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getModelMachineList({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
        searchWord: formData.value.searchWord,
        applicableScenario:'',
        modelType:1,
        sort:1,
      }
  ).then((res) => {
    if(res.success){
      tableData.value = res.data?.body || []
      tableConfig.value.paginationConfig.total = res.data.total || 0
    }else{
      ElMessage.error(res.msg)
    }
  })
      .finally(() => {
        loading.value = false
      })
}
const currentModel = ref({})
const handleRadioChange = (row)=> {
  console.log(row,'row=====')
  currentModel.value = row
}
/**
 * 重置
 */
const handleReset = ()=>{
  formData.value.searchWord = ''
  loadTableData()
}
/**
 * 分页
 */
const handlePageChange =  ()=> {
  loadTableData()
}
const handleClose = ()=> {
  emits('close')
}
const submitSelectModel = () =>{
  if(Object.keys(currentModel.value).length ==0){
    ElMessage.error('请选择模型')
  }else{
    handleClose()
    emits('submitSelectModel',currentModel.value)
  }
}
onMounted(() => {
  loadTableData() // 初始加载表格数据
})
</script>
<style scoped lang="scss">
.search-container{
  display: flex;
  justify-content: end;
}
.search-container{
  display: flex;
  justify-content: space-between;
}
.table-search{
  display: flex;
}
:deep(.is-dark){
  max-width: 50%;
}
</style>
<style>
.el-dialog .el-dialog__body .dialog-footer, .el-dialog .el-dialog__footer {
  margin-top: 0 !important;
  padding: 0 ;
  padding-right: 20px;
}
</style>
