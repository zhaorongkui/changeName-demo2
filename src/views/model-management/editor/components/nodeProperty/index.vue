<!--
 * @Author: 李钟祥 nfswfy@163.com
 * @Date: 2025-07-18 09:26:10
 * @LastEditors: 李钟祥 nfswfy@163.com
 * @LastEditTime: 2025-08-04 14:43:01
 * @FilePath: \device-prediction-frontend\src\views\model-develop\editor\components\nodeProperty\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- <teleport to=".edit-content"> -->
  <div class="custom-drawer-container" v-if="isVisible">
    <div class="custom-drawer-mask" @click="closeOnClickMask && handleClose()"></div>
    <transition name="slide-up">
      <div v-if="isVisible" class="custom-drawer node-property-drawer" ref="drawerRef">
        <div class="drawer-content">
          <div class="drawer-header">
            <h3 class="title">
              <NodeIcon :type="getNodeIconType(nodeData.type)" />
              <template v-if="editNameStatus">
                <el-input
                  v-model="nodeData.label"
                  placeholder="请输入节点名称"
                  size="small"
                  @blur="editNameStatus = false"
                  @keyup.enter="editNameStatus = false"
                />
              </template>
              <template v-else>
                {{ nodeData.label || '节点属性' }}
                <el-icon style="cursor: pointer" class="edit-icon-btn" @click="editNameStatus = true"><Edit /></el-icon>
              </template>
            </h3>
            <div class="actions">
              <el-button size="small" @click="handleClose">关闭</el-button>
              <el-button size="small" type="primary" @click="handleSave">保存</el-button>
            </div>
          </div>
          <div class="property-content">
            <!-- 基础属性 -->
            <!-- <div class="property-section">
              <h4 class="section-title">基础属性</h4>
              <el-form :model="nodeData" label-width="80px" size="small">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="节点名称">
                      <el-input v-model="nodeData.label" placeholder="请输入节点名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="节点ID">
                      <el-input v-model="nodeData.id" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="节点类型">
                      <el-input v-model="nodeData.type" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div> -->

            <!-- 根据不同节点类型展示不同的属性编辑区域 -->
            <div class="property-section" v-if="nodeData.type">
              <!-- <h4 class="section-title">类型属性</h4> -->
              <component
                ref="nodePropertyRef"
                :is="getPropertyComponent(nodeData.type)"
                :properties="nodeData.properties"
                :fields="fieldOptions"
                @update="handlePropertyUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <!-- </teleport> -->
</template>

<script lang="ts" setup>
import { ref, reactive, unref, defineExpose, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import { NodeAttribute, PropertyUpdateData } from '../../utils/types'

// 抽屉可见性
const isVisible = ref(false)
const drawerRef = ref(null)
const closeOnClickMask = ref(false) // 控制是否可以通过点击遮罩关闭抽屉

// 编辑节点名称状态
const editNameStatus = ref(false)
// 当前节点数据
const nodeData = reactive<NodeAttribute>({
  id: '',
  label: '',
  type: '',
  properties: {},
  status: 'default'
})

// 当前图形实例和节点引用
let currentGraph = null
let currentNode = null

// 节点类型映射（将内部类型映射到UI显示类型）
const getNodeIconType = (type) => {
  const typeMap = {
    input: 'params-input',
    output: 'params-output',
    filter: 'condition',
    aggregate: 'calculation',
    // 保留原始类型映射，确保兼容性
    'params-input': 'params-input',
    calculation: 'calculation',
    'params-output': 'params-output',
    condition: 'condition'
  }
  return typeMap[type] || 'params-input'
}

// 根据节点类型返回对应的属性编辑组件
// 导入各种节点类型的属性编辑组件
import InputNodeProperty from './InputNodeProperty.vue'
import ParamsInputNodeProperty from './ParamsInputNodeProperty.vue'
import ProcessNodeProperty from './ProcessNodeProperty.vue'
import CalculateNodeProperty from './CalculateNodeProperty.vue'
import DefaultNodeProperty from './DefaultNodeProperty.vue'
// import ConditionalRule from './conditionalRule/example.vue'
import ConditionalRule from './conditionalRule/index.vue'
import NodeIcon from '../drag/NodeIcon.vue'

const nodePropertyRef = ref(null)
// 根据节点类型返回对应的属性编辑组件
const getPropertyComponent = (type) => {
  const componentMap = {
    // 新类型映射
    process: ProcessNodeProperty,
    // 旧类型映射，确保兼容性
    // 'params-input': InputNodeProperty,
    'params-input': ParamsInputNodeProperty,
    calculation: CalculateNodeProperty,
    // 这里可以继续添加其他类型节点的属性编辑组件
    condition: ConditionalRule
  }

  return componentMap[type] || DefaultNodeProperty
}

const fieldOptions = ref([])

// 处理ESC按键关闭
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && isVisible.value) {
    handleClose()
  }
}

// 组件挂载和卸载生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 打开抽屉并设置节点数据
const open = (graph, node, operator) => {
  if (!graph || !node) return

  currentGraph = graph
  currentNode = node

  const data = node.getData() || {}

  // 更新节点数据
  nodeData.id = node.id
  nodeData.label = data.label || ''
  nodeData.type = data.type || ''
  nodeData.properties = { ...(operator?.properties || {}) }

  // 显示抽屉
  isVisible.value = true
}

watch(isVisible, (newValue) => {
  emit('visibleChange', newValue)
})

// 处理属性更新
const handlePropertyUpdate = (updateData: PropertyUpdateData) => {
  // console.log('属性更新:', updateData)
}

// 保存节点属性
const handleSave = () => {
  if (!currentGraph || !currentNode) return

  switch (nodeData.type) {
    case 'params-input':
      nodeData.properties = nodePropertyRef.value?.getSelectData?.()
      break
    case 'condition':
      nodeData.properties = nodePropertyRef.value?.getRuleData?.()
      break
    case 'calculation':
      nodeData.properties = nodePropertyRef.value?.getFormulaData?.()
    default:
  }

  // 更新图形节点label
  currentNode.setData({ label: nodeData.label }, { deep: true })
  // 关闭抽屉
  handleClose()
}

// 关闭抽屉
const handleClose = () => {
  // 使用动画过渡效果，先触发离开动画
  setTimeout(() => {
    isVisible.value = false
    currentGraph = null
    currentNode = null
    emit('close', nodeData)
  }, 50)
}

const emit = defineEmits(['close', 'visibleChange'])

// 向父组件暴露方法
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.custom-drawer-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  pointer-events: none;
}

.custom-drawer-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}

.custom-drawer {
  pointer-events: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 412px;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.node-property-drawer {
  .drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #333;

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;

      .title {
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        display: flex;
        align-items: center;
        color: #333;
        .edit-icon-btn {
          margin-left: 0.5rem;
          cursor: pointer;
          color: #409eff;
        }
      }

      .actions {
        display: flex;
        align-items: center;
      }
    }

    .property-content {
      padding: 0 1rem;
      flex: 1;
      overflow-y: auto;

      .property-section {
        .section-title {
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #f3f4f6;
        }
      }
    }
  }
}
</style>
