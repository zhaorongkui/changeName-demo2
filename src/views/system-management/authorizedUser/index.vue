<template>
  <div v-resize="onResize" class="authorize detail-config">
    <div class="authorize-top">
      <div class="authorize-top-info">
        <p class="authorize-top-info-item">
          {{ userTypeLabel }}:
          <span>{{ authorizeToUserType === 'role' ? authRole.name : getOrgTypeName }}</span>
        </p>
        <p class="authorize-top-info-item">
          {{ authorizeToUserType === 'role' ? '所属组' : '组织编码' }}:
          <span>{{ authorizeToUserType === 'role' ? authRole.groupName : orgInfo?.orgId || '' }}</span>
        </p>
        <p class="authorize-top-info-item">
          {{ authorizeToUserType === 'role' ? '角色描述' : '组织路径' }}:
          <span>{{
            authorizeToUserType === 'role'
              ? authRole.remark && authRole.remark.length != 0
                ? authRole.remark
                : '暂无'
              : getOrgPath
          }}</span>
        </p>
      </div>
      <p v-if="orgFactoryList?.length" class="authorize-top-info authorize-top-right">
        涵盖业务范围
        <el-popover placement="bottom-end" :width="280" trigger="click">
          <template #reference>
            <span class="blue">【{{ orgFactoryList?.length }}】</span>
          </template>
          <div class="authorize-top-pop">
            <div class="authorize-top-pop-title">
              <el-icon :size="20"><School /></el-icon>
              水厂：{{ orgFactoryList?.length }}个
            </div>
            <div class="authorize-top-pop-list">
              <div v-for="(factory, index) in orgFactoryList" :key="index" class="authorize-top-pop-list-item">
                <show-tool-tip
                  :content="`${index + 1}. ${factory.factoryName}_${factory.factoryCode}`"
                  :width="240"
                ></show-tool-tip>
                <show-tool-tip
                  :content="`${factory.factoryShortName || '-'}`"
                  :width="20"
                  :is-tag="true"
                ></show-tool-tip>
              </div>
            </div>
          </div>
        </el-popover>
      </p>
      <div class="authorize-top-extra">
        <el-button :icon="ArrowLeft" size="small" @click="handleBack">返回</el-button>
      </div>
    </div>
    <div class="authorize-main">
      <div class="authorize-main-left" :class="{ asideunexpand: !leftTreeExpand }">
        <choose-organization ref="chooseOrganizationRef" @filter-org="handleSelectOrg" />
      </div>
      <div ref="rightRef" class="authorize-main-right">
        <div class="authorize-main-right-filter">
          <div class="menuTab">
            <el-tabs v-model="activeTab" type="border-card" class="menuTab-tabs" @tab-click="handleFilterList">
              <el-tab-pane label="待授权用户" :name="1" />
              <el-tab-pane label="已授权用户" :name="2" />
              <el-tab-pane label="全部用户" :name="0" />
            </el-tabs>
          </div>
          <el-checkbox
            v-model="hasSubOrg"
            class="authorize-main-right-filter-search"
            label="包含子部门成员"
            @change="handleFilterList"
          />
          <el-checkbox v-model="hasDisabledUser" label="包含停用成员" @change="handleFilterList" />
          <sed-long-search
            v-model="keyword"
            style="margin-left: 10px"
            placeholder="搜索用户名称、登录账号、手机号、工号"
            @on-search="handleFilterList"
          ></sed-long-search>
        </div>
        <div
          v-if="selectRows.length > 1 && ((!isAllNotAuth && isAllAuth) || (isAllNotAuth && !isAllAuth))"
          class="authorize-main-right-stastic"
        >
          <el-icon><InfoFilled /></el-icon>
          已选择<span>{{ selectRows.length }}</span
          >项
          <el-button
            v-if="isAllNotAuth"
            class="authorize-main-right-stastic-btn"
            type="primary"
            link
            @click="handleBatch('addAuth')"
            >批量添加</el-button
          >
          <el-tooltip
            :show-after="TOOLTIP_SHOW_AFTER"
            :disabled="!(authorizeToUserType === 'role' && isDefaultSysRole)"
            content="默认角色不能取消授权"
            effect="dark"
            placement="top"
          >
            <el-button
              v-if="isAllAuth"
              class="authorize-main-right-stastic-btn"
              type="primary"
              link
              :disabled="isDefaultSysRole"
              @click="handleBatch('removeAuth')"
              >批量取消</el-button
            >
          </el-tooltip>
          <el-button type="primary" link @click="handleClear">清空</el-button>
        </div>
        <div class="data-table-container" v-loading="loading">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :height="tableConfig.height"
          @selection-change="handleSelectTable"
        >
          <template v-for="(item, index) in tableColumns" :key="index">
            <el-table-column
              v-if="item.type === 'selection' || item.type === 'index'"
              :type="item.type"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
            />
            <el-table-column
              v-else-if="item.type !== 'actions'"
              :label="item.label"
              :width="item.width ? item.width + 'px' : 'auto'"
              show-overflow-tooltip
            >
              <template #default="scope">
                {{ item.prop !== 'authRole' && item.prop !== 'status' ? scope.row[item.prop] || '-' : '' }}
                {{ item.prop === 'authRole' ? scope.row.roles?.map((t: Role) => t.name).join(', ') || '-' : '' }}
                {{ item.prop === 'status' ? (scope.row.status == 1 ? '启用' : '停用') : '' }}
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type === 'actions'" :label="item.label" :width="item.width">
              <template #default="scope">
                <el-button
                  v-if="shouwOperatBtn(scope.row) === -1"
                  link
                  type="primary"
                  :disabled="getDisabled(scope.row)"
                  size="small"
                  @click="operateCommand('addAuth', scope.row.id)"
                  >添加授权</el-button
                >
                <el-button
                  v-if="shouwOperatBtn(scope.row) !== -1"
                  link
                  type="danger"
                  :disabled="getDisabled(scope.row)"
                  size="small"
                  @click="operateCommand('removeAuth', scope.row.id)"
                  >取消授权</el-button
                >
              </template>
            </el-table-column>
          </template>
        </el-table>
        </div>
        <be-pager
          v-model:current-page="tableConfig.paginationConfig.currentPage"
          v-model:page-size="tableConfig.paginationConfig.pageSize"
          :total="tableConfig.paginationConfig.total"
          :list="tableData"
          :page-sizes="TABLE_LIST_PAGE_RANGE"
          @callback="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref,reactive,onMounted,onUnmounted,computed,nextTick} from "vue";
import { useRouter } from "vue-router";
import { EnumValue } from '@/utils/enum';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ORG_TYPE } from '@/utils/constant';
import { getOrgById } from '@/api/org';
import { addUserGrant, getUsersList, removeUserGrant } from '@/api/user';
import { getFactoryList } from '@/api/waterFactory';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import { ElTooltip } from 'element-plus';
import * as buses from '@/utils/bus';
import { TABLE_LIST_PAGE_RANGE } from '@/utils/constant';
import { InfoFilled, ArrowLeft } from '@element-plus/icons-vue';
import _ from 'lodash';
import type { User, Role } from '@/types/org';
import chooseOrganization from '@/components/ChooseOrganization/index.vue'
import SedLongSearch from '@/components/SedLongSearch/index.vue'
const loading = ref(false)
const leftTreeExpand = ref(true);
const router = useRouter();
const authOrgId = ref(router.currentRoute.value.query.orgId as string);
const authRole = ref({
  id: router.currentRoute.value.query.roleId as string,
  name: router.currentRoute.value.query.roleName,
  groupName: router.currentRoute.value.query.groupName,
  remark: router.currentRoute.value.query.roleRemark,
});
const authorizeToUserType = ref('org');
const orgInfo = ref();
// 1: 待授权 false, 2: 已授权 true, 0: 全部 null
const activeTab = ref(1);
const hasSubOrg = ref(false); // 是否包含子组织
const hasDisabledUser = ref(false); // 是否包含停用成员
const keyword = ref(''); // 关键字查询
const selectOrgIds = ref(''); // 选择的组织ID
const tableData = ref<User[]>();
const userTypeLabel = computed(() => {
  return authorizeToUserType.value === 'role' ? '角色名称' : '组织类型';
});
const tableColumns = ref([
  {
    type: 'selection',
    prop: 'selection',
    label: '多选',
    width: '50',
    align: 'center',
  },
  {
    type: 'index',
    prop: 'index',
    label: '序号',
    width: 60,
    align: 'center',
  },
  {
    prop: 'name',
    label: '用户名称',
    minWidth: 120,
  },
  {
    prop: 'username',
    label: '登录账号',
    minWidth: 120,
  },
  {
    prop: 'mobile',
    label: '手机号',
    minWidth: 120,
    format: (row: User) => {
      return row.mobile || '-';
    },
  },
  {
    prop: 'employeeNo',
    label: '工号',
    minWidth: 120,
    format: (row: User) => {
      return row.employeeNo || '-';
    },
  },
  {
    prop: 'title',
    label: '职位',
    minWidth: 120,
    format: (row: User) => {
      return row.title || '-';
    },
  },
  {
    prop: 'authRole',
    label: '授权角色',
    minWidth: 120,
    format: (row: User) => {
      return row.roles?.map((t: Role) => t.name).join(', ') || '-';
    },
  },
  {
    prop: 'status',
    label: '用户状态',
    minWidth: 120,
    format: (row: User) => {
      return row.status == 1 ? '启用' : '停用';
    },
  },
  {
    type: 'actions',
    prop: 'action',
    label: '操作',
    width: '180',
    buttons: function (row: User) {
      const n =
        authorizeToUserType.value === 'org'
          ? row.orgs.findIndex((t) => t.orgId == authOrgId.value)
          : row.roles.findIndex((t) => t.id === authRole.value.id);
      return [
        {
          name: n > -1 ? '取消授权' : '添加授权',
          command: n > -1 ? 'removeAuth' : 'addAuth',
          type: n > -1 ? 'danger' : 'primary',
          disabled:
            authorizeToUserType.value === 'org' ? false : n > -1 ? (isDefaultSysRole.value ? true : false) : false,
        },
      ];
    },
  },
]);

const shouwOperatBtn = (data) => {
  return authorizeToUserType.value === 'org'
    ? data.orgs.findIndex((t) => t.orgId == authOrgId.value)
    : data.roles.findIndex((t) => t.id === authRole.value.id);
};

const getDisabled = (data) => {
  const status =
    authorizeToUserType.value === 'org'
      ? data.orgs.findIndex((t) => t.orgId == authOrgId.value)
      : data.roles.findIndex((t) => t.id === authRole.value.id);
  return authorizeToUserType.value === 'org' ? false : status > -1 ? (isDefaultSysRole.value ? true : false) : false;
};

const tableConfig = ref({
  settingTable: false,
  tableId: 'auth-user',
  height: '100%',
  maxHeight: 100,
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },
  rowKey: 'id',
});
const chooseOrganizationRef = ref();
onMounted(() => {
  // buses.bus.on(buses.TREE_EXPAND, (isExpand: any) => {
  //   leftTreeExpand.value = isExpand;
  // });
  chooseOrganizationRef.value?.initData();
});

onUnmounted(() => {
  buses.bus.off(buses.TREE_EXPAND);
});

const isDefaultSysRole = computed(() => {
  return authRole.value.name === '默认角色' || authRole.value.id === '1';
});
// 组织信息
const getOrgDetail = async (id: string) => {
  const { data } = await getOrgById(id);
  orgInfo.value = data;
  getOrgFactory();
};
// 获取组织水厂
const orgFactoryList = ref();
const getOrgFactory = async () => {
  const { data } = await getFactoryList({
    currPage: 1,
    pageSize: 10,
    params: {
      parentOrgCode: [authOrgId.value],
    },
  });
  orgFactoryList.value = data?.records || [];
};

// 判断当前是【组织-用户授权】 OR 【角色-用户授权】
if (router.currentRoute.value.query.from) {
  authorizeToUserType.value = 'role';
} else {
  authorizeToUserType.value = 'org';
  getOrgDetail(authOrgId.value);
}

const getOrgPath = computed(() => {
  return `${orgInfo.value?.ancestors?.length ? orgInfo.value?.ancestors.join('-') + '-' : ''}${orgInfo.value?.name || '-'}`;
});
const getOrgTypeName = computed(() => EnumValue.getLabelByValue(ORG_TYPE, orgInfo.value?.orgType || -1));

// 选择组织
const handleSelectOrg = (orgIds: string) => {
  selectOrgIds.value = orgIds;
  initUserList();
};

// 是否包含子部门, 用户授权状态 搜索关键字
const handleFilterList = () => {
  tableConfig.value.paginationConfig.currentPage = 1;
  nextTick(() => {
    initUserList();
  });
};
// 用户列表
const initUserList = async () => {
  loading.value = true
  let params: any = {
    currPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    orgId: selectOrgIds.value,
    includeSubOrgs: hasSubOrg.value,
    keyword: keyword.value,
    asc: true,
    status: hasDisabledUser.value ? null : 1,
  };
  if (authorizeToUserType.value === 'role') {
    params = Object.assign(params, {
      grantedRole: authRole.value.id,
      grantedRoleEqual: activeTab.value == 1 ? false : activeTab.value == 2 ? true : null,
    });
  } else {
    params = Object.assign(params, {
      grantedOrg: authOrgId.value,
      grantedOrgEqual: activeTab.value == 1 ? false : activeTab.value == 2 ? true : null,
    });
  }
  const { data } = await getUsersList(params);
  tableData.value = data.records;
  tableConfig.value.paginationConfig.total = data.total;
  loading.value = false
};

// 选择表格时
const selectRows = ref<User[]>([]);
const handleSelectTable = (rows: User[]) => {
  selectRows.value = rows;
};
const isAllNotAuth = computed(() => {
  if (authorizeToUserType.value === 'org') {
    return selectRows.value.every((t) => t.orgs.filter((o) => o.orgId == authOrgId.value).length == 0);
  } else {
    return selectRows.value.every((t) => t.roles.filter((o) => o.id == authRole.value.id).length == 0);
  }
});
const isAllAuth = computed(() => {
  if (authorizeToUserType.value === 'org') {
    return selectRows.value.every((t) => t.orgs.filter((o) => o.orgId == authOrgId.value).length > 0);
  } else {
    return selectRows.value.every((t) => t.roles.filter((o) => o.id == authRole.value.id).length > 0);
  }
});

const operateApis: { [key1: string]: () => void } = {
  addAuth: addUserGrant,
  removeAuth: removeUserGrant,
};
// 授权 / 取消授权
const operateCommand = async (type: string, ids: string) => {
  ElMessageBox.confirm(
    `确认${type == 'removeAuth' ? '移除' : '添加'}用户的${authorizeToUserType.value === 'role' ? '角色' : '范围'}授权吗?`,
    '提示'
  )
    .then(() => {
      operateRequest(type, ids);
    })
    .catch(() => {
      ElMessage('取消操作');
    });
};
// unbindExisting: false 增量授权，不取消已有的权限
const operateRequest = async (type: string, ids: string) => {
  const data = await operateApis[type]({
    userIds: ids,
    unbindExisting: false, // authorizeToUserType.value === 'role' ? false : true,
    list: authorizeToUserType.value === 'role' ? [[], [authRole.value.id]] : [[authOrgId.value], []],
  });
  if (data.success) {
    ElMessage.success(data.message);
    initUserList();
  }
};

// 批量操作
const handleBatch = (type: string) => {
  const selsctIds = selectRows.value.map((row) => row.id).join(',');
  operateCommand(type, selsctIds);
};
// 清空
const tableEl = ref();
const handleClear = () => {
  tableEl.value.element.clearSelection();
};

// 切换页码
const handlePageChange = () => {
  initUserList();
};

// 计算表格高度

const rightRef = ref();
const onResize = _.debounce(() => {
  tableConfig.value.maxHeight = rightRef.value.offsetHeight - 32 - 48 - 40;
  tableConfig.value.height = tableConfig.value.maxHeight + 'px';
}, 500);

// 返回
const handleBack = () => {
  router.replace('/system-management/role');
};
</script>
<style lang="scss" scoped>
@use '@/style/virtual-tab.scss';
@use '@/style/layout-container.scss';
$tabHeight: 28px;
.authorize {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  &-top {
    line-height: 28px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid $mainBorderColor;
    padding: 0px $mainPadding;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    &-info {
      display: flex;
      &-item {
        margin-right: 80px;
      }
      span {
        font-weight: bold;
      }
    }
    &-right {
      margin-left: auto;
      margin-right: 0;
    }
    :deep(.blue) {
      color: $menuActiveText;
    }
    &-pop {
      width: 100%;
      height: auto;
      padding: 12px;
      box-sizing: border-box;

      &-title {
        height: 20px;
        display: flex;
        align-items: center;
        color: $subMenuActiveText;
        :deep(.el-icon) {
          margin-right: 4px;
        }
      }
      &-list {
        width: 100%;
        height: auto;
        margin-top: 8px;
        box-sizing: border-box;
        :deep(.content) {
          max-width: 200px;
        }
        &-item {
          line-height: 28px;
          display: flex;
          align-items: center;
          :deep(.el-tag) {
            margin-left: 8px;
          }
          &-name {
            max-width: 80%;
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
    &-extra {
      margin-bottom: 6px;
    }
  }
  &-main {
    width: 100%;
    height: calc(100% - 29px);
    flex: 1;
    display: flex;
    justify-content: space-between;
    &-left {
      width: 300px;
      padding: 16px 16px 16px 16px;
      box-sizing: border-box;
      margin-right: 20px;
      background-color: #fff;
      border-right: 1px solid $mainBorderColor;
      z-index: 12;
    }
    &-right {
      flex: 1;
      min-width: 500px;
      padding: 16px 16px 16px 0px;
      box-sizing: border-box;
      background-color: #fff;
      &-filter {
        width: 100%;
        height: 48px;
        display: flex;
        align-items: center;
        &-search {
          margin-left: auto;
        }
        :deep(.el-checkbox__label) {
          font-size: 14px;
          color: $menuText;
        }
        :deep(.el-tabs__header) {
          margin-bottom: 0px !important;
        }
        :deep(.el-tabs__content) {
          padding: 0px !important;
        }
      }
      &-stastic {
        width: 100%;
        height: 48px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-radius: 8px;
        margin: 12px 0;
        border: 1px solid $menuActiveText;
        background-color: $menuActiveText-1;
        font-size: 13px;
        :deep(.el-icon) {
          margin-right: 4px;
          font-size: 15px;
          color: $menuActiveText;
        }
        > span {
          margin: 0 4px;
          color: $menuActiveText;
        }
        &-btn {
          margin-left: auto;
        }
      }
      &-tabs {
        width: 260px;
        height: $tabHeight;
        margin-right: 20px;
        :deep(.el-tabs__header .el-tabs__item.is-active) {
          border-color: #e4e7ed;
        }
        :deep(.el-tabs__header) {
          height: $tabHeight;
        }
        :deep(.el-tabs__nav-prev),
        :deep(.el-tabs__nav-next) {
          line-height: calc($tabHeight + 4px);
        }
        :deep(.el-tabs__item) {
          // width: 100px;
          font-size: 12px;
          height: $tabHeight;
          line-height: $tabHeight;
          padding: 0 12px;
          color: $menuText;
          margin-top: 0px;
        }
      }
    }
  }
  :deep(.el-table__body td.el-table__cell) {
    :deep(.cell .el-button.is-link) {
      padding: 0px 2px;
    }
  }

}
@media screen and (max-width: 1280px) {
  :deep(.pages) {
    justify-content: flex-end;
    > div {
      display: none;
    }
    .el-pagination {
      display: flex;
    }
  }
}
.authorize-main-right{
  display: flex;
  flex-direction: column;
}
</style>
