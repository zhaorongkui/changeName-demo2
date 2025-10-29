<template>
  <div class="my-application detail-config">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>报表管理列表</h3>
      </div>
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" :rowItemMaxNumber="5" @on-search="handleFilterSearch"
                        @on-reset="handleFilterReset" @onClear="handleFilterClear">
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <div class="search-container" style="margin-bottom: 20px">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
        <div class="data-table-container" v-loading="isLoading">
          <be-table :is-lock="false" :table-data="tableData" :columns="tableColumns" :options="tableConfig"
                    @command="onCommand">
          </be-table>
        </div>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
                  v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
                  :list="tableData" :page-sizes="[10, 20, 30, 50]" @callback="handlePageChange" />
      </div>
    </div>
    <addDialog v-if="isShowDetail" @close="handleClose" :currentType="currentType" :isEdit="isEdit"></addDialog>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { DatasetType } from '@/types/dataSandbox'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getReportList,getDelType } from '@/api/backStageManage'
import { arrayToMap, getInitialValue } from "@/utils/index.ts";
import addDialog from './components/addDialog.vue'
const router = useRouter()
const { t } = useI18n()
const isEdit = ref(false)
const isShowDetail = ref(false)
// 表格数据和分页
const tableData = ref<DatasetType[]>([])
const currentModel = ref<DatasetType>()
// be-table columns 配置
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: t('INDEX'),
    align: 'center',
    width: 60
  },
  { prop: 'reportName', label: '报表名称', minWidth: 120 },
  { prop: 'reportType', label: '分类', minWidth: 100 },
  {
    prop: 'dataType',
    label: '关联数据分类',
    minWidth: 100,
  },
  { prop: 'reportDesc', label: '报表描述', minWidth: 100 },
  { prop: 'status', label: '状态', minWidth: 140,
    format: (row) =>{
      if(row.status ==1){
        return `启用`
      } else if(row.status == 2) {
        return `停用`
      }else{
        return '草稿'
      }
    }
  },
  { prop: 'createBy', label: '创建人', minWidth: 140 },

  {
    type: 'actions',
    label: t('OPERATION'),
    minWidth: 80,
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
      // {
      //   name: '预览',
      //   command: 'preview',
      //   type: 'primary'
      // },
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
 *
 */
const queryData = ref({
  reportType: '',
  reportName: '',
  dataType: '',
  status: null
})
const handleCheckedNodes = (nodes) => {
  queryData.value.orgId = nodes; // 同步到queryData,临时处理
};
const statusOptions = ref([])
const formItemList = ref([
  {
    type: 'input',
    label: '报表名称',
    paramKey: 'reportName',
    placeholder: '请输入名称',
    modelValue: queryData.value.reportName
  },
  {
    type: 'select',
    label: '分类',
    paramKey: 'reportType',
    placeholder: '请选择分类',
    modelValue: queryData.value.reportType,
    selectOptions: [
      {
        value: '水量',
        label: '水量',
      },
      {
        value: '电量',
        label: '电量',
      },
      {
        value: '污泥',
        label: '污泥',
      },
      {
        value: '药剂',
        label: '药剂',
      },
      {
        value: '水质',
        label: '水质',
      },
        ]
  },
  {
    type: 'input',
    label: '关联数据分类',
    paramKey: 'dataType',
    placeholder: '请输入名称',
    modelValue: queryData.value.dataType
  },

  {
    type: 'select',
    label: '状态',
    paramKey: 'status',
    placeholder: '请选择',
    modelValue: queryData.value.status,
    selectOptions: [
      {
        label:"启用",
        value:'1'
      },
      {
        label:"停用",
        value:'2'
      },
      {
        label:"草稿",
        value:'0'
      },
    ]
  },
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
    reportType: '',
    reportName: '',
    dataType: '',
    status: null
  }
  loadTableData()
}



const handlePageChange = () => {
  loadTableData()
}


const isLoading = ref(false)
// 获取数据集的列表
const loadTableData = (id?: string | number) => {
  isLoading.value = true
  getReportList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    reportName: queryData.value.reportName,
    reportType: queryData.value.reportType,
    dataType: queryData.value.dataType,
    status: queryData.value.status,
  })
      .then((res) => {
        if (res.success) {
          tableData.value = res.data.records
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

// 新增
const handleAdd = (row: DatasetType) => {
  isShowDetail.value = true
  isEdit.value =false
}
const currentType = ref({})
// 编辑
const handleDetail = (row: DatasetType) => {
  isShowDetail.value = true
  currentType.value = row
  isEdit.value = true
}
// 关闭新增弹窗
const handleClose = ()=> {
  isShowDetail.value = false
  isEdit.value =false
  loadTableData()
}
const onCommand = (command, row) => {
  switch (command) {
    case 'detail': //编辑
      handleDetail(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
    case 'preview': //预览
      handlePreview(row)
      break
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
    console.log(row,'row===')
    getDelType(row.id).then(res=>{
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
 * 预览
 */
const handlePreview = ()=> {

}

onMounted(() => {
  loadTableData() // 初始加载表格数据
})
</script>

<style lang="scss" scoped>


.table-operate {
  display: flex;
  justify-content: start;

}
:deep(.is-dark){
  max-width: 50%;
}
</style>
