<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-25 15:15:58
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-11 14:42:22
 * @FilePath: \model-sandbox-frontend\src\views\model-management\editor\components\nodeProperty\CalculateNodeProperty.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- <el-button type="primary" @click="getFormulaData">获取公式数据</el-button> -->
  <div style="height: 360px">
    <FormulaEditor ref="formulaEditorRef" :field-list="fieldList">
      <template #use>
        <el-scrollbar class="formula-verify">
          <el-button type="primary" size="small" @click="verifyScript">公式校验</el-button>

          <div class="common-title">校验结果</div>
          <p class="formula-verify-result">
            <span :class="[verifyScriptValue?.result ? 'success' : 'fail']">{{
              verifyScriptValue?.result ? '校验通过' : '校验不通过'
            }}</span>
          </p>
          <div class="common-title">校验公式</div>
          <p class="formula-verify-result">
            {{ verifyScriptValue?.request.script }}
          </p>
          <div class="common-title">校验参数</div>
          <template v-for="(value, key) in verifyScriptValue?.caseParams" :key="key">
            <p class="formula-verify-result">{{ key }}=> {{ value }}</p>
          </template>
          <div class="common-title">输出结果</div>
          <p class="formula-verify-result">
            {{ verifyScriptValue?.caseResult }}
          </p>
        </el-scrollbar>
      </template>
    </FormulaEditor>
  </div>
</template>

<script lang="ts" setup>
// import { FormulaEditor, type FormulaEditorInstance } from 'be-formula-editor'
// import type { FieldDataVo, ParamsFieldVo, CodemirrorMarksVo } from 'be-formula-editor/types'
import 'be-formula-editor/dist/theme-chalk/index.css'
import { FormulaEditor, type FormulaEditorInstance } from '@/components/formula-editor/src'
import type { FieldDataVo, ParamsFieldVo, CodemirrorMarksVo } from '@/components/formula-editor/src/types'
// import '@/components/formula-editor/src/theme-chalk/index.css'
import formula from 'formulajs'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { verifyScriptFun } from '~/api/dataRulesEditor'
import type { IndicatorMathElVo, IndicatorVerifyScriptVo } from '~/types/dataRulesEditor'

const formulaEditorRef = ref<FormulaEditorInstance | null>(null)
/**
 *
 * 字段数据 */
const fieldList = ref<FieldDataVo[]>([])
const initFieldList = () => {
  ;[
    { key: 'm_code', label: '数值', type: 'number', typeName: '数值' },
    { key: 'm_time', label: '时间', type: 'date', typeName: '时间' },
    { key: 'm_text', label: '文本', type: 'text', typeName: '文本' },
    { key: '1#_flow_in', label: '1号进水口', type: 'number', typeName: '数值' },
    { key: '1#_flow_out', label: '1号出水口', type: 'number', typeName: '数值' },
    { key: '2#_flow_in', label: '2号进水口', type: 'number', typeName: '数值' },
    { key: '2#_flow_out', label: '2号出水口', type: 'number', typeName: '数值' },
    { key: '3#_flow_in', label: '3号进水口', type: 'number', typeName: '数值' },
    { key: '3#_flow_out', label: '3号出水口', type: 'number', typeName: '数值' },
    { key: 'total_flow_in', label: '总进水', type: 'number', typeName: '数值' },
    { key: 'total_flow_out', label: '总出水', type: 'number', typeName: '数值' }
  ].forEach((item) => {
    fieldList.value.push({
      enCode: item.key,
      name: item.label
    })
  })
}
initFieldList()

const props = defineProps<{
  properties: {
    calculation: IndicatorMathElVo
  }
}>()

const echoCalculation = () => {
  //回显公式数据
  const calculation = props.properties.calculation || {}
  if (calculation && Object.keys(calculation).length > 0) {
    const { script = '', marks = '[]', params = {} } = calculation as IndicatorMathElVo
    const _params: { [key: string]: ParamsFieldVo } = {}
    for (const key in params) {
      _params[key] = {
        key,
        value: params[key].indicatorCode,
        singleValue: params[key].singleValue ? '0' : '1'
      }
    }
    console.log('回显公式', script, marks, _params)
    setTimeout(() => {
      formulaEditorRef.value?.renderData({
        text: script,
        params: _params,
        marks: JSON.parse(marks)
      })
    }, 500)
  }
  //回显公式时间规则
  // if (formulaTimeRef.value && data.timeRule) {
  //   formulaTimeRef.value.setData(data.timeRule);
  // }
}

onMounted(() => {
  // 初始化公式编辑器
  echoCalculation()
})

onUnmounted(() => {
  formulaEditorRef.value?.reset()
  // 清理公式编辑器
  verifyScriptValue.value = undefined
})

watch(
  () => props.properties,
  (newValue) => {
    if (newValue && newValue.calculation) {
      echoCalculation()
    }
  },
  { immediate: true }
)

const getFormulaData = () => {
  const data = formulaEditorRef.value?.getData()
  console.log('获取公式数据', data)
  return {
    calculation: {
      displayScript: data!.text,
      script: data?.text || '',
      marks: JSON.stringify(data?.marks || []),
      params: data?.params || {}
      // params: Object.fromEntries(
      //   Object.entries(data?.params || {}).map(([key, value]) => [
      //     key,
      //     {
      //       indicatorCode: value.value,
      //       indicatorName: value.label,
      //       singleValue: value.singleValue === '0'
      //     }
      //   ])
      // )
    }
  }
}
defineExpose({
  getFormulaData
})

/**公式校验的结果 */
const verifyScriptValue = ref<IndicatorVerifyScriptVo>()
/**
 * 公式校验
 */
const verifyScript = () => {
  const data = formulaEditorRef.value?.getData()
  verifyScriptFun({
    script: data!.text,
    params: data!.params
  }).then((res) => {
    if (res.code === 0) {
      verifyScriptValue.value = res.data
    }
  })
}
console.log('formula', formula)
const result = formula.SUM([1, 2, 3]) // 结果: 6
console.log('SUM Result:', result)
// 如果你需要“解析+计算”，建议用 hot-formula-parser 或 hyperformula。

import * as FormulaParser from 'hot-formula-parser'
console.log('FormulaParser', FormulaParser)

try {
  // 假设 paramsData 是公式编辑器里获取到的参数对象
  const paramsData = {
    m_code: 1,
    total_flow_in: 2
    // ...其他变量
  }

  const parser = new FormulaParser.Parser()
  console.log('parser', parser)
  parser.on('callVariable', (name, done) => {
    // 动态从 paramsData 取值
    if (paramsData.hasOwnProperty(name)) {
      done(paramsData[name])
    } else {
      done(new Error('变量未定义'))
    }
  })

  // 例如公式编辑器输入：SUM(m_code, total_flow_in, 10)
  const result = parser.parse('SUM([m_code, total_flow_in, 10])').result
  console.log('公式结果:', result)
} catch (error) {
  console.error('Parser error:', error)
}
</script>
<style lang="scss">
.formula-editor-coder {
  height: 120px;
}
.formula-verify {
  width: 240px;
  border: 1px solid #d7d9dc;
  border-left: 0;
  padding: 10px;

  &-result {
    line-height: 28px;

    .success {
      color: #339d3a;
    }

    .fail {
      color: #8d3030;
    }
  }
}
</style>
