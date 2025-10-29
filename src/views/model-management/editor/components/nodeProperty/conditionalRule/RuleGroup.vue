<template>
  <div class="rule-group-container" :class="{ 'root-group': isRoot, 'invalid-group': !isValidGroup }">
    <div class="group-header">
      <div class="group-left-section">
        <div class="group-type-selector">
          <el-select v-model="groupData.type" size="small" @change="syncToParent">
            <el-option label="满足所有条件（且）" :value="ConditionGroupType.AND"></el-option>
            <el-option label="满足任意条件（或）" :value="ConditionGroupType.OR"></el-option>
          </el-select>
        </div>

        <div class="inline-validation" v-if="!isValidGroup">
          <div class="compact-alert">
            <i class="el-icon-warning"></i>
            <span>至少需要两个条件或子条件组</span>
          </div>
        </div>

        <div class="inline-validation" v-if="isValidGroup && !allGroupsValid && isRoot">
          <div class="compact-alert">
            <i class="el-icon-warning"></i>
            <span>某些子条件组不满足要求</span>
          </div>
        </div>
      </div>

      <div class="group-actions">
        <el-tooltip content="添加条件" placement="top">
          <el-button size="small" circle :icon="Plus" @click="addCondition"></el-button>
        </el-tooltip>
        <el-tooltip content="添加条件组" placement="top">
          <el-button size="small" circle :icon="FolderAdd" @click="addGroup"></el-button>
        </el-tooltip>
        <el-tooltip v-if="!isRoot" content="删除组" placement="top">
          <el-button size="small" circle :icon="Minus" @click="$emit('remove')"></el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="conditions-container">
      <!-- 所有节点列表 -->
      <template v-for="(node, index) in groupData.children" :key="node.id">
        <!-- 计算当前节点的路径 -->
        <div
          :class="{
            'condition-item': node.nodeType === NodeType.ITEM,
            'nested-group': node.nodeType === NodeType.GROUP
          }"
          class="condition-wrapper"
        >
          <!-- 条件项节点 -->
          <div v-if="node.nodeType === NodeType.ITEM" class="condition-content">
            <!-- 显示带圆圈的编号（只在条件项上显示） -->
            <div class="condition-number">
              <span class="number-circle">{{ getNodeNumber(index) }}</span>
            </div>
            <RuleCondition
              :model-value="node"
              :fields="fields"
              @update:model-value="updateConditionNode(index, $event)"
              @remove="removeNode(index)"
            />
          </div>

          <!-- 条件组节点 -->
          <div v-else-if="node.nodeType === NodeType.GROUP" class="condition-content nested-content">
            <RuleGroup
              :model-value="node"
              :fields="fields"
              :is-root="false"
              :path="getNodeNumber(index)"
              :number-map="numberMap"
              @update:model-value="updateGroupNode(index, $event)"
              @remove="removeNode(index)"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import { Plus, Minus, FolderAdd } from '@element-plus/icons-vue'
import {
  ConditionGroupType,
  FieldOption,
  generateUniqueId,
  OperatorType,
  NodeType,
  ConditionGroupNode,
  ConditionItemNode,
  createConditionGroupNode,
  createConditionItemNode,
  convertOldGroupToNewStructure,
  convertNewStructureToOldGroup
} from './types'
import RuleCondition from './RuleCondition.vue'

export default defineComponent({
  components: {
    RuleCondition
  },
  props: {
    modelValue: {
      type: Object as () => ConditionGroupNode,
      required: true
    },
    fields: {
      type: Array as () => FieldOption[],
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    },
    numberMap: {
      type: Object as () => Map<string, number>,
      default: () => new Map()
    }
  },
  emits: ['update:modelValue', 'remove', 'validation'],
  setup(props, { emit }) {
    const groupData = ref<ConditionGroupNode>(createConditionGroupNode())

    // 计算条件总数
    const totalConditionsCount = computed(() => {
      return Array.isArray(groupData.value.children) ? groupData.value.children.length : 0
    })

    // 验证条件组是否有效（至少有两个条件）
    const isValidGroup = computed(() => {
      return totalConditionsCount.value >= 2
    })

    // 初始化组件数据
    const skipNextWatch = ref(false)

    // 只在组件初始化时和modelValue真正变化时进行一次性同步
    const initializeData = () => {
      if (props.modelValue) {
        // 创建深拷贝，避免直接引用
        groupData.value = JSON.parse(JSON.stringify(props.modelValue))

        // 兼容处理：如果是旧数据结构，则转换为新数据结构
        if (!('nodeType' in groupData.value)) {
          // 假设这是一个旧的ConditionGroup
          const oldGroup = groupData.value as unknown as ConditionGroupNode
          const newGroupNode = convertOldGroupToNewStructure(oldGroup)
          groupData.value = newGroupNode
        }
      }
    }

    // 初始化时加载数据
    initializeData()

    // 监听外部数据变化，但避免重复更新造成死循环
    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        // 检查是否为本组件引起的更新，如果是则跳过
        if (skipNextWatch.value) {
          skipNextWatch.value = false
          return
        }

        // 简单地检查JSON字符串是否相同，避免不必要的更新
        const newValStr = JSON.stringify(newVal)
        const currentValStr = JSON.stringify(groupData.value)

        if (newValStr !== currentValStr) {
          initializeData()
        }
      },
      { deep: true }
    )

    // 通过添加方法同步到父组件，而不是通过watch
    // 递归检查所有条件组是否有效
    const validateAllGroups = (group: ConditionGroupNode): boolean => {
      // 检查当前组是否有效（至少包含两个节点）
      const currentGroupValid = Array.isArray(group.children) && group.children.length >= 2

      // 如果当前组无效，直接返回 false
      if (!currentGroupValid) {
        return false
      }

      // 递归检查所有子组
      for (const child of group.children) {
        if (child.nodeType === NodeType.GROUP) {
          if (!validateAllGroups(child)) {
            return false
          }
        }
      }

      return true
    }

    // 获取验证结果
    const allGroupsValid = computed(() => {
      return validateAllGroups(groupData.value)
    })

    const syncToParent = () => {
      skipNextWatch.value = true

      // 复制数据
      const dataToEmit = JSON.parse(JSON.stringify(groupData.value))

      console.log('RuleGroup 同步数据到父组件:', JSON.stringify(dataToEmit))

      // 发送数据到父组件
      emit('update:modelValue', dataToEmit)

      // 额外发出验证状态事件，如果需要在父组件捕获
      emit('validation', allGroupsValid.value)
    }

    const addCondition = () => {
      // 创建新的条件节点
      const newNode = createConditionItemNode(
        props.fields.length > 0 ? props.fields[0].value : '',
        OperatorType.EQUAL,
        ''
      )
      // 确保children数组存在
      if (!Array.isArray(groupData.value.children)) {
        groupData.value.children = []
      }
      // 添加到children数组
      groupData.value.children.push(newNode)
      syncToParent()
    }

    const addGroup = () => {
      // 创建新的条件组节点
      const newNode = createConditionGroupNode(ConditionGroupType.AND, [])

      // 确保children数组存在
      if (!Array.isArray(groupData.value.children)) {
        groupData.value.children = []
      }
      // 添加到children数组
      groupData.value.children.push(newNode)
      syncToParent()
    }

    const updateConditionNode = (index: number, node: ConditionItemNode) => {
      if (index >= 0 && index < groupData.value.children.length) {
        // 确保要更新的节点是条件项类型
        if (groupData.value.children[index].nodeType === NodeType.ITEM) {
          groupData.value.children[index] = node
          syncToParent()
        }
      }
    }

    const updateGroupNode = (index: number, node: ConditionGroupNode) => {
      if (index >= 0 && index < groupData.value.children.length) {
        // 确保要更新的节点是条件组类型
        if (groupData.value.children[index].nodeType === NodeType.GROUP) {
          groupData.value.children[index] = node
          syncToParent()
          console.log('子条件组更新，同步到父组件')
        }
      }
    }

    const removeNode = (index: number) => {
      if (index >= 0 && index < groupData.value.children.length) {
        groupData.value.children.splice(index, 1)
        syncToParent()
      }
    }

    // 保留旧方法以兼容现有组件调用
    const updateCondition = (index: number, condition: ConditionItemNode) => {
      console.warn('使用已过时的updateCondition方法，请更新为updateConditionNode')
      const conditionNode: ConditionItemNode = {
        id: condition.id || generateUniqueId(),
        nodeType: NodeType.ITEM,
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      }
      updateConditionNode(index, conditionNode)
    }

    const removeCondition = (index: number) => {
      console.warn('使用已过时的removeCondition方法，请更新为removeNode')
      removeNode(index)
    }

    const updateGroup = (index: number, group: ConditionGroupNode) => {
      console.warn('使用已过时的updateGroup方法，请更新为updateGroupNode')
      const groupNode = convertOldGroupToNewStructure(group)
      updateGroupNode(index, groupNode)
    }

    const removeGroup = (index: number) => {
      console.warn('使用已过时的removeGroup方法，请更新为removeNode')
      removeNode(index)
    }

    // 获取节点编号，使用顺序编号
    const getNodeNumber = (index: number): string => {
      const node = groupData.value.children[index]
      if (!node) return `${index + 1}` // 兜底处理

      // 从编号映射中获取顺序号
      const sequenceNumber = props.numberMap.get(node.id)
      return sequenceNumber ? `${sequenceNumber}` : `${index + 1}`
    }

    return {
      groupData,
      ConditionGroupType,
      NodeType,
      addCondition,
      addGroup,
      updateConditionNode,
      updateGroupNode,
      removeNode,
      getNodeNumber,
      // 兼容旧方法
      updateCondition,
      removeCondition,
      updateGroup,
      removeGroup,
      syncToParent,
      totalConditionsCount,
      isValidGroup,
      allGroupsValid,
      validateAllGroups,
      Plus,
      Minus,
      FolderAdd
    }
  }
})
</script>

<style lang="scss" scoped>
.rule-group-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  // margin-bottom: 10px;
  background-color: rgba(250, 250, 250, 0.8);
}

.invalid-group {
  border: 1px solid #f0a5a5;
  background-color: rgba(253, 226, 226, 0.1);
}

.root-group {
  border: none;
  background-color: transparent;
  padding: 0;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
}

.group-left-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}

.group-type-selector {
  min-width: 200px;
  margin-right: 8px;
}

.inline-validation {
  margin-left: 5px;
  /* 移除margin-right:auto,防止它推开右侧的删除按钮 */
}

.compact-alert {
  display: flex;
  align-items: center;
  padding: 3px 6px;
  background-color: rgba(230, 162, 60, 0.1);
  border-radius: 3px;
  border-left: 2px solid #e6a23c;
  font-size: 12px;
  white-space: nowrap;
}

.compact-alert i {
  color: #e6a23c;
  margin-right: 4px;
  font-size: 12px;
}

.compact-alert span {
  color: #8c6134;
}

.group-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  min-width: max-content; /* 确保按钮大小由内容决定 */
  gap: 4px; /* 按钮之间的间距 */
  margin-left: 15px; /* 与左侧内容保持一定距离 */
  .el-button + .el-button {
    margin-left: 4px; /* 确保按钮之间有间距 */
  }
}

.conditions-container {
  margin-bottom: 15px;
}

.condition-wrapper {
  display: flex;
  align-items: center; /* 改为居中对齐 */
  margin-bottom: 10px;
  position: relative;
}

.condition-number {
  min-width: 25px;
  padding: 0 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  /* 移除margin-top */
}

.number-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  top: -1px; /* 轻微向上调整以视觉上更加居中 */
}

.condition-content {
  flex: 1;
  display: flex;
  align-items: center; /* 确保内容垂直居中 */
}

.condition-item {
  width: 100%;
  display: flex;
  align-items: center; /* 确保条件项垂直居中 */
}

.nested-group {
  width: 100%;
  /* border-left: 2px dashed #409eff; */
  // padding-left: 10px;
}

.nested-content {
  align-items: flex-start; /* 嵌套内容顶部对齐 */
  padding-top: 5px; /* 给嵌套内容顶部一点空间 */
}

.group-type-selector {
  margin-right: 15px;
}
</style>
