<template>
  <div style="height: 100vh;" v-if="['data-open-detail'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="detail-config" v-else>
    <div class="content-wrapper">
      <div class="content-title">
        <h3>数据公开记录</h3>
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <div class="search-criteria">
          <AdvancedSearch :formItemList="formItemList" :rowItemMaxNumber="5" @on-search="handleFilterSearch"
            @on-reset="handleFilterReset" @onClear="handleFilterClear">
            <template #orgId>
              <OrgSelect v-model="queryData.orgId" :show-checkbox="true" :multiple="true" :cascader="true"
                @update:modelValue="handleCheckedNodes" ref="OrgSelectRef" />
            </template>
            <template #timeRange>
              <el-date-picker v-model="queryData.timeRange" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
            </template>
          </AdvancedSearch>
        </div>
      </div>

      <div class="catalog-content content-main">
        <div class="table-operate">
          <el-button type="primary" class="ml-2" @click="handleAdd">新建公开申请</el-button>
        </div>

        <!-- 表格数据展示 -->
        <div class="data-table-container">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
            @cell-click="onCellClick" @command="onCommand">
          </be-table>
        </div>
      </div>
      <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
        :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
    </div>
  </div>
  <!--  新建-->
  <OpenModal v-if="openShowModal" @close="openShowModal = false" :dataSetList="dataSetList" @success="loadTableData"
    @submit="addOpenData" />
  <ReviewRecordModal v-if="showReviewRecordModal" :dataset-id="currentModel?.datasetId"
    @close="showReviewRecordModal = false" @success="loadTableData" />
</template>
<script lang="ts" setup>
import OrgSelect from '@/components/OrgSelect/index.vue'
import { defineComponent, ref, reactive, onMounted, watch, computed } from 'vue'
import { Search, Folder, FolderOpened, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type ElTree, type FormInstance } from 'element-plus'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import ReviewRecordModal from '../resource-application/components/ReviewRecordModal.vue'
import OpenModal from '../resource-application/components/OpenModal.vue'
import { DatasetType } from '@/types/dataSandbox'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import { useRouter } from "vue-router";
import { getopenDataList, addopenDataSave, getDataSetList, dataSetDown } from '@/api/backStageManage'
import { reviewStatus } from '@/utils/constant'
import { arrayToMap, getInitialValue } from '@/utils/index'
const statusOptions = ref([
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '审核中',
    value: 1,
  },
  {
    label: '审核通过',
    value: 2,
  },
  {
    label: '审核未通过',
    value: 3,
  },
  {
    label: '已下架',
    value: 4,
  },
])
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// AdvancedSearch 搜索表单数据
const queryData = ref({
  name: '', // 数据集名称
  orgId: [], // 组织ID
  timeRange: [], // 时间范围
  approvalStatus: '' // 申请状态
})
const currentModel = ref({
  id: '',
  ruleName: '',
  description: '',
  metrics: [],
  businessObject: '',
  dataset: '',
  formula: ''
})
const formItemList = ref([
  {
    type: 'input',
    label: '数据集名称',
    paramKey: 'name',
    placeholder: '请输入数据集名称',
    modelValue: queryData.value.name
  },
  {
    type: 'custom',
    label: '组织维度',
    paramKey: 'orgId',
    placeholder: '请选择组织',
    modelValue: queryData.value.orgId,
    isSlot: true
  },
  {
    type: 'dateRange',
    multiple: 1.2,
    label: '时间范围',
    paramKey: 'timeRange',
    modelValue: queryData.value.timeRange,
    isSlot: true
  },
  {
    type: 'select',
    label: '申请状态',
    paramKey: 'approvalStatus',
    placeholder: '请选择申请状态',
    modelValue: queryData.value.approvalStatus,
    selectOptions: statusOptions.value
  }
])
const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}
const router = useRouter()
const handleCheckedNodes = (nodes) => {
  queryData.value.orgId = nodes; // 同步到queryData,临时处理
};
// 表格和分页相关
const tableData = ref<any[]>([])
const tableConfig = ref({
  settingTable: false,
  tableId: 'data-open-table',
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})

const handlePageChange = () => {
  loadTableData()
}
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: t('INDEX'),
    align: 'center',
    width: 60
  },
  { prop: 'datasetsId', label: '数据集ID', minWidth: 120 },
  { prop: 'datasetName', label: '数据集名称', minWidth: 100 },
  {
    prop: 'busType',
    label: '单据类型',
    align: 'center',
    width: 220,
    format: (row) => {
      return row.busType?.toString() === '1' ? '数据集公开申请' : '数据集公开下架'
    }
  },
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
        4: '',
        null: 'inherit'
      }
      return `<span style="color:${statusClass[row.reviewStatus]}">${arrayToMap(reviewStatus)[row.reviewStatus]}</span>`
    }
  },
  // { prop: 'beginTime', label: '发布时间', minWidth: 140 },
  { prop: 'dataVolume', label: '数据规模', minWidth: 100 },
  { prop: 'ldmName', label: '业务实体', minWidth: 120 },
  { prop: 'orgName', label: '组织维度', minWidth: 120 },
  {
    prop: 'timeRange', label: '时间范围', minWidth: 200,
    format: (row) => {
      return `${row.beginTime}-${row.endTime} `
    }
  },
  {
    prop: 'openScope', label: '公开范围', minWidth: 100,
    // 自定义渲染单元格内容
    format: (row) => {
      return openScopeMap[row.openScope]
    }
  },
  { prop: 'datasetUse', label: '公开用途', minWidth: 140 },
  {
    type: 'actions',
    label: t('OPERATION'),
    minWidth: 100,
    buttons: (row) => {
      // 基础按钮数组（始终显示"详情"）
      const baseButtons = [
        {
          name: '详情',
          command: 'detail',
          type: 'primary'
        }
      ];
      // 当row.check为true时，添加"申请下架"按钮,applyDown = 2 代表已点过下架了，不再让点击了
      // if (row.reviewStatus === '2') {
      if (row.reviewStatus.toString() === '2' && row.applyDown?.toString() !== '2' && row.busType.toString() !== '2') {
        baseButtons.push({
          name: '申请下架',
          command: 'close',
          type: 'primary'
        });
      }
      if (row.reviewStatus.toString() === '4') {
        baseButtons.push({
          name: '申请下架',
          command: 'close',
          type: 'primary',
          disabled: true
        });
      }

      return baseButtons;
    }
  }
]

const addOpenData = (data) => {
  console.log(data);
  const {
    dataId,
    openPurpose,
    openScope,
    orgNameId
  } = data;
  // 新建公开数据
  const params = {
    dataId,
    datasetUse: openPurpose,
    openScope,
    orgNameId
  }
  addopenDataSave(params).then((res) => {
    const {
      code
    } = res
    if (code === 0) {
      ElMessage.success(res.message || `保存成功`)
      loadTableData()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  })

}
// 定义枚举映射关系
const openScopeMap = {
  '1': '全行业',
  '2': '特定组织',
  // 可扩展其他值
};
// 查询和重置
const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    if (!['orgId', 'timeRange'].includes(key)) {
      queryData.value[key] = data && data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    }
  })
  loadTableData()
}
const OrgSelectRef = ref(null)
const handleFilterReset = () => {
  queryData.value = {
    name: '',
    orgId: [],
    timeRange: [],
    approvalStatus: ''
  }
  OrgSelectRef.value.clearselectedData();
  loadTableData()
}
const isLoading = ref(false);
// 加载表格数据
const loadTableData = () => {
  isLoading.value = true
  getopenDataList({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    datasetName: queryData.value.name,
    orgIds: queryData.value.orgId,
    reviewStatus: queryData.value.approvalStatus === 'all' ? '' : queryData.value.approvalStatus,
    beginTime: queryData.value.timeRange[0],
    endTime: queryData.value.timeRange[1]
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.records
        tableConfig.value.paginationConfig.total = res.data.total
        console.log(tableData.value, 'value====')
      }

    })
    .finally(() => {
      isLoading.value = false
    })

  // 应用分页
  const currentPage = tableConfig.value.paginationConfig.currentPage
  const pageSize = tableConfig.value.paginationConfig.pageSize
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // tableData.value = filteredData.slice(startIndex, endIndex)
}

// 分页事件处理
const handleSizeChange = (val: number) => {
  tableConfig.value.paginationConfig.pageSize = val
  loadTableData()
}
const handleCurrentChange = (val: number) => {
  tableConfig.value.paginationConfig.currentPage = val
  loadTableData()
}
const openShowModal = ref(false)
const handleAdd = () => {
  // 打开选择数据集的模态框
  // 这里可以使用一个模态框组件来选择数据集
  openShowModal.value = true
  getDataSetFun()
}
const dataSetList = ref([]);
const getDataSetFun = () => {
  getDataSetList({
    datasetName: '',
  })
    .then((res) => {
      if (res.code === 0) {
        dataSetList.value = res.data
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
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

/**
 * 审批记录
 */
const showReviewRecordModal = ref(false)
const handleReviewRecord = (row: DatasetType) => {
  showReviewRecordModal.value = true
  currentModel.value = row
}

// 目录层级展示
const getLevelText = (level: number) => {
  return '水务主题/供水业务/水源水质'
}

// be-table 操作按钮事件
const onCommand = (command: string, row: any) => {
  if (command === 'close') {
    handleClose(row)
  }
  if (command === 'detail') {
    handleDetail(row)
  }
}
// 详情
const handleDetail = (row) => {
  router.push({
    path: '/data-sandbox/data-open/detail',
    query: {
      datasetId: row.dataId
    }
  })
}
// 公开操作
const handleOpen = (row?: any) => {
  console.log('公开数据目录', row)
}

// 数据集合下架
const handleClose = async (row: DatasetType) => {
  try {
    // 这里加个 确认框
    await ElMessageBox.confirm(`确定要下架该数据集吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 模拟下架操作
    const params = {
      id: row.id,
      dataId: row.dataId,
      datasetUse: row.datasetUse,
      openScope: row.openScope
    }
    dataSetDown(params).then((res) => {
      const {
        code
      } = res
      if (code === 0) {
        ElMessage.success(res.message || `下架成功`)
        loadTableData()
      } else {
        ElMessage.error(res.msg || '下架失败')
      }
    })
    // ElMessage.success('数据集已下架')
    // loadTableData() // 重新加载表格数据
  } catch (error) {
    // ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  }
}

onMounted(() => {
  loadTableData()
})
</script>

<style scoped lang="postcss">
.detail-config {
  .left-content {
    .search-box {
      padding: 12px 0px;
      border-top: 1px solid #e4e7ed;
      background-color: #fff;
    }

    .catalog-tree {
      flex: 1;
      overflow-y: auto;
    }
  }
}

.catalog-content {
  @apply flex-1 overflow-auto justify-items-stretch;
  display: flex;
  flex-direction: column;
}

/* 查询条件区域样式 */
.search-criteria {
  .form-action {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
