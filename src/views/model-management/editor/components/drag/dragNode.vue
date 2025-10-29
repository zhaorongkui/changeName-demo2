<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-17 15:54:42
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-06 16:59:22
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\components\drag\dragNode.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="node-panel">
    <div class="node-panel-header">
      <span class="node-panel-title">节点组件</span>
      <span class="node-panel-subtitle">拖拽至画布</span>
    </div>
    <ul ref="dragNodeListRef" class="drag-node-list">
      <li @mousedown="handleMousedown" class="node-item">
        <NodeIcon type="params-input" />
        <span>参数获取</span>
      </li>
      <li @mousedown="handleMousedown" class="node-item">
        <NodeIcon type="condition" />
        <span>条件判断</span>
      </li>
      <li @mousedown="handleMousedown" class="node-item">
        <NodeIcon type="calculation" />
        <span>数据计算</span>
      </li>
      <li @mousedown="handleMousedown" class="node-item">
        <NodeIcon type="params-output" />
        <span>参数输出</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Graph, Cell } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import { onMounted, ref } from 'vue'
import NodeIcon from './NodeIcon.vue'
const dragNodeListRef = ref<HTMLUListElement | null>(null)
let dnd: Dnd | null = null
let graphInstance: Graph | null = null
const initDnd = (graph: Graph) => {
  graphInstance = graph
  dnd = new Dnd({
    target: graph,
    dndContainer: dragNodeListRef.value as HTMLUListElement
    // getDragNode: (node: Cell) => {
    //   return graph.createNode({
    //     shape: 'dag-node'
    //   })
    // }
  })
  //   graph.use(dnd)
}

const handleMousedown = (event: MouseEvent) => {
  // 阻止默认事件，防止浏览器选中内容
  event.preventDefault()

  if (!graphInstance || !dnd) {
    console.warn('图表实例或DND未初始化')
    return
  }

  // 获取节点类型
  const target = event.currentTarget as HTMLElement
  const nodeIcon = target.querySelector('.node-icon')
  let nodeType = 'default'
  let nodeColor = '#1890ff'
  let portsItem = [
    {
      group: 'top'
    },
    {
      group: 'bottom'
    }
  ]

  if (nodeIcon) {
    // 从 NodeIcon 组件获取类型
    // 拖拽的时候根据不同的图标类型设置节点类型和颜色
    // 还有使用的连接桩
    if (nodeIcon.classList.contains('params-input')) {
      nodeType = 'params-input'
      nodeColor = '#1890ff'
      portsItem = [
        {
          group: 'bottom'
        }
      ]
    } else if (nodeIcon.classList.contains('condition')) {
      nodeType = 'condition'
      nodeColor = '#fa8c16'
    } else if (nodeIcon.classList.contains('calculation')) {
      nodeType = 'calculation'
      nodeColor = '#52c41a'
    } else if (nodeIcon.classList.contains('params-output')) {
      nodeType = 'params-output'
      nodeColor = '#9254de'
      portsItem = [
        {
          group: 'top'
        }
      ]
    }
  }

  // 创建节点
  const node = graphInstance.createNode({
    shape: 'dag-node',
    data: {
      type: nodeType,
      status: 'default',
      label: target.querySelector('span')?.textContent || '新节点'
    },
    ports: { items: portsItem }
  })
  console.log('创建的节点:', node)

  dnd.start(node, event)
}

defineEmits(['dragStart'])

defineExpose({
  initDnd
})
</script>

<style lang="postcss">
.node-panel {
  width: 100%;
  min-width: 180px;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
  border: 1px solid #eaeaea;
  overflow: hidden;
}

.node-panel-header {
  background-color: #f5f7fa;
  padding: 12px 16px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
}

.node-panel-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.node-panel-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.drag-node-list {
  list-style-type: none;
  padding: 12px;
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}

.drag-node-list li {
  padding: 6px 8px;
  background-color: white;
  border-radius: 4px;
  cursor: grab;
  color: #333;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-grow: 1;
  min-width: 72px;
  margin: 0;
  font-size: 12px;
}

/* 图标样式已移至 NodeIcon.vue 组件 */

.drag-node-list li:hover {
  background-color: #f4f9ff;
  border-color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(24, 144, 255, 0.1);
}

.drag-node-list li:active {
  cursor: grabbing;
  background-color: #e6f7ff;
}
</style>
