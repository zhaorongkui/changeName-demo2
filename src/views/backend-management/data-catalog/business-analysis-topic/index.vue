<template>
  <div style="height: 100vh;"  v-if=" ['business-analysis-topic-detail'].includes(`${String($route.name)}`)">
    <router-view></router-view>
  </div>
  <div class="business-analysis-topic-management detail-config" v-else>
    <div class="content-wrapper">
      <div class="content-title">
        <h3>业务分析主题管理列表</h3>
      </div>
      <!-- 查询区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset" @on-clear="handleClear"/>
      </div>

      <div class="content-main">
        <div class="table-operate">
                  <el-button type="primary" @click="showAddDrawer">
                    新增
                  </el-button>
        </div>

        <!-- 表格数据展示 -->
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

  <!-- 新增抽屉组件 -->
  <BusinessAnalysisTopicDrawer
    v-if="drawerVisible"
    :isEdit="isEdit"
    :currentTopic="currentTopic"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import BusinessAnalysisTopicDrawer from '../components/BusinessAnalysisTopicDrawer.vue'
import {  type BusinessAnalysisTopic } from '../businessAnalysisTopicMockData'
import { useRouter } from 'vue-router'
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import {getBusinessData, getBusinessDataDel, getBusinessReportsList,} from "~/api/backStageManage";

const router = useRouter()
const isLoading = ref(false)
const tableData = ref<BusinessAnalysisTopic[]>([])

// 抽屉相关状态
const drawerVisible = ref(false)

// 分页参数
const tableConfig = ref({
  settingTable: false,
  tableId: 'business-analysis-topic-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: 'domainCode'
})




// 查询条件数据
const queryData = ref({
  categoryName: '', // 主题名称
  parentCategory: '', // 分类
  businessOwner: '', // 业务负责人
  dataOwner: '', // 数据负责人
  domainDescription: '', // 主题描述
  relatedReports: '', // 关联报表
})

// 查询条件表单项配置
const formItemList = ref([
  {
    type: 'input',
    label: '主题名称',
    paramKey: 'categoryName',
    placeholder: '请输入主题名称',
    modelValue: queryData.value.categoryName
  },
  {
    type: 'select',
    label: '所属分类',
    paramKey: 'parentCategory',
    placeholder: '请选择',
    modelValue: queryData.value.parentCategory,
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
    type: 'input',
    label: '业务负责人',
    paramKey: 'businessOwner',
    placeholder: '请输入业务负责人',
    modelValue: queryData.value.businessOwner
  },
  {
    type: 'input',
    label: '数据负责人',
    paramKey: 'dataOwner',
    placeholder: '请输入数据负责人',
    modelValue: queryData.value.dataOwner
  },
  {
    type: 'select',
    label: '关联报表',
    paramKey: 'relatedReports',
    placeholder: '请输入关联报表',
    modelValue: queryData.value.relatedReports,
    selectOptions: []
  }
])

// 表格列定义
const tableColumns = computed(() => [
  {
    prop: 'categoryName',
    label: '主题名称',
    align: 'center'
  },
  {
    prop: 'parentCategory',
    label: '所属分类',
    align: 'center'
  },
  {
    prop: 'categoryCode',
    label: '主题编码',
    align: 'center'
  },

  {
    prop: 'categoryDescription',
    label: '主题描述',
    align: 'center'
  },
  {
    prop: 'businessOwner',
    label: '业务负责人',
    align: 'center'
  },
  {
    prop: 'dataOwner',
    label: '数据负责人',
    align: 'center'
  },
  {
    prop: 'relatedReports',
    label: '关联报表',
    align: 'center'
  },
  {
    type: 'actions',
    label: '操作',
    align: 'center',
    buttons: [
      {
        name: '编辑',
        command: 'detail',
        type: 'primary'
      },
      {
        name: '删除',
        command: 'del',
        type: 'primary'
      },
    ]
  }
])

// 查询处理
const handleFilterSearch = (data: any) => {
  Object.keys(queryData.value).forEach((key) => {
    queryData.value[key] = data[key]
  })
  getDataPageList()
}

// 重置处理
const handleFilterReset = () => {
  queryData.value = {
    categoryName: '',
    businessOwner: '',
    domainDescription: '',
    relatedReports: '',
    dataOwner:'',
    parentCategory:'',
  }
  tableConfig.value.paginationConfig.currentPage = 1
  tableConfig.value.paginationConfig.pageSize = 20
  getDataPageList()
}
// 清空某个搜索项
const handleClear = (parimaryKey: string)=> {
  queryData.value[parimaryKey] = ''
}
// 获取数据列表
const getDataPageList = () => {
  isLoading.value = true

  getBusinessData({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    parentCategory: queryData.value.parentCategory,
    categoryName: queryData.value.categoryName,
    businessOwner:  queryData.value.businessOwner,
    dataOwner: queryData.value.dataOwner,
    relatedReports: queryData.value.relatedReports,
  }).then(res => {
    if(res.success){
      tableData.value = res.data.records
      tableConfig.value.paginationConfig.total = res.data.total
    }
  }).finally(() => {
    isLoading.value = false
  })

}
const reportOptions = ref([])
// 获取报表
const getReportData = () => {
  getBusinessReportsList().then(res => {
    if(res.success){
      reportOptions.value = res.data
      if(res.data.length>0){
        formItemList.value[4].selectOptions = res.data.map(item =>{
          return {
            value: item.reportName,
            label: item.reportName
          }
        })
      }

    }
  })
}
// 切换分页
const handlePageChange = () => {
  getDataPageList()
}

// 操作命令处理
const onCommand = (command: string, row: BusinessAnalysisTopic) => {
  switch (command) {
    case 'detail': //编辑
      handleViewDetail(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
  }
}
/**
 * 删除
 * @param row
 */
const handleDelete = async (row) => {
  ElMessageBox.confirm('确定删除当前主题?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    getBusinessDataDel(row.id).then(res=>{
      if(res.success){
        getDataPageList()
        ElMessage.success(res.message)
      }else{
        ElMessage.error(res.message)
      }
    })
  })
}
const  currentTopic = ref({})
const isEdit = ref(false)
// 查看详情
const handleViewDetail = (row: BusinessAnalysisTopic) => {
  drawerVisible.value = true
  currentTopic.value = row
  isEdit.value = true
}

// 显示新增抽屉
const showAddDrawer = () => {
  drawerVisible.value = true

}

const handleClose = ()=> {
  drawerVisible.value = false
  currentTopic.value = {}
  isEdit.value = false
  getDataPageList()
}


// 页面加载时获取数据
onMounted(() => {
  getDataPageList()
  getReportData()
})
</script>

<style scoped lang="postcss">
.business-analysis-topic-management {
  padding: 20px;
}

.page-content {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 400px;
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
