<template>
  <div class="model-training detail-config">
    <div class="content-title">
      <h3>模型训练列表</h3>
    </div>
    <div class="search-criteria">
    <el-alert
        class="warning-banner"
        title="模型训练功能将基于在线开发环境运行，一旦运行将开始计费，如不再使用请及时停止。"
        type="warning"
        show-icon
        :closable="false"
    >
      <template #default>
        <el-button type="primary" text size="small" class="pay-button">开通付费</el-button>
      </template>
    </el-alert>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleCreateTask">创建模型在线训练</el-button>

      <div class="search-area">
        <el-input
            v-model="searchQuery"
            placeholder="搜索任务名称、模型名称"
            clearable
            @clear="handleSearchClear"
            @keyup.enter="handleSearch"
            class="search-input"
        >
          <template #suffix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary"  @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    </div>
    <div class="content-main">
    <div class="data-table-container" v-loading="loading">
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
        @callback="handleSizeChange"
    />
    </div>
  </div>
<!--  任务配置-->
  <taskConfiguration v-if="isShowTaskConfiguration" @close="handleCloseTaskConfiguration"></taskConfiguration>
<!--  创建训练任务-->
  <addTask v-if="isShowAddTask" @close="handleCloseAddTask"></addTask>
<!--  用量统计-->
  <usageStatistics v-if="isShowUsageStatistics" @close="handleCloseUsageStatistics"></usageStatistics>
<!--  训练结果-->
  <trainingResults v-if="isShowResults" @close="handleCloseResults" :currentModelId="currentModel.id"></trainingResults>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import taskConfiguration from './components/taskConfiguration.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import addTask from './components/addTask.vue'
import usageStatistics from './components/usageStatistics.vue'
import trainingResults from '@/views/model-develop/machine-learning/components/trainResults.vue'
import {getTrainPage} from "~/api/modelManage.js";
import {ElMessage} from "element-plus";
const isShowResults = ref(false)
const isShowTaskConfiguration = ref(false)
const isShowUsageStatistics = ref(false)
const isShowAddTask = ref(false)
const total = ref(0)
const currentModel =ref({})
// 表格数据
const tasks = ref([])

const { t } = useI18n()
const pageKey = 'model-train'
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
      prop: 'taskName',
      label: '任务名称',
      align: 'center'
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center'
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center'
    },
    {
      prop: '分类',
      label: '类型',
      align: 'center'
    },
    {
      prop: 'developLanguage',
      label: '编程语言',
      align: 'center'
    },

    {
      prop: 'statusName',
      label: '状态',
      align: 'center'
    },
    {
      prop: 'trainTime',
      label: '运行时长',
      align: 'center'
    },
    {
      prop: 'inputJson',
      label: '评估指标',
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 120,
      buttons: [
        // {
        //   name: '任务配置',
        //   command: 'taskConfig',
        //   type: 'primary'
        // },
        {
          name: '训练结果',
          command: 'result',
          type: 'primary'
        },
        {
          name: '用量统计',
          command: 'usage',
          type: 'primary'
        },
        // {
        //   name: '监控',
        //   command: 'monitor',
        //   type: 'primary'
        // },
        // {
        //   name: '删除',
        //   command: 'del',
        //   type: 'primary'
        // },
      ]
    }
  ]
})
// 筛选相关
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalTasks = ref(tasks.value.length)

// 计算属性 - 筛选后的任务
const tableData = ref([])
// 创建训练任务
const handleCreateTask = () => {
  isShowAddTask.value = true
}
/**
 * 关闭创建训练任务
 */
const handleCloseAddTask = ()=> {
  isShowAddTask.value = false
  loadTableData()
}
const handleSearch = () => {
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}

const handleSearchClear = () => {
  searchQuery.value = ''
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}

// 重置
const handleReset = () => {
  searchQuery.value = ''
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}
const loading = ref(false)
// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getTrainPage({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
    searchWord: searchQuery.value,
    name: searchQuery.value,
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

// 分页事件处理
const handleSizeChange = () => {
  loadTableData()
}


// 操作处理
const handleTaskConfig = (row) => {
  console.log('任务配置', row)
  isShowTaskConfiguration.value = true
}
const handleCloseTaskConfiguration = ()=>{
  isShowTaskConfiguration.value = false
}

// 分页
const onCommand = (command, row) => {
  switch (command) {
    case 'taskConfig': //任务配置
      // handleTaskConfig(row)
      break
    case 'result': //训练结果
      handleResults(row)
      break
    case 'usage': //用量统计
      handleUsage(row)
      break
    case 'monitor': //监控
      break
    case 'del': //删除
      // handleDelete(row)
      break
  }
}

/**
 * 查看训练结果
 */
const handleResults = (row) => {
  isShowResults.value = row
  currentModel.value = row
}
/**
 * 关闭训练结果弹窗
 */
const handleCloseResults = () => {
  isShowResults.value = false
  currentModel.value = {}
}
/**
 * 用量统计
 */
const handleUsage = (row)=>{
 isShowUsageStatistics.value = true
  currentModel.value = row
}
/**
 * 关闭用量统计
 */
const handleCloseUsageStatistics = ()=> {
  isShowUsageStatistics.value = false
  currentModel.value = {}
}
onMounted(()=>{
  loadTableData()
})
</script>

<style scoped lang="postcss">
.model-training {
  @apply flex flex-col h-full;
}
:deep(.el-alert__content ){
  flex-direction: row;

}
:deep(.el-alert .el-alert__icon.is-big){
  width: 14px;
}
:deep(.el-alert__title.with-description){
  font-size: 12px;
}
.warning-banner {
  margin-bottom: 20px;
}
.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-area {
  display: flex;
  align-items: center;
}
.search-input {
  width: 300px;
  margin-right: 10px;
}
.pay-button {
  margin-left: 10px;
}
</style>