<template>

  <el-dialog
      v-model="dialogVisible"
      title="模型评价"
      width="30%"
      @close="handleClose"
      :close-on-click-modal="false"
  >
    <div style="padding: 20px;background: #fff">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"

        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="模型评分" prop="sourceValue">
<!--        <el-rate-->
<!--            v-model="computedRating"-->
<!--            :max="5"-->
<!--            allow-half-->
<!--            @change="updateActualRating"-->
<!--        />-->
        <el-input v-model="ruleForm.sourceValue"  style="width: 140px" placeholder="请输入评分" oninput="value=value.replace(/[^\d]/g,'').replace(/^0+(\d+)/,'$1'); " />
<!--        <span class="score-display">{{ ruleForm.sourceValue }}</span>-->
      </el-form-item>
      <el-form-item label="模型评价" prop="notes">
        <el-input v-model="ruleForm.notes"  :rows="5"
                  type="textarea" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="模型特色" >
         <div class="feature_content">
           <div v-for="item in featureData" :key="item.textValue" class="feature_item" :class="{active: selectIds.includes(item.displayValue)}" @click="handleSelect(item)">
             {{item.displayValue}}
           </div>
         </div>
      </el-form-item>
    </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" style="margin-right: 10px" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
<!--        <el-checkbox v-model="isAnonymous">匿名发布</el-checkbox>-->
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { saveModelEvaluate,getEvaluateDetail} from '@/api/modelManage'
import { useDictValues } from '@/hooks/useDictValues'
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(true)
const selectIds = ref([])
const emits = defineEmits(['close'])
const props =defineProps({
  currentDetail: {
    type: Object,
    default: {}
  }
})
const computedRating = computed({
  get() {
    return ruleForm.value.source / 2; // 转换为5星制显示
  },
  set(value) {
    ruleForm.value.source = value * 2; // 转换为10分制存储
  }
});
const isAnonymous = ref(false) //是否匿名
const ruleForm = ref({
  source:'',
  evaluate:'',
  sourceValue:null,
  notes:''
})
const rules = ref({
  sourceValue:[
    { required: true, message: '请输入', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 检查是否为空（required 已经处理，此处可省略）
        if (value === '' || value === null || value === undefined) {
          callback(new Error('评分不能为空'));
          return;
        }
        // 检查是否为小数
        if (String(value).includes('.')) {
          callback(new Error('不能输入小数'));
          return;
        }
        // 检查范围 0-100
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100) {
          callback(new Error('请输入 0-100 的整数'));
          return;
        }
        callback(); // 验证通过
      },
      trigger: ['blur', 'change']
    }
  ],
  notes:[
    { required: true, message: '请输入', trigger: 'blur' }
  ],

})
const featureData = ref([
  {
    "id": 1338,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "十分好用",
    "textValue": "1",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 1,
    "createdAt": "2025-10-15 10:37:06",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:37:06",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1339,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "特别专业",
    "textValue": "2",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 2,
    "createdAt": "2025-10-15 10:37:18",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:37:18",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1340,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "输出规范",
    "textValue": "3",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 3,
    "createdAt": "2025-10-15 10:37:31",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:37:31",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1341,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "调整灵活",
    "textValue": "4",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 4,
    "createdAt": "2025-10-15 10:37:41",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:37:41",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1342,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "思路新颖",
    "textValue": "5",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 5,
    "createdAt": "2025-10-15 10:37:51",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:37:51",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1343,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "分析深入",
    "textValue": "6",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 6,
    "createdAt": "2025-10-15 10:38:05",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:38:05",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1344,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "适用性广",
    "textValue": "7",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 7,
    "createdAt": "2025-10-15 10:38:19",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:38:19",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1345,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "易懂性好",
    "textValue": "8",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 8,
    "createdAt": "2025-10-15 10:38:39",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 10:38:39",
    "updatedBy": "威海（weihai）",
    "remark": ""
  },
  {
    "id": 1357,
    "typeId": 2023090499,
    "typeName": "modelFeatures",
    "parentId": 0,
    "displayValue": "测试用的",
    "textValue": "11",
    "intValue": 0,
    "state": {
      "code": 1,
      "name": "启用"
    },
    "source": {
      "code": 2,
      "name": "自定义"
    },
    "orgId": "",
    "tenantId": "",
    "sortOrder": 9,
    "createdAt": "2025-10-15 15:17:52",
    "createdBy": "威海（weihai）",
    "updatedAt": "2025-10-15 15:17:52",
    "updatedBy": "威海（weihai）",
    "remark": ""
  }
])
const handleSelect = (item)=>{
  if(!selectIds.value.includes(item.displayValue)){
    selectIds.value.push(item.displayValue)
  }else{
    selectIds.value = selectIds.value.filter(it=> it !== item.displayValue)
  }
}
const updateActualRating = (val)=> {
  console.log(val,'val===')
  ruleForm.value.sourceValue = val * 2
}
const handleClose = () => {
   emits('close')
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(featureData.value,'featureData')
      console.log(selectIds.value,'selectIds==')
      const matchedTitles = featureData.value
          .filter(item => selectIds.value.includes(item.displayValue))
          .map(item => item.title || item.displayValue);
      console.log(matchedTitles,'tititt')
      saveModelEvaluate({
        modelId: props.currentDetail.modelId,
        score: ruleForm.value.sourceValue,
        flavours: matchedTitles,
        notes: ruleForm.value.notes,
        isAnonymous: isAnonymous.value ? 1 :0,
        modelKey: props.currentDetail.id,
        id: currentId.value,
        version: props.currentDetail.version,
      }).then(res =>{
        if(res.success){
          ElMessage.success(res.message)
          handleClose()
        }
      })
    } else {
    }
  })
}
const currentId = ref(null)
// 获取评价详情
const getDetail = ()=> {
  getEvaluateDetail(
    props.currentDetail.id
  ).then(res=>{
    if(res.success){
      if(res.data){
        currentId.value = res.data.id
        ruleForm.value.source = res.data.score
        ruleForm.value.sourceValue = res.data.score
        ruleForm.value.notes = res.data.notes
        selectIds.value = res.data.flavours
      }
    }
  })
}
const {getDictionaryValues} = useDictValues()
onMounted(async()=>{
  getDetail()
  // featureData.value  = await getDictionaryValues('2023090499')
})
</script>
<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.feature_content{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .feature_item{
    background: #f7f7f7;
    padding: 5px 20px;
    margin-bottom: 10px;
    border-radius:10px;
    cursor: pointer;

  }
  .active{
    color: #fff !important;
    background: #2669F7 !important;
  }
}
:deep(.el-input__suffix) {
  display: none;
}
</style>
