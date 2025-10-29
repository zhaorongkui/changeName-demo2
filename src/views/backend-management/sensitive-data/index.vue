<template>
  <div class="detail-config">
    <div class="left-content">
      <div class="catalog-tree">
        <BusinessTree ref="businessTreeRef" @node-click="handleNodeClick" />
      </div>
    </div>
    <div class="right-content">
      <!-- 查询条件区域 -->
      <div class="table-search">
        <el-form :inline="true" :model="queryData" class="demo-form-inline" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="queryData.fieldNameOrDesc" style="width: 240px" placeholder="搜索字段名称、字段描述" clearable
              :prefix-icon="Search" @change="handleSearch" />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="primary" @click="handleReset">重置</el-button>
      </div>
      <div class="content-main">
        <div class="table-operate">
          <el-button type="primary" class="ml-2" @click="handleAdd">新增</el-button>
        </div>
        <!-- 表格数据展示 -->
        <div class="data-table-container">
          <!--          <be-table-->
          <!--              :is-lock="false"-->
          <!--              :table-data="tableData"-->
          <!--              :columns="tableColumns"-->
          <!--              :options="tableConfig"-->
          <!--              @command="onCommand"-->
          <!--          />-->
          <el-table :data="tableData" class="table-content" border>
            <el-table-column type="index" label="序号" width="60" >
              <template #default="{ $index }">
                <span>{{
                  (tableConfig.paginationConfig.currentPage - 1) * tableConfig.paginationConfig.pageSize + $index + 1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="业务实体" min-width="100" prop="businessObject">
            </el-table-column>
            <el-table-column label="对象层级" min-width="100" prop="businessDomain">
            </el-table-column>

            <el-table-column label="字段名称" min-width="100" prop="fieldName">
            </el-table-column>

            <el-table-column label="字段描述" min-width="100" prop="description">
            </el-table-column>

            <el-table-column label="字段类型" min-width="100" prop="dataType">
            </el-table-column>
            <el-table-column label="数据分类标签" min-width="100" prop="dataTags">
            </el-table-column>

            <el-table-column label="单位" min-width="100" prop="unit">
            </el-table-column>
            <el-table-column label="脱敏级别" min-width="150" prop="desensitize" align="center">
              <template #default="{ row }">
                <el-select v-model="row.desensitize" class="m-2" size="large" @change="changeItem(row)">
                  <el-option v-for="item in desensitizationLevelOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" prop="unit">
              <template #default="{ row }">
                <el-button link type="primary" @click="deleteData(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
      </div>
    </div>
  </div>
  <addSensitiveData v-if="isShowAddSensitiveData" @close="handleCloseAddSensitiveData"></addSensitiveData>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import BusinessTree from '@/views/data-sandbox/components/BusinessTree.vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import {
  businessOptions as mockBusinessOptions,
  tagOptions as mockTagOptions,
  organizationOptions as mockOrganizationOptions,
  type BusinessTreeNode
} from '@/views/data-sandbox/mockData'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import { Search } from "@element-plus/icons-vue";
import addSensitiveData from './components/addSensitiveData.vue'
import { getDesensitizeList, deleteCatalogue, updateDesensitize } from '@/api/backStageManage'
let isShowAddSensitiveData = ref(false)
const pageKey = 'data-catalog'
const { t } = useI18n()
// ...existing code...
const router = useRouter()
const businessTreeRef = ref()
const currentNode = ref<BusinessTreeNode | null>(null)
const searchFormRef = ref<FormInstance>()
const desensitizationLevelOptions = ref([
  {
    value: 1,
    label: '组织外脱敏'
  },
  {
    value: 2,
    label: '集团外脱敏'
  },
])
const queryData = ref({
  fieldNameOrDesc: '',
})

// const themeOptions = ref(mockThemeOptions)
const businessOptions = ref(mockBusinessOptions)
const tagOptions = ref(mockTagOptions)
const organizationOptions = ref(mockOrganizationOptions)


const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
  })
  getTableList(currentNode.value?.id || 1)
}
const changeItem = (item) => {
  // console.log(item);
  updateDesensitize({id: item.id, desensitize: item.desensitize }).then((res) => {
    if (res.code !== 0) {
       ElMessage.error(res.msg || '保存失败')
    }
  })
}

const handleFilterReset = () => {
  queryData.value = {
    theme: '',
    business: '',
    tags: [],
    organization: [],
    timeRange: []
  }
  getTableList(currentNode.value?.id || 1)
}

const tableData = ref([])
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

const handlePageChange = () => {
  getTableList(currentNode.value?.id || 1)
}

const handleNodeClick = (data: BusinessTreeNode) => {
  currentNode.value = data
  getTableList(currentNode.value?.id || 1)
}

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
      prop: 'businessObject',
      label: '业务对象',
      align: 'center'
    },
    {
      prop: 'businessCategory',
      label: '业务对象类型',
      align: 'center'
    },
    {
      prop: 'logicDataModel',
      label: '逻辑数据模型',
      align: 'center'
    },
    {
      prop: 'time_Dimension',
      label: '时间维度',
      align: 'center'
    },
    {
      prop: 'dataTag',
      label: '数据标签',
      align: 'center'
    },
    {
      prop: 'propertyCount',
      label: '属性',
      align: 'center',
      width: 80
    },
    {
      prop: 'businessSubCategory',
      label: '关联的业务主题',
      align: 'center'
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 80,
      buttons: [
        {
          name: '详情',
          command: 'detail',
          type: 'primary'
        }
      ]
    }
  ]
})

const onCommand = (command, row) => {
  switch (command) {
    case 'detail':
      handleViewDetail(row)
      break
  }
}

// 查询
const handleSearch = () => {
  // console.log('查询条件:', queryData.value)
  getTableList(currentNode.value?.id || 1)
}

const handleReset = () => {
  queryData.value.fieldNameOrDesc = ''
  handleSearch()
}

const resetSearchForm = () => {
  if (!searchFormRef.value) return
  searchFormRef.value.resetFields()
  getTableList(currentNode.value?.id || 1)
}
const isLoading = ref(false)
// 获取数据集的列表
const getTableList = (id: string | number) => {
  isLoading.value = true
  getDesensitizeList({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    busId: id || 1,
    fieldNameOrDesc: queryData.value.fieldNameOrDesc
  })
    .then((res) => {
      if (res.success) {
        tableData.value = res.data.body
        // console.log(44444444444444, tableData.value, res.data.body)
        tableConfig.value.paginationConfig.total = res.data.total
      }

    })
    .finally(() => {
      isLoading.value = false
    })
}

//   新增敏感数据
const handleAdd = () => {
  isShowAddSensitiveData.value = true
}
const handleCloseAddSensitiveData = () => {
  isShowAddSensitiveData.value = false
  businessTreeRef.value.initTreeData();
  getTableList(1)
}
const getLevelText = (level: number) => {
  return '水务主题/供水业务/水源水质'
}

const handleViewDetail = (row) => {
  // 可根据 row.id 或其他参数拼接路由参数
  router.push({
    path: '/data-sandbox/data-catalog/detail',
    query: { businessId: row.id }
  })
}
// 删除
const deleteData = (data) => {
  ElMessageBox.confirm('确定删除当前数据?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCatalogue(data.id).then((res) => {
      if (res.code === 0) {
        ElMessage.success(res.message || '删除成功')
        getTableList(currentNode.value?.id || 1)
      }
    })
  })
}
onMounted(() => {
  getTableList(currentNode.value?.id || 1)
})

// 监听分页变化，重新获取数据
watch(
  () => [tableConfig.value.paginationConfig.currentPage, tableConfig.value.paginationConfig.pageSize],
  () => {
    getTableList(currentNode.value?.id || 1)
  }
)
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

/* 树形组件相关样式 */

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

  .check-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-right: 8px;

    .check-tag-item {
      --el-color-info: #909399;
      --el-color-info-light-9: rgb(244, 244, 245);

      .el-check-tag {
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: #e6f4ff;
          color: #409eff;
        }
      }
    }
  }
}

.table-search {
  display: flex;
}
</style>

