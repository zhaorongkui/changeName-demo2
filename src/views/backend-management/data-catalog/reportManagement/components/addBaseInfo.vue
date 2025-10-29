<template>
  <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
      label-position="top"
  >
    <el-form-item label="报表名称" prop="reportName">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.reportName"  />
    </el-form-item>
    <el-form-item label="分类" prop="reportType" >
      <el-select v-model="ruleForm.reportType" placeholder="请选择" >
        <el-option
            v-for="item in reportTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="ruleForm.status" placeholder="请选择"  >
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="创建人"  >
      <el-input placeholder="请输入" v-model="ruleForm.createBy"  disabled/>
    </el-form-item>
    <el-form-item label="报表描述" prop="reportDesc">
      <el-input  v-model="ruleForm.reportDesc"  :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" />
    </el-form-item>

  </el-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import { getBasicInfo } from '@/api/backStageManage'
const dialogVisible = ref(false)
interface RuleForm {
  reportName: string
  reportType: string
  reportDesc: string
  createBy?:string
  status?:string
}
const props = defineProps({

  isEdit:{
    reportType: Boolean,
    default: false
  },

  currentType:{
    reportType:Object,
    default: ()=> {}
  },

})
const statusOptions = ref([
  {
    value: '1',
    label: '启用',
  },
  {
    value: '2',
    label: '停用',
  },
  {
    value: '0',
    label: '草稿',
  },
])
const reportTypeOptions =ref([
  {
    value: 1,
    label: '水量',
  },
  {
    value: 2,
    label: '电量',
  },
  {
    value: 3,
    label: '污泥',
  },
  {
    value: 4,
    label: '药剂',
  },
  {
    value: 5,
    label: '水质',
  },
])


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref<RuleForm>({
  reportName: '',
  reportType: '',
  reportDesc: '',
  createBy: '',
  status:'',
})
const rules = reactive<FormRules<RuleForm>>({
  reportName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],

  reportType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  reportDesc: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})





watch(()=>props.currentType,val =>{
  console.log(val,props.isEdit,'val========')
  if(props.isEdit){
    getBasicInfo(val.id).then(res => {
      if(res.success){
        ruleForm.value.reportName = res.data.reportName
        ruleForm.value.reportDesc = res.data.reportDesc
        ruleForm.value.reportType = res.data.reportType
        ruleForm.value.status = res.data.status
        ruleForm.value.createBy = res.data.createBy
      }
    })
  }
},{deep:true,immediate:true})


onMounted(()=>{
  // getTagData()
  if(!props.isEdit){
    ruleForm.value.createBy = localStorage.getItem('app') ? JSON.parse(localStorage.getItem('app')).userInfo.username : ''
  }

})
defineExpose({
  ruleFormRef,
  ruleForm
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
