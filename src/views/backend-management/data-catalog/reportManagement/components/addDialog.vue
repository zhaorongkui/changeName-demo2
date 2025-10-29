<template>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false" @close="handleClose" size="45%" :modal="false">
    <el-tabs v-model="activeName" class="demo-tabs" >
      <el-tab-pane label="基本信息" name="modelInfo">
        <addBaseInfo ref="modelFormRef"  :isEdit="isEdit"  :currentType="currentType"  ></addBaseInfo>
      </el-tab-pane>

      <el-tab-pane  label="分类详情" name="dataSet">
        <typeDetail ref="modelDataset" :isEdit="isEdit" :currentType="currentTypeInfo"></typeDetail>
      </el-tab-pane>

    </el-tabs>

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 0 0;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirmNext" :loading="loading" >保存</el-button>

      </div>
    </template>

  </el-drawer>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type { TabsPaneContext } from 'element-plus'
import addBaseInfo from './addBaseInfo.vue'
import typeDetail from './typeDetail.vue'
import {useRouter} from "vue-router";
import { getModelDetail,getSaveModel,getUpdateModel} from '@/api/modelManage'
import { ElMessage } from 'element-plus'
import {getSaveOrUpdate, getTypeInfo} from "~/api/backStageManage";
const drawer = ref(true)
const loading = ref(false)
// 当前tab
const activeName = ref('modelInfo')
const modelFormRef = ref()
const modelDataset = ref()
const isShowRuleModelEditor = ref(false)
const currentTypeInfo = ref([]) //接口获取的详情
const props = defineProps({
  pageType:{ //当前页面类型 可以做单独判断使用
    type: String,
    default: ''
  },
  isEdit:{ //是否编辑
    type: Boolean,
    default: false
  },
  isVersion:{  //是否是版本更新或者另存为新版本
    type: Boolean,
    default: false
  },
  currentType:{ // 当前父组件传过来的详情信息
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
      const currentRuleForm = modelFormRef.value.ruleForm

        let currentDatasetId = ''
      let resultString =``
          const currentDataset = modelDataset.value?.tableData
          if(currentDataset.length>0){
            const combinedItems = currentDataset.map(item => `${item.businessObject}-${item.dataType}`);

             resultString = `${combinedItems.join("、")}`;
            currentDatasetId = currentDataset.map(item => item.id ).join(',')
          }

        loading.value = true

          getSaveOrUpdate({
            id: props.isEdit ? props.currentType.id : null,
            reportName: currentRuleForm.reportName,
            reportType: currentRuleForm.reportType,
            dataType: resultString,
            reportDesc: currentRuleForm.reportDesc,
            status: currentRuleForm.status,
            dataIds: currentDatasetId,
          }).then(res => {
            if(res.success){
              ElMessage.success(res.message)
              handleClose()
            }else {
              ElMessage.error(res.message)
            }
          }).finally(() => {
            loading.value = false
          })
    } else {
      ElMessage.warning('请填写完整基本信息！')
    }
  })
}

const rulePatamInList = ref([]) //数据规则模型的输入参数
/**
 * 编辑器提交
 */
const handleSuccess = (data) => {
  console.log(data,'data======')
  // if(data.paramInList && data.paramInList.length>0){
  const bMap = {};
  data.paramInList?.forEach(item => {
    bMap[item.paramName] = item;
  });

  // 遍历 a 数组，替换为匹配的对象或默认对象
  rulePatamInList.value = data.metrics?.map(item => {
    if (bMap[item]) {
      return bMap[item];  // 如果匹配，返回 b 中的对象
    } else {
      // 如果不匹配，返回一个类似结构的默认对象
      return {
        "id": null,
        "modelId": null,
        "paramName": item,  // 使用 a 的当前项作为 paramName
        "paramDesc": "",
        "paramType": null,
        "paramOwnership": null,
        "unit": null,
        "version": null,
        "dataSetId": null,
        "dataSetName": null,
        "ldmId": null,
        "idmName": null,
        "fieldId": null,
        "fieldName": null
      };
    }
  });

  // }
  console.log(rulePatamInList.value,'=rulePatamInList==')
  formula.value = data.formula
  metrics.value = data.metrics && data.metrics.length ? data.metrics.join(',') :''

  isShowRuleModelEditor.value = false
  isRuleModelEditor.value = true
  handleConfirmNext()
}
onMounted(()=>{
  // 编辑获取详情
  if(props.isEdit){
    console.log(props.currentType,'currentType')
    getTypeInfo(props.currentType.id).then(res=>{
      if(res.success){
        currentTypeInfo.value = res.data
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
