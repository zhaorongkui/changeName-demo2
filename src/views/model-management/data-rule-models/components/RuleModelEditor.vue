<template>
  <el-drawer
    modal-class="rule-model-editor-dialog"
    v-model="dialogVisible"
    size="80%"
    :title="dialogTitle"
    @close="handleClose"
    :fullscreen="isFullscreen"
    destroy-on-close
    :modal="false"
  >
    <div class="modal-container">
      <div class="main-content">
        <div class="editor-panel">
          <!-- 属性编辑表单 -->
          <div class="property-wrapper">
            <div class="panel-title">属性编辑</div>
            <el-form-item label="变量:">
              <div class="selected-metrics">
                <el-tag
                  v-for="metric in formData.metrics"
                  :key="metric"
                  :closable="!isTry"
                  @close="removeMetric(metric)"
                  class="metric-tag"
                >
                  {{ metric }}
                </el-tag>
                <el-button v-if="!isTry"  class="button-new-tag" style="margin-top: 2px" size="small" @click="handleAddField">
                  + 选择变量
                </el-button>
<!--                <div v-if="formData.metrics.length === 0" class="placeholder-text">点击右侧变量树选择</div>-->
              </div>
            </el-form-item>

               <el-row>
              <el-col :span="24"  v-if="!isTry">
                <el-alert
                    class="warning-banner"
                    title="为提高提示效率和准确性，请在依赖变量首尾添加[]，例如：[变量]"
                    type="warning"
                    show-icon
                    :closable="false"
                >
                </el-alert>
                <el-form-item label="公式提示词:" >
                  <el-input
                    v-model="formulaPromptWords"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入规则的中文描述，例如：如果  [进水COD]>500,  返回： '高负荷',  否则：'正常'"
                    :disabled="isTry"
                  />


                </el-form-item>
                <div style="margin-left: 100px;margin-bottom: 10px">
                    <el-button type="primary" style="margin-top: 5px" @click="generateFormulaAI('python')" :loading="isLoadingPython">生成公式：Python风格</el-button>
                    <el-button type="primary" style="margin-top: 5px" @click="generateFormulaAI('excel')" :loading="isLoadingExcel">生成公式：Excel风格</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="fourmula-content">
                <el-form-item label="计算规则:">
                  <el-input
                    v-if="!isTry"
                    v-model="formula"
                    type="textarea"
                    :rows="4"
                    placeholder="请根据提示词生成规则公式或者自定义规则公式"
                    id="formulaEditor"
                    @focus="isFormulaFocused = true"
                    @blur="handleBlur"
                  />
<!--                  readonly-->

                  <div v-else class="formula-label-display" style="min-height: 100px;width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #f5f7fa;">
                    {{ formula }}
                  </div>
                  <!-- 常用函数作为计算规则的附属属性 -->
                  <div class="functions-section" v-if="!isTry">
                    <span class="section-title">常用函数:</span>
                    <div class="function-buttons">
                      <el-button v-for="func in functions" :key="func" size="small" @mousedown.prevent="insertFunction(func)">
                        {{ func }}
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- Result preview area -->
          <div class="preview-panel">
            <div class="panel-title">结果试算区域</div>
            <!-- Query form for filtering data -->
            <div class="query-form">
              <el-form :model="queryForm" class="formula-form">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="水厂名称:">
                      <el-select
                        v-model="queryForm.businessScope"
                        placeholder="请选择水厂"
                        clearable
                        style="width: 100%"
                      >
                        <el-option
                            v-for="item in businessScopeOptions"
                            :key="item.orgId"
                            :label="item.name"
                            :value="item.orgId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="时间范围:">
                      <el-date-picker
                        v-model="queryForm.timeRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                        style="width: 80%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" @click="handleQuery">查询</el-button>
                      <el-button @click="resetQuery">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="table-container data-table-container">
              <el-table :data="tableData" class="table-content" border style="width: 100%" max-height="270" v-loading="isLoading">
                <el-table-column v-if="isCalculateFormula || tableData.length"  type="index" width="50" label="序号" />
                <el-table-column v-if="isCalculateFormula || tableData.length"   width="120" label="日期" prop="date"/>
                <el-table-column
                    v-for="column in dynamicColumns"
                    :key="column.prop"
                    :prop="column.prop"
                    :label="column.label"
                    :min-width="column.width"
                    :fixed="column.fixed"
                >
                  <template #header>
                    <span>{{ column.label }}</span>
<!--                    <el-icon class="delete-column-icon" @click="deleteColumn(column)">-->
<!--                      <Delete />-->
<!--                    </el-icon>-->
                  </template>
                  <template #default="{ row }">
                    <span>{{  row[column.prop] }}</span>
                  </template>
                </el-table-column>>
                <el-table-column v-if="isCalculateFormula"  width="120" label="结果" prop="result" fixed="right"/>
              </el-table>
            </div>
            <!-- <div class="preview-content">
              <div class="preview-info">数据行数: {{ tableData.length }}, 计算时间: 0.02秒</div>
            </div> -->
          </div>
        </div>
<!--        <div class="metadata-panel" v-if="!isTry">-->
<!--          <div class="panel-title">变量选择</div>-->
<!--          <datasetField @nodeClick="handleNodeClick"></datasetField>-->
<!--        </div>-->
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer text-end">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="clearFormula" v-if="!isTry">清空</el-button>
        <el-button type="primary" @click="calculateFormula" :loading="isCalculate">试算</el-button>
        <el-button type="primary" @click="saveFormula" v-if="!isTry && !isRelease">保存</el-button>
        <el-button type="primary" @click="saveFormula" v-if="!isTry && isRelease">确认发布</el-button>
      </div>
    </template>
  </el-drawer>
  <addField v-if="isShowAddField" @close="handleCloseAddField" @submit="submitFields" :metricsList="metricsList" :isEdit="isEdit"></addField>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick,watch } from 'vue'
import { Delete,Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TableDataItem } from '../tableData'
import * as formulajs from '@formulajs/formulajs'
import * as FormulaParser from 'hot-formula-parser'
import { Parser, SUPPORTED_FORMULAS } from 'hot-formula-parser'
import {getRuleModelVarData, getRuleModelCalcTrial, getRuleScript, getObjectField} from '@/api/modelManage'
import datasetField from './datasetField.vue'
import addField from './addField.vue'
import { useDictValues } from '@/hooks/useDictValues'
import {getOrgTree} from "~/api/org";
import type {Organization} from "~/types/org";
import {treeToArray} from "~/utils/array_func";
// 定义树节点类型
interface TreeNode {
  label: string
  children?: TreeNode[]
}
const isShowAddField = ref(false)
const isLoadingPython = ref(false)
const isLoadingExcel = ref(false)
const isCalculate = ref(false)
let loading = false; //防止重复加载数据集
const props = defineProps({
  isEdit:{
    type: Boolean,
    default: false
  },
  editingRow:{
    type: Object,
    default: {}
  },
  isFullscreen:{
    type: Boolean,
    default: true
  },
  isTry:{
    type: Boolean,
    default: false
  },
  currentModeldetail:{
    type:Object,
    default:{}
  },
  isVersion:{
    type: Boolean,
    default: false
  },
  isRelease:{
    type: Boolean,
    default:false
  },
  paramInList:{ //输入参数
    type: Array,
    default:[]
  }
})
// Emit for closing the dialog
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: TableDataItem): void
}>()

const metricsList = ref([]) //依赖变量的name和list
// 对话框可见状态
const dialogVisible = ref(true)
// 对话框标题
const dialogTitle = ref('数据规则模型编辑器')
// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  emit('close')
}

const formData = ref({
  ruleName: '',
  modelVersion: '',
  versionAlias: '',
  description: '',
  metrics: [],
  businessScope: '',
  timeDimension: '',
  creatorOrg: ''
})


const formula  = ref('')
const isFormulaFocused = ref(false); //计算规则是否获取了焦点
// 公式提示词
const formulaPromptWords = ref('')
// 识别到的变量
const identifyVariables = ref([])

// 常用函数列表
const functions = [
  'IF()',
  'AND()',
  'OR()',
  'NOT()',
  'SUM()',
  'AVG()',
  'COUNT()',
  'MAX()',
  'MIN()',
  'ROUND()',
  'ABS()',
  'CONCAT()'
]

// 动态列
const dynamicColumns = ref([])

// 查询表单
const queryForm = ref({
  businessScope: '',
  timeRange: []
})
/**
 * 初始化数据-编辑、试用
 */
const initFormData = () => {
  console.log(props.paramInList,'props.paramInList')
  formula.value = props.editingRow.formula || ''
  let metrics = []
  if(props.paramInList?.length ){
    metrics.push(...props.paramInList
        .filter(item => item.paramName )  // 过滤掉 null 或 undefined
        .map(item => item.paramName) )
    metricsList.value = props.editingRow.paramInList.filter(item => item.paramName ).map(item => {
      return {
        metricsName: item.paramName ? item.paramName : null ,
        metricsId: item.id,
        defaultValue: item.defaultValue ?  item.defaultValue : null,
        unit: item.unit,
        dataType: item.paramType,
        paramDesc: item.paramDesc,
        isCreate: item.isCreate,
      }
    })
  }
  if(props.editingRow.paramInStr){
    let params = props.editingRow.paramInStr
    let list = params.split(/[、\s]+/).filter(item => item);
    metrics.push(...list)
  }
  metrics = metrics.filter((item, index) => metrics.indexOf(item) === index);
  formData.value.metrics = metrics

  // getVarData()

}

// 表格数据
const tableData = ref([])
// 处理查询
const handleQuery = () => {
  isCalculateFormula.value = false
  getVarData()
}
// 重置查询
const resetQuery = () => {
  // 重置查询表单
  queryForm.value.timeRange = getLastMonthRange()

  // 重新加载数据
  handleQuery()
}
const clearFormula = ()=>{
  formula.value = ''
  tableData.value = []
  dynamicColumns.value = []
  queryForm.value.timeRange = []
  isCalculateFormula.value = false
}
// 树形控件的数据
const treeData = ref<TreeNode[]>([])
const pageNum = ref(1)


// 处理输入框失去焦点
const handleBlur = () => {
  setTimeout(() => {
    if (document.activeElement?.id !== 'formulaEditor') {
      isFormulaFocused.value = false;
    }
  }, 100);
};
// 插入函数到公式编辑器
const insertFunction = (func: string) => {
  if (!isFormulaFocused.value) return;

  const textarea = document.getElementById('formulaEditor') as HTMLTextAreaElement;
  if (!textarea) return;

  // 保存当前焦点状态
  const wasFocused = document.activeElement === textarea;

  // 执行插入
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  formula.value = formula.value.substring(0, start) + func + formula.value.substring(end);

  // 恢复焦点和光标位置
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(start + func.length, start + func.length);
  });
}

const isCalculateFormula = ref(false)
/**
 * 试算
 */
const calculateFormula = () => {
  if(!formula.value){
    ElMessage.warning('计算规则不能为空，请配置计算规则！')
    return
  }
  isCalculate.value = true
  let variables = []
  if(metricsList.value.length ){
    variables = metricsList.value.map(item => item.metricsName)
  }
  getRuleModelCalcTrial({
    startDate: queryForm.value.timeRange.length ? queryForm.value.timeRange[0] : '',
    endDate: queryForm.value.timeRange.length ? queryForm.value.timeRange[1] : '',
    variables:variables,
    orgCode: queryForm.value.businessScope,//水厂
    script: formula.value, //计算规则  formula.value
    // "script": "if(进水COD > 100 && 出水COD < 2) {return \"冲击\"; } else {return \"正常\";}",
  }).then(res => {
    if(res.success){
      tableData.value = []
      dynamicColumns.value = []
      isCalculateFormula.value = res.data.validateResult
      if(res.data.validateResult){
        if (res.data.data.length > 0) {
          tableData.value = processData(res.data.data);
          dynamicColumns.value = [
            ...res.data.data[0].varValues!.map(item => ({
              prop: item.varName,
              label: item.varName,
              width: '120'
            })),
          ];
        }
        ElMessage.success(res.message)
      }else{
        ElMessage.warning('计算规则有误,无法试算！')
      }
    }
  }).finally(() => {
    isCalculate.value = false
  })
}
// 保存公式
const saveFormula = () => {
  // 在实际应用中，这里会发送请求到后端保存公式
  emit('save', {
    ...props.editingRow,
    formula: formula.value,
    metrics: formData.value.metrics,
    ruleName: formData.value.ruleName,
    description: formData.value.description,
    businessScope: formData.value.businessScope,
    timeDimension: formData.value.timeDimension,
    creatorOrg: formData.value.creatorOrg,
    metricsList: metricsList.value,
    paramInList:props.paramInList,
  })
}

// 处理树节点点击事件
const handleNodeClick = (data) => {
  if(data.level ==3){
  let isHaveData = metricsList.value.some(item => item.metricsId == data.id)
  if(!isHaveData) {
    metricsList.value.push({
      metricsName: data.name,
      metricsId: data.id
    })
  }
    // 添加到依赖变量列表中（如果尚未存在）
    if (!formData.value.metrics.includes(data.name)) {
      formData.value.metrics.push(data.name)
    }
   // getVarData()
    // 插入文本到公式编辑器
    insertTextAtCursor(data.name)
  }
}

// 删除列
const deleteColumn = (column: string) => {
  // 从动态列数组中移除该列
  const index = dynamicColumns.value.indexOf(column)
  if (index > -1) {
    dynamicColumns.value.splice(index, 1)

    // 从表格数据中移除该列
    tableData.value.forEach((row) => {
      delete row[column]
    })
    formData.value.metrics =  formData.value.metrics.filter(item => item != column.label)
    // 从公式中移除该变量
    // 使用正则表达式匹配变量名并移除
    // 为了安全起见，我们只移除独立的变量名，而不是变量名的一部分
    formula.value = formula.value.replace(new RegExp(`${column.label}(?![^\u4e00-\u9fa5])`, 'g'), '');
  }
}

// 移除指标
const removeMetric = (metric: string) => {
  const index = formData.value.metrics.indexOf(metric)
  if (index > -1) {
    formData.value.metrics.splice(index, 1)
  }
  // 删除动态列
  const column = metric
  const columnIndex = dynamicColumns.value.indexOf(column)
  if (columnIndex > -1) {
    dynamicColumns.value.splice(columnIndex, 1)

    // 从表格数据中移除该列
    tableData.value.forEach((row) => {
      delete row[column]
    })
  }

  // 从公式中移除该变量
  // 使用正则表达式匹配变量名并移除
  // 为了安全起见，我们只移除独立的变量名，而不是变量名的一部分
  const regex = new RegExp(`\\[([^\\]]*${column}[^\\]]*)\\]`, 'g');
  formula.value = formula.value.replace(regex, '')
}

// 在光标位置插入常用函数文本
const insertTextAtCursor = (text) => {
  text = text.map(item => `[${item}]`).join('')
  const textarea = document.getElementById('formulaEditor') as HTMLTextAreaElement;
  if (textarea) {
    const cursorPos = textarea.selectionStart;
    const currentValue = formula.value;
    const newValue = currentValue.substring(0, cursorPos) + text + currentValue.substring(cursorPos);
    formula.value = newValue;

    nextTick(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos + text.length, cursorPos + text.length);
    });
  }
};


// 获取右侧变量树
const loadTreeData = ()=> {

  getObjectField({
    // pageNum:pageNum.value,
    // pageSize: 20
  }).then(res => {
    if(res.success){
      treeData.value = res.data.records
    }
  })
}
const groovyScript = ref('')
// 生成AI公式
const generateFormulaAI = async (style: 'python' | 'excel') => {
  if(!formulaPromptWords.value){
    ElMessage.warning('请输入公式提示词')
    return
  }
  if(style == 'python'){
    isLoadingPython.value =true
  }else{
    isLoadingExcel.value = true
  }
  getRuleScript({
    naturalLanguage: formulaPromptWords.value,
    scriptStyle: style
  }).then(res=>{
     formula.value = res.data.script
    identifyVariables.value = res.data.variables
    groovyScript.value = res.data.groovyScript
    if(identifyVariables.value.length){
      identifyVariables.value.forEach(item => {
        const matchedItem = findItemByName(treeData.value, item.varName);
        if (matchedItem) {
          item.id = matchedItem.id;
        }
      });
      // getVarData()
    }
  }).finally(()=>{
    isLoadingPython.value = false
    isLoadingExcel.value = false
  })


}
// 递归查找匹配 name 的 item
function findItemByName(items, name) {
  for (const item of items) {
    if (item.name === name) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findItemByName(item.children, name);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
const isLoading = ref(false)
// 获取结果试算区域列表数据
const getVarData = ()=>{
  isLoading.value = true
  // 获取最后的依赖变量的name和id

  let variables = []
  if(metricsList.value.length ){
    variables = metricsList.value.map(item => item.metricsName)
  }

  getRuleModelVarData({
    startDate: queryForm.value.timeRange.length ? queryForm.value.timeRange[0] : '',
    endDate: queryForm.value.timeRange.length ? queryForm.value.timeRange[1] : '',
    variables:variables,
    orgCode: queryForm.value.businessScope,//水厂
  }).then(res => {
    if(res.success){

      // 设置表头
      if (res.data.length > 0) {
        tableData.value = processData(res.data);
        metricsList.value.forEach(meItem => {
            const key = meItem.metricsName;
            const value = meItem.defaultValue;

            // 只有当 defaultValue 有值时才执行替换
            if (value !== undefined && value !== null && value !== '') {
              tableData.value.forEach(item => {
                if (item.hasOwnProperty(key)) {
                  item[key] = value;
                }
              });
            }
        });

        dynamicColumns.value = [

          ...res.data[0].varValues.map(item => ({
            prop: item.varName,
            label: item.varName,
            width: '120'
          })),
        ];
      }
    }
  }).finally(() => {
    isLoading.value = false
  })
}
const businessScopeOptions = ref([])
const {getDictionaryValues} = useDictValues()
// 处理结果试算区域列表的数据
const  processData = (data) => {
  if (!data || data.length === 0) return [];

  return data.map(item => {
    const rowData = {
      date: item.date,
      result: item.result // 添加 result 字段
    };

    item.varValues.forEach(varItem => {
      rowData[varItem.varName] = varItem.value;
    });

    return rowData;
  });
}


// 打开选择变量弹窗
const handleAddField = () =>{
  isShowAddField.value = true
}
const handleCloseAddField = () => {
  isShowAddField.value = false
}
const submitFields = (data )=>{
  const newDescriptions = [...new Set(data.map(item => item.description).filter(Boolean))];

  // 合并旧数据和新数据，并去重
  formData.value.metrics = [...new Set([
    ...(formData.value.metrics || []), // 保留原有数据
    ...newDescriptions                  // 添加新数据
  ])];
  metricsList.value.push(...data.map(item => {
    return {
      metricsName: item.description,
      metricsId: item.id,
      defaultValue: item.defaultValue ?  item.defaultValue : null,
      unit: item.unit,
      dataType: item.dataType,
      paramDesc: item.fieldName,
      isCreate: 0,
    }
  }))
  // 去重逻辑（保留第一个出现的重复项）
  metricsList.value = metricsList.value.filter((item, index, self) => {
    return index === self.findIndex((t) => (
        (t.id === item.id && t.metricsId === item.metricsId) ||
        (t.metricsId === item.metricsId && !t.id && !item.id)
    ));
  });
  insertTextAtCursor(newDescriptions)
  handleCloseAddField()
}
//获取上个月的月末和月初
const getLastMonthRange = ()=> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 当前月份（0-11）

  // 上个月的年份和月份
  let lastMonthYear = year;
  let lastMonth = month - 1;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear--;
  }

  // 上个月的第一天
  const firstDay = new Date(lastMonthYear, lastMonth, 1);
  // 上个月的最后一天
  const lastDay = new Date(lastMonthYear, lastMonth + 1, 0);

  // 格式化为 YYYY-MM-DD
  const format = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return [format(firstDay), format(lastDay)];
}
// 组件挂载时加载数据
onMounted(async () => {
  queryForm.value.timeRange = getLastMonthRange()
  // await initData()
  businessScopeOptions.value = JSON.parse(localStorage.getItem('businessScopeOptions'));
  queryForm.value.businessScope = businessScopeOptions.value[0].orgId
  // businessScopeOptions.value  = await getDictionaryValues('2023090497')
  loadTreeData()
  if (props.isEdit || props.isVersion || props.isTry) {
    initFormData()
  }else{
    if(props.paramInList && props.paramInList.length > 0){
      metricsList.value = props.paramInList.map(item => {
        return {
          metricsName: item.paramName,
          metricsId: item.paramId,
          defaultValue: item.defaultValue
        }
      })
      formData.value.metrics = props.paramInList.map(item => item.paramName).filter(Boolean);
      formula.value = props.paramInList.map(item => item.paramName).join('')
      nextTick(()=>{
        if(metricsList.value.length > 0  ){
          // getVarData()
        }
      })
    }
  }



})
defineExpose({

})
</script>

<style lang="scss">
.rule-model-editor-dialog {
  .el-dialog {
    // 仅在未全屏时设置 margin-top
    &:not(.is-fullscreen) {
      --el-dialog-margin-top: 50px;
      .modal-container {
        height: calc(100vh - 240px);
        overflow: hidden;
      }
    }
    &.is-fullscreen {
      .modal-container {
        height: calc(100vh - 120px);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.modal-container {
  .main-content {
    .form-panel {
      flex: 0 0 320px;
      padding: 12px 16px;
      border-right: 1px solid #e0e0e0;
      background-color: #fafafa;
      @media (max-width: 768px) {
        flex: 1;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }
      .property-form {
        padding: 0 16px;
        .el-form-item {
          margin-bottom: 12px;
          flex-wrap: wrap;
          flex-direction: column;
          :deep(.el-form-item__label) {
            flex: 1;
            justify-content: flex-start;
          }
        }
      }
    }
    .metadata-panel {
      width: 320px;
      height: 100%;
      border-left: 1px solid #e0e0e0;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      @media (max-width: 768px) {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }

      :deep(.tree-wrapper) {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
      }
      .search-input {
        margin-bottom: 10px;
      }
    }

    .editor-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 800px;
      overflow-y: auto;
      .property-wrapper {
        padding: 12px 16px 0px;
      }

      .selected-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        .metric-tag {
          margin: 2px 0;
        }
        .placeholder-text {
          color: #999;
          font-style: italic;
        }
      }

      .formula-editor {
        flex: 1;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #fafafa;
        border-radius: 4px;
        margin: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .formula-form {
      }

      .form-group {
        margin-bottom: 15px;
      }

      .form-label {
        display: block;
        margin-bottom: 5px;
        color: #333;
        text-align: left;
        font-weight: 500;
      }

      .formula-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        font-family: 'Courier New', monospace;
        min-height: 200px;
        resize: vertical;
        transition: border-color 0.2s;
        &:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
        }
      }

      .form-help-text {
        margin-top: 5px;
        font-size: 12px;
        color: #666;
      }

      .preview-panel {
        flex: 1;
        padding: 12px 16px;
        background-color: #ffffff;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        .query-form {
          // 样式可按需补充
          padding: 0 12px;
        }

        .table-container {
          overflow-x: auto;
          overflow: auto;
          max-width: 100%;
          padding: 0 12px;
          flex: 1;
          display: flex;

          .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;

            .preview-table-header {
              border: 1px solid #ddd;
              padding: 8px;
              background-color: #f5f5f5;
              text-align: left;
              font-weight: 600;
              color: #333;
            }

            .preview-table-cell {
              border: 1px solid #ddd;
              padding: 8px;
              color: #333;
            }
          }
        }

        .preview-content {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px 8px;
          overflow-y: auto;

          .preview-info {
            font-size: 12px;
            color: #666;
          }
        }
      }

      .formula-btn {
        background-color: #1976d2;
        color: white;
        border: none;
        padding: 12px 20px;
        margin-left: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
        &:hover {
          background-color: #1565c0;
        }
        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.4);
        }
      }

      .delete-column-icon {
        margin-left: 5px;
        cursor: pointer;
        color: #f56c6c;
        font-size: 14px;
        vertical-align: middle;
        &:hover {
          color: #ff0000;
        }
      }
    }
  }
}

// 常用函数区域样式
.functions-section {
  margin-top: 6px;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: #333;
    margin-right: 4px;
    line-height: 22px;
  }
  .function-buttons {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 0;
    .el-button {
      font-size: 11px;
      padding: 2px 8px;
      min-width: 0;
      height: 22px;
    }
    .el-button + .el-button {
      margin-left: 8px; // 移除按钮之间的默认间距
    }
    .el-button:first-child {
      margin-left: 8px; // 可根据需要调整 margin 数值
    }
  }
}
:deep(.property-wrapper .el-form-item){
  flex-direction: row;
  margin-bottom: 10px !important;
}
:deep(.preview-panel .el-form-item){
  flex-direction: row;
}
:deep(.el-alert){
  padding: 5px 10px !important;
  margin-bottom: 5px;
}
:deep(.el-alert .el-alert__icon.is-big){
  width: 14px;
}
:deep(.el-alert__title.with-description){
  font-size: 12px;
}
:deep(.fourmula-content .el-form-item__content){
  margin-left: 15px;
}
</style>
