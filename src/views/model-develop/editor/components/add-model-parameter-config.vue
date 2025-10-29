<template>
  <div class="input-params-container">
    <h1>参数信息</h1>
    <div class="params-container">
      <div>
        <div class="table-title">输入参数</div>
        <el-table :data="paramInList" border style="width: 100%" max-height="170px">
          <!-- 参数名列（必填） -->
          <el-table-column prop="paramName" label="参数描述" width="180" >
            <template #default="{ row, $index }">
              <el-select
                  v-model="row.paramName"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入"
                  clearable
                  size="small"
                  :class="{ 'is-required': !row.name && isSubmittedInput }"
                  @change="(val) => validateFieldInput(val, row, 'paramName', $index)"
                  @clear="(val) => clearFieldInput(val, row, 'paramName', $index)"
                  popper-class="custom-dataset-select"
              >
                <el-option
                    v-for="item in commonParamsOptions"
                    :key="item.id"
                    :label="item.description"
                    :value="item.description"
                />
              </el-select>
              <span v-if="!row.paramName && isSubmittedInput" class="error-message">不能为空</span>
            </template>
          </el-table-column>

          <!-- 参数描述列 -->
          <el-table-column prop="paramDesc" label="参数名" width="200">
            <template #default="{ row }">
              <el-input
                  v-model="row.paramDesc"
                  placeholder="请输入"
                  clearable
                  size="small"
              />
            </template>
          </el-table-column>

          <!-- 参数类型列（必填） -->
          <el-table-column prop="paramType" label="参数类型" width="180">
            <template #default="{ row, $index }">
<!--              <el-input v-model="row.paramType"  size="small"  readonly/>-->
              <el-select
                  v-model="row.paramType"
                  placeholder="请选择参数类型"
                  filterable
                  allow-create
                  clearable
                  size="small"
                  :class="{ 'is-required': !row.paramType && isSubmittedInput }"
              >
                <el-option
                    v-for="item in typeOptions"
                    :key="item.displayValue"
                    :label="item.displayValue"
                    :value="item.displayValue"
                />
              </el-select>
              <span v-if="!row.paramType && isSubmittedInput " class="error-message">参数类型不能为空</span>
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template #default="{row, $index }">
              <el-input v-model="row.unit"  size="small"  />
            </template>
          </el-table-column>
          <el-table-column label="默认值" v-if="paramInList.length>0 && paramInList.some(item => item.isCreate)">
            <template #default="{row, $index }" >
              <el-input v-model="row.defaultValue"  size="small" :class="{ 'is-required': !row.defaultValue && isSubmittedInput }" v-if="row.isCreate"  @change="(val) => defaultFieldInput(val, row, 'paramName', $index)" />
              <span v-if="!row.defaultValue  && row.isCreate && isSubmittedInputDefaultValue " class="error-message">默认值不能为空</span>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                  type="danger"
                  link
                  @click="handleDeleteInput($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增按钮 -->
        <div style="margin-top: 5px; text-align: left">
          <el-button  type="primary" size="small" @click="handleAddInput">
            新增
          </el-button>
        </div>
      </div>
      <div class="middl-table">
        <div class="table-title">输出参数</div>
        <el-table :data="paramOutList" border style="width: 100%" max-height="170px">
          <!-- 参数名列（必填） -->
          <el-table-column prop="paramName" label="参数描述" width="180">
            <template #default="{ row, $index }">
              <el-select
                  v-model="row.paramName"
                  filterable
                  default-first-option
                  placeholder="请选择或输入"
                  clearable
                  allow-create
                  size="small"
                  :class="{ 'is-required': !row.paramName && isSubmittedOutPut }"
                  @change="(val)=>validateFieldOutPut(val,row, 'paramName', $index)"
                  @clear="(val)=>clearFieldOutPut(val,row, 'paramName', $index)"
                  popper-class="custom-dataset-select"
              >
                <el-option
                    v-for="item in commonParamsOptions"
                    :key="item"
                    :label="item.description"
                    :value="item.description"
                />
              </el-select>
              <span v-if="!row.paramName && isSubmittedOutPut" class="error-message">不能为空</span>
            </template>
          </el-table-column>

          <!-- 参数描述列 -->
          <el-table-column prop="paramDesc" label="参数名" width="200">
            <template #default="{ row }">
              <el-input
                  v-model="row.paramDesc"
                  placeholder="请输入"
                  clearable
                  size="small"
              />
            </template>
          </el-table-column>

          <!-- 参数类型列（必填） -->
          <el-table-column prop="paramType" label="参数类型" width="180">
            <template #default="{ row, $index }">
<!--              <el-input v-model="row.paramType"  size="small"  readonly/>-->
              <el-select
                  v-model="row.paramType"
                  placeholder="请选择参数类型"
                  filterable
                  allow-create
                  clearable
                  size="small"
                  :class="{ 'is-required': !row.paramType && isSubmittedOutPut }"
              >
                <el-option
                    v-for="item in typeOptions"
                    :key="item.displayValue"
                    :label="item.displayValue"
                    :value="item.displayValue"
                />
              </el-select>
              <span v-if="!row.paramType && isSubmittedOutPut " class="error-message">参数类型不能为空</span>
            </template>
          </el-table-column>
          <el-table-column label="单位">
            <template #default="{row, $index }">
              <el-input v-model="row.unit"  size="small"   />
            </template>
          </el-table-column>
          <el-table-column label="默认值" v-if="paramOutList.length>0 && paramOutList.some(item => item.isCreate)">
            <template #default="{row, $index }" >
              <el-input v-model="row.defaultValue"  size="small" :class="{ 'is-required': !row.defaultValue && isSubmittedOutPut }"  v-if="row.isCreate"/>
              <span v-if="!row.defaultValue  && row.isCreate && isSubmittedOutDefaultValue" class="error-message">默认值不能为空</span>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                  type="danger"
                  link
                  @click="handleDeleteOutPut($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增按钮 -->
        <div style="margin-top: 5px; text-align: left">
          <el-button  type="primary" size="small" @click="handleAddOutput">
            新增
          </el-button>
        </div>
      </div>

      <div>
        <div class="table-title">评估指标</div>
        <el-table :data="paramEvaList" border style="width: 100%" max-height="170px">
          <!-- 参数名列（必填） -->
          <el-table-column prop="paramName" label="参数描述" width="180">
            <template #default="{ row, $index }">
              <el-select
                  v-model="row.paramName"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或输入"
                  clearable
                  size="small"
                  :class="{ 'is-required': !row.paramName && isSubmittedEvaluate }"
                  @change="(val) => validateFieldEvaluation(val, row, 'paramName', $index)"
              >
                <el-option
                    v-for="item in indicatorParamsOptions"
                    :key="item.textValue"
                    :label="item.displayValue"
                    :value="item.textValue"
                />
              </el-select>
              <span v-if="!row.paramName && isSubmittedEvaluate" class="error-message">不能为空</span>
            </template>
          </el-table-column>

          <!-- 参数描述列 -->
          <el-table-column prop="paramDesc" label="参数名" width="200">
            <template #default="{ row }">
              <el-input
                  v-model="row.paramDesc"
                  placeholder="请输入"
                  clearable
                  size="small"
              />
            </template>
          </el-table-column>

          <!-- 参数类型列（必填） -->
          <el-table-column prop="paramType" label="参数类型" width="180">
            <template #default="{ row, $index }">
              <el-select
                  v-model="row.paramType"
                  placeholder="请选择参数类型"
                  filterable
                  allow-create
                  clearable
                  size="small"
                  :class="{ 'is-required': !row.paramType && isSubmittedEvaluate }"
                  @change="(val) => validateFieldEvaluation(val, row, 'paramType', $index)"
              >
                <el-option
                    v-for="item in typeOptions"
                    :key="item.displayValue"
                    :label="item.displayValue"
                    :value="item.displayValue"
                />
              </el-select>
              <span v-if="!row.paramType && isSubmittedEvaluate" class="error-message">参数类型不能为空</span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column label="操作">
            <template #default="{ $index }">
              <el-button
                  type="danger"
                  link
                  @click="handleDeleteEvaluate($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 新增按钮 -->
        <div style="margin-top: 5px; text-align: left">
          <el-button  type="primary" size="small" @click="handleAddEvaluate">
            新增
          </el-button>
        </div>
      </div>
      <!-- 提交按钮（触发校验） -->
      <!--      <div style="margin-top: 20px; text-align: left">-->
      <!--        <el-button type="primary" size="small" @click="handleSubmit">-->
      <!--          提交-->
      <!--        </el-button>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick} from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getFieldListl } from '@/api/modelManage.ts'
import { useDatasetStore } from '@/store/modules/datasetStore'
import {getAllByCode} from "~/api/common";
import {useDictValues} from "~/hooks/useDictValues";
const datasetStore = useDatasetStore()
const props = defineProps({
  pageType:{
    type: String,
    default: ''
  },
  isEditMode:{
    type: Boolean,
    default: false
  },
  isVersion:{  //是否是版本更新或者另存为新版本
    type: Boolean,
    default: false
  },
  currentModeldetail:{
    type: Object,
    default: () => {}
  },
  activeName:{ // tabs
    type: String,
    default:'',
  },
  pageType:{
    type: String,
    default:''
  },
})
// 常用参数名列表
const commonParamsOptions = ref([])
const indicatorParamsOptions = ref([])
// 参数类型选项
const typeOptions = ref([])

// 输入参数列表数据
const paramInList = ref([])
// 输出参数列表数据
const paramOutList = ref([])

// 输入参数控制是否提交过
const isSubmittedInput = ref(false)

// 新增输入参数行
const handleAddInput = () => {
  paramInList.value.push({
    paramName: '',  // 新增行初始值为空
    paramDesc: '',
    paramType: ''
  })
  isSubmittedInput.value = false  // 重置校验状态，避免新增行时触发校验
  nextTick(() => {
    // 找到 el-select 下拉框中的滚动容器
    const popperEl = document.querySelector('.custom-dataset-select .el-select-dropdown__wrap')
    if (popperEl) {
      // 先移除旧的监听（避免重复绑定）
      popperEl.removeEventListener('scroll', handleScroll)
      // 再绑定新的
      popperEl.addEventListener('scroll', handleScroll)
    }
  })
}

// 输入参数删除参数行
const handleDeleteInput = (index) => {
    paramInList.value.splice(index, 1)
}

// 输入参数控制是否提交过
const isSubmittedOutPut = ref(false)
// 新增输出参数行
const handleAddOutput = () => {
  paramOutList.value.push({
    paramName: '',  // 新增行初始值为空
    paramDesc: '',
    paramType: ''
  })
  isSubmittedOutPut.value = false  // 重置校验状态，避免新增行时触发校验
  nextTick(() => {
    // 找到 el-select 下拉框中的滚动容器
    const popperEl = document.querySelector('.custom-dataset-select .el-select-dropdown__wrap')
    if (popperEl) {
      // 先移除旧的监听（避免重复绑定）
      popperEl.removeEventListener('scroll', handleScroll)
      // 再绑定新的
      popperEl.addEventListener('scroll', handleScroll)
    }
  })
}

// 输入参数删除参数行
const handleDeleteOutPut = (index) => {
    paramOutList.value.splice(index, 1)
}
// 评估指标列表数据
const paramEvaList = ref([

])
// 评估指标控制是否提交过
const isSubmittedEvaluate = ref(false)
// 新增评估指标行
const handleAddEvaluate = () => {
  paramEvaList.value.push({ paramName: '', paramDesc: '', paramType: '' })
  isSubmittedOutPut.value = false  // 重置校验状态，避免新增行时触发校验
}

// 评估指标删除参数行
const handleDeleteEvaluate = (index) => {
    paramEvaList.value.splice(index, 1)
}
// 评估指标校验单个字段
const validateFieldEvaluation = (val,row, field, index) => {
  console.log(field,'vallll textValue')
  if(field== 'paramName'){
    const selectedOption = indicatorParamsOptions.value.find(
        (item: any) => item.textValue === val
    )
    if(selectedOption){
      paramEvaList.value[index].paramDesc = val
    }else{
      paramEvaList.value[index].paramDesc = ''
    }
  }
  if (isSubmittedEvaluate.value && !row[field]) {
    isSubmittedEvaluate.value = true  // 确保校验状态保持
  }
}
// 生成一个随机数
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
// 输入参数校验单个字段
const validateFieldInput = (val,row, field, index) => {
  const selectedOption = commonParamsOptions.value.find(
      (item: any) => item.description === val
  )

  if(selectedOption){
    paramInList.value[index].isCreate = 0
    paramInList.value[index].unit = selectedOption.unit
    paramInList.value[index].paramId = Number(selectedOption.id)
    paramInList.value[index].paramType = selectedOption.dataType
    paramInList.value[index].paramDesc = selectedOption.fieldName
  }else{
    paramInList.value[index].isCreate = 1
    paramInList.value[index].unit = ''
    paramInList.value[index].paramId = paramInList.value[index].defaultValue
    paramInList.value[index].paramType = ''
    paramInList.value[index].paramDesc = ''
  }
  if (isSubmittedInput.value && !row[field]) {
    isSubmittedInput.value = true  // 确保校验状态保持
  }
}
// 输入参数-参数名-清空
const clearFieldInput = (val,row, field, index)=>{
  paramInList.value[index].unit = ''
  paramInList.value[index].paramId = null
  paramInList.value[index].paramType =''
  paramInList.value[index].paramDesc = ''
  paramInList.value[index].isCreate = 0
  paramInList.value[index].defaultValue = ''
}
// 输入参数-输入默认值
const defaultFieldInput = (val,row, field, index)=> {
  paramInList.value[index].paramId = Math.floor(Math.random() * 10001)
}
// 输出参数校验单个字段
const validateFieldOutPut = (val,row, field, index) => {
  const selectedOption = commonParamsOptions.value.find(
      (item: any) => item.description === val
  )
  if(selectedOption){
    paramOutList.value[index].isCreate = 0
    paramOutList.value[index].paramId = Number(selectedOption.id)
    paramOutList.value[index].unit = selectedOption.unit
    paramOutList.value[index].paramType = selectedOption.dataType
    paramOutList.value[index].paramDesc = selectedOption.fieldName
  }else{
    paramOutList.value[index].isCreate = 1
    paramOutList.value[index].unit = ''
    paramOutList.value[index].paramId = paramOutList.value[index].defaultValue
    paramOutList.value[index].paramType = ''
    paramOutList.value[index].paramDesc = ''
  }
  if (isSubmittedOutPut.value && !row[field]) {
    isSubmittedOutPut.value = true  // 确保校验状态保持
  }
}
// 输出参数-参数名-清空
const clearFieldOutPut = (val,row, field, index)=>{
  paramOutList.value[index].unit = ''
  paramOutList.value[index].paramId = ''
  paramOutList.value[index].paramType =''
  paramOutList.value[index].paramDesc = ''
  paramOutList.value[index].isCreate = 0
}
// 校验全部必填 (机器模型发布的时候触发)
const isSubmittedInputDefaultValue = ref(false); // 仅用于 输入参数的defaultValue 校验
const isSubmittedOutDefaultValue = ref(false); // 仅用于 输出参数的defaultValue 校验
const handleSubmit = () => {
  if(paramInList.value.length  ==0){
    paramInList.value = [
      {
        paramName: '',  // 新增行初始值为空
        paramDesc: '',
        paramType: ''
      }
    ]
  }
  if(paramOutList.value.length  ==0){
    paramOutList.value = [
      {
        paramName: '',  // 新增行初始值为空
        paramDesc: '',
        paramType: ''
      }
    ]
  }
  if(paramEvaList.value.length  ==0){
    paramEvaList.value = [
      {
        paramName: '',  // 新增行初始值为空
        paramDesc: '',
        paramType: ''
      }
    ]
  }
  // 标记所有表格为已提交状态以触发校验
  isSubmittedInput.value = true
  isSubmittedOutPut.value = true
  isSubmittedEvaluate.value = true
  isSubmittedInputDefaultValue.value = true
  isSubmittedOutDefaultValue.value = true
  // 检查所有表格是否都有完整数据
  // const isInputValid = paramInList.value.every(row => row.paramName && row.paramType)
  // 检查默认值（当 isCreate 为 true 时）
  const isInputValid = paramInList.value.every(row => {
    const basicValid = row.paramName && row.paramType;
    // 如果是自定义参数，还需要检查 defaultValue
    return row.isCreate ? basicValid && row.defaultValue : basicValid;
  });
  const isOutputValid = paramOutList.value.every(row => row.paramName && row.paramType)
  const isEvaluateValid = paramEvaList.value.every(row => row.paramName && row.paramType)

  if (isInputValid && isOutputValid && isEvaluateValid) {
    // 收集所有数据
    const allData = {
      inputParams: paramInList.value,
      outputParams: paramOutList.value,
      evaluationMetrics: paramEvaList.value
    }
    return true
  } else {
    return false
  }
}

// 校验默认值必填（只要有手动输入的参数名就会触发）
const handleSubmitDefault = () => {

  // 标记所有表格为已提交状态以触发校验
  isSubmittedInputDefaultValue.value = true;
  isSubmittedOutDefaultValue.value = true;
  // 检查默认值（当 isCreate 为 true 时）
  const isInputValid = paramInList.value!.every(row => {

    // 如果是自定义参数，还需要检查
    return row.isCreate ?  row.defaultValue  : true;
  });
  const isOutputValid = paramOutList.value!.every(row => {

    // 如果是自定义参数，还需要检查
    return row.isCreate ?  row.defaultValue  : true;
  });
  if (isInputValid && isOutputValid ) {
    // 收集所有数据
    const allData = {
      inputParams: paramInList.value,
      outputParams: paramOutList.value,
      evaluationMetrics: paramEvaList.value
    }
    return true
  } else {
    return false
  }
}
const ids = ref([]) //关联的数据集id
const pageNum = ref(1)
const hasMore = ref(true)
const isFetchingMore = ref(false) // 专为滚动加载更多而设的锁
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  // 滚动到底部附近（比如差 10px）时，触发加载
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (hasMore.value && !isFetchingMore.value) {
      isFetchingMore.value = true
      getFieldData()
    }
  }
}

// 参数名滚动加载
const initScrollListener = () => {
  nextTick(() => {
    // 找到 el-select 下拉框中的滚动容器
    const popperEl = document.querySelector('.custom-dataset-select .el-select-dropdown__wrap')
    if (popperEl) {
      // 先移除旧的监听（避免重复绑定）
      popperEl.removeEventListener('scroll', handleScroll)
      // 再绑定新的
      popperEl.addEventListener('scroll', handleScroll)
    }
  })
}
// 获取参数名
const getFieldData = ()=>{
  getFieldListl({
    idList:ids.value,
    pageNum: pageNum.value,
    pageSize:20
  }).then(res=>{
    if(res.success){
      const newItems = res.data.records || []
      if (newItems.length > 0) {
        commonParamsOptions.value = [...commonParamsOptions.value, ...newItems]
        // 如果是滚动加载的 页面+1
        if(isFetchingMore.value){
          pageNum.value += 1
        }
      }
      if (newItems.length < 20) {
        hasMore.value = false
      }
      // 参数类型从字典获取
      // typeOptions.value = commonParamsOptions.value.map(item =>{
      //   return {
      //     label: item.dataType,
      //     value: item.dataType,
      //     id: item.id
      //   }
      // })
      // typeOptions.value = [...new Map(typeOptions.value.map(item => [item.value, item])).values()]
    }
  })
}

watch(()=>props.activeName,val => {
  if(val && val =='config' &&  props.isEditMode){
    initScrollListener()
    pageNum.value = 1
  }
  if( props.pageType == 'rule'){
    getFieldData()
  }
},{deep: true})
// 编辑回显数据
watch(()=>props.currentModeldetail,val =>{
  // 编辑回显
  if(val && Object.keys(val).length > 0 && props.isEditMode || props.isVersion){
    paramInList.value = val.paramInList && val.paramInList.length>0 ? val.paramInList : []
    paramOutList.value = val.paramOutList &&  val.paramOutList.length>0 ? val.paramOutList : []
    paramEvaList.value = val.paramEvaList &&  val.paramEvaList.length>0 ? val.paramEvaList : []
  }
},{deep:true})

// 根据关联的数据集展示下拉对应的字段
watch(()=>datasetStore.datasetList,val => {
  // 获取关联的数据集的id
  if(val && val.length > 0){
     ids.value = val.length ? val.map(item => item.id) : []
     getFieldData()
  }else{
    commonParamsOptions.value = []
  }

},{deep:true})

const {getDictionaryValues} = useDictValues()
onMounted(async ()=>{
  // 获取评估指标参数名
  indicatorParamsOptions.value  = await getDictionaryValues('2023090500')
  // 获取参数类型
  typeOptions.value  = await getDictionaryValues('2023090501')

})
defineExpose({
  handleSubmit,
  paramInList,
  paramOutList,
  paramEvaList,
  handleSubmitDefault
})
</script>

<style scoped>
.input-params-container {
  margin: 0 auto;
}
.params-container {
  padding: 20px 0 0 20px;
}
.table-title {
  font-size: 14px;
  margin-bottom: 5px;
}
h1 {
  color: #333;
}

/* 错误提示样式 */
.error-message {
  color: #f56c6c;
  font-size: 10px;
  margin-left: 8px;
}

/* 必填字段样式 */
.is-required {
  border-color: #f56c6c !important;
}
.middl-table{
  margin: 20px 0;
}
</style>