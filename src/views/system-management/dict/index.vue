<!--
* @description :数据字典
* @fileName index.vue
* @author zhangshufeng
* @date 2024/02/19 13:26:08
* @filePath src\views\system\datadictionary\index.vue
-->
<template>
  <div ref="rightRef" v-resize="onResize" class="main-page detail-config">
    <div class="search-content">
      <div v-permission="`${permissionKey}create`" style="display: flex">
        <el-button type="primary" @click="onAdd">
          <el-icon size="20"><Plus /></el-icon>
          新增字典
        </el-button>
      </div>
      <!-- <sync v-if="isBootstrap()" style="margin-right: 20px" path="/settings/dict" /> -->
      <SedLongSearch
        ref="inputRef"
        v-model="searchForm.searchValue"
        placeholder="搜索字典名称/字典编码"
        @on-search="getList"
      ></SedLongSearch>
    </div>
    <div class="data-table-container" v-loading="loading">
    <be-table
      :table-data="list"
      :columns="tableColumns"
      :options="tableConfig"
      :is-lock="false"
      @command="onCommand"
      @sort-change="onSortChange"
    >
    </be-table>
    </div>
    <be-pager
      v-model:current-page="tableConfig.paginationConfig.currentPage"
      v-model:page-size="tableConfig.paginationConfig.pageSize"
      :total="tableConfig.paginationConfig.total"
      :list="list"
      :page-sizes="TABLE_LIST_PAGE_RANGE"
      @callback="getList"
    ></be-pager>
<!--    新增编辑-->
    <add-dictionary :refresh-list="getList"></add-dictionary>
<!--    字典项配置-->
    <config-menu-dictionary></config-menu-dictionary>
  </div>
</template>

<script setup lang="ts">
import {reactive,ref,onMounted} from 'vue';
 import * as buses from '@/utils/bus';
import AddDictionary from './components/addDictionary.vue';
import ConfigMenuDictionary from './components/configMenuDictionary.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getDictList, deleteDict } from '@/api/dict';
import { DictListItem } from '@/types/dict';
import { isBootstrap } from '@/utils/index';
import { hasPermission } from '@/utils/hasPermission';
import { useWindowSize } from '@vueuse/core';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
import _ from 'lodash';
import { FormConstants } from '@/utils/globalConstants';
import { Plus } from '@element-plus/icons-vue';
import SedLongSearch from '@/components/SedLongSearch/index.vue'
const loading = ref(false)
const windowSize = useWindowSize();
const permissionKey = 'settings:dict:';
const searchForm = reactive({
  searchValue: '',
});
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: '序号',
    width: '80',
  },
  {
    prop: 'displayName',
    label: '字典名称',
    sortable: 'custom',
    minWidth: '80',
  },
  {
    prop: 'name',
    label: '字典编码',
    sortable: 'custom',
    minWidth: '80',
  },
  {
    prop: 'valueProviderType ',
    label: '值来源',
    minWidth: '100',
    format: (row) => {
      return `<span class='el-tag el-tag--info el-tag--light'>${row.valueProviderType.name}</span>`;
    },
  },
  {
    prop: 'source',
    label: '来源',
    minWidth: '80',
    format: (row) => {
      return `<span>${row.source.name}</span>`;
    },
  },
  {
    prop: 'updatedAt',
    label: '最近操作时间',
    sortable: 'custom',
    minWidth: '120',
  },
  {
    prop: 'updatedBy',
    label: '最近操作人',
    minWidth: '80',
  },
  {
    prop: 'remark',
    label: '备注',
    minWidth: '80',
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '250',
    align: 'left',
    buttons: (row: DictListItem) => {
      const btns = [
        {
          name: '编辑字典',
          command: 'edit',
          type: 'primary',
          code: 'update',
          disabled: isBootstrapAndsource_1(row) ? true : false,
        },
        {
          name: '删除字典',
          command: 'delete',
          type: 'primary',
          code: 'delete',
          disabled: isBootstrapAndsource_1(row) ? true : false,
        },
        {
          name: '字典项配置',
          command: 'config',
          type: 'primary',
          code: 'config',
          disabled: row.valueProviderType.code === 'a' || row.valueProviderType.code === 'x' ? true : false,
        },
      ];
      return btns
        .map((t) => {
          return hasPermission(t.code ? `${permissionKey}${t.code}` : '') ? t : null;
        })
        .filter((t) => !!t);
      // return btns
    },
  },
];
const tableConfig = ref({
  tableId: 'DICTIONARY_TABLE',
  lazy: true,
  load: 'load',
  rowKey: 'id',
  settingTable: false,
  height: windowSize.height.value - 48 - 66 - 38 - 52 - 4,
  maxHeight: windowSize.height.value - 48 - 66 - 38 - 52 - 4 + 'px',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },
});
const list = ref<DictListItem[]>([]);
const rightRef = ref();
const state = reactive({
  asc: true,
  orderBy: '',
});
onMounted(() => {
  getList();
});

const getList = () => {
  loading.value = true
  getDictList({
    pageNum: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    keyword: searchForm.searchValue,
    asc: state.asc,
    orderBy: state.orderBy,
  }).then((res) => {
    if(res.success){
      tableConfig.value.paginationConfig.currentPage = res.data.current;
      tableConfig.value.paginationConfig.pageSize = res.data.size;
      tableConfig.value.paginationConfig.total = res.data.total;
      list.value = res.data.records;
    }else{
      ElMessage.error(res.message);
    }
  }).finally(() => {
    loading.value = false
  })
};
const onResize = _.debounce(() => {
  tableConfig.value.height = windowSize.height.value - 48 - 66 - 38 - 48;
  tableConfig.value.maxHeight = tableConfig.value.height + 'px';
}, 500);

// 删除
const deleteDic = (row: DictListItem) => {
  deleteDict(row).then((res) => {
    if (res.success) {
      ElMessage.success(FormConstants.MESSAGE_TIP_SUCCESS);
    }
    getList();
  });
};

const onAdd = () => {
  buses.bus.emit(buses.DATA_DICTIONARY_SHOW_DIALOG_ADD, {
    dialogType: 'add',
  });
};
const onCommand = (command: string, row: any) => {
  switch (command) {
    case 'edit': //编辑
      buses.bus.emit(buses.DATA_DICTIONARY_SHOW_DIALOG_ADD, {
        dialogType: 'edit',
        row: row,
      });
      break;
    case 'delete': //删除
      if (isBootstrapAndsource_1(row)) {
        ElMessage.warning('内置字典不可删除');
      } else {
        ElMessageBox.confirm('确认删除当前字典吗？', '提示', {
          confirmButtonText: FormConstants.CONFIRM,
          cancelButtonText: FormConstants.CANCEL,
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
            deleteDic(parame);
          })
          .catch(() => {
            ElMessage(FormConstants.MESSAGE_TIP_CANCEL);
          });
      }

      break;
    case 'config': //字典项配置
      buses.bus.emit(buses.DATA_DICTIONARY_SHOW_DIALOG_CONFIG, {
        row: row,
      });
      break;
  }
};
const onSortChange = (event: any) => {
  if (event.order === 'descending') {
    state.asc = false;
  } else {
    state.asc = true;
  }
  state.orderBy = event.prop;
  getList();
};

// 判断是否是非0号租户并且内置角色
const isBootstrapAndsource_1 = (row) => {
  return !isBootstrap() && row.source.code === 1;
};
</script>
<style lang="scss" scoped>
@use '@/style/common-filter.scss';

:deep(.el-button svg)  {
  margin-right: 5px;
}
.main-page {
  display: flex;
  flex-direction: column;
  .search-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>
