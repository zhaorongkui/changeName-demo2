<template>
  <div class="base-model detail-config" v-show="!isChildRoute">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>智能体模型列表</h3>
      </div>
      <div class="content-main">
        <div class="search-container">
          <el-button type="primary" @click="handleAdd">新建模型</el-button>
          <div class="table-search">
            <el-form :inline="true" :model="formData" class="demo-form-inline" @submit.native.prevent>
              <el-form-item>
                <el-input
                  v-model="formData.name"
                  style="width: 240px"
                  placeholder="搜索模型名称、模型ID"
                  clearable
                  :prefix-icon="Search"
                  @change="onSearch"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button  @click="handleReset">重置</el-button>
          </div>
        </div>
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
            @callback="handlePageChange"
        />
      </div>
    </div>
  </div>
<!--  新增-->
  <addModel v-if="isShowAddModel" @close="handleCloseAddModel" :isEditMode="isEditMode" :currentModeldetail="currentModelDetail" pageType="agent" :isRelease="isRelease"></addModel>
  <!--  版本管理-->
  <versionDialog v-if="isShowVersionDialog" @close="handleCloseVerionDialog" :currentModel="currentModelDetail" :isEditMode="true" pageType="agent"></versionDialog>
  <router-view :key="route.path"></router-view>
<!--  试用-->
  <modelTrial v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail" :currentModelDetail="currentModelDetail"></modelTrial>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { mockTableData, type TableDataItem } from './tableData'
import {ElMessage, ElMessageBox} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import versionDialog from '../../editor/components/versionDialog.vue'
import addModel from '../../editor/components/add-model.vue'
import modelTrial from './components/modelTrial.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import {getModelMachineList,getModelMachineDel} from "~/api/modelManage";
import { useRoute,useRouter } from 'vue-router';
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('detail'));
const { t } = useI18n()
const isEditMode = ref(false)
const currentModelDetail = ref({})
const currentModelId = ref(null)
const pageKey = 'model-develop-agent'
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
      prop: 'modelId',//模型ID
      label: t('MODEL_ID'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'modelName',//模型名称
      label: t('MODEL_NAME'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'modelType',//分类
      label: '分类',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'notes',//功能描述
      label: t('NOTES'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'paramInStr',//输入参数
      label: t('INPUT_PARAMETERS'),
      align: 'center',
      minWidth: 160,
    },

    {
      prop: 'paramOutStr',//输出参数
      label: t('OUTPUT_PARAMETERS'),
      align: 'center',
      minWidth: 160,
    },
    {
      prop: 'applicableScenario',//应用场景
      label: t('APPLICABLE_SCENARIO'),
      align: 'center',
      minWidth: 160,
    },
    {
      prop: 'paramEva', //评估指标
      label: t('EVALUATION_METRICS'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'releaseStatus',//发布状态
      label: t('RELEASE_STATUS'),
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'deploymentStatus',//部署状态
      label: '部署状态',
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'createTime', //创建时间
      label: t('CREATE_AT'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'version', //当前版本
      label: t('MODEL_VERSION'),
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'updateTime', //更新时间
      label: t('LAST_UPDATED'),
      align: 'center',
      minWidth: 120,
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 160,
      fixed:'right',
      buttons:(row)=>{
        const btns = [
          {
            name: '编辑',
            command: 'edit',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus =='未发布',
          },
          {
            name: '版本管理',
            command: 'version',
            type: 'primary',
            visibleWhen: (r) => true,
          },
          {
            name: '试用',
            command: 'ontrial',
            type: 'primary',
            visibleWhen: (r) => true,
          },
          {
            name: '发布',
            command: 'release',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus =='未发布',
          },
          {
            name: '调试',
            command: 'debug',
            type: 'primary',
            visibleWhen: (r) => true,
          },
          {
            name: '删除',
            command: 'del',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus =='未发布',
          },
        ]
        return btns.filter((btn) => btn.visibleWhen(row));
      }
    }
  ]
})
let isShowViewModelDetail = ref(false)
let isShowAddModel = ref(false)
let isShowVersionDialog = ref(false)
const router = useRouter()
const formData = ref({
  name: ''
})
// 列表查询
const onSearch = () => {
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}
    // 表格数据和分页
const tableData = ref<TableDataItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getModelMachineList({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
    searchWord: formData.value.name,
        applicableScenario:'',
        modelType:2,
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

// 试用按钮点击处理
const handleTrial = (row) => {
  if(row.subcateGory == '聊天助手' || row.subcateGory == 'Agent' || row.subcateGory == 'Chatflow'){
    currentModelId.value = row.id
    currentModelDetail.value = row
    isShowViewModelDetail.value = true
  } else{
    let url =  'http://10.198.0.137/apps'
    window.open(url)
  }

}
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
}

// 编辑模型
const handleEdit = (row: TableDataItem) => {
  isEditMode.value = true
  isShowAddModel.value = true
  currentModelDetail.value = row
  console.log(currentModelDetail.value,'vurr')
}


// 打开新增模型
const handleAdd = () => {
  isShowAddModel.value = true
  isEditMode.value = false
}
const handleCloseAddModel = ()=>{
  isShowAddModel.value = false
  isEditMode.value = false
  isRelease.value = false
  loadTableData()
}

// 打开版本管理
const handleVersion = (row) =>{
  isShowVersionDialog.value = true
  currentModelDetail.value = row
}
// 关闭版本管理弹窗
const handleCloseVerionDialog = ()=> {
  isShowVersionDialog.value = false
  loadTableData()
}
const isRelease = ref(false) //是否点击的发布
const onCommand = (command, row) => {
  switch (command) {
    case 'edit': //编辑
      handleEdit(row)
      break
    case 'version': //版本管理
      handleVersion(row)
      break
    case 'release': //发布
      handleRelease(row)
      break
    case 'ontrial': //试用
      handleTrial(row)
      break
    case 'debug': //调试
      handleDebug(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
  }
}
// 调试
const handleDebug = (row)=> {
  // let url = row.showUrl ? row.showUrl : ''
  let url =  'http://10.198.0.137/apps'
  window.open(url)
}
// 发布
const handleRelease = (row) => {
  isRelease.value = true
  isEditMode.value = true
  isShowAddModel.value = true
  currentModelDetail.value = row
}

/**
 * 删除
 * @param row
 */
const handleDelete = async (row: TableDataItem) => {
  ElMessageBox.confirm('确定删除当前模型版本?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    getModelMachineDel(row.id).then(res=>{
      if(res.success){
        loadTableData()
        ElMessage.success(res.message)
      }else{
        ElMessage.error(res.message)
      }
    })
  })
}
/**
 * 重置
 */
const handleReset = ()=>{
  formData.value.name = ''
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}
/**
 * 分页
 */
const handlePageChange = ()=>{
  loadTableData()
}
onMounted(() => {
  loadTableData() // 初始加载表格数据
})


</script>
<style scoped>
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
