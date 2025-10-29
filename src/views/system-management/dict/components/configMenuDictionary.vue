<!--
* @description :配置枚举类型数据字典
* @fileName configMenuDictionary.vue
* @author zhangshufeng
* @date 2024/02/19 17:07:03
* @filePath src\views\system\datadictionary\components\configMenuDictionary.vue
-->
<template>
  <el-dialog v-model="dialogFormVisible" class="commonPopWin dict-dialog" title="字典项配置" z-index="1900">
    <div ref="dialogRef" style="background: #fff;padding: 20px;display: flex;flex-direction: column">
      <div class="dictionDes">
        <div>
          <span>当前字典: {{ rowData.displayName }} ({{ rowData.name }}) </span>
          <el-tag type="warning">{{ rowData.source!.name }}</el-tag>
        </div>
        <div class="topNum fs-18">
          <div class="circle active"></div>
          <span>{{ activeNum }}</span>
          <div class="circle disabled"></div>
          <span>{{ disabledNum }}</span>
        </div>
      </div>
      <div class="search">
        <el-button type="primary" @click="handleAddRow">添加</el-button>
        <SedLongSearch
          ref="inputRef"
          v-model="searchValue"
          placeholder="搜索字典项/字典编码"
          @on-search="onSearch"
        ></SedLongSearch>
      </div>
      <div>
        <el-form ref="configDicRef" :inline="true" :model="state" label-width="0px" :rules="rules">
          <div class="data-table-container">
          <el-table
            tooltip-effect="dark"
            :style="{
              width: '100%',
              'overflow-y': 'auto',
            }"
            max-height="400"
            :data="state.tableData"
            @sort-change="handleSortChange"
          >
            <!-- 序号 -->
            <el-table-column label="序号" type="index" align="left" width="80">
              <template #default="{ $index }">
                <span>{{
                  (tableConfig.paginationConfig.currentPage - 1) * tableConfig.paginationConfig.pageSize + $index + 1
                }}</span>
              </template>
            </el-table-column>
            <!-- 字典项 -->
            <el-table-column label="字典项" prop="displayValue" align="left" width="150">
              <template #default="{ row, $index }">
                <div style="display: flex">
                  <el-form-item
                    v-if="row.isNew || row.isEdit"
                    :prop="`tableData.${$index}.displayValue`"
                    label=""
                    :rules="[
                      { ...rules.displayValue[0], row: row },
                      { ...rules.displayValue[1], row: row },
                    ]"
                  >
                    <el-input
                      v-model.trim="row.displayValue"
                      size="small"
                      maxlength="100"
                      class="input-pop input-value"
                      placeholder="请输入字典项"
                    >
                    </el-input>
                  </el-form-item>
                  <el-tooltip
                    v-else
                    popper-class="el-tooltip__popper"
                    :disabled="row.displayValue.length < 10"
                    effect="dark"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="row.displayValue"
                    placement="top"
                  >
                    <el-text line-clamp="1" class="mx-1 safari-oneline">{{ row.displayValue }}</el-text>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <!-- 字典编码 -->
            <el-table-column label="字典项编码" prop="textValue" align="left" width="150">
              <template #default="{ row, $index }">
                <div style="display: flex">
                  <el-form-item
                    v-if="row.isNew"
                    :prop="`tableData.${$index}.textValue`"
                    label=""
                    :rules="[
                      { ...rules.textValue[0], row: row },
                      { ...rules.textValue[1], row: row },
                      { ...rules.textValue[2], row: row },
                    ]"
                  >
                    <el-input
                      v-model="row.textValue"
                      size="small"
                      class="input-pop input-value"
                      maxlength="100"
                      placeholder="请输入字典编码"
                    >
                    </el-input>
                  </el-form-item>
                  <el-tooltip
                    v-else
                    popper-class="el-tooltip__popper"
                    :disabled="row.textValue.length < 10"
                    effect="dark"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="row.textValue"
                    placement="top"
                  >
                    <el-text line-clamp="1" class="mx-1 safari-oneline">{{ row.textValue }}</el-text>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <!-- 来源 -->
            <el-table-column label="来源" prop="textValue" align="left" width="80">
              <template #default="{ row }">
                <span>{{ row.isNew ? '--' : row.source.name }}</span>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column label="状态" sortable="custom" prop="state" align="left" width="100">
              <template #default="{ row }">
                <span
                  v-show="!row.isNew"
                  :class="`dot ${row.state.code === 1 ? 'dot-enabled' : 'dot-disabled'}`"
                ></span>
                <span>{{ row.isNew ? '--' : row.state.code === 2 ? '停用' : '启用' }}</span>
              </template>
            </el-table-column>
            <!-- 排序+ -->
            <el-table-column label="排序" sortable="custom" align="left" prop="sortOrder" width="120">
              <template #default="{ row, $index }">
                <el-form-item
                  v-if="row.isNew || row.isEdit"
                  :prop="`tableData.${$index}.sortOrder`"
                  label=""
                  :rules="[{ ...rules.sortOrder[0], row: row }]"
                >
                  <el-input
                    v-model.trim="row.sortOrder"
                    size="small"
                    class="input-pop input-sort"
                    type="number"
                    placeholder="请输入排序号"
                    @keyup="clearTwoFloat(row, row.sortOrder)"
                    @change="updateOrder(row)"
                  >
                  </el-input>
                </el-form-item>
                <span v-else>{{ row.sortOrder }}</span>
              </template>
            </el-table-column>
            <!-- 备注 -->
            <el-table-column label="备注" align="left" prop="remark">
              <template #default="{ row }">
                <div style="display: flex">
                  <el-input
                    v-if="row.isNew || row.isEdit"
                    v-model.trim="row.remark"
                    size="small"
                    class="input-pop input-sort"
                    placeholder="请输入备注"
                  >
                  </el-input>
                  <el-tooltip
                    v-else
                    :disabled="row.remark.length < 10"
                    popper-class="el-tooltip__popper"
                    effect="dark"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="row.remark"
                    placement="top"
                  >
                    <el-text line-clamp="1" class="mx-1 safari-oneline">{{ row.remark }}</el-text>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" align="left" width="180">
              <template #default="{ row }">
<!--                确定-->
                <div v-if="row.isNew || row.isEdit" class="ctrl-btns">
                  <el-button class="configBtn" type="primary" text @click="handleUpdate(row)">{{
                    FormConstants.CONFIRM
                  }}</el-button>
                  <i class="split-line"></i>
<!--                  取消-->
                  <el-button class="configBtn" type="primary" text @click="handleCancel(row)">{{
                    FormConstants.CANCEL
                  }}</el-button>
                </div>
<!--                编辑-->
                <div v-else class="ctrl-btns">
                  <el-button class="configBtn" type="primary" text @click="handleEditRow(row)">{{
                    FormConstants.EDIT
                  }}</el-button>
                  <i class="split-line"></i>
                  <el-button
                    class="configBtn"
                    type="primary"
                    text
                    :disabled="isBootstrapAndsource_1(row)"
                    @click="handleDeleteRow(row)"
                    >{{ FormConstants.DELETE }}</el-button
                  >
                  <i class="split-line"></i>
<!--                  停用-->
                  <el-button
                    v-if="row.state.code === 1"
                    class="configBtn"
                    type="primary"
                    text
                    :disabled="isBootstrapAndsource_1(row)"
                    @click="updateDicValue(row)"
                    >{{ FormConstants.STOP_TINGYONG }}</el-button
                  >
                  <el-button
                    v-if="row.state.code === 2"
                    class="configBtn"
                    type="primary"
                    text
                    :disabled="isBootstrapAndsource_1(row)"
                    @click="updateDicValue(row)"
                    >{{ FormConstants.START_QIYONG }}</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-form>
        <be-pager
          v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize"
          :total="tableConfig.paginationConfig.total"
          :list="state.tableData"
          :page-sizes="TABLE_LIST_PAGE_RANGE"
          @callback="onCallback"
        ></be-pager>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref,reactive,onMounted ,onUnmounted,nextTick} from 'vue'
import * as buses from '@/utils/bus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { dataDictionaryModel } from '../types/type';
import {
  addDict,
  deleteDictItem,
  getDictItems,
  updateDict,
  dictValueSingularApi,
  getDictValuesCount,
} from '@/api/dict';
import { isBootstrap } from '@/utils/index';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
import { FormConstants } from '@/utils/globalConstants';
import SedLongSearch from '@/components/SedLongSearch/index.vue'
const searchValue = ref('');
const dialogFormVisible = ref(false);

const rowData: dataDictionaryModel = reactive<dataDictionaryModel>({
  id: 0,
  displayName: '',
  name: '',
  valueProvider: '',
  valueProviderType: {
    code: '',
    name: '',
  },
  remark: '',
  state: {
    code: 1,
    name: '启用',
  },
  source: {
    code: 2,
    name: '自定义',
  },
});
const displayValueCheckServe = async (rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await dictValueSingularApi({
      displayValue: value,
      typeId: rowData.id,
      intValue: rule.row.intValue ? rule.row.intValue : null,
      id: rule.row.id ? rule.row.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('字典项重复'));
    } else {
      callback();
    }
  }
};
const textValueCheckServe = async (rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await dictValueSingularApi({
      textValue: value,
      typeId: rowData.id,
      intValue: rule.row.intValue ? rule.row.intValue : null,
      id: rule.row.id ? rule.row.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('字典项编码重复'));
    } else {
      callback();
    }
  }
};
const sortOrderValidator = async (_rule: any, value: string, callback: any) => {
  if (!Number(value) || Number(value) <= 0) {
    callback(Error('请输入正整数'));
  } else {
    callback();
  }
};
const rules = ref({
  displayValue: [
    { required: true, message: '请输入字典项名称', trigger: ['blur', 'change'] },
    { validator: displayValueCheckServe, trigger: 'blur' },
  ],
  textValue: [
    { required: true, message: '请输入字典项编码', trigger: ['blur', 'change'] },
    {
      message: '限输入大/小写字母、数字、下划线"_"',
      pattern: /^[a-zA-Z_\d]{0,100}$/,
      trigger: ['blur', 'change'],
    },
    { validator: textValueCheckServe, trigger: 'blur' },
  ],
  sortOrder: [{ validator: sortOrderValidator, trigger: 'blur' }],
});
const configDicRef = ref();
onMounted(() => {
  buses.bus.on(buses.DATA_DICTIONARY_SHOW_DIALOG_CONFIG, (data: any) => {
    searchValue.value = '';
    dialogFormVisible.value = true;
    rowData.id = data.row.id;
    rowData.displayName = data.row.displayName;
    rowData.name = data.row.name;
    rowData.valueProvider = data.row.valueProvider;
    rowData.valueProviderType = data.row.valueProviderType;
    rowData.remark = data.row.remark;
    rowData.state = data.row.state;
    rowData.source = data.row.source;
    getDictionaryValueList();
    getStatusCount();
    nextTick(() => {
      getHeight();
    });
  });
});
onUnmounted(() => {
  buses.bus.off(buses.DATA_DICTIONARY_SHOW_DIALOG_CONFIG);
});

const state = ref({
  orderBy: '',
  asc: true,
  tableData: [] as any[],
});
const dialogRef = ref();
const tableHeight = ref();
const tableMaxHeight = ref();
const tableConfig = ref({
  tableId: 'configDictTable',
  lazy: true,
  load: 'load',
  rowKey: 'id',
  settingTable: false,
  height: '100%',
  // treeprops:"{ children: 'children', hasChildren: 'hasChildren' }",
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },
});

function resetSearchParams() {
  state.value.asc = true;
  state.value.orderBy = '';
  state.value.tableData = [];
}
function onCallback() {
  getDictionaryValueList();
}
const getHeight = () => {
  // tableMaxHeight.value = 395
  tableMaxHeight.value = 390;
  tableHeight.value = tableMaxHeight.value;
};

function clearTwoFloat(row: any, value: string) {
  value = (value + '').replace(/[^\d.=-]/g, ''); // 清除“数字”和“.”以外的字符
  value = value.replace(/^\./g, ''); // 验证第一个字符是数字而不是.
  value = value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
  value = value.replace(/-{2,}/g, '-');
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  value = value.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-');
  value = value.replace(/^(-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3');
  row.sortOrder = value;
}
// function clearTwoFloat1(row: any, value: string) {
//   value = (value + '').replace(/[^\d.=-]/g, ''); // 清除“数字”和“.”以外的字符
//   value = value.replace(/^\./g, ''); // 验证第一个字符是数字而不是.
//   value = value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
//   value = value.replace(/-{2,}/g, '-');
//   value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
//   value = value.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-');
//   value = value.replace(/^(-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3');
//   row.textValue = value;
// }
function updateOrder(row: any) {
  console.log('更新当前行排序', row);
}

function handleDeleteRow(row: any) {
  if (row.source.code !== 2) return;
  ElMessageBox.confirm(`确认删除当前字典项吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const parame = {
        ...row,
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null,
      };
      deleteDictItem([parame]).then((res) => {
        if(res.success){
          ElMessage.success(res.message);
          resetSearchParams();
          getDictionaryValueList();
          getStatusCount();
        }

      });
    })
    .catch(() => {
      ElMessage('取消删除字典项');
    });
}
function handleEditRow(row: any) {
  if (!row.isEdit || row.isEdit === undefined) {
    row.isEdit = true;
  } else {
    row.isEdit = false;
  }
}

const handleUpdate = (row: any) => {
  configDicRef.value.validate(async (valid: boolean) => {
    //   if (row.displayValue === '') {
    //   ElMessage({
    //     message: '请输入字典项',
    //     type: "warning"
    //   })
    // }
    // if (row.textValue === '' || row.textValue.length > 100 || !(/^[a-zA-Z_]{0,100}$/.test(row.textValue))) {
    //   ElMessage({
    //     message: '字典项编码限输入大/小写字母+下划线_',
    //     type: "warning"
    //   });
    // }

    // if (!Number(row.sortOrder) || Number(row.sortOrder) < 0) {
    //   ElMessage({
    //     message: '请输入正整数',
    //     type: "warning"
    //   });
    // }
    if (valid) {
      if (row.isNew) {
        addDict([row]).then(() => {
          resetSearchParams();
          getDictionaryValueList();
          getStatusCount();
        });
      } else {
        updateDicValueToServe(row);
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
};
function handleAddRow() {
  if (state.value.tableData.length > 0 && state.value.tableData[0].isNew) {
    ElMessage.warning('请先保存数据再添加');
    return;
  }
  state.value.tableData.unshift({
    isNew: true,
    displayValue: '',
    textValue: '',
    state: {
      code: 1,
      name: '启用',
    },
    source: {
      code: 2,
      name: '自定义',
    },
    sortOrder: 0,
    remark: '',
    typeId: rowData.id,
    typeName: rowData.name,
  });
}
function handleCancel(row: any) {
  if (row.isNew !== undefined) {
    state.value.tableData.shift();
  } else {
    row.isEdit = false;
  }
}
const activeNum = ref(0);
const disabledNum = ref(0);
// 获取字典项
const getDictionaryValueList = () => {
  state.value.tableData = [];
  getDictItems({
    id: rowData.id,
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    keyword: searchValue.value,
    asc: state.value.asc,
    orderBy: state.value.orderBy,
  }).then((res) => {
    tableConfig.value.paginationConfig.currentPage = res.data.current;
    tableConfig.value.paginationConfig.pageSize = res.data.size;
    tableConfig.value.paginationConfig.total = res.data.total;
    state.value.tableData = res.data.records;
  });
};
// 获取启用停用个数
const getStatusCount = async () => {
  activeNum.value = 0;
  disabledNum.value = 0;
  const result = await getDictValuesCount({ typeId: rowData.id });
  if (result.success) {
    activeNum.value = result.data['1'];
    disabledNum.value = result.data['2'];
  }
};
function onSearch() {
  resetSearchParams();
  getDictionaryValueList();
  getStatusCount();
}
function handleSortChange(event: any) {
  if (event.order === 'descending') {
    state.value.asc = false;
  } else {
    state.value.asc = true;
  }
  state.value.orderBy = event.prop;
  getDictionaryValueList();
}

function updateDicValue(row: any) {
  let message = '确认启用当前字典项吗？';
  const rowItem = JSON.parse(JSON.stringify(row));
  if (rowItem.source.code !== 2) return;
  if (rowItem.state.code === 2) {
    rowItem.state.code = 1;
    rowItem.state.name = '启用';
  } else if (rowItem.state.code === 1) {
    rowItem.state.code = 2;
    rowItem.state.name = '停用';
    message = '确认停用当前字典项吗？';
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      updateDicValueToServe(rowItem);
    })
    .catch(() => {
      ElMessage(FormConstants.MESSAGE_TIP_CANCEL);
    });
}
function updateDicValueToServe(row: any) {
  row.sortOrder = Number(row.sortOrder);
  const param = {
    ...row,
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null,
  };
  updateDict([param]).then((res) => {
    if(res.success) {
      ElMessage.success(res.message);
      resetSearchParams();
      getDictionaryValueList();
      getStatusCount();
    }

  });
}

// 判断是否是非0号租户并且内置角色
const isBootstrapAndsource_1 = (row) => {
  return !isBootstrap() && row.source.code === 1;
};
</script>
<style lang="scss">
.dict-dialog.el-dialog {
  &::before {
    bottom: 65px;
  }
  .el-pagination__sizes {
    margin-right: 10px;
  }
}
</style>
<style lang="scss" scoped>
@use '@/style/virtual-button.scss';

.dictionDes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: $mainBorderRadius;
  padding: 5px 10px;

  .topNum {
    display: flex;
    align-items: center;

    .circle {
      width: 6px;
      height: 6px;
      border-radius: 100%;
      margin-right: 5px;
    }

    .active {
      background-color: #38acfe;
    }

    .disabled {
      margin-left: 5px;
      background-color: #999999;
    }
  }
}

.search {
  display: flex;
  margin: 10px 0px 10px 0px;
  justify-content: space-between;
  align-items: center;

  :deep(.asterisk-left) {
    margin-bottom: 0px;
  }
}

.searchInput {
  width: $searchInputWidth;
}

:deep(.el-table .cell) {
  text-overflow: unset;
  padding: 0px 6px;
}

.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin: 30px 0px !important;
}

.input-sort {
  :deep(.el-input__wrapper) {
    text-align: center;
    border-radius: 5px;
    color: #3388ff;
    min-height: 25px !important;
  }
}

.input-value {
  :deep(.el-input__wrapper) {
    border-radius: $mainBorderRadius;
    min-height: 25px !important;
  }

  &::before {
    content: '*';
    display: inline-block;
    margin: 0 6px 0 -6px;
    color: #e96a68;
  }
}

.pages {
  margin-bottom: 20px;
}

.dot.dot-disabled::before {
  background: #e96a68;
}

.table-mini-switch {
  margin-right: 5px;
}

.pages {
  margin-bottom: 0px !important;
}

.ctrl-btns {
  display: flex;
  align-items: center;
}

.configBtn {
  width: 40px;
}

.configBtn:hover,
.configBtn:focus {
  background-color: #fff !important;
}

.configBtn:focus {
  color: var(--el-color-primary) !important;
}

:deep(.el-table tbody tr:hover > td) {
  background-color: #fff !important;
}

:deep(.el-table tbody tr:hover) {
  background-color: #fff !important;
}

:deep(.el-table__inner-wrapper:before) {
  --el-table-border-color: #ffffff;
}

:deep(.el-table) {
  border-bottom: 0px solid #ffffff !important;
}
</style>
