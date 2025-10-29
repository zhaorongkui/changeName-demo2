<template>
  <div class="conditional-rule-example">
    <h3>条件规则示例</h3>
    <div class="rule-container">
      <ConditionalRule ref="conditionalRuleRef" :fields="fieldOptions" />
    </div>

    <div class="rule-preview">
      <h4>规则预览 (JSON)</h4>
      <pre>{{ JSON.stringify(ruleConfig, null, 2) }}</pre>
    </div>

    <div class="rule-actions">
      <el-button type="primary" @click="applyRule">应用规则</el-button>
      <el-button @click="resetRule">重置规则</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ConditionalRule from './index.vue'
import {
  ConditionGroupType,
  FieldOption,
  NodeType,
  OperatorType,
  createConditionItemNode,
  createConditionGroupNode
} from './types'

export default defineComponent({
  name: 'ConditionalRuleExample',
  components: {
    ConditionalRule
  },
  setup() {
    const conditionalRuleRef = ref<InstanceType<typeof ConditionalRule>>()
    // 示例字段选项
    const fieldOptions = ref<FieldOption[]>([
      { label: '温度', value: 'temperature', type: 'number' },
      { label: '流量', value: 'flow', type: 'number' },
      { label: '压力', value: 'pressure', type: 'number' },
      { label: '设备状态', value: 'deviceStatus', type: 'string' },
      { label: '报警时间', value: 'alarmTime', type: 'date' },
      { label: '是否启用', value: 'isEnabled', type: 'boolean' }
    ])

    // 使用新的数据结构创建初始规则配置
    const initialRule = createConditionGroupNode(ConditionGroupType.AND, [
      // 温度 > 30 的条件
      createConditionItemNode('temperature', OperatorType.GREATER_THAN, 30)
    ])

    const ruleConfig = ref(JSON.parse(JSON.stringify(initialRule)))

    const getRuleData = () => {
      return conditionalRuleRef.value?.getRuleData?.() || {}
    }

    // 应用规则
    const applyRule = () => {
      console.log('应用规则:', ruleConfig.value)
      // 这里可以添加实际的规则应用逻辑
    }

    // 重置规则
    const resetRule = () => {
      // 重新创建一个新的初始规则对象
      const newInitialRule = createConditionGroupNode(ConditionGroupType.AND, [
        createConditionItemNode('temperature', OperatorType.GREATER_THAN, 30)
      ])
      ruleConfig.value = JSON.parse(JSON.stringify(newInitialRule))
    }

    return {
      fieldOptions,
      ruleConfig,
      getRuleData,
      applyRule,
      resetRule
    }
  }
})
</script>

<style scoped>
.conditional-rule-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.rule-container {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  background-color: #f8f8f8;
}

.rule-preview {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
}

pre {
  white-space: pre-wrap;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
}

.rule-actions {
  display: flex;
  gap: 10px;
}
</style>
