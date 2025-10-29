<template>
  <div :class="['node', `status-${status}`, `node-type-${type}`]">
    <NodeIcon :type="type" />
    <span class="label">{{ label }}</span>
    <span class="status">
      <div v-if="status === 'success'" class="status-icon success-icon">
        <Check />
      </div>
      <div v-else-if="status === 'failed'" class="status-icon failed-icon">
        <CircleCloseFilled />
      </div>
      <div v-else-if="status === 'running'" class="status-icon running-icon">
        <Loading />
      </div>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, inject, ref, unref, watch } from 'vue'
import { Check, CircleCloseFilled, Loading } from '@element-plus/icons-vue'
import NodeIcon from '../../components/drag/NodeIcon.vue'
import { Cell, Node, Graph } from '@antv/x6'
import useDataRulesEditorStore from '~/store/modules/dataRulesEditor'
const { getOperatorById } = useDataRulesEditorStore()
// VUE组件注册 自带的props
const props = defineProps<{
  node: Node
  graph: Graph
}>()
console.log('props', props)
// 注入的节点和图形实例 （自带注入）
const injectNode = inject('getNode')
const injectGraph = inject('getGraph')

// 从节点数据中获取状态信息(初始化)
const nodeData = computed(() => {
  return props.node?.getData() || {}
})
const label = ref(nodeData.value.label || '')
const status = ref(nodeData.value.status || 'default')
const type = ref(nodeData.value.type || 'default')

const currenNode = ref<Node | null>(null)
currenNode.value = props.node

if (currenNode.value) {
  currenNode.value.on('change:data', ({ current }) => {
    label.value = current.label || ''
    status.value = current.status || 'default'
  })

  // currenNode.value.resize(180, 360)
}
/**
 * 每个节点配置的属性
 */
const properties = computed(() => {
  console.log('nodeData.value', currenNode.value)
  const { properties } = getOperatorById(currenNode.value.id) || {}
  return properties?.[nodeData.value.type]
})
console.log('properties', properties.value)
</script>

<style lang="scss" scoped>
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
/* 节点图标样式已移至 NodeIcon.vue */
.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
  font-weight: bold;
}

/* 节点状态  */
.node .status {
  flex-shrink: 0;
}
.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-icon svg {
  width: 16px;
  height: 16px;
}
.success-icon {
  color: #52c41a;
}
.failed-icon {
  color: #ff4d4f;
}
.running-icon {
  color: #1890ff;
  svg {
    animation: spin 1.5s linear infinite;
  }
}

/* 不同类型的节点样式 */
.node-type-params-input {
  border-left: 4px solid #1677ff;
}
.node-type-params-input .node-icon {
  color: #1677ff;
}

.node-type-condition {
  border-left: 4px solid #fa8c16;
}
.node-type-condition .node-icon {
  color: #fa8c16;
}

.node-type-calculation {
  border-left: 4px solid #13c2c2;
}
.node-type-calculation .node-icon {
  color: #13c2c2;
}

.node-type-params-output {
  border-left: 4px solid #9254de;
}
.node-type-params-output .node-icon {
  color: #9254de;
}
</style>
