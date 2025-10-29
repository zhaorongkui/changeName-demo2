<template>
  <div class="formula-editor">
    <div class="formula-editor-left" ref="leftRef">
      <field-variable :fieldList="fieldList" />
      <params-field
        :fieldList="fieldList"
        :maxHeight="paramsFieldMaxHeight"
        :disabled="disabled"
        :formulaCore="formulaCore"
        ref="paramsFieldRef"
      ></params-field>
    </div>
    <div class="formula-editor-content">
      <slot name="top"></slot>
      <div class="formula-editor-coder">
        <CodeMirror @ready="onCmReady" :disabled="disabled"></CodeMirror>
      </div>
      <div class="formula-editor-use">
        <formula-list
          class="formula-list"
          :nodes="formulaConfig"
          :disabled="disabled"
          @formulaClick="onFormulaClick"
          @enterInfo="onEnterInfo"
        />
        <div class="formula-info">
          <template v-if="currentFormula">
            <div class="info-text">{{ currentFormula.tip }}</div>
            <div class="info-text">说明：{{ currentFormula.usage }}</div>
            <div class="info-text">示例：{{ currentFormula.example }}</div>
          </template>
        </div>
        <slot name="use"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CodeMirror from '../codemirror/index.vue'
import FormulaEditorCore from '../../core'
import {
  CodemirrorMarksVo,
  FieldDataVo,
  FormulaBaseUseVo,
  ParamsFieldVo,
} from '../../types'
import { formulaConfig } from '../../formulaConfig'
import FieldVariable from './fieldVariable.vue'
import ParamsField from './paramsField.vue'
import FormulaList from './formulaList.vue'
import { generateRandomString } from '../../utils'
import type { Editor } from 'codemirror'
const props = defineProps({
  fieldList: {
    type: Array<FieldDataVo>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const leftRef = ref<HTMLDivElement>()
/** 实例化功能对象 */
const formulaCore = ref<FormulaEditorCore>()
const paramsFieldRef = ref<InstanceType<typeof ParamsField>>()
const currentFormula = ref<FormulaBaseUseVo>()

const paramsFieldMaxHeight = ref(450)
onMounted(() => {
  setTimeout(() => {
    paramsFieldMaxHeight.value = leftRef.value!.clientHeight - 200
  }, 1000)
})
/**重置数据 */
const reset = () => {
  currentFormula.value = undefined
  formulaCore.value?.reset()
  paramsFieldRef.value?.setData({})
}
/**获取公式结构 */
const getData = (): {
  text: string
  marks: CodemirrorMarksVo[]
  params: Record<string, any>
} => {
  const data = formulaCore.value!.getData()
  const paramsData = paramsFieldRef.value!.getData()
  return {
    ...data,
    params: paramsData,
  }
}
/**
 * 回显数据
 * @param formulaData
 */
const renderData = (formulaData: {
  text: string
  marks: CodemirrorMarksVo[]
  params: { [key: string]: ParamsFieldVo }
}) => {
  formulaCore.value?.renderData(formulaData)
  paramsFieldRef.value?.setData(formulaData.params)

  setTimeout(() => {
    focus
  })
}

/**编辑器加载完成的回调 */
const onCmReady = (codemirror: Editor) => {
  formulaCore.value = new FormulaEditorCore(codemirror, '', formulaConfig)
}

/**
 * 公式点击事件
 * @param formula
 */
const onFormulaClick = (formula: FormulaBaseUseVo) => {
  currentFormula.value = formula
  if (formula.type === 'custom') {
    const field: FormulaBaseUseVo = JSON.parse(JSON.stringify(formula))
    field.replace?.forEach((str: string, index: number) => {
      const random = `${str}_${generateRandomString(3)}`
      field.replace![index] = random
      field.example = field.example.replaceAll(str, random)
    })
    formulaCore.value?.insertText(field, 'custom')
    field.replace!.forEach((key: string) => {
      paramsFieldRef.value?.addParams({
        key,
        addType: 2,
        singleValue: '0',
      } as ParamsFieldVo)
    })
    return
  }
  formulaCore.value?.insertText(`${formula.name}()`, 'formula')
}
const onEnterInfo = (formula: FormulaBaseUseVo) => {
  currentFormula.value = formula
}

defineExpose({
  getData,
  renderData,
  reset,
})
</script>
