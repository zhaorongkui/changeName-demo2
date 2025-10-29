<template>
  <el-dialog
      v-model="dialogVisible"
      title="选择变量"
      width="80%"
      @close="handleClose"
  >

    <div style="background: #fff;padding: 20px;display: flex;flex-direction: column;height: 70vh;">
      <div>
        <div >已选择变量：{{selectedFields.length}}</div>
        <div style="display: flex;overflow-x: scroll;padding-left: 10px">
          <div v-for="item in selectedFields" :key="item.id" class="field-item">
            <p class="title-icon">
              <span style="font-weight: bold">{{item.description}}</span>
              <span @click="handleDelFields(item)" class="icon-span"><el-icon size="18px"><Close /></el-icon></span>
            </p>
            <p> {{item.businessObject}}-{{item.businessDataType}} </p>
          </div>
        </div>
      </div>
      <div  style="display: flex;width: 100%;overflow: hidden;height: calc( 100% - 120px)">
        <div class="left-content">
          <div class="content-title-tree">{{  '数据目录'  }}</div>
          <div class="tree-content">
            <BusinessTree ref="businessTreeRef" @node-click="handleNodeClick" @getFirst="getFirst" pageType="rule" />

          </div>
        </div>
        <div class="middle-content">
          <div class="content-main" style="height: 100%">
            <div class="content-title">
              <h3>数据分类列表</h3>
            </div>
            <!-- 查询条件区域 -->

            <div  class="table-operate">
              <div class="search-form">
                <el-select v-model="formData.name" placeholder="请选择数据分类搜索" style="width: 240px">
                  <el-option
                      v-for="item in dataTypeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                  />
                </el-select>

                <el-button type="primary" @click="onSearch">查询</el-button>
                <el-button  @click="handleFilterReset">重置</el-button>
              </div>
            </div>
            <div class="content-main">
              <!-- 表格数据展示 -->
              <div class="data-table-container" v-loading="isLoading">
                <be-table :is-lock="false" :table-data="tableData"
                          :columns="tableColumns" :options="tableConfig" @current-change="handleCurrentChange"
                          />
              </div>
              <el-pagination
                  class="inline-block justify-end mt-1"
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="total"
                  @size-change="handlePageSizeChange"
                  @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
        <div class="right-content">
          <fieldComponent :currentDataTypeRow="currentDataTypeRow" @handleSelectField="handleSelectField" :selectedTableData="selectedFields" :delCount="delCount"></fieldComponent>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox, FormInstance} from 'element-plus'
import { getdataCatalog, getSelector } from '@/api/dataSet.ts'
import { selectAilabLogicalDataModel, deleteDataType, ailabLogicalDataModelDelete, selectBusinessObjectType } from '@/api/backStageManage.ts'
import BusinessTree from "~/views/data-sandbox/components/BusinessTree.vue";
import fieldComponent from "./fieldComponent.vue"
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant'
import {useRouter} from "vue-router";
import type {BusinessObjectType} from "~/types/dataSandbox";
import {Close, Search} from "@element-plus/icons-vue";
const currentTreeNodeId = ref('')
const tableConfig = ref({
  settingTable: false,
  tableId: `sdf-table`,
  height: '400',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 50
  },

  rowKey: `sdfId`
})
const selectedFields = ref([
])
const props = defineProps({
  metricsList:{ //编辑的时候回显变量选中
    default:[]
  },
  isEdit:{ //是否编辑
    default: false
  }
})
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const currentDataCatalog = ref({})
const router = useRouter()
const isLoading = ref(false)
const switchType = ref<'business' | 'topic'>('business')

const formData = ref({
  name: ''
})

const businessTreeRef = ref()
const currentNode = ref(null)

// 获取选择的变量
const handleSelectField = (data) => {
  console.log(data,'ddd')
  selectedFields.value = data
}
const delCount = ref(0)
// 删除已经选择的变量
const handleDelFields = ( val)=>{
  selectedFields.value = selectedFields.value.filter(item=> item.id !== val.id)
  delCount.value +=1
}
const onSearch = () => {

  getDataPageList(currentTreeNodeId.value)
}
// 重置
const handleFilterReset = () => {
  formData.value.name = ''
  currentTreeNodeId.value = 1
  getDataPageList(currentTreeNodeId.value)
}
const currentDataTypeRow = ref(null)
const handleCurrentChange = (row)=>{
  console.log(row,'row===')
  currentDataTypeRow.value = row
}
// 获取目录树的第一个节点的id
const getFirst = (id: string) => {
  currentTreeNodeId.value = id
  getDataPageList(currentTreeNodeId.value)
}
const dataTypeOptions = ref([])
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      dataTypeOptions.value = res.data.data_type.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const tableData = ref<BusinessObjectType[]>([])
// 获取数据目录的列表
const getDataPageList = (id: string | number) => {
  isLoading.value = true
  getdataCatalog({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    directory:  id ,
    topicName:  null,
    businessObject: '',
    businessObjectType: '',
    objectHierarchy: '',
    dataType: formData.value.name,
    dateDim: '',
    businessScenarios: '',
    dataModelName: '',
    type: 1
  })
      .then((res) => {
        if (res.success) {
          tableData.value = res.data.records
          total.value = res.data.total
        }
      })
      .finally(() => {
        isLoading.value = false
      })
}

// 切换分页
const handlePageChange = (val: number) => {
  currentPage.value = val
  getDataPageList(currentTreeNodeId.value)
}
const handlePageSizeChange = (val:number)=>{
  currentPage.value = 1
  pageSize.value = val
  getDataPageList(currentTreeNodeId.value)
}
// 切换树节点
const handleNodeClick = (data) => {
  currentNode.value = data
  currentTreeNodeId.value = switchType.value === 'business' ? data.id : data.name
  console.log(data, 'data====')
  getDataPageList(currentTreeNodeId.value)
}

const tableColumns = computed(() => {
  return [
    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center'
    },

    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'propertyCount',
      label: '包含指标数',
      align: 'center'
    },

  ]
})
const selectBusinessObjectTypeList = ref([])
// 获取业务实体下拉数据
const selectBusinessObject = (name) => {
  selectBusinessObjectType(name).then((res) => {
    console.log(res);
    if (res.success) {
      selectBusinessObjectTypeList.value = res.data.map(item => {
        return { id: item.id, name: item.catalogName }
      })
    }
  })
}
onMounted(() => {
  getSelectorData()
  selectBusinessObject('') // 业务实体下拉
})
const dialogVisible = ref(true)
const emits = defineEmits(['close','submit'])
const handleClose = (done: () => void) => {
  emits('close')
}
const handleSubmit = ()=>{
  if(selectedFields.value.length == 0){
    ElMessage.warning('请选择变量')
    return
  }else{
    emits('submit',selectedFields.value)
  }
}
</script>
<style scoped lang="scss">
.left-content {
  width: 200px;
  border-right: 1px solid #ccdde9;
  padding-right: 10px;
  overflow-x: scroll;
  .content-title-tree{
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 15px;
  }
  .tree-content{
    width: 100%;
    height: calc( 100% - 45px);
    overflow: auto;
  }
  .catalog-tree {
    flex: 1;
    overflow-y: auto;
  }
}
.content-title{
  margin-bottom: 10px !important;
}
.middle-content{
  margin-left: 10px;
  flex: 1;
  border-right: 1px solid #ccdde9;
  padding-right: 10px;
  .table-operate{
    justify-content: end;
  }
}
.right-content{
  flex: 1;
  margin-left: 10px;
  height: 100%;
}
.field-item{
  margin-right: 10px;
  border-radius: 5px;
  box-shadow:0 0 6px 0 rgba(0, 0, 0, .38);
  padding: 10px;
  margin-bottom: 10px;
  min-width: 160px;
  margin-top: 10px;
  .title-icon{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon-span{
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
:deep(.el-tree){
  min-width: 100%;
  width: 100%
};
</style>
<style>
.table-search-type  .el-form-item {
  flex-direction: row !important;
}
</style>
