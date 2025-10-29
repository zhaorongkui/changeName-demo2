<template>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" @close="handleClose" size="55%" :modal="false">
    <el-tabs v-model="activeName" class="demo-tabs" >
      <el-tab-pane label="模型信息" name="modelInfo">
        <addModelForm ref="modelFormRef" :pageType="pageType" :isEditMode="isEditMode"  :currentModeldetail="currentModel" :isVersion="isVersion" :isRelease="isRelease"></addModelForm>
      </el-tab-pane>
<!--      数据规则模型新增不需要展示-->
      <el-tab-pane v-if="pageType!=='rule'" label="关联数据集" name="dataSet">
        <addModelDataset ref="modelDataset" :isEditMode="isEditMode" :currentModeldetail="currentModel"></addModelDataset>
      </el-tab-pane>
      <el-tab-pane label="参数配置" name="config">
        <addModelParameterConfig ref="modelParamterConfig" :isEditMode="isEditMode" :currentModeldetail="currentModel" :activeName="activeName" :isVersion="isVersion" :pageType="pageType"></addModelParameterConfig>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 0 0;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmNext" :loading="loading" v-if="!isRelease">保存并继续</el-button>
        <el-button type="primary" @click="handleConfirmNext" :loading="loading" v-if="isRelease && pageType !='rule'">确认发布</el-button>
        <el-button type="primary" @click="handleConfirmNext" :loading="loading" v-if="isRelease && pageType =='rule'">下一步</el-button>
      </div>
    </template>
    <!--数据规则编辑器-->
    <RuleModelEditor
        v-if="isShowRuleModelEditor"
        :isEdit="isEditMode"
        :isTry="isTryModal"
        :isRelease="isRelease"
        :isVersion="isVersion"
        :paramInList="paramInList"
        :currentModeldetail="currentModel"
        :editing-row="currentModel"
        @close="handleCloseModal"
        @save="handleSuccess"
    />
  </el-drawer>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type { TabsPaneContext } from 'element-plus'
import addModelForm from './add-model-form.vue'
import addModelDataset from './add-mode-dataset.vue'
import addModelParameterConfig from './add-model-parameter-config.vue'
import {useRouter} from "vue-router";
import { getModelDetail,getSaveModel,getUpdateModel} from '@/api/modelManage'
import { ElMessage } from 'element-plus'
import RuleModelEditor from "~/views/model-management/data-rule-models/components/RuleModelEditor.vue";
const drawer = ref(true)
const loading = ref(false)
// 当前tab
const activeName = ref('modelInfo')
const modelFormRef = ref()
const modelDataset = ref()
const modelParamterConfig = ref()
const isShowRuleModelEditor = ref(false)
const isTryModal = ref(false)
const currentModel = ref({
  id: '',
  ruleName: '',
  description: '',
  metrics: [],
  businessObject: '',
  dataset: '',
  formula: ''
}) //接口获取的详情
const props = defineProps({
  pageType:{ //当前页面类型 可以做单独判断使用
   type: String,
    default: ''
  },
  isEditMode:{ //是否编辑
    type: Boolean,
    default: false
  },
  isVersion:{  //是否是版本更新或者另存为新版本
    type: Boolean,
    default: false
  },
  currentModeldetail:{ // 当前父组件传过来的详情信息
    type: Object,
    default: () => {}
  },
  isRelease: { //是否发布
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close', 'confirmNext'])


const handleClose = ()=> {
  emits('close')
}
const router = useRouter()
/**
 * 通过页面类型判断模型类型
 */
const getModelType = ()=> {
  let type = 1
  if(props.pageType == 'machine'){ //机器学习模型
    type = 1
  } else if(props.pageType == 'agent'){ //智能体
    type = 2
  }else if(props.pageType == 'rule'){ //数据规则
    type = 3
  }
  return type
}
const formula = ref('') //数据规则公式
const metrics = ref('') //数据规则依赖变量 字符串逗号分隔形式
// 判断数据规则编辑器是否点击了保存
const isRuleModelEditor = ref(false)
const paramInList = ref([]) //已经增加的输入参数
const currentModelId =ref('')
/**
 * 保存并继续
 */
const handleConfirmNext = ()=> {

  if (!modelFormRef.value) {
    console.error('未获取到子组件实例')
    return
  }
  modelFormRef.value.ruleFormRef.validate((valid: boolean) => {
    if (valid) {
      if( !props.isRelease  && !modelParamterConfig.value.handleSubmitDefault()){
        ElMessage.warning('请将参数配置填写完整！')
        return
      }
      // 如果是机器学习模型的发布 就校验必填
      if(props.pageType == 'machine' && props.isRelease){
        const currentDataset = modelDataset.value?.tableData
        if(currentDataset.length == 0){
          ElMessage.warning('请关联数据集！')
          return
        }
        if(!modelParamterConfig.value.handleSubmit()){
          ElMessage.warning('请将参数配置填写完整！')
          return
        }
      }
      const currentRuleForm = modelFormRef.value.ruleForm
      currentRuleForm.avaiTags  = currentRuleForm.availableTags.map(item => item.id).join(',')
      if(props.pageType=='rule' && !isRuleModelEditor.value){
        paramInList.value = modelParamterConfig.value.paramInList
        isShowRuleModelEditor.value = true
      }else{

        let currentDatasetId = []
        if(props.pageType !='rule'){
          const currentDataset = modelDataset.value?.tableData
          if(currentDataset.length>0){
            currentDatasetId = currentDataset.map(item => item.id || item.dataSetsId)
          }
        }
        loading.value = true
        //新增和编辑
        if(!props.isEditMode){
          getSaveModel({
            isUpdateVersion:props.isVersion  ? 1 :0,//模型列表页面新增默认传0  版本管理新增传1
            modelId: props.currentModeldetail.modelId || currentModelId.value ,
            name: currentRuleForm.name,
            modelType: getModelType(),
            owner: currentRuleForm.owner,
            applicableScenario: currentRuleForm.applicableScenario.join(','),
            developLanguage: currentRuleForm.developLanguage,
            notes: currentRuleForm.notes,
            aliasName: currentRuleForm.aliasName,
            version: currentRuleForm.version,
            difyApi: currentRuleForm.difyApi,
            difyKey: currentRuleForm.difyKey,
            subcateGory: currentRuleForm.subcateGory, //分类
            paramInList: props.pageType !='rule' ?  modelParamterConfig.value.paramInList : rulePatamInList.value,
            paramOutList: modelParamterConfig.value.paramOutList,
            paramEvaList: modelParamterConfig.value.paramEvaList,
            dataSetIdList: currentDatasetId,
            tagId: currentRuleForm.avaiTags,
            formula: formula.value,
            metrics: metrics.value,
            metricsList: metricsList.value,
          }).then(res => {
            if(res.success){
              ElMessage.success(res.message)
              handleClose()
              // 智能体模型跳转第三方
              if(props.pageType == 'agent'){

                // let url =  currentRuleForm.selectOption.showUrl
                let url =  'http://10.198.0.137/apps'
                window.open(url)
              }
            }else {
              ElMessage.error(res.message)
            }
          }).finally(() => {
            loading.value = false
          })
        }else{
          // 编辑 、 发布
          getUpdateModel({
            id: props.currentModeldetail.id,
            isRelease: props.isRelease ? 1 : 0,
            instructions: currentRuleForm.instructions,
            name: currentRuleForm.name,
            modelType: getModelType(),
            owner: currentRuleForm.owner,
            arrangeId: currentRuleForm.arrangeId,
            applicableScenario: currentRuleForm.applicableScenario.join(','),
            developLanguage: currentRuleForm.developLanguage,
            notes: currentRuleForm.notes,
            aliasName: currentRuleForm.aliasName,
            subcateGory: currentRuleForm.subcateGory, //分类
            paramInList: props.pageType !='rule' ?  modelParamterConfig.value.paramInList : rulePatamInList.value,
            paramOutList: modelParamterConfig.value.paramOutList,
            paramEvaList: modelParamterConfig.value.paramEvaList,
            dataSetIdList: currentDatasetId,
            tagId: currentRuleForm.avaiTags,
            formula: formula.value,
            metrics: metrics.value,
            metricsList: metricsList.value,
          }).then(res =>{
            if(res.success){
              ElMessage.success(res.message)
              handleClose()
              // 智能体模型跳转第三方 只有新增和编辑的时候才能跳 发布不能跳
              if(props.pageType == 'agent' && !props.isRelease){
                // let url =  currentRuleForm.selectOption.showUrl
                let url =  'http://10.198.0.137/apps'

                window.open(url)
              }
            }
          }).finally(() => {
            loading.value = false
          })
        }
      }
    } else {
      ElMessage.warning('请填写完整模型信息！')
    }
  })
}
// 关闭模态框
const handleCloseModal = () => {
  isTryModal.value = false
  isShowRuleModelEditor.value = false
}
const rulePatamInList = ref([]) //数据规则模型的输入参数
const metricsList = ref([])  //数据规则模型的依赖变量的name和id
/**
 * 编辑器提交
 */
const handleSuccess = (data) => {
  console.log(data,'data======')
  console.log(data.metricsList,'data.metricsList======')
    const bMap = {};
    data.paramInList?.forEach(item => {
      bMap[item.paramName] = item;
    });
   metricsList.value = data.metricsList
  // 遍历 a 数组，替换为匹配的对象或默认对象
  // rulePatamInList.value = data.metricsList
   rulePatamInList.value = data.metricsList?.map(item => {
     console.log(item,'ititii')
      if (bMap[item.metricsName]) {
        return bMap[item.metricsName];  // 如果匹配，返回 b 中的对象
      } else {
        // 如果不匹配，返回一个类似结构的默认对象
        return {
          "paramName": item.metricsName,
          defaultValue:item.defaultValue,// 使用 a 的当前项作为 paramName
          paramId: Number(item.metricsId),
          "paramDesc": item.paramDesc,
          "unit": item.unit,
        };
      }
    });
  console.log(rulePatamInList.value,'rulePatamInList.value')

  formula.value = data.formula
  metrics.value = data.metrics && data.metrics.length ? data.metrics.join(',') :''

  isTryModal.value = false
  isShowRuleModelEditor.value = false
  isRuleModelEditor.value = true
  handleConfirmNext()
}
onMounted(()=>{
  // 编辑获取详情
  if(props.isEditMode || props.isVersion){
    getModelDetail(props.currentModeldetail.id).then(res=>{
      if(res.success){
        currentModel.value = res.data
        currentModelId.value = res.data.modelId
      }
    })

  }
})
</script>
<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
:deep(.el-tabs__item){
  font-size: 18px;
}
</style>
