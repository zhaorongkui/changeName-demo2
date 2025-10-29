<template>
  <el-dialog title="关联数据分类" v-model="dialogVisible" width="80%" custom-class="limited-dialog" @close="handleClose"
    :close-on-click-modal="false">
    <div class="apply-modal-content">
      <div class="operate-content">
        <div>已选择分类数：{{ checkedBusinessObject.length }}</div>
        <div class="check-tag-list">
          <el-tag class="check-tag-item" v-for="(tag, index) in checkedBusinessObject"
            :checked="queryData.tags.includes(tag.id)" type="primary" closable @close="handleTagClose(index)">
            {{ tag.businessObject }}-{{ tag.dataType }}-{{ tag.propertyCount }}个字段
          </el-tag>
        </div>
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset"
          @onClear="handleFilterClear">
        </AdvancedSearch>
      </div>
      <div class="content-main">
        <!-- 表格数据展示 -->
        <el-table ref="tableRef" :data="tableData" class="table-content" border v-loading="isLoading" type="selection"
          row-key="id" @selection-change="handleSelectChange">
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>/>
          <el-table-column type="index" :index="indexMethod" label="序号" width="60" />

          <el-table-column label="业务实体" property="businessObject" min-width="100"></el-table-column>

          <el-table-column label="所属系统/单元" property="businessObjectType" min-width="100"></el-table-column>

          <el-table-column label="对象层级" property="objectHierarchy" min-width="100"></el-table-column>
          <el-table-column label="数据分类" property="dataType" min-width="100"></el-table-column>
          <el-table-column label="数据更新频率" property="dateDim" min-width="100"></el-table-column>
          <el-table-column label="包含指标数" property="propertyCount" min-width="100"></el-table-column>
          <el-table-column label="业务场景" property="dataTag" min-width="100"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button link type="primary" size="small" @click.prevent="handleViewPreview(scope.row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize" :total="tableConfig.paginationConfig.total"
          :list="tableData" :page-sizes="[10, 30, 50, 100]" @callback="handlePageChange" />
      </div>
    </div>
    <CoreObjectDetailModal @close="closeCoreObjectDetail" ref="childRef" :dataChecked="dataChecked" />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, ref, watch, PropType, computed, provide, nextTick } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

import { getInitialValue } from '@/utils/index'

import CoreObjectDetailModal from '@/views/data-sandbox/resource-application/components/CoreObjectDetailModal.vue'
import { tagTypeList } from '@/api/tagType'
import { tagList } from '@/api/tag'
import { getbusinessObjectList, creatbusinessObject, getSelector } from '@/api/dataSet.ts'
import { getfieldTree } from '@/api/common.ts'

import type { BusinessObjectType } from '@/types/dataSandbox'
const pageKey = 'dataset-apply'
onMounted(() => {
  checkedBusinessObject.value = props.selectData;
  setTimeout(() => {
    syncSelection();
  }, 500);
  // initTreeData()
})
const { t } = useI18n()

const currentDataset = ref({
  name: "",
  datasetsId: '',
  orgDimension: '',
  deadline: '',
  createTime: '',
  updateTime: '',
  type: 1,
  creator: '',
  timeRange: '',
  ldmList: []
})
interface ModelForm {
  id?: string | number
  modelCategory: string
  modelName: string
  features: string
  description: string
}
// 定义组件暴露的事件
const emit = defineEmits(['close', 'submit', 'next', 'drawerClose'])
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  modelData: {
    type: Object as PropType<ModelForm>,
    default: () => ({})
  },
  selectData: {
    type: Array,
    default: () => ([])
  }
})
// 从mockData.ts导入选项数据
const topicOptions = ref([])
const businessOptions = ref([])
const tagOptions = ref([])
const organizationOptions = ref([])
const treeData = ref([])

const addDataForm = ref({
  name: '',
  datasetDesc: '',
  orgId: [],
  explanation: '',
  licence: '',
  tagTypeId: '',
  tagIds: [],
  timeRange: [],
  createTime: null,
  creator: '杭湖区域公司/张建忠',
  deadline: ''
})

const rules = ref<FormRules>({
  name: [{ required: true, message: `请输入数据集名称`, trigger: ['blur', 'change'] }],
  datasetDesc: [{ required: true, message: `请输入申请描述`, trigger: ['blur', 'change'] }],
  orgId: [{ required: true, type: 'array', min: 1, message: '请选择组织维度', trigger: ['blur', 'change'] }],
  timeRange: [{ required: true, type: 'array', min: 2, message: '请选择时间范围', trigger: ['blur', 'change'] }],
  deadline: [{ required: true, message: '请选择到期时间', trigger: ['blur', 'change'] }],
})

// 3. 核心配置：指定value和label字段
const cascaderProps = ref({
  value: 'id',   // 用于绑定v-model的字段（选中值存id）
  label: 'name', // 用于显示的文本字段（显示name）
  children: 'children' // 子节点字段（默认是children，可省略）
});

const id = ref('');
const visible = ref(false)
const cordObjectShow = ref(false)

// 对话框可见状态
const dialogVisible = ref(true)
// 对话框标题
const dialogTitle = ref(props.isEdit ? '编辑数据集' : '数据集申请')

// 获取标签类型列表
const tagTypeLIstData = ref([])
const getTagTypeFn = () => {
  tagTypeLIstData.value = []
  tagTypeList().then((res) => {
    const { data } = res
    tagTypeLIstData.value = data
  })
}

getTagTypeFn()

// 获取标签列表
const tagListData = ref([])
const tagTypeChange = () => {
  addDataForm.value.tagIds = []
  tagListData.value = []
  tagList({
    tagTypeId: addDataForm.value.tagTypeId
  }).then((res) => {
    const { data } = res
    tagListData.value = data || []
  })
}
const queryData = ref({
  objectHierarchy: '',
  businessObjectType: '',
  dataType: '',
  dateDim: '',
  organization: '',
  timeRange: [],
  tags: [],
  businessObject: ''
})
const formItemList = ref([
  {
    type: 'input',
    label: '业务实体',
    paramKey: 'businessObject',
    placeholder: '请输入业务实体',
    modelValue: queryData.value.businessObject
  },
  {
    type: 'select',
    label: '对象层级',
    paramKey: 'objectHierarchy',
    placeholder: '请选择对象层级',
    modelValue: queryData.value.objectHierarchy,
    selectOptions: topicOptions.value
  },
  {
    type: 'select',
    label: '数据分类',
    paramKey: 'dataType',
    placeholder: '请选择数据分类',
    modelValue: queryData.value.dataType,
    selectOptions: businessOptions.value
  },
  {
    type: 'select',
    label: '数据更新频率',
    paramKey: 'dateDim',
    placeholder: '请选择数据更新频率',
    modelValue: queryData.value.dateDim,
    selectOptions: tagOptions.value
  },
  {
    type: 'select',
    label: '属性',
    paramKey: 'organization',
    placeholder: '请输入属性',
    modelValue: queryData.value.organization,
    selectOptions: [],
    filterable: true,
  }
])
const handleCheckedNodes = (nodes) => {
  addDataForm.value.orgId = nodes; // 同步到queryData,临时处理
};
const handleFilterSearch = (data: any) => {
  console.log('搜索条件:', data)
  Object.keys(queryData.value).forEach((key) => {
    queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
  })
  getTableList()
}
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
  getSelector({
    field: ["object_hierarchy",
      "data_type",
      "date_dim"]
  }).then(res => {
    if (res.success) {
      formItemList.value[1].selectOptions = res.data.object_hierarchy.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      formItemList.value[2].selectOptions = res.data.data_type.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
      formItemList.value[3].selectOptions = res.data.date_dim.map((item, index) => {
        return {
          name: item,
          id: item,
        }
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const getfieldTreeFun = () => {
  getfieldTree({ keyWord: '' }).then(res => {
    if (res.success) {
      console.log('res.data.organization', res)
      formItemList.value[4].selectOptions = res.data
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 初始化获取下拉选项数据
onMounted(() => {
  getSelectorData()
  getfieldTreeFun()
})
const selectionIds = ref<string[]>([]);
const handleFilterClear = (key) => {
  queryData.value[key] = getInitialValue(key);
}
const handleFilterReset = () => {
  queryData.value = {
    objectHierarchy: '',
    businessObjectType: '',
    dataType: '',
    dateDim: '',
    organization: '',
    timeRange: [],
    tags: [],
    businessObject: ''
  }
  getTableList()
}

/**
 * 分页参数
 */
const tableConfig = ref({
  settingTable: false,
  tableId: `${pageKey}-table`,
  height: '100%',
  paginationConfig: {
    total: 1,
    currentPage: 1,
    pageSize: 10
  },
  rowKey: `${pageKey}Id`
})
const tableRef = ref()
// 分页事件
const handlePageChange = async () => {
  await getTableList(); // 确保 getTableList 返回 Promise
  // 等待数据更新和 DOM 渲染完成
  await nextTick();
  // 稍微延迟确保表格完全渲染
  setTimeout(() => {
    syncSelection();
  }, 50);
}

const tableColumns = computed(() => {
  return [
    { type: 'selection', prop: 'selection', width: 50, align: 'center' },
    {
      type: 'index',
      prop: 'index',
      label: t('INDEX'),
      align: 'center',
      width: 60
    },
    {
      prop: 'businessObject',
      label: '业务实体',
      align: 'center'
    },
    {
      prop: 'businessObjectType',
      label: '所属系统/单元',
      align: 'center'
    },
    {
      prop: 'objectHierarchy',
      label: '对象层级',
      align: 'center'
    },

    {
      prop: 'dataType',
      label: '数据分类',
      align: 'center'
    },
    {
      prop: 'dateDim',
      label: '数据更新频率',
      align: 'center'
    },
    {
      prop: 'propertyCount',
      label: '包含指标数',
      align: 'center'
    },
    {
      prop: 'dataTag',
      label: '业务应用场景',
      align: 'center'
    },
    {
      type: 'actions',
      label: '操作',
      minWidth: 180,
      buttons: [
        {
          name: '详情',
          command: 'preview',
          type: 'primary'
        }
      ]
    }
  ]
})

const onCommand = (command, row) => {
  switch (command) {
    case 'preview':
      handleViewPreview(row)
      break
  }
}
const dataChecked = ref([]);
const handleSelectChange = (selection: BusinessObjectType[]) => {
  console.log('选中的数据:', selection)
  // 1. 先移除当前页已选中但不在新选择中的项
  const currentPageIds = tableData.value.map(row => row.id);
  const currentPageSelections = selection.filter(row =>
    currentPageIds.includes(row.id)
  );
  // 2. 先移除当前页的所有项
  checkedBusinessObject.value = checkedBusinessObject.value.filter(
    item => !currentPageIds.includes(item.id)
  );
  // 3. 添加新选择的项（自动去重）
  currentPageSelections.forEach(row => {
    const exists = checkedBusinessObject.value.some(item => item.id === row.id);
    if (!exists) {
      checkedBusinessObject.value.push({ ...row });
    }
  });
  dataChecked.value = checkedBusinessObject.value
}
// 处理标签关闭（单个移除）
const handleTagClose = (index) => {

  const removedItem = checkedBusinessObject.value[index];
  checkedBusinessObject.value.splice(index, 1);
  // 同步表格中的选中状态
  if (tableRef.value) {
    const rowInCurrentPage = tableData.value.find(
      row => row.id === removedItem.id
    );
    if (rowInCurrentPage) {
      tableRef.value?.toggleRowSelection(rowInCurrentPage, false);
    }
  }
  // 2. 清除表格所有选中状态，再重新同步当前页
  // if (tableRef.value) {
  //     tableRef.value.clearSelection(); // 清除表格缓存的选中状态
  //     syncSelection(); // 重新同步当前页的选中状态
  // }
  // 3. 关键：更新 dataChecked（如果需要）
  dataChecked.value = [...checkedBusinessObject.value];
};
// 首次进来同步状态
// const firstSyncSelection = () => {

// }
// 同步选中状态（翻页后调用）
const syncSelection = () => {
  if (!tableRef.value) return;
  console.log(343434, checkedBusinessObject.value);
  // 1. 先提取 checkedBusinessObject 中所有数据的唯一标识（如 id），存成 Set（查询更快）
  const checkedIds = new Set(
    checkedBusinessObject.value.map(item => item.id) // 替换成你的唯一标识字段（如 businessId）
  );
  // 过滤 tableData：只保留“唯一标识在 checkedIds 中”的数据
  const matchedData = tableData.value.filter(item => {
    // 判断当前 tableData 元素的 id 是否在 checkedIds 中
    return checkedIds.has(item.id); // 在则保留，即“包含在 checkedBusinessObject 中”
  });
  // 回显的
  matchedData.forEach(item => {
    tableRef.value?.toggleRowSelection(item, true);
  })

  // 过滤 tableData：只保留“id不在 checkedIds 中”的数据，列表去掉的
  const filteredTableData = tableData.value.filter(item => {
    // 同样使用唯一标识字段，判断是否在 checkedIds 中
    return !checkedIds.has(item.id); // 不在则保留
  });
  filteredTableData.forEach(item => {
    tableRef.value?.toggleRowSelection(item, false);
  })
};

const tableData = ref<BusinessObjectType[]>([])
const isLoading = ref(false)
function getTableList() {
  isLoading.value = true
  getbusinessObjectList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    directory: 1,
    fieldAttribute: queryData.value.organization, // 属性
    businessObject: queryData.value.businessObject, // 业务实体
    businessObjectType: queryData.value.businessObjectType, //所属系统单元
    objectHierarchy: queryData.value.objectHierarchy, //对象层级
    dataType: queryData.value.dataType, // 数据分类
    dateDim: queryData.value.dateDim, //数据更新频率
  }).then((res) => {
    if (res.success) {
      tableData.value = res.data.records
      tableConfig.value.paginationConfig.total = res.data.total
      // nextTick(() => {
      //   //  props.selectData
      //   syncSelection();
      // });
    }
  })
    .finally(() => {
      isLoading.value = false
    })
}
getTableList()

const childRef = ref(null);
const coreObjectItem = ref<BusinessObjectType>({});
const handleViewPreview = (row: BusinessObjectType) => {
  console.log('查看预览详情:', row)
  if (childRef.value) {
    // 调用子组件暴露的方法，并可传递参数
    const result = childRef.value.openDialog(row);
    console.log('子组件返回结果：', result);
    coreObjectItem.value = row;
    provide('coreObjectItem', coreObjectItem.value);
  }
  // cordObjectShow.value = true;
  // 这里可以添加查看预览详情的逻辑，打卡弹框等
}
const closeCoreObjectDetail = () => {
  console.log('关闭业务实体详情弹窗');
  cordObjectShow.value = false
}

/**
 *  已选择的业务对象
 */
const checkedBusinessObject = ref<BusinessObjectType[]>([])

const handleDrawerClose = (data) => {
  visible.value = false
  emit('drawerClose', data)
}
const openDrawer = () => {
  visible.value = true
}
// 暴露给父组件的方法
defineExpose({
  openDrawer,
})
// 关闭对话框
const handleClose = () => {
  emit('close')
}
// 确定
const handleSubmit = () => {
  console.log(checkedBusinessObject.value, 'value====')
  emit('submit', checkedBusinessObject.value,)
}
// 点击了确定按钮
const addFormRef = ref()

const CoreObjectModaltest = ref(null)
const active = ref(0)
const next = () => {
  if (active.value < 2) {
    // 第一步需要校验才能添加
    if (active.value === 0) {
      addFormRef.value.validate((valid: boolean) => {
        if (valid) {
          active.value++;
        } else {
          ElMessage.error('请完善表单信息')
        }
      })
      // active.value++;  // 临时打开注释,方便测试
    }
    else if (active.value === 1) {
      if (checkedBusinessObject.value.length === 0) {
        ElMessage.error('请至少选择一个业务实体对象')
        return
      }
      active.value++;
      if (active.value === 2) {
        // 右侧要主动触发
        setTimeout(() => {
          CoreObjectModaltest.value.getField()
        })

      }
    }
    else {
      // 第二步不需要校验,直接跳转下一步
      active.value++;

    }
  }
}
const before = () => {
  if (active.value > 0) {
    active.value--
  };
}
const indexMethod = (index) => {
  return (tableConfig.value.paginationConfig.currentPage - 1) * tableConfig.value.paginationConfig.pageSize + index + 1
}

</script>

<style lang="scss" scoped>
.apply-modal-content {
  background: #fff;
  padding: 20px;
}



.operate-content {
  .check-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-right: 8px;

    max-height: 125px;
    overflow: auto;
    padding: 10px;

    .check-tag-item {
      --el-color-info: #909399;
      --el-color-info-light-9: rgb(244, 244, 245);

      .el-check-tag {
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: #e6f4ff;
          color: #409eff;
        }
      }
    }
  }
}

.el-form-item__content {
  :deep(.el-cascader) {
    width: 100% !important;
  }

}

:deep(.endTimeStyle) {
  width: 100%;

  .el-input__wrapper {
    width: 100%;
  }
}

.content-main {
  overflow: scroll;
  height: 480px;
}

:deep(.search-criteria .el-form-item) {
  flex-direction: row;
}
:deep(.el-popper) {
  z-index: 4000 !important;
}

</style>
<style>
.custom-drawer .el-drawer__body {
  overflow: hidden;
}

</style>

