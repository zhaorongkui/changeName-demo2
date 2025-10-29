<template >
  <div style="margin-top: 20px;width: 65%">
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      status-icon
      label-position="right"
  >
    <el-form-item label="任务名称" prop="taskName" label-width="80px">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.taskName"  />
    </el-form-item>
    <el-form-item label="选择模型" prop="modelName" label-width="80px">
      <el-input
          v-model="ruleForm.modelName"
          style="width: 80%; margin-right: 20px"
          placeholder="请选择"
          :readonly="true"
      />
      <el-button type="primary" v-if="pageType !='machine'"  @click="handleSelectModel">选择模型</el-button>

    </el-form-item>
    <el-form-item label="模型版本" prop="version" label-width="80px">
      <el-input
          v-model="ruleForm.version"
          style="width: 80%; margin-right: 20px"
          placeholder="请选择"
          :readonly="true"
      />
      <el-button type="primary"   @click="handleSelectVersion">选择版本</el-button>
    </el-form-item>
    <el-form-item label="选择数据集" prop="dataSetName" label-width="100px">
      <el-input
          v-model="ruleForm.dataSetName"
          style="width: 80%; margin-right: 20px"
          placeholder="请选择"
          :readonly="true"
      />
      <el-button type="primary"  @click="handleSelectDataset">选择数据集</el-button>
    </el-form-item>

    <el-form-item label="参数配置（JSON格式）" prop="inputJson" label-width="180px">
      <el-input  v-model="ruleForm.inputJson"  :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" />
    </el-form-item>
    <el-form-item label="任务资源配置" prop="resource" label-width="80px">
      <el-table :data="tableData" style="width: 100%" max-height="400px">
        <el-table-column width="60">
          <template #default="{ row }">
            <el-radio
                v-model="selectedResource"
                :label="row.name"
                @change="handleResourceChange(row)"
            />
          </template>
        </el-table-column>

        <!-- 名称列 -->
        <el-table-column prop="name" label="名称" width="120">
          <template #default="{ row }">
            <div class="resource-name">
              <span class="name-text">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 规格列 -->
        <el-table-column label="规格" min-width="200">
          <template #default="{ row }">
            <div class="spec-text">{{ row.specification }}</div>
          </template>
        </el-table-column>

        <!-- 价格列 -->
        <el-table-column label="价格" width="280">
          <template #default="{ row }">
            <div class="price-info">
              <span v-if="row.price" class="price-amount">{{ row.price }}</span>
              <span v-if="row.freeInfo" class="free-info">{{ row.freeInfo }}</span>
              <span v-if="row.freeLimit" class="free-limit">{{ row.freeLimit }}</span>
              <span v-if="row.promotion" class="promotion-free">{{ row.promotion }}</span>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-form-item>
  </el-form>
   </div>
  <selectModel v-if="isShowSelectModel" @close="handleCloseSelectModel" @submitSelectModel="submitSelectModel"></selectModel>
  <selectVersion v-if="isShowSelectVersion" :currentModel="currentModel" :isEditMode="true" @close="handleCloseVersion" @submitSelectModel="submitSelectVersion"></selectVersion>
  <selectDataset v-if="isShowDataset" @close="handleCloseDataset" @submit="handleSubmitDataset"></selectDataset>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import type {DataTableItem, TableConfig} from "~/types/modelManagement";
import selectModel from'./selectModel.vue'
import selectVersion  from './selectVersion.vue'
import selectDataset from './selectDataset.vue'
import { useI18n } from 'vue-i18n'
import {getModelDetail} from "~/api/modelManage";
const { t } = useI18n()
const selectedResource = ref(null)
const isShowDataset = ref(false)
const isShowSelectModel = ref(false)
const isShowSelectVersion = ref(false)
const props = defineProps({
  pageType:{
    type: String,
    default: ''
  },
  currentModel:{
    type:Object,
    default: ()=> {}
  },

})
const addTagName = ref([])
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
      prop: 'datasetsId',
      label: '数据集ID',
      align: 'center'
    },
    {
      prop: 'name',
      label: '数据集名称',
      align: 'center'
    },
    {
      prop: 'dataVolume',
      label: '数据规模',
      align: 'center'
    },
    {
      prop: 'ldmName',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'orgDimension',
      label: '组织维度',
      align: 'center'
    },
    {
      prop: 'timeRange',
      label: '时间范围',
      align: 'center'
    },
  ]
})
const tableConfig = ref<TableConfig>({
  settingTable: false,
  tableId: 'add-dataset-table',
  height: 'auto',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: 'id'
})
const tableData = ref([
  {
    name: 'GPU V100',
    specification: 'TeslaGPU_V100_32GB 显存单卡_8核_CPU_32GB 内存',
    price: '¥0.5/分钟',
    freeInfo: '当前账户前 28.22 (小时*节点) 免费',
    promotion: ''
  },
  {
    name: 'CPU 2 核',
    specification: 'CPU 2 核 8GB 内存',
    price: '',
    freeInfo: '',
    promotion: '限时免费'
  }
])

const currentModel = ref({})

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  taskName: '', // 任务名称
  modelName:'',//模型名称
  dataSetId: '',
  dataSetName: '',
  modelId:'',//模型id
  inputJson:'',
  resource:'',//资源
  version: '', //版本
  status:1,
})

const rules = reactive({
  modelName: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
  taskName: [
    { required: true, message: '请输入', trigger: 'change' },
  ],
  version: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
  dataSetName: [
    { required: true, message: '请选择', trigger: 'change' },
  ],
  inputJson: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  resource: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
})
// 选择模型
const handleSelectModel = ()=> {
  isShowSelectModel.value = true
}
const handleCloseSelectModel = ()=> {
  isShowSelectModel.value = false
}
const submitSelectModel = (row) => {
  console.log(row.modelName,'row====')
  ruleForm.value.modelName = row.modelName
  ruleForm.value.modelId = row.id
  currentModel.value = row
}
// 选择版本
const handleSelectVersion = ()=> {
  isShowSelectVersion.value = true
}
const handleCloseVersion = ()=> {
  isShowSelectVersion.value = false
}
// 选择版本确定
const submitSelectVersion = (row) =>{
  ruleForm.value.version = row.version
}
// 选择数据集
const handleSelectDataset = ()=> {
   isShowDataset.value = true
}
const handleCloseDataset = ()=> {
  isShowDataset.value = false
}
// 选择数据集确定
const handleSubmitDataset = (data) =>{
  ruleForm.value.dataSetName = data.map(item => item.name).join(',')
  ruleForm.value.dataSetId = data.map(item => item.id).join(',')
}

// 选择资源配置
const handleResourceChange = (row)=> {
  ruleForm.value.resource = row.name
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const handleChange = (value) => {
}

// 机器学习模型跳过来默认回显 无需选择
watch(()=>props.pageType,val=>{
  if(val && val =='machine'){
    console.log(props.currentModel,'currentModels')
    ruleForm.value.modelName = props.currentModel.modelName
    ruleForm.value.modelId = props.currentModel.id
    ruleForm.value.version = props.currentModel.version;
    // getModelDetail(props.currentModel.id).then(res=>{
    //   if(res.success){
    //       if(res.data.dataSetList.length>0){
    //         ruleForm.value.dataSetName = res.data.dataSetList.map(item => item.name).join(',')
    //         ruleForm.value.dataSetId = res.data.dataSetList.map(item => item.id).join(',')
    //       }
    //   }
    // })

  }
},{deep:true,immediate:true})


onMounted(()=>{

})
defineExpose({
  ruleFormRef,
  ruleForm,
})
</script>
<style scoped>

.add-tag-content{
  background: #fff;
  display: flex;
  padding:  20px;
  height: 100px;
  align-items: center;
}
</style>
