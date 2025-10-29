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
    <el-form-item label="模型名称" prop="name">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.name" :disabled="isEditMode || isVersion" />
    </el-form-item>
    <el-form-item label="模型类型" prop="modelType" >
      <el-select v-model="ruleForm.modelType" placeholder="请选择" disabled>
        <el-option
            v-for="item in modelTypeOptionsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="分类" prop="subcateGory" v-if="ruleForm.modelType !== '智能体' && ruleForm.modelType !== '数据规则模型'">
      <el-select v-model="ruleForm.subcateGory" placeholder="请选择"  :disabled="isEditMode || isVersion">
        <el-option
            v-for="item in subcateGoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="分类" prop="subcateGory" v-if="ruleForm.modelType == '智能体'">
      <el-select v-model="ruleForm.subcateGory" placeholder="请选择"  :disabled="isEditMode || isVersion">
        <el-option
            v-for="item in agentSubcateGoryOptionso"
            :key="item.value"
            :label="item.label"
            :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="后端服务API" prop="difyApi" v-if="ruleForm.modelType == '智能体'">
      <el-input  placeholder="请输入" v-model="ruleForm.difyApi"  />
    </el-form-item>
    <el-form-item label="API秘钥" prop="difyKey" v-if="ruleForm.modelType == '智能体'">
      <el-input  placeholder="请输入" v-model="ruleForm.difyKey"  />
    </el-form-item>
    <el-form-item label="版本" prop="version" v-if="isEditMode || isVersion">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.version"  disabled/>
    </el-form-item>
    <el-form-item label="版本别名" prop="aliasName" v-if="isVersion">
      <el-input maxlength="50"  show-word-limit placeholder="请输入" v-model="ruleForm.aliasName"  />
    </el-form-item>

    <el-form-item label="模型所有者" prop="owner">
      <el-select v-model="ruleForm.owner" placeholder="请选择">
        <el-option
            v-for="item in ownerOptionsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="编程语言" prop="developLanguage" v-if="ruleForm.modelType !== '智能体' && ruleForm.modelType !== '数据规则模型'">
      <el-input maxlength="50"  show-word-limit v-model="ruleForm.developLanguage" placeholder="请输入"  />
    </el-form-item>
    <el-form-item label="模型适用场景" prop="applicableScenario">
      <el-tree-select
          v-model="ruleForm.applicableScenario"
          :data="modelApplicableOptions"
          :render-after-expand="false"
          show-checkbox
          multiple
          collapse-tags
          collapse-tags-tooltip
          @change="handleChange"
      />
    </el-form-item>
    <el-form-item label="模型描述" prop="notes">
      <el-input  v-model="ruleForm.notes" maxlength="500" :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" show-word-limit/>
    </el-form-item>
    <el-form-item label="标签" prop="label">
      <div class="tag-selector">
        <el-tag
            v-for="(tag, index) in availableTags"
            :key="index"
            type="info"
            closable
            style="margin-right: 8px; margin-bottom: 8px; "
            @close="handleTagClose(index)"
        >
          {{ tag.tagName }}
        </el-tag>
        <div>
          <el-button class="button-new-tag ml-1" size="small" type="primary" plain  @click="addTag">
            + 添加标签
          </el-button>
        </div>

      </div>
    </el-form-item>
    <el-form-item label="使用说明" prop="instructions" v-if="isRelease">
      <el-input  v-model="ruleForm.instructions"  :autosize="{ minRows: 4, maxRows: 5 }" type="textarea" placeholder="请输入此版本模型的试用说明" />
    </el-form-item>
  </el-form>
  <el-dialog
      v-model="dialogVisible"
      title="添加标签"
      width="30%"
      :close-on-click-modal="false"
  >
    <div class="add-tag-content">
      <label>标签名称：</label>
      <el-select
          v-model="addTagName"
          filterable
          default-first-option
          placeholder="请选择或输入"
          clearable
          multiple
          collapse-tags
          collapse-tags-tooltip
          size="small"
          style="width: 80%"
      >
        <!--          allow-create-->

        <el-option
            v-for="item in commonTags"
            :key="item.value"
            :label="item.tagName"
            :value="item.id"
        />
      </el-select>
    </div>
    <template #footer>
      <span class="dialog-footer">
          <el-button type="primary" @click="submitAddTag">
          确定
        </el-button>
        <el-button @click="closeDialog">取消</el-button>

      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import { modelApplicableOptions,subcateGoryOptions,agentSubcateGoryOptionso } from '@/utils/constant'
import { tagPage } from '@/api/tag'
import {getAllModelArranges} from "~/api/modelManage";
const propsCascader = { multiple: true }
const dialogVisible = ref(false)
interface RuleForm {
  name: string
  modelType: string
  modelOpen?: string
  owner: string
  developLanguage: string
  applicableScenario: string[]
  notes: string
  availableTags?: any
  version?:string
  aliasName?:string
  subcateGory?:string
  avaiTags?:string
  difyKey?: string
  difyApi?: string
}
const props = defineProps({
  pageType:{
    type: String,
    default: ''
  },
  isEditMode:{
    type: Boolean,
    default: false
  },
  isVersion:{
    type: Boolean,
    default: false
  },
  currentModeldetail:{
    type:Object,
    default: ()=> {}
  },
  isRelease:{
    type: Boolean,
    default: false
  }
})
const addTagName = ref([])
const arrangeIdOptions = ref([])

const modelTypeOptionsoptions = ref([
  {
    value: '1',
    label: '机器学习',
  },
  {
    value: '2',
    label: '智能体',
  },
  {
    value: '3',
    label: '数据规则模型',
  },
])


const ownerOptionsoptions =ref([
  {
    value: '1',
    label: '个人',
  },
  {
    value: '2',
    label: '所在组织',
  },
])
const commonTags = ref([])
// 已选择的标签
const availableTags = ref([])
/**
 * 新建标签
 */
const addTag = ()=> {
  dialogVisible.value = true
  addTagName.value = availableTags.value.map(item => item.id)
}
/**
 * 关闭新建标签弹窗
 */
const closeDialog = ()=>{
  dialogVisible.value = false
  addTagName.value =[]
}
/**
 * 确定添加tag标签
 */
const submitAddTag = ()=> {
  if(addTagName.value.length == 0){
    ElMessage.warning('请选择标签')
    return
  }else{
    availableTags.value = commonTags.value.filter(tag => addTagName.value.includes(tag.id))
    ruleForm.value.availableTags = availableTags.value
    closeDialog()
  }
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  name: '',
  modelType: '',
  owner: '',
  developLanguage: '',
  applicableScenario: [],
  notes: '',
  availableTags:[],
  version:'',//当前版本
  aliasName:'',//版本别名
  subcateGory:'',//二级分类
  avaiTags:[] , //tagID
  instructions:'',//使用说明
  difyKey:'',//API秘钥
  difyApi: '',//后端服务API
  selectOption:{},
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  aliasName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  difyKey: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  difyApi: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  modelType: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  subcateGory: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  owner: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  developLanguage: [
    {
      required: true,
      message: '请输入',
      trigger: 'change',
    },
  ],
  applicableScenario: [
    {
      required: true,
      message: '请选择',
      trigger: 'change',
    },
  ],
  notes: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  instructions: [
    { required: true, message: '请输入', trigger: 'blur' },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
    } else {
    }
  })
}
const handleChange = (value) => {
}

// 移除标签
const handleTagClose = (index) => {
  availableTags.value.splice(index, 1)
}
// 获取标签下拉数据
const getTagData = () =>{
  tagPage({
    currentPage: 1,
    pageSize: 500,

  }).then((res) => {
    const { data } = res
    commonTags.value =
        data?.body.map((item) => {
          return {
            ...item,
          }
        }) || []
  })

}
// 获取模型编排下拉数据
const getArrId = ()=>{
  getAllModelArranges().then(res => {
    if(res.success){
      arrangeIdOptions.value = res.data
    }
  })
}
const handleArrangeSelect = (val)=>{
  ruleForm.value.selectOption = arrangeIdOptions.value.find(item => item.id == val)
}
watch(()=>props.currentModeldetail,val =>{
  if(val && Object.keys(val).length > 0 && props.isEditMode || props.isVersion){
    ruleForm.value.name = val.name
    ruleForm.value.developLanguage = val.developLanguage
    ruleForm.value.applicableScenario = val.applicableScenario.split(',')
    ruleForm.value.notes = val.notes
    ruleForm.value.version = val.version
    ruleForm.value.owner = val.owner
    ruleForm.value.difyApi = val.difyApi
    ruleForm.value.difyKey = val.difyKey
    ruleForm.value.subcateGory = val.subcateGory
    ruleForm.value.selectOption.showUrl = val.showUrl
    availableTags.value = val.tagList || []
    ruleForm.value.version = props.isVersion ? val.nextVersion : val.version
    ruleForm.value.availableTags = val.tagList || []
  }
},{deep:true})
onMounted(()=>{
  getTagData()
  getArrId()
  if(props.pageType && props.pageType=='rule'){
    ruleForm.value.modelType = '数据规则模型'
  }else if(props.pageType=='agent'){
    ruleForm.value.modelType = '智能体'
  }else{
    ruleForm.value.modelType = '机器学习'
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
