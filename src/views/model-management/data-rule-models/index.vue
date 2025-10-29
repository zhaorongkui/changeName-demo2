<template>
  <div class="base-model detail-config" v-show="!isChildRoute">
    <div class="content-wrapper">
      <div class="content-title">
        <h3>数据规则模型</h3>
      </div>
      <div class="content-main">
        <div class="table-operate">
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
  <!--  新建模型-->
  <addModel v-if="isShowAddModel" @close="handleCloseAddModel" :isEditMode="isEditMode" :currentModeldetail="currentModelDetail" pageType="rule" :isRelease="isRelease"></addModel>
  <!--  版本管理-->
  <versionDialog v-if="isShowVersionDialog" @close="handleCloseVerionDialog" dataSet="dataSet" :isEditMode="true" pageType="rule" :currentModel="currentModel"></versionDialog>
  <!--  试用弹窗-->
<!--  <modelRuleTrial v-if="showAddModal" @close="handlCloseViewModelDetail" :currentModel="currentModel"></modelRuleTrial>-->
  <!--  发布弹窗-->
  <releaseDialog v-if="isShowReleaseDialog" @close="handleCloseRelease" :currentModel="currentModel"></releaseDialog>
<!--  试用跳数据规则编辑器-->
      <RuleModelEditor
        v-if="showAddModal"
        :isTry="isTryModal"
        :paramInList="paramInList"
        :editing-row="currentModel"
        @close="handleCloseModal"
        @save="handleSuccess"
      />
  <router-view :key="route.path"></router-view>
</template>

<script lang="ts" setup>
import {computed, defineComponent, nextTick, onMounted, ref} from 'vue'
import {  type TableDataItem } from './tableData'
import addModel from '@/views/model-develop/editor/components/add-model.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import versionDialog from '../../model-develop/editor/components/versionDialog.vue'
import { useI18n } from 'vue-i18n'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import RuleModelEditor from './components/RuleModelEditor.vue'
import releaseDialog from '@/views/model-develop/components/releaseDialog.vue'
import { getModelMachineDel, getModelMachineList,getModelDetail} from "~/api/modelManage";
import { useRoute,useRouter } from 'vue-router';
import {treeToArray} from "~/utils/array_func";
import {getOrgTree} from "~/api/org";
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('detail'));
const { t } = useI18n()
const isShowVersionDialog = ref(false)
const isShowViewModelDetail = ref(false)
const isShowAddModel = ref(false)
const isShowReleaseDialog = ref(false)
// 确保类型兼容
interface RuleForm {
  id?: string | number
  ruleName: string
  description: string
  metrics: string[]
  businessObject: string
  dataset: string
  formula?: string
}
const loading = ref(false)
const formData = ref({
  name: ''
})
const pageKey = 'data-rule-model'
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
      prop: 'modelId',
      label: '模型ID',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'modelName',
      label: '模型名称',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'version',
      label: '版本',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'notes',
      label: '模型描述',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'paramInStr',
      label: '输入参数',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'formula',
      label: '公式',
      align: 'center',
      minWidth: 200,
    },
    {
      prop: 'paramOutStr',
      label: '输出参数',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'applicableScenario',
      label: '应用场景',
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
      prop: 'owner',
      label: '创建组织',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'creator',
      label: '创建人',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      minWidth: 120,
    },
    {
      prop: 'updateTime',
      label: '最近更新时间',
      align: 'center',
      minWidth: 120,
    },
    {
      type: 'actions',
      label: t('OPERATION'),
      minWidth: 180,
      fixed:'right',
      buttons:(row) =>{
        const btns = [
          {
            name: '编辑',
            command: 'edit',
            type: 'primary',
            visibleWhen: (r) => r.releaseStatus =='未发布',
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
      },


    }
  ]
})
/**
 * 查询
 */
const onSearch = () => {
  // 搜索逻辑
  loadTableData()
}
/**
 * 重置
 */
const handleReset = ()=> {
 formData.value.name = ''
  tableConfig.value.paginationConfig.currentPage = 1
  loadTableData()
}
// 表格数据和分页
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模态框相关状态
const showAddModal = ref(false)
const isEditMode = ref(false)
const currentModel = ref<RuleForm & { id: string | number; dataset: string }>({
  id: '',
  ruleName: '',
  description: '',
  metrics: [],
  businessObject: '',
  dataset: '',
  formula: ''
})
const currentModelDetail = ref({})
// 加载表格数据
const loadTableData = () => {
  loading.value = true
  getModelMachineList({
        currentPage: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
    searchWord: formData.value.name,
        applicableScenario:'',
        modelType:3,
        sort:1,
      }
  ).then((res) => {
    if(res.success){
      tableData.value = res.data?.body || []
      tableConfig.value.paginationConfig.total = res.data.total || 0
    }else{
      ElMessage.error(res.msg)
    }
  }).finally(() => {
    loading.value = false
  })
}

// 分页
const handlePageChange = () => {
  loadTableData()
}
const isRelease = ref(false)
/**
 * 表格操作列
 * @param val
 */
const onCommand = (command, row) => {
  switch (command) {
    case 'version': //版本管理
      handleVersion(row)
      break
    case 'edit': //编辑
      handleEdit(row)
      break
    case 'ontrial': //试用
      handleTry(row)
      break
    case 'release': //发布
      handleRelease(row)
      break
    case 'del': //删除
      handleDelete(row)
      break
  }
}
/**
 * 发布
 * @param data
 */
const handleRelease = (row) => {
  isRelease.value = true
  isEditMode.value = true
  isShowAddModel.value = true
  currentModelDetail.value = row
  currentModel.value = row
}
/**
 * 关闭发布弹窗
 * @param row
 */
const handleCloseRelease = ()=> {
  isShowReleaseDialog.value = false
  loadTableData()

}
/**
 * 关闭试用弹窗
 */
const handlCloseViewModelDetail = ()=> {
  isShowViewModelDetail.value = false
  showAddModal.value = false
  loadTableData()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadTableData()
}

// 打开新建模型
const handleAdd = () => {
  isShowAddModel.value = true
  isEditMode.value = false
}
/**
 * 关闭新增模型抽屉
 */
const handleCloseAddModel = ()=> {
  isShowAddModel.value = false
  loadTableData()
}
// 打开编辑模态框
const availableMetrics = ref<string[]>(['COD', 'BOD', '氨氮', '总磷', '总氮', 'SS', 'pH值', '浊度'])
// 编辑模型
const handleEdit = (row: TableDataItem) => {
  isEditMode.value = true
  currentModel.value = {
    ...row
  }
  // showAddModal.value = true
  isShowAddModel.value = true
  currentModelDetail.value = row
  console.log(row,'row========')
}
// 版本管理
const handleVersion = (row) => {
  isShowVersionDialog.value = true
  currentModel.value = row
}
// 关闭版本管理
const handleCloseVerionDialog = () => {
  isShowVersionDialog.value = false
  loadTableData()
}
// 关闭模态框
const handleCloseModal = () => {
  isTryModal.value = false
  showAddModal.value = false
  loadTableData()
}

// 处理成功提交
const handleSuccess = () => {
  isTryModal.value = false
  loadTableData() // 重新加载表格数据
}

//试用
const isTryModal = ref(false)
const paramInList = ref([]) //输入参数
const handleTry = (row: TableDataItem) => {
  getModelDetail(row.id).then(res=>{
    if(res.success){
      currentModel.value = res.data
      paramInList.value = res.data.paramInList
      showAddModal.value = true

    }
  })
  isTryModal.value = true


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
// 获取水厂
const initData = async () => {
  const { data,success } = await getOrgTree({
    orgId:  '1',
    name:  undefined,
    orgType:  undefined,
    orgLevel: 4,
    isLogin: '2',
  });
  const resultList = Object.keys(data)?.length ? data : [];
  const arr: Organization[] = [];
  treeToArray(resultList, arr);
  const businessScopeOptions = arr.filter((item: Organization) => {
    delete item.children;
    return item.iotStatus == 1 && item.orgLevel == 4;
  });
  localStorage.setItem('businessScopeOptions',JSON.stringify(businessScopeOptions));
};
onMounted(() => {
  initData()
  loadTableData() // 初始加载表格数据
})
</script>
<style scoped>
.table-operate{
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
