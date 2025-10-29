<template>
  <el-select
    v-model="model"
    :placeholder="placeholder || t('SELECT_PLACEHOLDER_COMMON')"
    :multiple="multiple"
    :disabled="readonly"
    :filterable="allowCreate"
    :allow-create="allowCreate"
    :default-first-option="allowCreate"
    :reserve-keyword="!allowCreate"
    :clearable="clear"
    @clear="handleClear"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script lang="ts" setup>
// import { ORG_TYPE, ORG_NOTIFY, ORG_TAGS } from '@/utils/constant';
import { computed } from 'vue'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

type SelectOption = {
  value: number | string
  label: string
}

const model = defineModel<string | number | number[] | string[] | null>()

const props = defineProps({
  // modelValue: String || Array,
  code: String,
  multiple: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  allowCreate: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  clear: {
    type: Boolean,
    default: false
  }
})

const jobDict = inject('jobDict', null) as any
const orgDict = inject('orgDict', null) as any
const options = computed<SelectOption[]>(() => {
  switch (props.code) {
    // case 'orgType':
    // // return orgDict.value?.orgType || [];
    // return ORG_TYPE;
    // case 'orgTags':
    //   return ORG_TAGS;
    // case 'orgNotify':
    //   return ORG_NOTIFY;
    // case 'product':
    //   return [
    //     { value: 'sed-saas', label: '污水云'}
    //   ]
    case 'jobStatus':
      return jobDict.value?.jobTemplate?.status || []
    case 'jobSource':
      return jobDict.value?.jobTemplate?.source || []
    case 'jobLevel':
      return jobDict.value?.jobTemplate?.level || []
    case 'instanceType':
      return jobDict.value?.jobInstance?.type || []
    case 'instanceStatus':
      return jobDict.value?.jobInstance?.status || []
    case 'executionStatus':
      return jobDict.value?.jobExecution?.status || []
    case 'serviceAccounts':
      return jobDict.value?.serviceAccounts || []
    case 'pvcs':
      return jobDict.value?.pvcs || []
  }
})

const handleClear = () => {
  model.value = null
}
</script>

<style lang="scss" scoped>
:deep(.el-select__input) {
  margin-left: 0;
  height: 24px;
}
</style>
