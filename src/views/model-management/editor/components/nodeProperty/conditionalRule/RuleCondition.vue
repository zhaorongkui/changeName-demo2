<template>
  <div class="rule-condition">
    <div class="condition-content">
      <!-- 字段选择 -->
      <el-select
        v-model="conditionData.field"
        size="small"
        placeholder="选择字段"
        @change="handleFieldChange"
        class="field-selector"
      >
        <el-option v-for="field in fields" :key="field.value" :label="field.label" :value="field.value"> </el-option>
      </el-select>

      <!-- 操作符选择 -->
      <el-select v-model="conditionData.operator" size="small" placeholder="选择操作符" class="operator-selector">
        <el-option v-for="op in availableOperators" :key="op.value" :label="op.label" :value="op.value"> </el-option>
      </el-select>

      <!-- 值类型选择 -->
      <el-select
        v-model="conditionData.valueType"
        size="small"
        placeholder="值类型"
        class="value-type-selector"
        v-if="!['is_null', 'is_not_null'].includes(conditionData.operator)"
      >
        <el-option v-for="type in valueTypes" :key="type.value" :label="type.label" :value="type.value"> </el-option>
      </el-select>

      <!-- 值输入 -->
      <div class="value-input" v-if="!['is_null', 'is_not_null'].includes(conditionData.operator)">
        <!-- 根据字段类型和操作符动态显示不同的输入控件 -->
        <template v-if="typeof getInputComponent === 'string'">
          <component
            :is="getInputComponent"
            v-model="conditionData.value"
            :placeholder="'输入值'"
            :field-type="actualValueType"
            size="small"
          >
          </component>
        </template>
        <template v-else-if="actualValueType === 'boolean'">
          <el-select v-model="conditionData.value" size="small" placeholder="选择值">
            <el-option
              v-for="option in getInputComponent.options"
              :key="String(option.value)"
              :label="option.label"
              :value="option.value"
            >
            </el-option>
          </el-select>
        </template>
      </div>
    </div>

    <div class="condition-actions">
      <el-tooltip content="删除条件" placement="top">
        <el-button size="small" @click="$emit('remove')" circle :icon="Delete"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { ConditionItem, FieldOption, getOperatorsByFieldType, ConditionItemNode, NodeType, OperatorType } from './types'
import { Delete } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'RuleCondition',
  props: {
    modelValue: {
      type: Object as () => ConditionItemNode,
      required: true
    },
    fields: {
      type: Array as () => FieldOption[],
      required: true
    }
  },
  emits: ['update:modelValue', 'remove'],
  setup(props, { emit }) {
    const conditionData = ref<ConditionItemNode>({
      id: '',
      nodeType: NodeType.ITEM,
      field: '',
      operator: OperatorType.EQUAL,
      value: '',
      valueType: ''
    })

    // 初始化和监听外部数据变化
    const isUpdatingFromProps = ref(false)

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal) {
          isUpdatingFromProps.value = true
          nextTick(() => {
            conditionData.value = JSON.parse(JSON.stringify(newVal))
            // 如果没有值类型，则使用字段类型作为默认值
            if (!conditionData.value.valueType) {
              conditionData.value.valueType = currentFieldType.value
            }
            // 在下一个tick恢复标志，以便后续的本地更改可以触发emit
            nextTick(() => {
              isUpdatingFromProps.value = false
            })
          })
        }
      },
      { immediate: true, deep: true }
    )

    // 监听内部数据变化，同步到外部
    watch(
      () => conditionData.value,
      (newVal) => {
        if (!isUpdatingFromProps.value) {
          emit('update:modelValue', JSON.parse(JSON.stringify(newVal)))
        }
      },
      { deep: true }
    )

    // 获取当前字段类型
    const currentFieldType = computed(() => {
      const field = props.fields.find((f) => f.value === conditionData.value.field)
      return field ? field.type : 'string'
    })

    // 可选的值类型
    const valueTypes = computed(() => {
      return [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '布尔值', value: 'boolean' },
        { label: '日期', value: 'date' }
      ]
    })

    // 实际使用的值类型
    const actualValueType = computed(() => {
      return conditionData.value.valueType || currentFieldType.value
    })

    // 根据字段类型获取可用的操作符
    const availableOperators = computed(() => {
      return getOperatorsByFieldType(currentFieldType.value)
    })

    // 布尔值选项
    const booleanOptions = [
      { label: '是', value: true },
      { label: '否', value: false }
    ]

    // 根据值类型获取对应的输入组件
    const getInputComponent = computed(() => {
      switch (actualValueType.value) {
        case 'number':
          return 'el-input-number'
        case 'boolean':
          return {
            component: 'el-select',
            options: booleanOptions
          }
        case 'date':
          return 'el-date-picker'
        default:
          return 'el-input'
      }
    })

    // 处理字段变化，重置操作符和值
    const handleFieldChange = () => {
      const field = props.fields.find((f) => f.value === conditionData.value.field)
      if (field) {
        // 根据字段类型设置默认操作符
        const defaultOperator = getOperatorsByFieldType(field.type)[0]?.value || OperatorType.EQUAL
        conditionData.value.operator = defaultOperator as OperatorType

        // 设置值类型为字段类型
        conditionData.value.valueType = field.type

        // 根据字段类型设置默认值
        switch (field.type) {
          case 'number':
            conditionData.value.value = 0
            break
          case 'boolean':
            // 对于布尔值，使用下拉选择的第一个选项作为默认值
            conditionData.value.value = booleanOptions[0].value
            break
          case 'date':
            conditionData.value.value = ''
            break
          default:
            conditionData.value.value = ''
            break
        }
      }
    }

    return {
      conditionData,
      currentFieldType,
      valueTypes,
      actualValueType,
      availableOperators,
      getInputComponent,
      booleanOptions,
      handleFieldChange,
      Delete
    }
  }
})
</script>

<style scoped>
.rule-condition {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.condition-content {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
}

.field-selector {
  width: 25%;
  min-width: 100px;
}

.operator-selector {
  width: 20%;
  min-width: 90px;
}

.value-type-selector {
  width: 20%;
  min-width: 90px;
}

.value-input {
  flex: 1;
  min-width: 100px;
}

.condition-actions {
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 确保删除按钮靠右 */
  white-space: nowrap; /* 防止按钮换行 */
}
</style>
