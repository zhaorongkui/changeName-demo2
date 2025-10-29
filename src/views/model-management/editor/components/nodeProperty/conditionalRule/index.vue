<template>
  <div class="conditional-rule-container">
    <div v-if="showResult && ruleExpression" class="rule-result">
      <div class="rule-expression-row">
        <span class="rule-content">
          关系式
          <span class="rule-bold" v-html="ruleExpression"></span>， 成立时通过，否则直接拒绝
        </span>
      </div>
    </div>
    <div class="rule-group">
      <RuleGroup
        v-model="ruleData"
        :fields="fieldOptions"
        :is-root="true"
        path=""
        :number-map="conditionNumberMap"
        @update:model-value="updateRule"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick, defineExpose } from 'vue'
import RuleGroup from './RuleGroup.vue'
import {
  ConditionGroupType,
  ConditionItemNode,
  ConditionGroupNode,
  FieldOption,
  NodeType,
  createConditionGroupNode,
  convertOldGroupToNewStructure,
  convertNewStructureToOldGroup
} from './types'

export default defineComponent({
  name: 'ConditionalRule',
  components: {
    RuleGroup
  },
  props: {
    fields: {
      type: Array as () => FieldOption[],
      default: () => []
    },
    properties: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const ruleData = ref<ConditionGroupNode>(createConditionGroupNode())

    // 全局条件计数器，用于按顺序生成编号
    const conditionCounter = ref(0)

    const fieldOptions = ref<FieldOption[]>(props.fields)

    // 标记是否正在从props更新
    const isUpdatingFromProps = ref(false)

    const echoRuleData = (condition: ConditionGroupNode) => {
      if (condition) {
        isUpdatingFromProps.value = true
        nextTick(() => {
          ruleData.value = JSON.parse(JSON.stringify(condition))
          nextTick(() => {
            isUpdatingFromProps.value = false
            generateRuleExpression()
          })
        })
      }
    }

    onMounted(() => {
      const { condition } = props.properties as { condition: ConditionGroupNode }
      echoRuleData(condition)
    })

    watch(
      () => props.fields,
      (newVal) => {
        fieldOptions.value = newVal
      },
      { deep: true }
    )

    watch(
      () => props.properties,
      (newVal) => {
        // 如果有需要处理的属性变化逻辑，可以在这里添加
        console.log('属性变化:', newVal)
        const { condition } = newVal as { condition: ConditionGroupNode }
        echoRuleData(condition)
      },
      { deep: true }
    )

    const updateRule = (val: ConditionGroupNode) => {
      if (!isUpdatingFromProps.value) {
        // 使用 val 更新本地数据
        ruleData.value = JSON.parse(JSON.stringify(val))
        // 更新规则表达式
        console.log('ConditionalRule 收到更新:', JSON.stringify(val))
        generateRuleExpression()
      } else {
        console.log('ConditionalRule 忽略更新(来自props):', JSON.stringify(val))
      }
    }

    const getRuleData = () => {
      console.log('获取规则数据:', JSON.stringify(ruleData.value))
      return {
        condition: JSON.parse(JSON.stringify(ruleData.value))
      }
    }

    // 是否显示结果
    const showResult = ref(true)

    // 规则表达式文本
    const ruleExpression = ref('')

    // 根据字段ID获取字段名称
    const getFieldLabelByValue = (value: string): string => {
      const field = fieldOptions.value.find((f) => f.value === value)
      return field ? field.label : value
    }

    // 获取操作符的中文显示
    const getOperatorLabel = (operatorValue: string): string => {
      const operatorMap: Record<string, string> = {
        '=': '等于',
        '!=': '不等于',
        '>': '大于',
        '>=': '大于等于',
        '<': '小于',
        '<=': '小于等于',
        contains: '包含',
        not_contains: '不包含',
        starts_with: '开头是',
        ends_with: '结尾是',
        is_null: '为空',
        is_not_null: '不为空'
      }
      return operatorMap[operatorValue] || operatorValue
    }

    // 将条件节点转换为带圆圈编号的HTML标签
    const nodeToHtml = (node: ConditionItemNode | ConditionGroupNode, index: number): string => {
      if (!node) return `未知条件`

      // 获取节点顺序编号
      const sequenceNumber = conditionNumberMap.value.get(node.id) || index + 1

      if (node.nodeType === NodeType.ITEM) {
        // 条件项返回带圆圈的编号HTML
        return `<span class="rule-number">${sequenceNumber}</span>`
      } else if (node.nodeType === NodeType.GROUP) {
        // 条件组需要递归处理，但不显示组本身的编号
        return groupNodeToHtml(node)
      }

      return `未知节点类型`
    }

    // 将条件组节点转换为带圆圈编号的HTML
    const groupNodeToHtml = (groupNode: ConditionGroupNode): string => {
      if (!groupNode || !groupNode.children) return ''

      const joinWord = groupNode.type === ConditionGroupType.AND ? '且' : '或'

      // 处理所有子节点
      const nodeHtmls = groupNode.children
        .map((node) => {
          if (node.nodeType === NodeType.ITEM) {
            // 条件项返回带圆圈的编号
            // 获取条件项的顺序编号
            const sequenceNumber = conditionNumberMap.value.get(node.id) || 0
            return `<span class="rule-number">${sequenceNumber}</span>`
          } else if (node.nodeType === NodeType.GROUP) {
            // 子条件组需要用括号包围，但不显示组本身的编号
            const subHtml = groupNodeToHtml(node)
            return subHtml ? `<span class="rule-group-inline">（${subHtml}）</span>` : ''
          }
          return ''
        })
        .filter((html) => html) // 过滤掉空字符串

      if (nodeHtmls.length === 0) {
        return ''
      }

      // 返回带HTML标签的表达式，使用更紧凑的连接方式
      return nodeHtmls.join(` <span class="join-word">${joinWord}</span> `)
    }

    // 生成规则表达式
    const generateRuleExpression = () => {
      if (!ruleData.value) {
        ruleExpression.value = ''
        return
      }

      // 确保children数组存在且有内容
      const hasChildren = Array.isArray(ruleData.value.children) && ruleData.value.children.length > 0

      if (hasChildren) {
        try {
          // 使用带圆圈的编号生成规则表达式
          ruleExpression.value = groupNodeToHtml(ruleData.value)
        } catch (error) {
          console.error('生成规则表达式时出错：', error)
          ruleExpression.value = '规则表达式生成失败'
        }
      } else {
        ruleExpression.value = ''
      }
    }

    // 生成条件编号表
    const generateConditionMap = () => {
      const map = new Map<string, number>()
      let counter = 1 // 从1开始计数

      // 递归函数，只为条件项节点生成编号
      const processNode = (node: ConditionItemNode | ConditionGroupNode) => {
        // 仅为条件项节点分配编号
        if (node.nodeType === NodeType.ITEM) {
          map.set(node.id, counter++)
        }

        // 如果是条件组，递归处理其子节点
        if (node.nodeType === NodeType.GROUP && Array.isArray(node.children)) {
          for (const child of node.children) {
            processNode(child)
          }
        }
      }

      // 如果有根节点，从根节点开始处理
      if (ruleData.value && Array.isArray(ruleData.value.children)) {
        for (const child of ruleData.value.children) {
          processNode(child)
        }
      }

      conditionCounter.value = counter
      return map
    }

    // 条件ID到序号的映射
    const conditionNumberMap = ref(new Map<string, number>())

    // 监听规则数据变化，自动更新表达式和编号表
    watch(
      ruleData,
      (newVal) => {
        conditionNumberMap.value = generateConditionMap()
        generateRuleExpression()
      },
      { deep: true }
    )

    // 初始化时生成一次表达式和编号表
    onMounted(() => {
      nextTick(() => {
        conditionNumberMap.value = generateConditionMap()
        generateRuleExpression()
      })
    })

    // 根据节点ID获取序号
    const getNodeSequenceNumber = (nodeId: string): number => {
      return conditionNumberMap.value.get(nodeId) || 0
    }

    return {
      ruleData,
      fieldOptions,
      updateRule,
      getRuleData,
      showResult,
      ruleExpression,
      conditionNumberMap,
      getNodeSequenceNumber
    }
  }
})
</script>

<style lang="scss">
/* 规则表达式中的圆形编号样式 - 透明背景带边框 */
/* 移除scoped以使样式应用到v-html生成的内容 */
.rule-number {
  display: inline-flex;
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
  margin: 0 2px;
  vertical-align: middle; /* 确保垂直居中 */
  line-height: 1;
  text-align: center;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  top: -0.5px; /* 微调以与文字对齐 */
}

/* 条件组和连接词样式 */
.rule-group-inline {
  color: #606266;
  display: inline-flex;
  align-items: center;
}

.join-word {
  color: #303133;
  font-weight: 500;
  margin: 0 2px;
  line-height: 1.4;
}
</style>

<style scoped>
.conditional-rule-container {
  width: 100%;
  padding: 12px 0;
}

.rule-group {
  /* border: 1px solid #e4e7ed; */
  /* border-radius: 4px; */
}

.rule-result {
  margin-bottom: 4px;
  padding: 6px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 3px solid #409eff;
  margin-bottom: 12px;

  .rule-expression-row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    .rule-content {
      font-size: 14px;
      color: #303133;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .rule-bold {
        font-size: 14px;
        line-height: 1.4;
        color: #303133;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
      }
    }
  }
}
</style>
