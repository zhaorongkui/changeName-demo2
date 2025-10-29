<template>
<!--  用户管理-->
  <div ref="userListRef" class="detail-config">
<!--    <el-container class="layout-container">-->
      <el-aside width="320px" :class="{ asideunexpand: !leftTreeExpand }">
        <organize-tree
            v-loading="orgTreeLoading"
          ref="orgTree"
          :default-expanded-keys="orgTreeDefaultExpandedKeys"
          :default-checked-keys="orgTreeDefaultCheckedKeys"
          :is-expand-on-click-node="false"
          title-name=""
          :default-props="orgTreeDefaultProps"
          :data="orgTreeData"
          :filter-node="orgTreeFilterNode"
          node-key="orgId"
        ></organize-tree>
      </el-aside>
      <div class="content-main">
        <div class="search">
          <div class="search-input">
            <el-checkbox-group v-model="searchForm.isHasDeptFellow" class="checkboxgroup" @change="onSearch">
              <el-checkbox label="包含子部门成员" value="isHasDeptFellow" />
            </el-checkbox-group>
            <sed-long-search
              v-model="searchForm.searchValue"
              placeholder="搜索用户名称、登录账号、手机号、工号"
              @on-search="onSearch"
            ></sed-long-search>
          </div>
        </div>
        <div class="data-table-container" v-loading="loading">
        <be-table
          :table-data="tableData"
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
          :list="tableData"
          :page-sizes="TABLE_LIST_PAGE_RANGE"
          @callback="onCallback"
        ></be-pager>
      </div>
<!--    </el-container>-->
    <user-authorization v-if="dialogFormVisible" :refresh-list="refreshList" :org-tree-data="orgTreeData" :currentUserData="currentUserData" @close="handleCloseDialog"></user-authorization>
  </div>

</template>
<script lang="ts" setup>
import {onMounted,onUnmounted,reactive,ref,watch } from 'vue'
import * as buses from '@/utils/bus';
import OrganizeTree from '@/components/organizeTree.vue';
import UserAuthorization from './components/userAuthorization.vue';
import { getUsersList, getUserByUserNameApi } from '@/api/user';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
import { hasPermission } from '@/utils/hasPermission';
import {ElMessage} from "element-plus";
import SedLongSearch from '@/components/SedLongSearch/index.vue'
import {getOrgTree} from "~/api/org";
const orgTreeLoading = ref(false)
import type {Organization} from "~/types/org";
import {treeToArray} from "~/utils/array_func";
const dialogFormVisible = ref(false)
const loading = ref(false)
const currentUserData = ref({})
onMounted(() => {
  getHeight();
  getOrgTreeList();
  buses.bus.on(buses.ORGANIZATION_TREE_NODE_CLICK, (data: any) => {
    orgObj.value = data;
    getList();
  });
  buses.bus.on(buses.TREE_EXPAND, (isExpand: any) => {
    leftTreeExpand.value = isExpand;
  });
  buses.bus.on(buses.ORGANIZATION_TREE_DATA_CHANGE, () => {
    getOrgTreeList();
  });
});
onUnmounted(() => {
  buses.bus.off(buses.ORGANIZATION_TREE_NODE_CLICK);
  buses.bus.off(buses.TREE_EXPAND);
  buses.bus.off(buses.ORGANIZATION_TREE_DATA_CHANGE);
});
const searchForm = reactive({
  searchValue: '',
  includeSubOrgs: false,
  isHasDeptFellow: [],
});
const orgObj = ref<any>({});
const orgTreeDefaultExpandedKeys = ref<string[]>([]);
const orgTreeDefaultCheckedKeys = ref<string[]>([]);
const orgTree = ref();
const orgTreeDefaultProps = ref({
  label: 'name',
  children: 'children',
});
const orgTreeData = ref([]);
const orgTreeFilterNode = (value: string, data) => {
  if (!value) return true;
  return data.name.includes(value);
};
watch(
  () => searchForm.isHasDeptFellow,
  () => {
    if (searchForm.isHasDeptFellow.length === 1) {
      searchForm.includeSubOrgs = true;
    } else {
      searchForm.includeSubOrgs = false;
    }
  }
);
const tableData = ref([]);
const leftTreeExpand = ref(true);
const tableColumns = [
  {
    type: 'index',
    prop: 'index',
    label: '序号',
    width: '80',
  },
  {
    prop: 'name',
    label: '用户姓名',
    sortable: true,
    minWidth: '120',
    format: (row) => {
      return `<span class='safari-oneline'>${row.name}</span>`;
    },
  },
  {
    prop: 'username',
    label: '登录账号',
    sortable: true,
    minWidth: '120',
    format: (row) => {
      return `<span class='safari-oneline'>${row.username}</span>`;
    },
  },
  {
    prop: 'employeeNo',
    label: '工号',
    sortable: true,
    minWidth: '180',
    format: (row) => {
      return `<span>${row.employeeNo || '-'}</span>`;
    },
  },
  {
    prop: 'orgName',
    label: '所属组织',
    sortable: true,
    minWidth: '180',
    format: (row) => {
      return `<span>${row.orgName || '-'}</span>`;
    },
  },
  {
    prop: 'title',
    label: '职位',
    sortable: true,
    minWidth: '180',
    format: (row) => {
      return `<span>${!row.title || row.title.length === 0 ? `-` : `(${row.title || '-'})`}</span>`;
    },
  },
  {
    prop: 'roles',
    label: '所属角色',
    minWidth: '180',
    format: (row) => {
      return `<span>${row.roles
        .map((obj) => {
          return obj.name;
        })
        .join(',')}</span>`;
    },
  },
  {
    prop: 'status',
    label: '用户状态',
    sortable: true,
    minWidth: '110',
    format: (row) => {
      return `<span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 8px; background: ${row.status == 1 ? '#0076F6' : '#666'}"></span><span>${row.status === 1 ? '启用' : '停用'}</span>`;
    },
  },
  {
    prop: 'source',
    label: '来源',
    sortable: true,
    minWidth: '90',
    format: (row) => {
      return `<span>${row.source === 1 ? '系统' : '第三方'}</span>`;
    },
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    align: 'left',
    width: '100',
    buttons: () => {
      const btns = [
        {
          name: '用户授权',
          command: 'empowerToUser',
          type: 'primary',
        },
      ];
      return btns;
      // return btns
      //   .map((t) => {
      //     return hasPermission('settings:user:grant') ? t : null;
      //   })
      //   .filter((t) => !!t);
    },
  },
];
const tableConfig = ref({
  tableId: 'userTable',
  lazy: true,
  load: 'load',
  rowKey: 'id',
  settingTable: false,
  height: '100%',
  border: true,
  maxHeight: 100,
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },
});
const state = reactive({
  asc: true,
  orderBy: '',
});
const userListRef = ref();
function onCallback() {
  getList();
}

const recursionTree = (oldArr, newArr) => {
  oldArr.forEach((item) => {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.children = [];
    if (item.children && item.children.length === 1 && !item.children[0].name) {
      item.children = [];
    }
    if (item.children && Array.isArray(item.children)) {
      recursionTree(item.children, newItem.children);
    }
    newArr.push(newItem);
  });
};
// 获取左侧组织树
const getOrgTreeList = async () => {
  orgTreeData.value = [];
  const newTreeData = localStorage.getItem('selectListFactory')
    ? JSON.parse(localStorage.getItem('selectListFactory') as string)
    : [];
  recursionTree(newTreeData, orgTreeData.value);
  if (orgTreeData.value.length > 0) {
    orgTreeDefaultExpandedKeys.value.push(orgTreeData.value[0].orgId);
    orgObj.value = orgTreeData.value[0];
    orgTree.value.setCurrentKey(orgObj.value.orgId);
  }
  getList();
};

function onSearch() {
  getList();
}
// 获取右侧列表
async function getList() {
  const params = {
    currPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    orgId: orgObj.value.orgId,
    includeSubOrgs: searchForm.includeSubOrgs,
    keyword: searchForm.searchValue,
    orderBy: state.orderBy,
    asc: state.asc,
  };
  getUsersList(params).then(res => {
    if(res.success) {
      tableConfig.value.paginationConfig.currentPage = res.data.current;
      tableConfig.value.paginationConfig.pageSize = res.data.size;
      tableConfig.value.paginationConfig.total = res.data.total;
      tableData.value = res.data.records;
    }else{
      ElMessage.error(res.message);
    }
  })

}
const getHeight = () => {
  tableConfig.value.maxHeight = userListRef.value.offsetHeight - 106;
  tableConfig.value.height = `${tableConfig.value.maxHeight}px`;
};
function onSortChange(event: any) {
  if (event.order === 'descending') {
    state.asc = false;
  } else {
    state.asc = true;
  }
  state.orderBy = event.prop;
  getList();
}
const handleCloseDialog = ()=> {
  dialogFormVisible.value = false;
}
async function onCommand(command: string, row) {
  switch (command) {
    case 'empowerToUser': //用户授权
        loading.value = true;
      getUserByUserNameApi({
        username: row.username,
      }).then((res) => {
        dialogFormVisible.value = true;
        currentUserData.value = res.data
      }).finally(() => {
        loading.value = false;
      })
      break;
  }
}
function refreshList() {
  getList();
}
</script>

<style scoped lang="scss">
@use '@/style/virtual-button.scss' as *;
@use '@/style/layout-container.scss' as *;
@use '@/style/mainButton.scss' as *;
.content-main{
  padding-left: 10px;
}
.search {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  &-input {
    margin: auto;
    margin-right: 0px;
    display: flex;
    .checkboxgroup {
      margin-right:5px;
    }
  }
}
:deep(.el-dropdown) {
  margin-left: 6px;
  vertical-align: middle;
  color: var(--el-color-primary);
}
:deep(.el-aside){
  border-right: 1px solid #e5e6f7;
  padding-right: 10px;
}
</style>
