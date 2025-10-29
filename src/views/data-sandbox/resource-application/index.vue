<template>
  <div style="height: 100vh;" v-if="$route.name === 'resource-application-detail'">
    <router-view></router-view>
  </div>
  <div class="my-application detail-config"  v-if="$route.name === 'resource-application'">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>我的申请</h3>
      </div>
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList"  @on-search="handleFilterSearch"
          @on-reset="handleFilterReset" @onClear="handleFilterClear">
          <template #timeRange>
            <el-date-picker v-model="queryData.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
          </template>
          <template #orgId>

            <el-tree-select class="org-tree-select" node-key="orgId" v-model="queryData.orgId" :data="treeData" multiple
                            collapse-tags collapse-tags-tooltip :props="propsTree" show-checkbox placeholder="请选择"
                            ref="OrgSelectRef" style="width: 100%" />
            <!--            <OrgSelect v-model="queryData.orgId" :show-checkbox="true" :multiple="true" :cascader="true"-->
            <!--              @update:modelValue="handleCheckedNodes" ref="OrgSelectRef" />-->
          </template>
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <div class="table-operate">
          <el-button type="primary" class="ml-2" @click="handleAdd">申请数据集</el-button>
          <el-button type="primary" @click="handleUpload">上传数据集</el-button>
          <el-button type="primary" @click="handleDataExploration">数据探查</el-button>
        </div>
        <div class="data-table-container">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
            @cell-click="onCellClick" @command="onCommand">
          </be-table>
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="[10, 20, 30, 50]" @callback="handlePageChange" />
      </div>
    </div>


    <ReviewRecordModal v-if="showReviewRecordModal" :dataset-id="currentModel?.datasetId"
      @close="showReviewRecordModal = false" @success="loadTableData" />

    <OpenModal v-if="openShowModal" @close="openShowModal = false" @success="loadTableData" />
    <!--数据探查-->
    <dataExploration v-if="isShowDataExploration" @close="handleCloseDataExploration"></dataExploration>
    <!-- 上传数据集抽屉 -->
    <uploadDataset @close="handleCloseUploadDataset" ref="uploadDrawer" v-if="isShowUploadDataset"></uploadDataset>
    <!-- 申请数据集抽屉 -->
    <applayModel ref="applayModelDrawer" @drawerClose="handleDrawerClose" v-if="applayDrawerVisible"></applayModel>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { DatasetType } from '@/types/dataSandbox'
import { ElMessage, ElMessageBox } from 'element-plus'
import OpenModal from './components/OpenModal.vue'
import ReviewRecordModal from './components/ReviewRecordModal.vue'
import { useRouter } from 'vue-router'
import { statusOptions as mockStatusOptions } from '../mockData'
import { useI18n } from 'vue-i18n'
import uploadDataset from './components/uploadDataset.vue'
import applayModel from './applay-model.vue'
import dataExploration from './components/dataExploration.vue'
import { getDatasetList } from '@/api/dataSet.ts'
import { arrayToMap, getInitialValue } from "@/utils/index.ts";
import { getNamesStringByOrgIdsOptimized,initTreeData } from '@/utils/dataSandbox'
const router = useRouter()
const { t } = useI18n()
const isShowUploadDataset = ref(false)
const isShowDataExploration = ref(false)
const applayDrawerVisible = ref(false)
const uploadDrawer = ref(null)
const applayModelDrawer = ref(null)
const treeData = ref([])
const propsTree = ref({
  label: 'name',
  children: 'children',
  value: 'orgId',
})
// be-table columns 配置
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: t('INDEX'),
    align: 'center',
    width: 60
  },
  { prop: 'name', label: '数据集名称', minWidth: 120 },
  { prop: 'documentType', label: '单据类型', minWidth: 100 },
  {
    prop: 'applicationStatus',
    label: '申请状态',
    minWidth: 100,
    // 自定义渲染单元格内容
    format: (row) => {
      const isOpen = row.applicationStatus === '审核中'
      const statusClass = {
        1: '#1775ff',
        2: '#19be6b',
        3: '#ff9900',
        null: 'inherit'
      }
      // statusOptions.value
      // return `<span style="color:${statusClass[row.applicationStatus]}">${statusOptions.value[row.applicationStatus]}</span>`
      return `<span style="color:${statusClass[row.applicationStatus]}">${arrayToMap(statusOptions.value)[row.applicationStatus]}</span>`
    }
  },
  { prop: 'datasetsId', label: '数据集ID', minWidth: 100 },
  // { prop: 'beginTime', label: '发布时间', minWidth: 140 },
  { prop: 'deadline', label: '到期时间', minWidth: 140 },
  { prop: 'dataVolume', label: '数据规模', minWidth: 100 },
  { prop: 'ldmName', label: '业务实体', minWidth: 120 },
  { prop: 'orgId', label: '组织维度', minWidth: 120 },
  { prop: 'timeRange', label: '时间范围', minWidth: 140 },
  { prop: 'creator', label: '申请人', minWidth: 100 },
  { prop: 'createTime', label: '申请时间', minWidth: 140 },
  {
    type: 'actions',
    label: t('OPERATION'),
    minWidth: 80,
    buttons: [
      {
        name: '详情',
        command: 'detail',
        type: 'primary'
      },
    ]
  }
]

// be-table 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'resource-application-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})

/**
 * 点击单元格操作
 * 切换用户状态的swich操作
 */
const onCellClick = (row, column, _cell, event) => {
  // 切换用户状态的swich操作
  if (column.property === 'approvalStatus' && row.approvalStatus === '审核中') {
    handleReviewRecord(row)
  }
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //版本管理
      handleDetail(row)
      break
    case 'review': //审核
      break
  }
}
/**
 * 审批记录
 */
const showReviewRecordModal = ref(false)
const handleReviewRecord = (row: DatasetType) => {
  showReviewRecordModal.value = true
  currentModel.value = row
}

/**
 *
 */
const queryData = ref({
  ldmName: '', //业务实体
  name: '', //数据集名称
  orgId: [], // 组织ID
  timeRange: [], //时间范围
  approvalStatus: null // 申请状态
})

const statusOptions = ref(mockStatusOptions)
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'name',
    placeholder: '请输入数据集名称',
    modelValue: queryData.value.name
  },
  {
    type: 'input',
    label: '业务实体',
    paramKey: 'ldmName',
    placeholder: '请输入业务实体',
    modelValue: queryData.value.ldmName,
  },
  {
    type: 'custom',
    label: '组织维度',
    paramKey: 'orgId',
    placeholder: '请选择组织维度',
    modelValue: queryData.value.orgId,
    isSlot: true
  },
  {
    type: 'select',
    label: '申请状态',
    paramKey: 'approvalStatus',
    placeholder: '请选择申请状态',
    modelValue: queryData.value.approvalStatus,
    selectOptions: statusOptions.value
  },
  // {
  //   type: 'dateRange',
  //   multiple: 1.2,
  //   label: '时间范围',
  //   paramKey: 'timeRange',
  //   modelValue: queryData.value.timeRange,
  //   isSlot: true
  // }
])

const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    if (key !== 'orgId') {
      queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    }
  })
  loadTableData()
}
const handleFilterReset = () => {
  queryData.value = {
    name: '',
    orgId: [],
    timeRange: [],
    approvalStatus: '',
    // dataType: ''
  }
  // OrgSelectRef.value.clearselectedData();
  loadTableData()
}

// 表格数据和分页
const tableData = ref<DatasetType[]>([])

const currentModel = ref<DatasetType>()

const handlePageChange = () => {
  loadTableData()
}
const OrgSelectRef = ref(null)

const isLoading = ref(false)
// 获取数据集的列表
const loadTableData = (id?: string | number) => {
  isLoading.value = true
  getDatasetList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    directory: 1,
    datasetName: queryData.value.name,
    ldmName: queryData.value.ldmName,
    applicationStatus: queryData.value.approvalStatus,
    dataType: '', // 数据分类
    orgId: queryData.value.orgId,
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.records
        if (tableData.value.length > 0) {
          tableData.value.forEach(item => {
            item.orgId = getNamesStringByOrgIdsOptimized(item.orgId)
          })
        }
        tableConfig.value.paginationConfig.total = res.data.total
      }

    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}

// 申请数据集
const handleAdd = () => {
  applayDrawerVisible.value = true;
  setTimeout(() => {
    applayModelDrawer.value.openDrawer()
  }, 0);
}
const handleDrawerClose = (data) => {
  applayDrawerVisible.value = false;
  if (data) {
    loadTableData() // 如果创建成功了，关闭创建抽屉，并且刷新列表
  }
}

// 上传数据集
const handleUpload = () => {
  isShowUploadDataset.value = true
  setTimeout(() => {
    if (uploadDrawer.value) {
      uploadDrawer.value.openDialog()
    }
  }, 0);
}
// 关闭上传数据集弹窗
const handleCloseUploadDataset = (item) => {
  console.log('关闭上传数据集弹窗, 接收到了', item);
  isShowUploadDataset.value = false
  if (item) {
    loadTableData() // 如果是提交成功后，自动关闭抽屉，就重新加载表格数据
  }
}
// 数据探查
const handleDataExploration = () => {
  isShowDataExploration.value = true
}
const handleCloseDataExploration = () => {
  isShowDataExploration.value = false
}


// 处理成功提交
const handleSuccessModel = () => {
  loadTableData() // 重新加载表格数据
}

const handleDetail = (row: DatasetType) => {
  // 这里可以添加查看详情的逻辑
  // 路由跳转
  // console.log('跳转事件触发了！',row, router)
  router.push({
    path: '/data-sandbox/resource-application/detail',
    query: { datasetId: row.id, pageType: 'application', workflowId: row.workflowId }
    // query: { datasetId: '34' }
  }).catch(err => {
    // 捕获可能的路由错误
    console.error('路由跳转失败:', err)
  })
}
const openShowModal = ref(false)
const handleOpen = (row: DatasetType) => {
  openShowModal.value = true
}

// 数据集合下架
const handleClose = async (row: DatasetType) => {
  try {
    // 这里加个 确认框
    await ElMessageBox.confirm(`确定要下架数据集 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 模拟下架操作
    row.openStatus = '未公开'
    ElMessage.success('数据集已下架')
    loadTableData() // 重新加载表格数据
  } catch (error) {
    ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  }
}

onMounted(() => {
  treeData.value = initTreeData()
  loadTableData() // 初始加载表格数据
  

})
</script>

<style lang="postcss">
.my-application {
  @apply flex flex-col h-full;
}

.table-operate {
  display: flex;
  justify-content: start;

}
</style>
<style lang="scss" scoped>
.org-tree-select {

  // width: 100%;
  :deep(.el-select__tags-text) {
    display: inline-block;

    /* 固定宽度 */
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
  }
}
:deep(.is-dark){
  max-width: 50%;
}
</style>
