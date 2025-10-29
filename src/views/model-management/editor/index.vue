<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-24 16:57:51
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-05 16:35:10
 * @FilePath: \model-sandbox-frontend\src\views\model-management\editor\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-17 09:33:43
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-07-30 13:37:27
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="model-editor">
    <div class="editor-content">
      <div class="drag-sidebar">
        <dragNode ref="dragNodeRef" />
      </div>
      <div class="editor-operate">
        <el-button type="primary" :icon="Setting" size="small" @click="handleSetting">全局配置</el-button>
        <el-button type="primary" :icon="Operation" size="small" @click="handleExport">导出数据</el-button>
        <el-button type="primary" :icon="View" size="small" @click="handlePreview">预览数据</el-button>
        <el-button type="primary" size="small" @click="handleSave">保存</el-button>
        <!-- <el-button type="primary" size="small" @click="handleExecute">运行</el-button> -->
      </div>
      <div ref="containerRef" id="edit-container" class="edit-container"></div>
      <NodeProperty ref="nodePropertyRef" @close="onControllerSave" @visibleChange="handleNodeVisibleChange" />
      <SettingDrawer ref="settingDrawerRef" />
    </div>
    <DatasetDetail ref="datasetDetailRef" :visible="nodePropertyVisible" :defaultData="datasetData" />
  </div>
</template>
<script lang="tsx" setup>
import { Cell } from '@antv/x6'
import { computed, onMounted, reactive, ref } from 'vue'
import { Operation, Setting, View } from '@element-plus/icons-vue'
import dragNode from './components/drag/dragNode.vue'
import NodeProperty from './components/nodeProperty/index.vue'
import SettingDrawer from './components/settingDrawer/index.vue'
import DatasetDetail from './components/datasetDetail/index.vue'
import editorData, { CellsData } from './editorData'
import { useRouter } from 'vue-router'
import { useGraph } from './utils/useGraph'
import { useExecuteModel } from './utils/executeUtils'
import { validateModel } from './utils/limitUtils'
import { NodeAttribute } from './utils/types'
import useDataRulesEditorStore from '@/store/modules/dataRulesEditor'

const { operatorArray, setOperatorArray, addOrUpdateOperator, removeOperatorById, getOperatorById, getOperatorByType } =
  useDataRulesEditorStore()

const image = {
  logo: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
  success: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ',
  failed: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ',
  running: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ'
}
const dragNodeRef = ref<InstanceType<typeof dragNode> | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const nodePropertyRef = ref<InstanceType<typeof NodeProperty> | null>(null)
/**
 * 初始化图形数据
 */
const { graph, init, initData } = useGraph(containerRef)

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
const routeParams = computed(() => currentRoute.value.params)

const getModelData = async () => {
  // 获取模型数据
  const modelId = routeParams.value.id as string
  if (!modelId) {
    // console.error('模型ID不能为空')
    await initData(CellsData)
    return
  }
  // 接口请求模型数据
}

onMounted(async () => {
  await init()
  await getModelData()
  // await initData(CellsData)
  dragNodeRef.value?.initDnd(graph.value)

  graph.value.on('node:dblclick', ({ node, e }) => {
    const data = node.getData() || {}
    // 找到对应的节点属性
    const operator = getOperatorById(node.id)
    nodePropertyRef.value?.open(graph.value, node, operator)
    if (data.type === 'params-input') {
      // 如果是参数输入关闭 数据详情
      datasetDetailRef.value?.close()
    } else {
      // 打开数据详情
      datasetDetailRef.value?.open()
    }
  })
})

/**
 * 全局配置
 */
const settingDrawerRef = ref<InstanceType<typeof SettingDrawer> | null>(null)
const handleSetting = () => {
  console.log('全局配置')
  settingDrawerRef.value?.open()
}

/**
 * 导出数据
 */
const handleExport = () => {
  const data = graph.value.toJSON()
  console.log('导出数据:', data)
  // 这里可以将数据发送到服务器或下载为文件
  // 例如使用 Blob 创建下载链接
  // const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  // const url = URL.createObjectURL(blob)
  // const a = document.createElement('a')
  // a.href = url
  // a.download = 'graph-data.json'
  // document.body.appendChild(a)
  // a.click()
  // document.body.removeChild(a)
  // URL.revokeObjectURL(url)
  // console.log('数据导出成功')
}

const handlePreview = () => {
  // 预览数据
  const data = graph.value.toJSON()
  console.log('预览数据:', data)
  // 预览属性
  console.log('预览属性:operatorArray:', operatorArray)
}

/**
 * 处理节点属性抽屉关闭事件
 * @param controllerData
 */

const onControllerSave = (controllerData: NodeAttribute) => {
  console.log('onControllerSave controllerData:', controllerData)
  graph.value.cleanSelection()
  addOrUpdateOperator(controllerData)
  console.log('处理节点数据:operatorArray:', operatorArray)
  datasetDetailRef.value?.open()
}
/**
 * 处理节点属性抽屉可见性变化
 */
const nodePropertyVisible = ref(false)
const handleNodeVisibleChange = (visible: boolean) => {
  nodePropertyVisible.value = visible
  console.log('节点属性抽屉可见性变化:', visible)
}

const datasetDetailRef = ref<InstanceType<typeof DatasetDetail> | null>(null)
// 参数获取的输出值
const datasetData = computed(() => {
  const operator = getOperatorByType('params-input')
  const { properties } = operator || {}
  return properties?.['params-input'] || []
})

const handleSave = () => {
  // 保存数据
  const data = graph.value.toJSON()
  console.log('保存数据:', data)
  console.log('节点属性:', operatorArray)
  // 这里可以将数据发送到服务器或保存到本地存储
}

/**
 * 运行模型
 */
const handleExecute = () => {
  // 这里预留 校验 数据的逻辑
  const validate = validateModel(graph.value)
  if (!validate) {
    return Promise.reject(new Error('模型校验失败'))
  }
  // 在这里可以添加运行模型的逻辑
  // 比如发送到服务器进行处理
  const { execute } = useExecuteModel(graph.value, operatorArray)
  execute()
}
</script>

<style lang="scss">
.model-editor {
  font-size: 0.875rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  .editor-content {
    background-color: white;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .editor-operate {
      position: absolute;
      right: 16px;
      top: 12px;
      z-index: 9;
      background-color: #f0f2f5;
      border-left: 1px solid #d9d9d9;
    }
    .edit-container {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      flex: 1;
    }
    .drag-sidebar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 8;
    }
    :deep(.node-property-drawer) {
      position: absolute;
      // right: 0;
      // top: 0;
      // z-index: 9;
    }
  }
}
.x6-node-selected .node {
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}
/* .x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}
.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
} */
.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
