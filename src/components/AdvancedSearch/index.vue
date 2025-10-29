<template>
  <div class="searchView" ref="searchViewRef">
    <div ref="searchViewContentRef" class="searchView-content" :class="{ expanded: openBtnExpand }">
      <el-form :model="formModel" ref="formRef" class="form-container">
        <el-row style="min-height: 52px; width: 100%" :gutter="10">
          <!-- 搜索条件栏 -->
          <el-col v-for="(item, index) in displayItems" :key="index" :span="colSpanComputed(item)">
            <el-form-item :label="`${t(item.label)} :`" :prop="item.paramKey">
              <slot v-if="item.isSlot" :name="item.paramKey" />
              <div style="width: 100%" v-else>
                <!-- input输入框 -->
                <el-input v-if="item.type === 'input'" v-model="formModel[item.paramKey]"
                  :placeholder="t(item.placeholder!)" clearable></el-input>
                <!-- select 字典插件下拉框 -->
                <dictionary-select v-if="item.type === 'dictselect'" :code="item.code"
                  v-model="formModel[item.paramKey]" clear />
                <!-- select 普通下拉框 -->
                <el-select class="search-select" v-if="item.type === 'select'" v-model="formModel[item.paramKey]"
                  :placeholder="t(item.placeholder!)" filterable clearable @clear="handleClear(item.paramKey)">
                  <el-option v-for="option in item.selectOptions" :key="option.id"
                    :label="option.name || option.label || option.dictName || option.catalogName"
                    :value="option.id || option.value || option.dictCode"
                    @change="selecteChange(item.paramKey)"></el-option>
                </el-select>
                <!-- select 多选下拉框 -->
                <el-select class="search-select" v-if="item.type === 'multiselect'" v-model="formModel[item.paramKey]"
                  multiple collapse-tags collapse-tags-tooltip filterable clearable @clear="handleClear(item.paramKey)">
                  <el-option v-for="option in item.selectOptions" :key="option.id" :label="option.name"
                    :value="option.id"></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <!-- 搜索按钮区域作为一个 col -->
          <el-col :span="btnColSpan" class="search-btn-col">
            <div class="searchBtn" ref="searchBtnRef" :class="{ expanded: openBtnExpand }">
              <slot name="checkBox" />
              <div class="button-group">
                <el-button type="primary" @click="onSearch">{{ t('SEARCH_BUTTON') }}</el-button>
                <el-button v-if="isShowReset" @click="onReset">{{ t('RESET_BUTTON') }}</el-button>
                <slot name="btnBox" />
                <el-popover v-if="isMoreCondition" placement="bottom" :width="300" trigger="click"
                  popper-class="filter-popover" @before-enter="moreBtnExpand = true"
                  @before-leave="moreBtnExpand = false">
                  <div>
                    <el-input placeholder="搜索可选条件" v-model="keyword" suffix-icon="Search" clearable />
                    <div class="filter-title selected">
                      <span>已选条件</span>
                      <el-button link type="primary" @click="clearSelectedFields">
                        <el-icon>
                          <CircleClose />
                        </el-icon>清空
                      </el-button>
                    </div>
                    <div class="check-list">
                      <div
                        v-for="item in selectedFields.filter((i) => (keyword ? i.fieldName.includes(keyword) : true))"
                        :key="item.fieldCode">
                        <el-checkbox v-model="item.checfked">{{ item.fieldName }}</el-checkbox>
                      </div>
                    </div>
                    <div class="filter-title">
                      <span>可选条件</span>
                    </div>
                    <div class="check-list">
                      <div v-for="item in nonSelectedFields.filter((i) =>
                        keyword ? i.fieldName.includes(keyword) : true
                      )" :key="item.fieldCode">
                        <el-checkbox v-model="item.checked" @change="removeItem(item)">{{
                          item.fieldName
                        }}</el-checkbox>
                      </div>
                    </div>
                  </div>
                  <template #reference>
                    <el-button>
                      更多
                      <el-icon class="more-icon" :class="moreBtnExpand ? ' expand' : ''">
                        <ArrowDown />
                      </el-icon>
                    </el-button>
                  </template>
                </el-popover>
                <el-button type="text" v-if="props.formItemList.length >= rowItemMaxNumber" class="open"
                  @click="changeOpenBtnState">{{
                    openBtnExpand ? '收起' : '展开' }}</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- <list-filter
      v-if="isMoreCondition"
      :selected-fields="selectedFields"
      :option-map="optionMap"
      :search-form="fieldSearchForm"
      @getList="handleSearch"
      @removeItem="removeItem"
    /> -->
      <div class="searchView-bottomLine"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SearchFormItem, SearchFormRow, ParamData } from '@/types/search'
import { watch, ref, computed, nextTick, onMounted } from 'vue'
import { CircleClose, ArrowDown } from '@element-plus/icons-vue'
import DictionarySelect from '@/components/DictionarySelect/index.vue'
// import ListFilter from '@/components/listFilter/index.vue'
import { useI18n } from 'vue-i18n'
import { FormFieldItem, ControlType, OptionItem } from '@/types/form'
import { getObjectType } from '@/utils/index'

// 定义FactoryQueryParams接口
interface FactoryQueryParams {
  [key: string]: any
}
const { t } = useI18n()
const emit = defineEmits()

const formModel = ref({
  type: Object,
  default: () => ({})
})
const moreBtnExpand = ref(false)
const openBtnExpand = ref(false)
const props = defineProps({
  formItemList: {
    //查询条件数组
    type: Array as () => SearchFormItem[],
    default: []
  },
  isMoreCondition: {
    //是否显示更多查询条件
    type: Boolean,
    default: false
  },
  fields: {
    //多条件查询,条件列表数据,需要父组件传入
    type: Array as () => (FormFieldItem & {
      checked?: boolean
      options?: OptionItem[]
      dateType?: any
      searchKeyword?: string
    })[],
    default: []
  },
  fieldSearchForm: {
    //多条件查询查询条件
    type: Object as () => FactoryQueryParams,
    default: {}
  },
  optionMap: {
    //筛选项为单选、多选的选项列表
    type: Object as () => { [key: string]: OptionItem[] },
    default: {}
  },
  isShowReset: {
    type: Boolean,
    default: true
  },
  rowItemMaxNumber: {
    type: Number,
    default: 4
  }
})
const searchViewRef = ref()
const searchBtnRef = ref()
const formRef = ref()
const searchViewContentRef = ref()
const keyword = ref('') //多条件查询输入框字符串
const selecteChange = (item) => {
  console.log(343434343434, item);
}
// 计算el-col的span值
const getItemSpanFactor = (item: SearchFormItem) => {
  return item?.multiple ? item.multiple : 1
}

const colSpan = computed(() => {
  // 不展开时，留一部分空间给按钮区域
  return Math.ceil(24 / props.rowItemMaxNumber)
})

const colSpanComputed = (item: SearchFormItem) => {
  return getItemSpanFactor(item) * colSpan.value
}

const rowColSpanMap = computed(() => {
  // 计算每一行的span值
  // 返回对应map
  // 例如
  // return { 1: [6, 6, 6, 6], 2: [12], 3: [24] }
  // 能保证该换行的时候换行
  const rowColSpan: { [key: number]: number[] } = {}
  let currentRow = 1
  let currentRowSpan = 0
  props.formItemList.forEach((item) => {
    const itemSpan = colSpanComputed(item)
    if (!rowColSpan[currentRow]) {
      rowColSpan[currentRow] = []
    }
    if (currentRowSpan + itemSpan > 24) {
      // 当前行已满，换行
      currentRow += 1
      currentRowSpan = itemSpan
      if (!rowColSpan[currentRow]) {
        rowColSpan[currentRow] = []
      }
    } else {
      currentRowSpan += itemSpan
    }
    rowColSpan[currentRow].push(itemSpan)
  })
  return rowColSpan
})
console.log('rowColSpanMap', rowColSpanMap.value)

// 按钮区域的宽度
const btnColSpan = computed(() => {
  // 在不展开时，给按钮区域一个固定宽度
  if (!openBtnExpand.value) {
    // 计算所有显示项目占用的总空间
    let totalItemsSpan = 0
    const visibleItems = props.formItemList.slice(0, props.rowItemMaxNumber - 1)
    visibleItems.forEach((item) => {
      totalItemsSpan += colSpan.value * getItemSpanFactor(item)
    })
    // 留出按钮区域的空间
    return 24 - totalItemsSpan
  }

  // 展开时根据剩余空间自适应
  // 获取 rowColSpanMap 的最后一项 的 值 的和
  const lastRow = Object.keys(rowColSpanMap.value).length
  if (lastRow === 0) {
    return 24 // 如果没有行，则占满整行
  }
  const lastRowSpans = rowColSpanMap.value[lastRow]
  if (!lastRowSpans || lastRowSpans.length === 0) {
    return 24 // 如果最后一行没有span，则占满整行
  }
  // 计算当前行所有项的总span
  const lastRowTotalSpan = lastRowSpans.reduce((sum, span) => sum + span, 0)

  // 计算当前行剩余空间 (如果当前行已满或不足，则占用整行)
  const remainingSpan = lastRowTotalSpan % 24 === 0 ? 24 : 24 - (lastRowTotalSpan % 24)
  // 如果剩余空间不足以显示按钮区域，则占用整行
  return remainingSpan < 4 ? 24 : remainingSpan
})

// 展示的表单项
const displayItems = computed(() => {
  if (!openBtnExpand.value) {
    // 不展开时只显示部分项
    return props.formItemList.slice(0, props.rowItemMaxNumber - 1)
  } else {
    // 展开时显示全部
    return props.formItemList
  }
})

/**处理多条件查询组件 */
// 查询列表中，所选中的列表数据
const selectedFields = computed(() => {
  return props.fields.filter((i) => i.checked)
})
// 查询列表中，未选中的列表数据
const nonSelectedFields = computed(() => {
  return props.fields.filter((i) => !i.checked)
})

// 初始化一些表单数据
const handleSearchData = (item: FormFieldItem) => {
  if ([ControlType.number, ControlType.money].includes(item.formControlType)) {
    props.fieldSearchForm[item.fieldCodeCamelCase] = { max: null, min: null }
  }
  if ([ControlType.date, ControlType.dateRange].includes(item.formControlType)) {
    props.fieldSearchForm[item.fieldCodeCamelCase] = []
  }
  // 可以根据类型判断，鉴于不熟悉之前的逻辑，现在处理方式重置是判断 props.fieldSearchForm[item.fieldCodeCamelCase]的类型，如果是数组就重置数组，如果是字符串重置字符串
  // if ([ControlType.input, ControlType.textarea].includes(item.formControlType)) {
  //     props.fieldSearchForm[item.fieldCodeCamelCase] = ''
  // }
  // if ([ControlType.checkbox, ControlType.radio,ControlType.cascader,ControlType.organization].includes(item.formControlType)) {
  //     props.fieldSearchForm[item.fieldCodeCamelCase] = []
  // }
  const obj = props.fieldSearchForm[item.fieldCodeCamelCase]
  if (getObjectType(obj) === 'Array') {
    props.fieldSearchForm[item.fieldCodeCamelCase] = []
  }
  if (getObjectType(obj) === 'String') {
    props.fieldSearchForm[item.fieldCodeCamelCase] = ''
  }
}

// 移除已选择的筛选项
const removeItem = (item) => {
  item.checked = false
  handleSearchData(item)
  emit('removeItem', item)
}

// 清空所有选择的筛选项,
const clearSelectedFields = () => {
  props.fields.forEach((i) => {
    i.checked = false
    handleSearchData(i)
  })
  emit('refreshData') //刷新列表页面数据，调用列表页面getList接口
}
const handleSearch = () => {
  emit('refreshData')
}

// 整理筛选项数据
const getParams = () => {
  const params: FactoryQueryParams = {}
  selectedFields.value.forEach((item) => {
    const value = props.fieldSearchForm[item.fieldCodeCamelCase]
    switch (item.formControlType) {
      case ControlType.date:
      case ControlType.dateRange:
        params[item.fieldCodeCamelCase] = value.length
          ? {
            start: value[0],
            end: value[1]
          }
          : undefined
        break
      case ControlType.radio:
      case ControlType.checkbox:
        params[item.fieldCodeCamelCase] = value?.map((i) => i.textValue) || undefined
        break
      case ControlType.cascader:
        params[item.fieldCodeCamelCase] = value?.length
          ? value.reduce((pre, curr) => {
            return {
              ...pre,
              [curr.regionCode]: curr.regionName
            }
          }, {} as any)
          : undefined
        break
      case ControlType.number:
      case ControlType.money:
        params[item.fieldCodeCamelCase] = value.max || value.min ? value : undefined
        break
      default: // default: input/textarea/number/money/organization
        params[item.fieldCodeCamelCase] = value || undefined
    }
  })
  return params
}
// 已移除 CSS 变量设置，改用计算属性
watch(
  () => props.formItemList,
  (val) => {
    val.forEach((item: SearchFormItem) => {
      formModel.value[item.paramKey] = item.modelValue
    })
  },
  {
    deep: true,
    immediate: true
  }
)

const onSearch = () => {
  console.log(formModel.value, 'val==')
  emit('onSearch', formModel.value)
}

const onReset = () => {
  formRef.value.resetFields()
  emit('onReset')
}
const handleClear = (parimaryKey: string) => {
  emit('onClear', parimaryKey)
}
// 展开 /收起
const changeOpenBtnState = () => {
  openBtnExpand.value = !openBtnExpand.value
  emit('toggleOpenState')
}
// 不再需要chunk函数，由el-col组件自动处理布局
onMounted(() => {
  // formMode中的数据，从props.formItemList获取,并且每一项都是一个defineModel宏
  props.formItemList.forEach((item: SearchFormItem) => {
    formModel.value[item.paramKey] = item.modelValue ?? ''
  })
})
defineExpose({
  getParams
})
// 提供对外暴露的接口,用户可在此方法中,重新gei
</script>
<style lang="scss">
/* @import '@/styles/common-filter.scss'; */
@import '@/style/variables.scss';

.searchView {
  width: 100%;
  position: relative;
  margin-bottom: $mainPadding;

  &-bottomLine {
    height: 1px;
    background-color: $mainBorderColor;
    position: absolute;
    bottom: 0px;
    left: (-$mainPadding);
    right: (-$mainPadding);
  }

  &-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;

    &.expanded {
      flex-direction: column;

      .form-container {
        width: 100%;
      }

      .searchBtn {}
    }

    &:not(.expanded) {
      .form-container {
        width: 100%;
      }

      .search-btn-col {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
      }

      .searchBtn {}
    }

    .el-select .el-select__wrapper {
      border: none !important;
      box-shadow: none !important;

      &.is-hovering {
        box-shadow: none !important;
      }
    }

    .el-range-editor.el-input__wrapper {
      box-shadow: none !important;
    }

    .el-date-editor.el-input__wrapper {
      box-shadow: none;
    }

    .searchBtn {
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 10px;

      .open {
        color: $color_primary;
        margin-left: 20px;
        cursor: pointer;
      }

      .button-group {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;

        .el-button+.el-button {
          margin-left: 8px;
        }
      }

      .more-icon,
      :deep(.more-icon) {
        transform: rotate(0);
        transition: all 0.2s linear;
        margin-left: 4px;

        &.expand {
          transform: rotate(180deg);
        }
      }
    }

    .form-container {
      display: flex;
      flex-wrap: wrap;
    }

    .el-form {
      width: 100%;
      flex: 1;

      .el-form-item {
        border: 1px solid $mainBorderColor;
        padding: 0px 10px;
        border-radius: $mainBorderRadius;
        margin-right: 12px;
        margin-bottom: 10px;
        align-items: center;

        .el-input {
          --el-input-border-color: #ffffff !important;
          --el-input-hover-border-color: #ffffff !important;
          --el-input-focus-border-color: #ffffff !important;
          width: 100%;

          :deep(.el-input__wrapper) {
            border: 0px solid #ffffff;
            padding: 0px !important;
          }
        }
      }
    }
  }
}
</style>
