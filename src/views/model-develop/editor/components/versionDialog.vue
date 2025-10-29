<template>
  <el-dialog v-model="dialogVisible" title="版本管理" width="70%" @close="handleClose" destroy-on-close :close-on-click-modal="false">
    <div class="bg-white p-3 px-7" >
      <div class="table-search">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="版本别名">
          <el-input
              v-model="versionAlias"
              style="width: 240px"
              placeholder="请输入"
              clearable
              :prefix-icon="Search"
          />
        </el-form-item>
      </el-form>
        <span>
         <el-button type="primary"  @click="handleSearch">查询</el-button>
         <el-button  @click="handleReset">重置</el-button>
          </span>
        </div>
      <el-button type="primary"  @click="handleAddVersion" class="add-version-btn">版本更新</el-button>
      <div class="data-table-container" v-loading="loading">
        <be-table
            :is-lock="false"
            :table-data="tableData"
            :columns="tableColumns"
            :options="tableConfig"
            @command="onCommand"
        >
        </be-table>
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
<!--    部署-->
<!--    <deployModelDialog v-if="isShowDeploy" :deployObjectCurrent="deployObjectCurrent" @close="handleCloseDeploy"></deployModelDialog>-->
<!--    编辑-->
<!--    <editVersion  v-if="isShowEditVersion" @close="handleCloseEditVersion"></editVersion>-->
    <!--  查看模型试用弹窗-->
    <viewModelDetail v-if="isShowViewModelDetail" @close="handlCloseViewModelDetail"></viewModelDetail>
<!--    版本更新-另存为新版本-->
    <addModel v-if="isShowAddModel" @close="handleCloseAddModel" :isEditMode="false" :pageType="pageType" :currentModeldetail="currentModelDetail" :isVersion="true"></addModel>
  </el-dialog>

</template>
<script setup lang="ts">
import {ref, watch, nextTick, computed, onMounted} from 'vue'
import type { Action } from 'element-plus'
import { ElMessage, FormRules ,ElMessageBox} from 'element-plus'
import deployModelDialog from './deployModelDialog.vue'
import editVersion from './editVersion.vue'
import { mockVersionTableData, type TableDataVersionItem } from './tableData'
import {Search} from "@element-plus/icons-vue";
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import {useRouter,useRoute} from "vue-router";
import {
  getModelMachineDel,
  getPageVersion, getVersionControUnpublish,
} from '@/api/modelManage'
import viewModelDetail from '@/views/model-management/viewModeldetail.vue'
import addModel from '@/views/model-develop/editor/components/add-model.vue'
const route = useRoute()
const isShowViewModelDetail = ref(false)
const versionAlias =ref('')
const isShowDeploy =ref(false)
const isShowEditVersion =ref(false)
const isShowAddModel = ref(false)
const currentModelDetail = ref({})
const loading = ref(false)
// 模型接口
const tableData = ref([])
const tableColumns = computed(() => {
 let columsData = [
    {
      type: 'index',
      prop: 'index',
      label: '序号',
      align: 'center',
      width: 60
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center',
      minWidth: 120
    },
    {
      prop: 'aliasName',
      label: '版本别名',
      align: 'center',
      minWidth: 120
    },

    {
      prop: 'releaseStatus',
      label: '版本状态',
      align: 'center',
      minWidth: 120,
      format: (row) =>{
        if(row.releaseStatus =='已发布'){
          return `<span class="status-badge published">已发布</span>`
        } else {
          return `<span class="status-badge unpublished">未发布</span>`
        }
      }
    },
    {
      prop: 'deploymentStatus',
      label: '部署状态',
      align: 'center',
      minWidth: 120,
      format: (row) =>{
        if(row.deploymentStatus =='已部署'){
          return `<span class="status-badge deployed">已部署</span>`
        } else if (row.deploymentStatus =='未部署'){
          return `<span class="status-badge unpublished">未部署</span>`
        }
      }
    },
    {
      prop: 'notes',
      label: '版本描述',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'developLanguage',
      label: '编程语言',
      align: 'center',
      minWidth: 100
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      minWidth: 120
    },
    {
      prop: 'updateTime',
      label: '最近操作时间',
      align: 'center',
      minWidth: 120
    },
    {
      type: 'actions',
      label: '操作',
      fixed:'right',
      minWidth: 160,
      buttons: (row) => {
        const btns = [
          {
            name: '查看',
            command: 'viewModel',
            type: 'primary',
            visibleWhen: (r) => true,
          },
          {
            name: '另存为新版本',
            command: 'verificationModel',
            type: 'primary',
            visibleWhen: ( ) => true ,
          },
          {
            name: '取消发布',
            command: 'cancelPublishing',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus === '已发布',
          },
          {
            name: '删除',
            command: 'del',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus !=='已发布' && r.deploymentStatus !=='已部署' ,
          },
        ];

        return btns.filter((btn) => btn.visibleWhen(row));
      }
    }
  ]
  if(props.pageType =='machine'){
    return columsData
  }else {
    return columsData.filter( item => item.prop !='developLanguage')
  }
})
// 定义组件暴露的事件
const emit = defineEmits(['close','confirmNext'])
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  dataSet:{
    type: String,
    default:null
  },
  currentModel:{  //当前模型-父组件传过来的
    type: Object,
    default: {}
  },
  isEditMode:{
    type:Boolean,
    default:true
  },
  pageType:{
    type:String,
    default:''
  },
})
const pageKey = 'version-dialog'
/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '280px',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  maxHeight:'280px',
  rowKey: `${pageKey}Id`
})
// 对话框可见状态
const dialogVisible = ref(true)
// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getPageVersion({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
          aliasName: versionAlias.value,
         modelId: props.currentModel.modelId,
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

 const handleClose = ()=> {
  emit('close')
 }
const handleReset = ()=> {
  versionAlias.value = ''
  loadTableData()
}
// 查询
const handleSearch = ()=> {
  loadTableData()
}

//     分页
const handlePageChange = () => {
  loadTableData()
}
const deployObjectCurrent = ref({})
const router = useRouter()
// 操作列
const onCommand = (command, row) => {
  switch (command) {
    case 'viewModel': //查看模型
        handleSeeModel(row)
      break;
    case 'deploy':  //部署
      isShowDeploy.value = true
      deployObjectCurrent.value = row
      break;
    case 'cancelPublishing': //取消发布
      cancelPublishing(row)
      break;
    case 'verificationModel': //另存为新版本
      handleAddVersion(row)
      break;
    case 'edit': //编辑’
        isShowEditVersion.value = true
      break;
    case 'del': //删除
      handleDelete(row)
      break;
    // case 'release': //发布
    //     handleRelease(row)
    //   break;

  }
}
/**
 * 删除
 * @param row
 */
const handleDelete = async (row) => {
  ElMessageBox.confirm('确定删除当前数据?', '提示', {
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
// 查看
const handleSeeModel = (row)=> {
  handleClose()
  let pathName = ''
  switch(props.pageType) {
    case 'machine':
      pathName = 'model-learning-detail'
      break;
    case 'agent' :
      pathName = 'model-agent-detail'
          break;
      case 'rule' :
        pathName = 'model-rule-detail'
          break;
  }
    router.push({
      // path: '/model-develop/machine/learning/model-detail',
      name: pathName,
      query: {
        modelId: row.id,
        versionState: '1',
      }
    })

}
// 发布
const handleRelease = (row)=> {
  ElMessageBox.confirm(
      `是否发布当前 ${row.version} 模型？<br>版本别名：${row.versionAlias}`,
      '请确认', // 弹窗标题
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true, // ✅ 允许 HTML 字符串，<br> 才会生效
      }
  )
      .then(() => {
        // ✅ 用户点击了【确定】
        // 在这里添加 确定后要执行的逻辑，比如提交表单、删除数据等
        console.log('点击了确定')
      })
      .catch(() => {
        // ✅ 用户点击了【取消】 或 点击了遮罩、ESC等关闭弹窗
        // 在这里添加 取消后要执行的逻辑，比如什么都不做，或者回滚状态
        console.log('点击了取消')
      })
}
// 取消发布
const cancelPublishing = (row) => {
  ElMessageBox.confirm(
      `是否取消发布当前 ${row.version}  版本模型？`,
      '请确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
  )
      .then(() => {
        getVersionControUnpublish(row.id).then(res=>{
          if(res.success){
            ElMessage.success(res.message)
            loadTableData()
          }else{
            ElMessage.error(res.message)
          }
        })
      })
}

// 关闭查看模型弹窗
const handlCloseViewModelDetail = ()=>{
  isShowViewModelDetail.value = false
}

// 打开版本更新弹窗
const handleAddVersion = ()=> {
  isShowAddModel.value = true
}
const handleCloseAddModel = ()=>{
  isShowAddModel.value = false
  loadTableData()
  setTimeout(()=>{
    currentModelDetail.value = tableData.value.length ? tableData.value[tableData.value.length-1] : {}
    console.log(currentModelDetail.value,'value===')
  },300)
}

onMounted(()=>{
  currentModelDetail.value = props.currentModel
  loadTableData()
})
</script>
<style scoped lang="postcss">
.table-search{
  width: 100%;
  @apply flex justify-between;
  .table-search-item{
    @apply flex ;
  }

}
.add-version-btn{
  margin-bottom: 10px;
}
:deep(.status-badge){
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
}
:deep(.status-badge.published) {
  background-color: #f0f9eb;
  color: #68C23A;
}
:deep(.status-badge.unpublished) {
  background-color: #f4f4f5;
  color: #919399;
}
:deep(.status-badge.deployed) {
  background-color: #ecf5ff;
  color: #409EFF;
}
:deep(.el-popper) {
  z-index: 4000 !important;
}
</style>


