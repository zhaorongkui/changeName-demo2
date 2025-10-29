<template>
  <div class="content-main">
    <el-tabs v-model="activeTab" class="demo-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="字段信息" name="detail"></el-tab-pane>
      <el-tab-pane label="数据资源" name="preview"></el-tab-pane>
    </el-tabs>
    <!-- 放置关联业务对象 内容 -->
    <slot name="expand" :onCheckTagChange="onCheckTagChange" :queryData="queryData"></slot>
    <div v-if="activeTab === 'detail' && !isEditMode" class="table-operate">
      <slot name="detail-operate" :is-edit-mode="isEditMode" :toggle-edit="toggleEditMode"></slot>
      <div class="search-form">
        <el-input class="search-input" placeholder="搜索字段名称、字段描述" v-model="searchContent" clearable @clear="handleClear">
          <template #suffix>
            <el-icon class="pointer" @click="handleSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
    <div v-if="activeTab === 'detail'" class="data-table-container">
      <el-alert v-if="isEditMode" type="warning" size="small">
        <template #default>
          字段取消勾选后，被取消的字段列数据将取消应用，取消应用的字段将不再展示在数据集中，也不可在校验模型中被引用。
        </template>
      </el-alert>
      <el-table :data="tableData" class="table-content" border v-loading="isLoading"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
        @selection-change="handleSelectionChange">
        <el-table-column v-if="isEditMode" type="selection" />
        <!-- 自定义序号列 -->
        <el-table-column label="序号" width="60">
          <template #default="{ $index }">
            {{ getIndex($index) }}
          </template>
        </el-table-column>

        <el-table-column label="字段名称" min-width="100">
          <template #default="{ row }">
            <template v-if="!isEditMode">
              {{ row.fieldName }}
            </template>
            <template v-else>
              <el-input v-model="row.fieldName" />
            </template>
          </template>
        </el-table-column>

        <el-table-column label="描述" min-width="100">
          <template #default="{ row }">
            <template v-if="!isEditMode">
              {{ row.description }}
            </template>
            <template v-else>
              <el-input v-model="row.description" />
            </template>
          </template>
        </el-table-column>

        <el-table-column label="字段类型" min-width="100">
          <template #default="{ row }">
            <template v-if="!isEditMode">
              {{ row.dataType }}
            </template>
            <template v-else>
              <el-select v-model="row.dataType" placeholder="请选择">
                <el-option label="数值" value="number" />
                <el-option label="时间" value="date" />
                <el-option label="文本" value="text" />
              </el-select>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="数据分类标签" min-width="100">
          <template #default="{ row }">
            <template v-if="!isEditMode">
              {{ row.classTag }}
            </template>
            <template v-else>
              <el-input v-model="row.classTag" />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="100">
          <template #default="{ row }">
            <template v-if="!isEditMode">
              {{ row.unit }}
            </template>
            <template v-else>
              <el-input v-model="row.unit" />
            </template>
          </template>
        </el-table-column>
      </el-table>
      <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
        :list="tableData" :page-sizes="[10, 20, 30, 50]" @callback="handleSearch" />
    </div>
    <div v-if="activeTab === 'preview'" class="data-table-container">
      <el-table :data="tableDataPreview" class="table-content" border v-loading="loading"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column v-for="field in businessObjectMetaData" :key="field.fieldName" :label="`${field.description}`" :prop="field.fieldName"
          min-width="120">
          <!-- <el-table-column :label="`${field.dataType}`" :prop="field.fieldName"> </el-table-column> -->
        </el-table-column>
      </el-table>
      <be-pager v-model:current-page="tableConfigPreview.paginationConfig.currentPage"
        v-model:page-size="tableConfigPreview.paginationConfig.pageSize"
        :total="tableConfigPreview.paginationConfig.total" :list="tableDataPreview" :page-sizes="[10, 20, 30, 50]"
        @callback="handlePagePreview" />
    </div>
    <slot name="footer"> </slot>
    <div v-if="isEditMode" class="detail-footer">
      <!-- 增加 确定 取消按钮 -->
      <el-button type="primary" @click="handleCancel">取消</el-button>
      <el-button @click="handleOk">确定</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, PropType, computed, onMounted, nextTick } from 'vue'
import { ElMessage, FormRules, TabPaneName,  } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getDatasetDetailField, getDatasetDetailPreview, getBusinessDetail } from '@/api/dataset.ts'
import { useDatasetStore } from '@/store/modules/datasetStore'
import { BaseInfo } from '@/types/dataSandbox'
const datasetStore = useDatasetStore()
// be-table字段信息 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'dataset-detail-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})
// be-table数据预览 配置
const tableConfigPreview = ref({
  settingTable: false,
  tableId: 'dataset-detail-preview-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})
const isLoading = ref(false)
const loading = ref(false)
const currentDatasetDetail = ref<BaseInfo | null>(null)
// 定义组件暴露的事件
const emit = defineEmits(['close', 'success'])
const props = defineProps({
  viewType: {
    type: String as PropType<'detail' | 'preview'>,
    default: 'detail'
  },
  sourceType: {
    type: String, // 'dataset', | 'business'
    default: 'dataset'
  },
  datasetId: {
    type: String,
    default: ''
  },
  businessId: {
    type: String,
    default: ''
  },
  currentDataset: { //数据集广场行数据
    type: Object,
    default: {}
  },
  pageType: { //是数据分类还是数据集
    type: String,
    default: ''
  },
  currentDataCatalog: { //数据目录行数据
    type: Object,
    default: {}
  }
})
const activeTab = ref('detail')
const tableData = ref([])
const tableDataPreview = ref([])
const handleTabChange = (pane: TabPaneName) => {
  activeTab.value = pane as 'detail' | 'preview'
  isEditMode.value = false
  console.log(activeTab.value, 'activeTab==')
  if (pane == 'detail') {
    getFieldData()
  } else {
    getPreViewData()
  }
}

const onCheckTagChange = (status: boolean, tagId: number) => {
  queryData.value.tags = tagId
  loadTableData()
}
const businessObjectMetaData = ref([])
// const businessObjectMetaData = computed(() => {
//   // if (props.sourceType === 'business') {
//   //   return mockDataList.find((item) => item.datasetId === '10002')?.metadata || []
//   // }
//   if(props.datasetId){
//     return mockDataList.find((item) => item.datasetId === props.datasetId)?.metadata || []
//   }
//   return mockDataList.find((item) => item.datasetId === '10002')?.metadata || []
//
// })

const dataPreview = computed(() => {
  return activeTab.value === 'preview'
})
// 获取字段信息
const getFieldData = () => {
  tableData.value = []
  isLoading.value = true
  if (!props.pageType) {
    getDatasetDetailField({
      pageNum: tableConfig.value.paginationConfig.currentPage,
      pageSize: tableConfig.value.paginationConfig.pageSize,
      objectId: queryData.value.tags,
      datasetsId: currentDatasetDetail.value.datasetsId,
      keyWord: searchContent.value
    }).then(res => {
      if (res.success) {
        tableData.value = res.data.records
        tableConfig.value.paginationConfig.total = res.data.total ? res.data.total : 0
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
      isLoading.value = false
    })
  } else if (props.pageType && props.pageType == 'catalog') {
    getBusinessDetail({
      pageNum: tableConfig.value.paginationConfig.currentPage,
      pageSize: tableConfig.value.paginationConfig.pageSize,
      keyWord: searchContent.value,
      dataListId: props.currentDataCatalog.id
    }).then(res => {
      if (res.success) {
        tableData.value = res.data.records
        tableConfig.value.paginationConfig.total = res.data.total ? res.data.total : 0
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
      isLoading.value = false
    })
  }

}
// 字段信息查询
const handleSearch = () => {
  getFieldData()
}
// 字段信息重置
const handleReset = () => {
  searchContent.value = ''
  getFieldData()
}
// 获取数据资源
const getPreViewData = () => {
  loading.value = true
  getDatasetDetailPreview({
    pageNum: tableConfigPreview.value.paginationConfig.currentPage,
    pageSize: tableConfigPreview.value.paginationConfig.pageSize,
    objectId: queryData.value.tags,
    datasetsId: !props.pageType ? currentDatasetDetail.value.datasetsId : null,
    kind: props.pageType && props.pageType == 'catalog' ? 2 : 1,  //1:数据集广场 2：数据目录
  }).then(res => {
    if (res.success) {
      tableDataPreview.value = res.data.row
      businessObjectMetaData.value = res.data.title
      tableConfigPreview.value.paginationConfig.total = res.data.total ? res.data.total : 0
      console.log(tableDataPreview.value, 'tableDataPreview.value===')
    } else {
      ElMessage.error(res.message)
    }
  }).finally(() => {
    loading.value = false
  })
}
// 数据资源分页
const handlePagePreview = () => {
  getPreViewData()
}
function generateMockRows(count = 10) {
  const rows = []
  console.log(businessObjectMetaData.value, 'value===1')
  for (let i = 0; i < count; i++) {
    const row = {}
    businessObjectMetaData.value.forEach((field) => {
      if (field.dataType === 'number') {
        // row[field.fieldName] = Math.round(Math.random() * 1000) + i * 10
        row[field.fieldName] = parseFloat((Math.random() * 10).toFixed(2));
      } else if (field.dataType === 'date') {
        row[field.fieldName] = `2025-08-${String(i + 1).padStart(2, '0')}`
      } else {
        row[field.fieldName] = `示例${i + 1}`
      }
    })
    rows.push(row)
  }
  console.log(rows, 'rows====')

  return rows
}

const searchContent = ref('')
const handleClear = () => {
  searchContent.value = ''
  getFieldData()
  loadTableData()
}

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 计算序号的方法
const getIndex = (index: number) => {
  return (tableConfig.value.paginationConfig.currentPage - 1) * tableConfig.value.paginationConfig.pageSize + index + 1
}
const loadTableData = () => {
  if (activeTab.value === 'detail') {
    tableData.value = businessObjectMetaData.value.map((item) => ({
      ...item,
      selected: false // 初始化选中状态
    }))
    console.log(tableData.value, 'tab==')
  } else {
    console.log('加载数据预览', generateMockRows(queryData.value.pageSize))
    tableData.value = generateMockRows(queryData.value.pageSize)
  }
}

// 设置状态
const isEditMode = ref(false)
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const handleSelectionChange = (selection: any[]) => {
  console.log('选中行:', selection)
}

const previewType = ref<'organization' | 'timeRange'>('organization') // 预览类型，默认为按组织
const queryData = ref({
  organization: '',
  tags: 1,
  timeRange: [],
  pageSize: 10
})
const handleResetPreviewQuery = () => {
  queryData.value.organization = ''
  queryData.value.timeRange = []
  queryData.value.pageSize = 10
  loadTableData()
}
const handlePreviewTypeChange = (value: 'organization' | 'timeRange') => {
  previewType.value = value
}

const handleSizeChange = (value: number) => {
  queryData.value.pageSize = value
  loadTableData()
}

/**
 * 取消设置按钮点击事件
 */
const handleCancel = () => {
  isEditMode.value = false
  emit('close')
}
/**
 * 确定设置按钮点击事件
 */
const handleOk = () => {
  isEditMode.value = false
  emit('success')
  ElMessage.success('操作成功')
  // 这里可以添加保存逻辑
  // modelSave(currentModel.value).then(() => {
  //   ElMessage.success('模型保存成功')
  //   emit('success')
  // })
}
// 数据集广场-数据集切换业务实体
watch(() => props.currentDataset, (val) => {
  currentDatasetDetail.value = val as BaseInfo
  console.log(currentDatasetDetail.value, ' currentDatasetDetail.value ===')
  if (val && val.ldmList && val.ldmList.length) {
    queryData.value.tags = val.ldmList[0].id
    getFieldData()
  }
}, {
  deep: true
})
// 数据集广场-业务实体切换
watch(() => datasetStore.currentCoreObject, (val) => {
  if (val || val == 0) {
    queryData.value.tags = val
    if (activeTab.value == 'detail') {
      getFieldData()
    } else {
      getPreViewData()
    }
  }
})
onMounted(() => {
  nextTick(() => {
    if (props.pageType && props.pageType == 'catalog') {
      queryData.value.tags = props.currentDataCatalog.id
      getFieldData()
    }
  })

})
defineExpose({
  getFieldData
})
</script>

<style lang="scss" scoped>
.table-operate {
  justify-content: space-between;

  .search-form {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;

    .search-input {
      width: 240px;
      margin-left: 0.5rem;
    }

    .date-range {
      margin-left: 0.5rem;
    }

    :deep(.el-form-item) {
      margin-right: 16px;
      margin-bottom: 16px;

      .el-form-item__label {
        font-weight: normal;
        color: #606266;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    :deep(.el-form-item__content) {
      .el-button+.el-button {
        margin-left: 10px;
      }
    }
  }
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
