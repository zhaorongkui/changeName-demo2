
<template>
  <div class="detail-config">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>模型试用列表</h3>
      </div>
      <div class="content-main">
        <div class="table-operate">

          <div class="table-search">
            <div class="table-search-item">
            <el-form :inline="true" :model="formData" class="demo-form-inline" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model="formData.searchWord"
                  style="width: 240px"
                  placeholder="搜索模型名称、模型ID"
                  clearable
                  :prefix-icon="Search"
                  @change="onSearch"
                />
              </el-form-item>
            </el-form>
              <el-button type="primary"  @click="handleSearch">查询</el-button>
              <el-button  @click="handleReset">重置</el-button>
            </div>
          </div>
        </div>
        <div class="data-table-container" v-loading="isLoading">
          <be-table
              :is-lock="false"
              :table-data="tableData"
              :columns="tableColumns"
              :options="tableConfig"
              @command="onCommand"
          />
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

  <!-- 模型详情抽屉 -->
  <el-drawer v-model="drawerVisible" title="模型查看" direction="rtl" size="50%" :modal="false">
    <div class="drawer-content">
      <div class="detail-section" v-if="currentModel">
        <h4>基本信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="模型ID">{{ currentModel.modelId }}</el-descriptions-item>
          <el-descriptions-item label="模型名称">{{ currentModel.modelName }}</el-descriptions-item>
          <el-descriptions-item label="运行时间">{{ currentModel.runTime }}</el-descriptions-item>
          <el-descriptions-item label="运行次数">{{ currentModel.runCount }}</el-descriptions-item>
          <el-descriptions-item label="推理延迟(ms)">{{ currentModel.inferenceLatency }}</el-descriptions-item>
          <el-descriptions-item label="内存使用(MB)">{{ currentModel.memoryUsage ? currentModel.memoryUsage :'' }}</el-descriptions-item>
          <el-descriptions-item label="准确率（最好）">{{ currentModel.bestAccuracy ? currentModel.bestAccuracy.toFixed(3) : '' }}</el-descriptions-item>
          <el-descriptions-item label="准确率（平均）">{{ currentModel.avgAccuracy ? currentModel.avgAccuracy.toFixed(3) :'' }}</el-descriptions-item>
          <el-descriptions-item label="均方误差（MSE/RMSE）" :span="2">{{
            currentModel.squaredError
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模型试用记录表格 -->
      <div class="detail-section" v-if="currentModel">
        <h4>试用记录</h4>
        <trialRecord :currentModelId="currentModelId"></trialRecord>
      </div>
    </div>
  </el-drawer>
<!--  选择模型-->
  <selectModel v-if="isShowSelectModel" @close="handleCloseSelectModel" ></selectModel>
<!--  机器学习试用弹窗-->
  <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail" :currentModelId="currentModelId" pageType="ontrial"></viewModelDetail>
  <!-- 数据规则模型 试用跳数据规则编辑器-->
  <RuleModelEditor
      v-if="showAddModal"
      :isEdit="true"
      :isTry="true"
      :editing-row="currentModel"
      @close="handleCloseModal"
  />
</template>

<script lang="ts" setup>
import {computed, defineComponent, onMounted, ref} from 'vue'
import { mockTableData, type TableDataItem } from './tableData'
import { Search } from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import tableMockData from './mode-trial-reuslt.json'
import selectModel from './components/selectModel.vue'

import {useRouter} from "vue-router";
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
const { t } = useI18n()
import trialRecord from './components/trialRecord.vue'
import { getModelOntrialList,getModelTrialDetail } from '@/api/modelManage'
import RuleModelEditor from "~/views/model-management/data-rule-models/components/RuleModelEditor.vue";
// 试用记录接口
interface TrialRecordItem {
  index: number
  time: string
  user: string
  inferenceLatency: number
  memoryUsage: number
  squaredError: string
  dataset: string
  result: string
}
const showAddModal = ref(false)
const isLoading = ref(false)
const pageKey = 'model-ontrial'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: `${pageKey}Id`
})
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
      prop: 'modelId',
      label: '模型ID',
      align: 'center'
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'runTime',
      label: '运行时间',
      align: 'center'
    },
    {
      prop: 'runCount',
      label: '运行次数',
      align: 'center'
    },

    {
      prop: 'notes',
      label: '模型描述',
      align: 'center'
    },
    {
      prop: 'modelCreator',
      label: '创建人',
      align: 'center'
    },
    {
      prop: 'modelVersion',
      label: '版本',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: [
        {
          name: '查看',
          command: 'detail',
          type: 'primary'
        },
        {
          name: '试用',
          command: 'ontrial',
          type: 'primary'
        },
      ]
    }
  ]
})

let isShowViewModelDetail = ref(false)
const isShowSelectModel = ref(false)
const formData = ref({
      searchWord: ''
    })
const drawerVisible = ref(false)
const currentModel = ref<TableDataItem | null>(null)
const currentModelId = ref(null)
// 试用记录表格数据和分页
const trialRecords = ref([])
const trialCurrentPage = ref(1)
const trialPageSize = ref(10)
const trialTotal = ref(0)
// 获取列表数据
const getOntrialList = ()=> {
  isLoading.value =true
  getModelOntrialList({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    sort:1,
    searchWord: formData.value.searchWord,
  }).then((res) => {
    if(res.success){
      tableData.value = res.data.body
      tableConfig.value.paginationConfig.total = res.data.total
    }
  }).finally(() => {
    isLoading.value = false
  })
}
const onSearch = () => {
  // 处理搜索逻辑
  console.log('搜索内容:', formData.value.name)
  getOntrialList() // 重新加载表格数据
}
// 表格数据和分页
const tableData = ref<TableDataItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

/**
 * 初始化加载表格数据
 */
const loadTableData = () => {
  // 根据当前选中的节点和搜索条件过滤数据
  const filteredData = mockTableData.filter((item) => {
    return true
  })

  total.value = filteredData.length

  // 计算分页数据
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  // tableData.value = filteredData.slice(startIndex, endIndex)
  tableData.value = mockData
}
/**
 * 分页
 *
 */
const handlePageChange = () => {
  getOntrialList()
}
const router = useRouter()
  // 查看按钮点击处理
const handleView = (row: TableDataItem) => {
  console.log('查看模型:', row)
  currentModelId.value = row.id
  getModelTrialDetail(row.id).then(res => {
    if(res.success){
      currentModel.value = res.data
      drawerVisible.value = true
    }else{
      ElMessage.error(res.message)
    }
  })
  // 延迟加载试用记录，确保抽屉已经打开
  setTimeout(() => {
    loadTrialRecords()
  }, 100)
}

/**
 * 试用按钮点击处理
 * @param row
 */
const handleTrial = (row: TableDataItem) => {
  console.log(row,'row===')
    if(row.modelType == '机器学习'){
      isShowViewModelDetail.value = true
    }else if(row.modelType == '智能体'){
      // let url = 'http://10.195.6.251/app/41420996-db98-4bd3-9858-6c1df75d223c/workflow'
      let url =  'http://10.198.0.137/apps'
      window.open(url)
    }else if(row.modelType == '数据规则模型'){
      showAddModal.value = true
    }
  currentModelId.value = row.id
  currentModel.value = row
}
// 关闭机器学习模型试用
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
  currentModel.value = {}
}
// 关闭数据规则模型试用
const handleCloseModal = ()=>{
  showAddModal.value = false
  currentModel.value = {}
}
// 加载试用记录数据
const loadTrialRecords = () => {
  console.log('加载试用记录数据', tableMockData)
  // 导入JSON文件数据
  const trialResultData = tableMockData

  // 从JSON数据中提取试用记录
  const jsonTrialRecords: TrialRecordItem[] = trialResultData['test_records'] || []

  // 更新总记录数
  trialTotal.value = jsonTrialRecords.length

  // 计算分页数据
  const startIndex = (trialCurrentPage.value - 1) * trialPageSize.value
  const endIndex = startIndex + trialPageSize.value
  trialRecords.value = jsonTrialRecords.slice(startIndex, endIndex)
  console.log(trialRecords.value,'value')
}

// 试用记录分页事件处理
const handleTrialSizeChange = (val: number) => {
  trialPageSize.value = val
  loadTrialRecords()
}

const handleTrialCurrentChange = (val: number) => {
  trialCurrentPage.value = val
  loadTrialRecords()
}
// 打开选择模型弹窗
const handleSelectModel = ()=> {
  isShowSelectModel.value = true
}
// 关闭选择模型弹窗
const handleCloseSelectModel = ()=> {
  isShowSelectModel.value = false
}
// 查询
const handleSearch = () => {
  getOntrialList()
}
// 重置
const handleReset = ()=> {
  formData.value.searchWord = ''
  tableConfig.value.paginationConfig.currentPage = 1
  getOntrialList()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //查看
      handleView(row)
      break
    case 'ontrial': //试用
      handleTrial(row)
      break
  }
}
onMounted(() => {
  getOntrialList()
})

</script>

<style scoped>
.drawer-content {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin-bottom: 15px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}
.table-search{
  width: 100%;
  display: flex;
  justify-content: end;
}
.table-search-item{
  display: flex;
}
</style>
