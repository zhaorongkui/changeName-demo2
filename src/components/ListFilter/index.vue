<!--
 * @Author: lihuihui
 * @Date: 2024-09-29 15:56:24
 * @LastEditors: lihuihui
 * @LastEditTime: 2024-09-29 15:56:29
 * @Description: 请填写简介
-->
<template>
  <div class="selected-search">
      <div v-for="(item, index) in selectedFields" class="popover-item" :key="item.fieldCode">
          <el-popover
              popper-class="search-popover"
              trigger="manual"
              :visible="popoverIndex === index"
          >
              <template #reference>
                  <el-button @click="setPopover(index)">
                      {{ item.fieldName }}：{{ getSearchText(item) }}
                      <el-icon class="more-icon" :class="popoverIndex === index ? ' expand' : ''"><ArrowRight /></el-icon>
                  </el-button>
              </template>
              <div>
                  <el-form-item>
                      <!-- number/money -- 展示上下限 -->
                      <div class="range-item" v-if="[ControlType.number, ControlType.money].includes(item.formControlType) && searchForm[item.fieldCodeCamelCase]">
                          <el-input-number controls-position="right" v-model="searchForm[item.fieldCodeCamelCase].min" placeholder="最低值" clearable />
                          <el-input-number controls-position="right" v-model="searchForm[item.fieldCodeCamelCase].max" placeholder="最高值" clearable />
                      </div>
                      <!-- date/daterange -- 展示时间范围 -->
                      <template v-else-if="item.formControlType.includes('DATE')">
                          <div class="range-item" v-if="item.dateType?.type === 'year'">
                              <el-date-picker
                                  v-for="(i, index) in ['起始', '结束']"
                                  :key="i"
                                  v-model="searchForm[item.fieldCodeCamelCase][index]"
                                  clearable
                                  :placeholder="i + '年'"
                                  type="year"
                                  :value-format="item.dateType?.format"
                              />
                          </div>
                          <el-date-picker
                              v-else
                              v-model="searchForm[item.fieldCodeCamelCase]"
                              clearable
                              :start-placeholder="`起始${item.dateType?.label}`"
                              :end-placeholder="`结束${item.dateType?.label}`"
                              range-separator="至"
                              :type="`${item.dateType?.type}range`"
                              :value-format="item.dateType?.format"
                          />
                      </template>
                      <el-input
                          v-else-if="[ControlType.input, ControlType.textarea].includes(item.formControlType)"
                          placeholder="请输入"
                          v-model="searchForm[item.fieldCodeCamelCase]"
                          clearable
                      />
                      <!-- 级联 -- 显示级联单选 -->
                      <el-cascader-panel
                          v-else-if="item.formControlType === ControlType.cascader"
                          v-model="searchForm[item.fieldCodeCamelCase]"
                          :ref="$event => setItemRef($event as any, item.fieldCodeCamelCase)"
                          :placeholder="item.placeholder || '请选择省-市-区/县'"
                          :props="cascaderProps"
                          clearable
                      />
                      <template v-else>
                          <el-input placeholder="请输入" v-model="item.searchKeyword" @change="searchInput($event, item)" clearable />
                          <!-- checkbox/radio--展示checkbox列表选择 -->
                          <el-checkbox-group v-if="[ControlType.radio, ControlType.checkbox].includes(item.formControlType)" v-model="searchForm[item.fieldCodeCamelCase]">
                              <el-checkbox v-for="option in (item.options || optionMap[item.dictType.name])" :key="option.value" :label="option.value">
                                  {{ option.label }}
                              </el-checkbox>
                          </el-checkbox-group>
                          <!-- 选组织 -- 显示组织多选 -->
                          <el-tree
                              v-if="item.formControlType === ControlType.organization"
                              style="max-width: 600px"
                              :ref="$event => setItemRef($event as any, item.fieldCodeCamelCase)"
                              show-checkbox
                              node-key="orgId"
                              :data="treeData"
                              :props="defaultProps"
                              :check-strictly="true"
                              :filter-node-method="handleFilterNode"
                              @check="(...$event) => handleCheck($event, item)"
                          >
                              <template #default="{ node }">
                                  <p class="tree-item">
                                  <el-tooltip
                                      effect="dark"
                                      :content="node.label"
                                      placement="top"
                                      :show-after="TOOLTIP_SHOW_AFTER"
                                      popper-class="el-tooltip__popper"
                                  >
                                      {{ node.label }}
                                  </el-tooltip>
                                  </p>
                              </template>
                              </el-tree>
                      </template>
                  </el-form-item>
                  <div class="btn-group">
                      <el-button size="small" @click="cancelPopver(index)">取消</el-button>
                      <el-button size="small" type="primary" @click="confirmSearch">确定</el-button>
                  </div>
              </div>
          </el-popover>
          <svg-base  iconName="icon-color-guanbishixin" @click="removeItem(item)"  size="16"></svg-base>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { FormFieldItem, ControlType } from '@/types/form';
import { FactoryQueryParams } from '@/types/waterFactory';
import { getRegionList } from '@/service/api/waterFactory';
import { getOrgTreeAllInternal } from '@/service/api/org';
import Node from 'element-plus/es/components/cascader-panel/src/node';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant'
import SvgBase from '@/components/SvgBase/index.vue';
const props = defineProps({
  selectedFields: {
      type: Array as () => any[],
      default: []
  },
  searchForm: {
      type: Object as () => FactoryQueryParams,
      default: {}
  },
  optionMap: {
      type: Object as () => { [key: string]: OptionItem[] },
      default: {}
  }
})

const popoverIndex = ref(-1)
const lastItemValue = ref<any>()
// popover控制是否显示
const setPopover = (index: number) => {
  lastItemValue.value = props.searchForm[props.selectedFields[index].fieldCodeCamelCase]?JSON.parse(JSON.stringify(props.searchForm[props.selectedFields[index].fieldCodeCamelCase])):props.searchForm[props.selectedFields[index].fieldCodeCamelCase]
  popoverIndex.value = popoverIndex.value === index ? -1 : index
}
const cancelPopver = (index: number) => {
  props.searchForm[props.selectedFields[index].fieldCodeCamelCase] = lastItemValue.value
  if (lastItemValue.value) {
     itemRef.value[props.selectedFields[index].fieldCodeCamelCase].setCheckedKeys(lastItemValue.value,true)
  }
  popoverIndex.value = -1
}

const itemRef = ref<{ [key: string]: any }>({});
const setItemRef = (el, type: string) => {
if (el) {
  itemRef.value![type] = el;
}
};

// 初始化组织树
const treeData = ref<Organization[]>([])
const initTree = async () => {
  const { data } = await getOrgTreeAllInternal()
  treeData.value = Object.keys(data)?.length ? [data] : [];
}

// 筛选项的输入内容回显
const getSearchText = (item: FormFieldItem) => {
  const value = props.searchForm[item.fieldCodeCamelCase]
  if (!value) {
      return ''
  }
  switch(item.formControlType) {
      case ControlType.number:
      case ControlType.money:
          return `${
              (!value.max && !value.min) ?
                  '不限' :
                  `${value.min || '不限'} ~ ${value.max || '不限'}`
          }`
      case ControlType.radio:
      case ControlType.checkbox:
          return `${value?.map(i => i.label).join(', ') || '不限'}`
      case ControlType.cascader:
          return value[value.length - 1]?.regionName
      case ControlType.date:
      case ControlType.dateRange:
          return value.length ? `${value[0] || '不限'} ~ ${value[1] || '不限'}` : ''
      case ControlType.organization:
          return itemRef.value[item.fieldCodeCamelCase].getCheckedNodes()?.map(i => i.name).join(', ')
      default:
          return value || '不限'
  }
}

// 获取省市区列表
const getRegion = (node: Node, resolve: Function) => {
  getRegionList(node.value ? (node.value as any).regionCode + '' : '0').then(res => {
      resolve(res.data.map(item => ({
          ...item,
          value: {
              ...item
          },
          label: item.regionName,
          leaf: item.regionLevel >= 3
      })))
  })
}

const cascaderProps = {
  lazy: true,
  lazyLoad: getRegion,
  checkStrictly: true
}

// 过滤单选多选的选项、筛选组织树
const searchInput = (val, item) => {
  if ([ControlType.checkbox, ControlType.radio].includes(item.formControlType)) {
      item.options = props.optionMap[item.dictType.name].filter(i => {
          return i.label.includes(val)
      })
  } else if (item.formControlType === ControlType.organization) {
      itemRef.value[item.fieldCodeCamelCase].filter(val)
  }
}

// 组织树过滤
const handleFilterNode = (value: string, data: Organization) => {
if (!value) return true
return data.name.includes(value)
}

// 组织树选择后绑定数据
const handleCheck = (data, item: FormFieldItem) => {
  props.searchForm[item.fieldCodeCamelCase] = data[1].checkedKeys
}

const defaultProps = {
children: 'children',
label: 'name',
}

const emit = defineEmits(['getList', 'removeItem'])

// 查询
const confirmSearch = () => {
  popoverIndex.value = -1
  emit('getList')
}

onMounted(() => {
  initTree()
})

// 点击关闭按钮，删除已选的筛选项
const removeItem = item => {
  emit('removeItem', item)
}

</script>
<style lang="scss">
.search-popover {
  width: auto !important;

  .btn-group {
      text-align: right;
  }
  .el-form-item__content {
      flex-direction: column;
      align-items: flex-start;

      .range-item {
          display: flex;
          .el-input {
              width: 160px;
          }
          .el-input-number .el-input {
              margin: 0;
          }
      }
      .el-checkbox-group {
          max-width: 300px;

          .el-checkbox {
              width: 100%;
          }
      }
      .el-input {
          width: 300px;
          margin-bottom: 10px;
      }
      .el-tree {
          max-height: 400px;
          overflow: auto;
      }
  }
}
</style>
<style lang="scss" scoped>
.selected-search {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 10px;
}
.more-icon, :deep(.more-icon) {
      transform: rotate(90deg);
      transition: all .2s linear;
      margin-left: 4px;

      &.expand {
          transform: rotate(90deg);
      }
  }

.popover-item {
  padding-right: 20px;
  display: flex;
  align-items: center;
  .el-button {
      border: 0;
      padding-left: 0;

      &:hover, &:active, &:focus {
          background-color: transparent !important;
      }
  }
  .remove-icon {
      position: relative;
      top: 4px;
      cursor: pointer;
  }
}
</style>