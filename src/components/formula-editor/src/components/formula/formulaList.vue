<!--
 * @Author: linyongcai
 * @Date: 2024-12-20 16:56:33
 * @FilePath: \formula-editor\formula-editor\src\components\formula\formulaList.vue
 * @Description: 页面描述
-->
<template>
  <div class="formula-list">
    <div class="formula-list-search">
      <el-input
        placeholder="搜索函数"
        prefix-icon="el-icon-search"
        v-model="searchTreeVariable"
        clearable
      ></el-input>
    </div>
    <el-scrollbar class="treeContainer" @mouseleave="leaveTree">
      <el-tree
        :data="nodes"
        :props="{
          children: 'formula',
          label: 'name',
        }"
        default-expand-all
        :current-node-key="currentKeyNode?.enCode"
        node-key="enCode"
        @node-click="nodeClick"
        highlight-current
      >
        <template #="{ data }">
          <span
            class="info-container"
            @mouseenter="enterInfo(data)"
            slot-scope="{ data }"
          >
            <span>{{ data.name }}</span>
            <span v-if="data.tip" class="tip">
              {{ data.tip }}
            </span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BaseFormulaVo } from '../../types'

const props = defineProps({
  nodes: {
    type: Array<BaseFormulaVo>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['formulaClick', 'enterInfo'])
const searchTreeVariable = ref('')

const currentKeyNode = ref<BaseFormulaVo>()

const nodeClick = (node: BaseFormulaVo) => {
  if (props.disabled) {
    return
  }
  // 目录情况
  if (node.formula) {
    if (currentKeyNode.value?.enCode) {
      currentKeyNode.value = undefined
    }
    return
  }
  currentKeyNode.value = node
  emits('formulaClick', node)
}
const enterInfo = (data: BaseFormulaVo) => {
  if (data.formula) return
  emits('enterInfo', data)
}
const leaveTree = () => {
  if (currentKeyNode.value?.enCode) {
    emits('enterInfo', currentKeyNode.value)
  }
}
</script>
