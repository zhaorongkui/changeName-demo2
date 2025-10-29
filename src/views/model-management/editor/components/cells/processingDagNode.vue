<template>
  <div class="data-processing-dag-node">
    <div class="main-area" @mouseenter="onMainMouseEnter" @mouseleave="onMainMouseLeave">
      <div class="main-info">
        <!-- 节点类型icon -->
        <i class="node-logo" :style="{ backgroundImage: `url(${NODE_TYPE_LOGO[nodeData.type]})` }" />
        <el-tooltip :content="nodeData.name" :mouseEnterDelay="0.8">
          <div class="ellipsis-row node-name">{{ nodeData.name }}</div>
        </el-tooltip>
      </div>

      <!-- 节点状态信息 -->
      <div class="status-action">
        <el-tooltip v-if="nodeData.status === CellStatus.ERROR" :content="nodeData.statusMsg">
          <i class="status-icon status-icon-error" />
        </el-tooltip>
        <i v-if="nodeData.status === CellStatus.SUCCESS" class="status-icon status-icon-success" />

        <!-- 节点操作菜单 -->
        <div class="more-action-container">
          <i class="more-action" />
        </div>
      </div>
    </div>

    <!-- 添加下游节点 -->
    <div v-if="nodeData.type !== NodeType.OUTPUT" class="plus-dag">
      <el-dropdown
        placement="bottom"
        trigger="click"
        popper-class="processing-node-menu"
        :visible="plusActionSelected"
        @visible-change="onPlusDropdownOpenChange"
      >
        <i
          :class="[
            'plus-action',
            {
              'plus-action-selected': plusActionSelected
            }
          ]"
        />
        <template #dropdown>
          <ul>
            <li v-for="item in PROCESSING_TYPE_LIST" :key="item.type" class="each-sub-menu">
              <a @click="clickPlusDragMenu(item.type)">
                <i class="node-mini-logo" :style="{ backgroundImage: `url(${NODE_TYPE_LOGO[item.type]})` }" />
                <span>{{ item.name }}</span>
              </a>
            </li>
          </ul>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
// https://x6.antv.antgroup.com/examples/showcase/practices#dataProcessingDag

import { ref, computed } from 'vue'
import { Graph } from '@antv/x6'
// 从原来的代码迁移过来的类型定义，根据实际情况调整
type Node = any
enum NodeType {
  INPUT = 'input',
  OUTPUT = 'output',
  PROCESSING = 'processing'
  // 根据实际需求添加更多类型
}
enum CellStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  DEFAULT = 'default'
  // 根据实际需求添加更多状态
}

// 这些应该是从外部导入的常量，现在临时定义
const PROCESSING_TYPE_LIST = [
  { type: NodeType.INPUT, name: '输入' },
  { type: NodeType.PROCESSING, name: '处理' },
  { type: NodeType.OUTPUT, name: '输出' }
  // 根据实际情况添加更多类型
]

const NODE_TYPE_LOGO: Record<string, string> = {
  [NodeType.INPUT]: '',
  [NodeType.PROCESSING]: '',
  [NodeType.OUTPUT]: ''
  // 根据实际情况添加更多类型对应的图标
}

const getDownstreamNodePosition = (node: Node, graph: Graph, dx = 250, dy = 100) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList: string[] = []
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON()?.data
    if (originEdge.source === node.id) {
      downstreamNodeIdList.push(originEdge.target)
    }
  })
  // 获取起点的位置信息
  const position = node.getPosition()
  let minX = Infinity
  let maxY = -Infinity
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition()
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y
      }
    }
  })

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y
  }
}

const createNode = (type: NodeType, graph: Graph, position: { x: number; y: number }) => {
  // 临时实现，需要根据实际逻辑完善
  return { id: 'new-node' } as any
}

const createEdge = (source: string, target: string, graph: Graph) => {
  // 临时实现，需要根据实际逻辑完善
}

// 定义组件的props
const props = defineProps<{
  node: Node
}>()

// 响应式状态
const plusActionSelected = ref(false)

// 计算属性：节点数据
const nodeData = computed(() => {
  return props.node?.getData() || {}
})

// 创建下游的节点和边
const createDownstream = (type: NodeType) => {
  const node = props.node
  const graph = node.model?.graph
  if (graph) {
    // 获取下游节点的初始位置信息
    const position = getDownstreamNodePosition(node, graph)
    // 创建下游节点
    const newNode = createNode(type, graph, position)
    const source = node.id
    const target = newNode.id
    // 创建该节点出发到下游节点的边
    createEdge(source, target, graph)
  }
}

// 点击添加下游+号
const clickPlusDragMenu = (type: NodeType) => {
  createDownstream(type)
  plusActionSelected.value = false
}

// 添加下游菜单的打开状态变化
const onPlusDropdownOpenChange = (value: boolean) => {
  plusActionSelected.value = value
}

// 鼠标进入矩形主区域的时候显示连接桩
const onMainMouseEnter = () => {
  const node = props.node
  // 获取该节点下的所有连接桩
  const ports = node.getPorts() || []
  ports.forEach((port) => {
    node.setPortProp(port.id, 'attrs/circle', {
      fill: '#fff',
      stroke: '#85A5FF'
    })
  })
}

// 鼠标离开矩形主区域的时候隐藏连接桩
const onMainMouseLeave = () => {
  const node = props.node
  // 获取该节点下的所有连接桩
  const ports = node.getPorts() || []
  ports.forEach((port) => {
    node.setPortProp(port.id, 'attrs/circle', {
      fill: 'transparent',
      stroke: 'transparent'
    })
  })
}
</script>

<style scoped>
/* 数据处理节点样式 */
.data-processing-dag-node {
  position: relative;
  display: flex;
  flex-direction: column;
}
.main-area {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.main-info {
  display: flex;
  align-items: center;
}
.node-logo {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.node-name {
  max-width: 120px;
  font-size: 14px;
}
.status-action {
  display: flex;
  align-items: center;
}
.status-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
.status-icon-error {
  background-color: #ff4d4f;
  border-radius: 50%;
}
.status-icon-success {
  background-color: #52c41a;
  border-radius: 50%;
}
.more-action-container {
  cursor: pointer;
}
.more-action {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='2' r='1.5'/%3E%3Ccircle cx='8' cy='8' r='1.5'/%3E%3Ccircle cx='8' cy='14' r='1.5'/%3E%3C/svg%3E");
  background-size: contain;
}
.plus-dag {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
.plus-action {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 4v16m-8-8h16' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E");
  background-size: contain;
}
.plus-action-selected {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 4v16m-8-8h16' stroke='%231890ff' stroke-width='2'/%3E%3C/svg%3E");
}
.ellipsis-row {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* 下拉菜单样式 */
:deep(.processing-node-menu) {
  min-width: 120px;
}
:deep(.each-sub-menu) {
  list-style: none;
}
:deep(.each-sub-menu a) {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
}
:deep(.each-sub-menu a:hover) {
  background-color: #f5f5f5;
}
:deep(.node-mini-logo) {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
