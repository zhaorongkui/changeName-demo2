<template>
  <div style="height: 100vh;" v-if="['logical-data-model-detail'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="detail-config" style="flex-direction: column" v-else>
    <div class="content-title">
      <h3>逻辑数据模型管理</h3>
    </div>
    <!-- 查询区域 -->
    <div class="search-criteria">
      <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset"
        @onClear="handleFilterClear" />
    </div>

    <div class="content-main">
      <div class="table-operate">
        <el-button type="primary" @click="showAddDrawer">
          新增
        </el-button>
      </div>

      <!-- 表格数据展示 -->
      <div class="data-table-container" v-loading="isLoading">
        <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
          @command="onCommand" />
      </div>
      <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
        v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
        :list="tableData" :page-sizes="TABLE_LIST_PAGE_RANGE" @callback="handlePageChange" />
    </div>
  </div>
  <detail v-if="isShowDetail" @close="handleClose" :currentData="currentData" :dataSourceList="dataSourceList"></detail>
  <!-- 新增抽屉组件 -->
  <LogicalDataModelDrawer v-if="drawerVisible" :businessDomainList="businessDomainList" :dataSourceList="dataSourceList"
    :detailObject="detailObject" :itemId='itemId' ref="logicalDataModelDrawerRef" v-model:drawerVisible="drawerVisible"
    @submit="handleAddSubmit" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import LogicalDataModelDrawer from '../components/LogicalDataModelDrawer.vue'
import {  type LogicalDataModel } from '../logicalMockData'
import { useRouter } from 'vue-router'
import { getAilabLogicalData } from '@/api/dataset.ts'
import { getDataSourceList, getBusinessDomainList } from '@/api/common.ts'
import { ailabLogicalDataModelDetail, ailabLogicalDataModelDelete } from '@/api/backStageManage.ts'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import { arrayToMap, getInitialValue } from '@/utils/index'
import detail from './components/detail.vue'
const router = useRouter()
const isLoading = ref(false)
const tableData = ref<LogicalDataModel[]>([])
// isShowDetail.value = true
//     currentData.value = row
// 抽屉相关状态
const drawerVisible = ref(false)

// 分页参数
const tableConfig = ref({
  settingTable: false,
  tableId: 'logical-data-model-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: 'entityCode'
})

// 查询条件数据
const queryData = ref({
  entity: '', // 实体/表名
  businessDomain: '', // 业务域
  dataSource: '', // 数据来源
  businessDefinition: '', // 业务定义
  businessRules: '', // 业务规则
  responsibleDepartment: '', // 责任部门
  versionInfo: '', // 版本信息
  lifecycleStatus: '', // 生命周期状态
  accessPermissions: '' // 访问权限
})

// 查询条件表单项配置
const formItemList = ref([
  {
    type: 'input',
    label: '实体/表名',
    paramKey: 'entity',
    placeholder: '请输入实体或表名',
    modelValue: queryData.value.entity
  },
  {
    type: 'select',
    label: '业务域',
    paramKey: 'businessDomain',
    placeholder: '请输入业务域',
    modelValue: queryData.value.businessDomain,
    selectOptions: [
      { name: '水量', id: '水量' },
      { name: '电量', id: '电量' },
      { name: '污泥', id: '污泥' },
      { name: '药剂', id: '药剂' },
      { name: '水质', id: '水质' },
      { name: '设备', id: '设备' },
      { name: '设施', id: '设施' },
      { name: '工单', id: '工单' },
      { name: '经营', id: '经营' }
    ]
  },
  {
    type: 'select',
    label: '数据来源',
    paramKey: 'dataSource',
    placeholder: '请选择数据来源',
    modelValue: queryData.value.dataSource,
    selectOptions: [
      { name: '数采', id: '数采' },
      { name: '基础数据', id: '基础数据' },
      { name: '工单数据', id: '工单数据' },
      { name: '台账数据', id: '台账数据' },
      { name: '填报数据', id: '填报数据' }
    ]
  },
  {
    type: 'input',
    label: '业务定义',
    paramKey: 'businessDefinition',
    placeholder: '请输入业务定义',
    modelValue: queryData.value.businessDefinition
  },
  {
    type: 'input',
    label: '业务规则',
    paramKey: 'businessRules',
    placeholder: '请输入业务规则',
    modelValue: queryData.value.businessRules
  },
  {
    type: 'input',
    label: '责任部门',
    paramKey: 'responsibleDepartment',
    placeholder: '请输入责任部门',
    modelValue: queryData.value.responsibleDepartment
  },
  {
    type: 'input',
    label: '版本信息',
    paramKey: 'versionInfo',
    placeholder: '请输入版本信息',
    modelValue: queryData.value.versionInfo
  },
  {
    type: 'select',
    label: '状态',
    paramKey: 'lifecycleStatus',
    placeholder: '状态',
    modelValue: queryData.value.lifecycleStatus,
    selectOptions: [
      { name: '已上线', id: '已上线' },
      { name: '测试中', id: '测试中' },
      { name: '设计', id: '设计' },
      { name: '归档', id: '归档' },
      { name: '失效', id: '失效' }
    ]
  },
  {
    type: 'select',
    label: '访问权限',
    paramKey: 'accessPermissions',
    placeholder: '请选择访问权限',
    modelValue: queryData.value.accessPermissions,
    selectOptions: [
      { name: '受权限控制', id: '受权限控制' },
      { name: '公开访问', id: '公开访问' }
    ]
  }
])
const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}
// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'entity',
    label: '实体/表名',
    align: 'center'
  },
  {
    prop: 'entityCode',
    label: '实体编码',
    align: 'center'
  },
  {
    prop: 'fieldCount',
    label: '字段数量',
    align: 'center'
  },
  {
    prop: 'businessDomain',
    label: '业务域',
    align: 'center'
  },
  {
    prop: 'dataSource',
    label: '数据来源',
    align: 'center'
  },
  {
    prop: 'businessDefinition',
    label: '业务定义',
    align: 'center'
  },
  {
    prop: 'businessRules',
    label: '业务规则',
    align: 'center'
  },
  {
    prop: 'responsibleDepartment',
    label: '责任部门',
    align: 'center'
  },
  {
    prop: 'versionInfo',
    label: '版本信息',
    align: 'center'
  },
  {
    prop: 'lifecycleStatus',
    label: '状态',
    align: 'center'
  },
  {
    prop: 'accessPermissions',
    label: '访问权限',
    align: 'center'
  },
  {
    type: 'actions',
    label: '操作',
    align: 'center',
    buttons: [
      {
        name: '编辑',
        command: 'edit',
        type: 'primary'
      },
      {
        name: '详情',
        command: 'detail',
        type: 'primary'
      },
      {
        name: '删除',
        command: 'detelt',
        type: 'primary'
      }
    ]
  }
])

// 查询处理
const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
  })
  getDataPageList()
}

// 重置处理
const handleFilterReset = () => {
  queryData.value = {
    entity: '', // 实体/表名
    businessDomain: '', // 业务域
    dataSource: '', // 数据来源
    businessDefinition: '', // 业务定义
    businessRules: '', // 业务规则
    responsibleDepartment: '', // 责任部门
    versionInfo: '', // 版本信息
    lifecycleStatus: '', // 生命周期状态
    accessPermissions: '' // 访问权限
  }
  getDataPageList()
}

// 获取列表
const getDataPageList = () => {
  isLoading.value = true
  getAilabLogicalData({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    entity: queryData.value.entity, // 实体/表名
    businessDomain: queryData.value.businessDomain, // 业务域
    dataSource: queryData.value.dataSource, // 数据来源
    businessDefinition: queryData.value.businessDefinition, // 业务定义
    businessRules: queryData.value.businessRules, // 业务规则
    responsibleDepartment: queryData.value.responsibleDepartment, // 责任部门
    versionInfo: queryData.value.versionInfo, // 版本信息
    lifecycleStatus: queryData.value.lifecycleStatus, // 生命周期状态
    accessPermissions: queryData.value.accessPermissions // 访
  }).then((res) => {
    if (res.success) {
      tableData.value = res.data.records
      tableConfig.value.paginationConfig.total = res.data.total
    }
  })
    .finally(() => {
      isLoading.value = false
    })
}
const dataSourceList = ref([])
const businessDomainList = ref([
  { name: '水量', id: '水量' },
  { name: '电量', id: '电量' },
  { name: '污泥', id: '污泥' },
  { name: '药剂', id: '药剂' },
  { name: '水质', id: '水质' },
  { name: '设备', id: '设备' },
  { name: '设施', id: '设施' },
  { name: '工单', id: '工单' },
  { name: '经营', id: '经营' }
])
// 获取数据源
const getDataSource = () => {
  getDataSourceList('').then((res) => {
    console.log(res);
    if (res.success) {
      formItemList.value[2].selectOptions = res.data
      dataSourceList.value = res.data
    }
  })
}
// 获取业务域
const getBusinessDomain = () => {
  getBusinessDomainList('').then((res) => {
    console.log(res);
    if (res.success) {
      // formItemList.value[1].selectOptions = res.data
      // businessDomainList.value = res.data
    }
  })
}
// 切换分页
const handlePageChange = () => {
  getDataPageList()
}

// 操作命令处理
const onCommand = (command: string, row: LogicalDataModel) => {
  switch (command) {
    case 'detail':
      handleViewDetail(row)
      break
    case 'edit':
      handleViewEdit(row)
      break
    case 'detelt':
      handleViewDetelt(row)
      break
  }
}
const currentData = ref(null);
const isShowDetail = ref(false);
// 查看详情
const handleViewDetail = (row: LogicalDataModel) => {
  isShowDetail.value = true
  currentData.value = row
}
const handleClose = () => {
  isShowDetail.value = false

}
// 显示新增抽屉
const showAddDrawer = () => {
  itemId.value = ''
  drawerVisible.value = true
}
const handleViewDetelt = (row) => {
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ailabLogicalDataModelDelete(row.id).then(res => {
      if (res.code === 0) {
        ElMessage.success(res.message || '删除成功')
        getDataPageList()
      } else {
        ElMessage.error(res.message)
      }
    }).finally(() => {
    })
    // done()
  }).catch(() => {
    // 用户取消关闭
  })
}

const itemId = ref('');
const detailObject = ref(null);
const logicalDataModelDrawerRef = ref(null)
const handleViewEdit = (row) => {
  showAddDrawer()
  itemId.value = row.id
  logicalDataModelDrawerRef.value.getDetailValue(row.id)
}
// 提交新增
const handleAddSubmit = () => {
  // 刷新列表
  getDataPageList()
  // 关闭抽屉
  drawerVisible.value = false
  // ElMessage.success('新增成功')
}

// 页面加载时获取数据
onMounted(() => {
  getDataPageList()
  getDataSource()
  getBusinessDomain()
})
</script>

<style scoped lang="postcss">
.logical-data-model-management {
  padding: 20px;
}

.page-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 400px;
}


.content-main {
  .table-operate {
    margin-bottom: 16px;
  }
}

.data-table-container {
  margin-bottom: 16px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }

  .el-button {
    min-width: 80px;
  }
}

.drawer-content {
  padding: 20px 0;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}
</style>
