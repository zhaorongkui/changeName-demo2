<template>
  <div class="base-model detail-config" v-show="!isChildRoute">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>机器学习模型列表</h3>
      </div>
      <div class="content-main">
        <div class="search-container">
          <el-button type="primary" @click="handleAdd">新建模型</el-button>
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
  <addModel v-if="isShowAddModel" @close="handleCloseAddModel" :isEditMode="isEditMode" :currentModeldetail="currentModel" pageType="machine" :isRelease="isRelease"></addModel>
 <!--  版本管理-->
  <versionDialog v-if="isShowVersionDialog" @close="handleCloseVerionDialog"  :isEditMode="true" :currentModel="currentModel" pageType="machine"></versionDialog>
  <!--  试用弹窗-->
  <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail" :currentModelMachine="currentModel" :currentModelId="currentModelId" pageType="machine"></viewModelDetail>
<!--  发布弹窗-->
  <releaseDialog v-if="isShowReleaseDialog" @close="handleCloseRelease" :currentModel="currentModel"></releaseDialog>
  <router-view :key="route.path"></router-view>
<!--  新增训练-->
  <addTask v-if="isShowAddTask" @close="handleCloseAddTask" :currentModel="currentModel" pageType="machine"></addTask>
<!--  训练结果-->
  <trainResult v-if="isShowResult" @close="handleCloseResult" :currentModelId="currentModel.id"></trainResult>
</template>

<script lang="ts" setup>
import { computed,  onMounted, ref } from 'vue'
import {  type TableDataItem } from './tableData'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import versionDialog from '../editor/components/versionDialog.vue'
import addModel from '../editor/components/add-model.vue'
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import trainResult from '@/views/model-develop/machine-learning/components/trainResults.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import {getModelMachineList, getModelMachineDel, getJudgeModelTrain} from "~/api/modelManage";
import releaseDialog from '../components/releaseDialog.vue'
import { useRoute,useRouter } from 'vue-router';
import addTask from '@/views/model-evaluation/model-train/components/addTask.vue'
const isShowResult = ref(false)
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('detail'));
const { t } = useI18n()
const isEditMode = ref<boolean>(false)
const currentModel = ref({})
const isShowAddTask  = ref(false)
const loading = ref(false)
const isShowReleaseDialog = ref(false)
const currentModelId = ref(null)
const pageKey = 'model-develop-machine-learning'
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
// 表格列配置
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
      align: 'center'
    },
    {
      prop: 'modelName',//模型名称
      label: t('MODEL_NAME'),
      minWidth: 120,
      align: 'center'
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
      // label: 'fenlei',
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'paramInStr',//输入参数
      label: t('INPUT_PARAMETERS'),
      minWidth: 120,
      align: 'center'
    },

    {
      prop: 'paramOutStr',//输出参数
      label: t('OUTPUT_PARAMETERS'),
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'applicableScenario',//应用场景
      label: t('APPLICABLE_SCENARIO'),
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'paramEva', //评估指标
      label: t('EVALUATION_METRICS'),
      minWidth: 120,
      align: 'center'
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
      minWidth: 120,
      align: 'center'
    },
    {
      prop: 'version', //当前版本
      label: t('MODEL_VERSION'),
      minWidth: 80,
      align: 'center'
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
      minWidth: 180,
      fixed: 'right',
      buttons:(row) =>{
        const btns = [
          {
            name: '编辑',
            command: 'edit',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus =='未发布',
          },
          {
            name: '训练',
            command: 'debug',
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
            name: '版本管理',
            command: 'version',
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
// 试用弹窗
const isShowViewModelDetail = ref(false)
// 新增弹窗
const isShowAddModel = ref(false)
// 版本管理
const isShowVersionDialog = ref(false)
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
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

// 试用按钮点击处理
const handleTrial = (row: TableDataItem) => {
  console.log('试用模型:', row)
  currentModelId.value = String(row.id)
  currentModel.value = row
  isShowViewModelDetail.value = true
}
// 关闭试用
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
}
/**
 * 新建模型
 */
const handleAdd = () => {

  isEditMode.value = false
  isShowAddModel.value = true
}
/**
 * 关闭新建模型
 */
const handleCloseAddModel = () => {
  isShowAddModel.value = false
  isEditMode.value = false
  isRelease.value = false
  loadTableData()
}
/**
 * 编辑模型
 * @param row
 */
const handleEdit = (row: TableDataItem) => {
  isEditMode.value = true
  isShowAddModel.value = true
  currentModel.value = row
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
 * 版本管理
 */
const handleVersion = (row: TableDataItem)=>{
  isShowVersionDialog.value = true
  currentModel.value = row
}
/**
 * 关闭版本管理
 */
const handleCloseVerionDialog = ()=> {
  isShowVersionDialog.value = false
  loadTableData()
}
/**
 * 表格操作列
 * @param command
 * @param row
 */
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
    case 'debug': //训练
        handleDebug(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
  }
}
const isRelease = ref(false)
/**
 * 发布
 * @param data
 */
const handleRelease = (row) => {
  isRelease.value = true
  isEditMode.value = true
  isShowAddModel.value = true
  currentModel.value = row
}
// 关闭发布弹窗
const handleCloseRelease = ()=> {
  isShowReleaseDialog.value = false
  loadTableData()
}
/**
 * 训练
 */
const handleDebug = (row)=>{
  currentModel.value = row
  getJudgeModelTrain(row.id).then(res=>{
    if(res.success){
      if(res.data ==1 ){ // 返回0是没有运行中，1是有运行中
        ElMessage.warning('当前模型正在训练中')
      }else{
        isShowAddTask.value = true

      }
    }
  })
}
const handleCloseAddTask = ()=>{
  isShowAddTask.value = false
  currentModel.value = {}
}
const handleCloseResult = ()=>{
  isShowResult.value = false
  currentModel.value = {}
}
/**
 * 重置
 */
const handleReset = ()=>{
  formData.value.searchWord = ''
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}
/**
 * 分页
 */
const handlePageChange =  ()=> {
  loadTableData()
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
