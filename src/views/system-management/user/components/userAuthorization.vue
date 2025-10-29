<!--
* @description ：用户授权
* @fileName userAuthorization.vue
* @author zhangshufeng
* @date 2024/03/04 10:57:24
* @filePath src\views\system\usermanage\components\userAuthorization.vue
!-->
<template>
  <el-dialog v-model="dialogFormVisible" class="commonPopWin" title="用户授权" :before-close="handleClose" :close-on-click-modal="false">
    <div class="content">
    <el-form ref="addOrgRef" label-width="70px" label-position="left" :model="currentUser">
      <el-row>
        <el-col :span="12">
          <el-form-item label="当前用户" prop="currentUserName">
            <el-input v-model="username_phone" placeholder="请输入" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权角色" prop="roles">
            <el-cascader
              v-model="userAuthorizedRoles"
              :options="roleArr"
              :show-all-levels="false"
              :props="roleCascaderDefaultProps"
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              clearable
              @change="changeAuthorizedrole"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="授权范围">
            <div class="authorizationRange">
              <div class="authorizationRange_left">
                <div style="padding-top: 10px">可授权范围</div>
                <organize-tree
                  ref="roleTree"
                  :is-show-check-box="true"
                  title-name="可授权范围"
                  :data="orgTreeData"
                  :check-strictly="false"
                  :filter-node="orgTreeFilterNode"
                  :default-expanded-keys="orgTreeDefaultExpandedKeys"
                  :default-checked-keys="orgTreeDefaultCheckedKeys"
                  node-key="orgId"
                  :scroll-view-bottom="50"
                  :input-top="5"
                  :default-props="orgTreeDefaultProps"
                  @change-node="changeNode"
                >
                </organize-tree>
              </div>
              <div class="authorizationRange_right">
                <tree-to-list ref="treeList"></tree-to-list>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="最近操作人">
            <el-input v-model="currentUser!.updatedBy" placeholder="创建后自动生成" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近操作时间">
            <el-input v-model="currentUser!.updatedAt" placeholder="创建后自动生成" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit" :loading="isSubmitLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import * as buses from '@/utils/bus';
import OrganizeTree from '@/components/organizeTree.vue';
import TreeToList from '@/components/treeToList.vue';
import { getRolesWithGroupApi } from '@/api/role';
import { grantsToUserApi } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import type { UserModel, roleModel, roleGroupModel } from '~/types/user';
import type { Organization } from '~/types/org';

const { t } = useI18n();

const dialogFormVisible = ref(true);
const treeList = ref();
const orgTreeDefaultProps = ref({
  label: 'name',
  id: 'orgId',
  disabled: 'disabled',
  children: 'children',
});
const emits = defineEmits(['close'])
const { refreshList, orgTreeData,currentUserData } = defineProps({
  refreshList: {
    type: Function,
    default: () => {},
  },
  orgTreeData: {
    type: Array as () => Organization[],
    default: () => [],
  },
  currentUserData:{
    type: Object,
    default:{}
  }
});
const currentUser = ref<UserModel>();
const roleTree = ref();
const username_phone = computed(() => {
  return currentUser.value?.name + '( ' + currentUser.value?.username + ' | ' + currentUser.value?.mobile + ' )';
});
const roleCascaderDefaultProps = ref({
  multiple: true,
  label: 'name',
  value: 'id',
  children: 'roles',
});
const orgTreeDefaultExpandedKeys = ref<string[]>([]);
const orgTreeDefaultCheckedKeys = ref<string[]>([]);
const isSubmitLoading = ref(false)
const userAuthorizedRoles = ref<any[]>([]);
onMounted(() => {
    nextTick(() => {
      roleTree.value.init();
    });
    currentUser.value = currentUserData;
    if (orgTreeData.length > 0) {
      orgTreeDefaultExpandedKeys.value.push(orgTreeData[0].orgId);
    }
    //当前用户的授权角色，应该是这个用户返回的roles,而不是authorizedRoles,authorizedRoles仅仅是这个人因为有了别的角色，可以授权他的附属角色，角色有层级概念
    userAuthorizedRoles.value = currentUser.value.roles.map((item: roleModel) => {
      return [item.groupId, item.id];
    });
    orgTreeDefaultCheckedKeys.value = currentUser.value.orgs.map((item: Organization) => item.orgId);
    // 配置已授权范围数据
    getOrgTreeList();
    getRoleRange();
  buses.bus.on(buses.AUTHORIZED_DATA_CHANGE, (busedata: any) => {
    if (busedata.length > 0) {
      roleTree.value.setNodeCheckStatus({ id: busedata[0].orgId }, false);
    } else {
      orgTreeDefaultCheckedKeys.value = [];
      arr.value.forEach((item) => {
        roleTree.value.setNodeCheckStatus({ id: item.orgId }, false, true);
        item.checked = false;
        item.disabled = false;
      });
    }
  });
});
onUnmounted(() => {
  buses.bus.off(buses.USER_MANAGE_SHOW_DIALOG_EMPOWER_TO_USER);
  buses.bus.off(buses.AUTHORIZED_DATA_CHANGE);
});

const roleArr = ref<roleGroupModel[]>();
const handleClose = () => {
  dialogFormVisible.value = false;
};
async function grantsToUserToService(userId: string | string[]) {
  isSubmitLoading.value = true;
  const param = {
    userId: userId,
    unbindExisting: true, //是否先解绑已有授权
  };
  const orgIds = treeList.value.data.filter((item) => item.checked).map((item) => item.orgId);;
  const authroles = userAuthorizedRoles.value.map((item: any) => {
    return item[item.length - 1];
  });
  const data = [orgIds, authroles];
  const result = await grantsToUserApi(param, data);
  if (result.success) {
    cancel()

    ElMessage.success('授权成功');
    refreshList();
  }
  isSubmitLoading.value = false
}

const submit = () => {
  const id = String(currentUser.value!.id);
  grantsToUserToService(id);
};
const cancel = () => {
  emits('close');
};

const arr = ref<Organization[]>([]);
const getOrgTreeList = async () => {
  arr.value = [];
  orgTreeData.forEach((item: Organization) => {
    defaultTreeDisableStatus(item);
  });
  // 配置树形结构后，配置已授权范围列表数据
  nextTick(() => {
    treeList.value.data = arr.value.filter((item) => item.checked && item.name);
  });
};
// 获取授权角色
async function getRoleRange() {
  const result = await getRolesWithGroupApi();
  if (result.success) {
    roleArr.value = result.data.map((item: any) => {
      item.roles = item.roles?.map((role: any) => {
        if (role.name === '默认角色') {
          return {
            ...role,
            disabled: true,
          };
        } else {
          return role;
        }
      });
      return {
        ...item,
        disabled: !item.roles || item.roles.length === 0 ? true : false,
      };
    });
  }
}
const orgTreeFilterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

const changeAuthorizedrole = (e: any) => {
  if (e.length === 0) {
    const result = currentUser.value?.roles.filter((item: roleModel) => {
      return item.name === '默认角色';
    });
    userAuthorizedRoles.value = result && result.length > 0 ? [[result[0].groupId, result[0].id]] : [];
  } else {
    // userAuthorizedRoles.value = e.map((item:any)=>{
    //     return item[item.length-1]
    // })
  }
};
// 通过勾选tree节点，修改数据，改变可勾选状态和选中状态
const changeNode = (node: any) => {
  // console.log(node);
  // changeTreeNodeDisableStatus(node.data, node.checked);
  const selectList = roleTree.value.getCheckedNodesFn(false, false);
  treeList.value.data = selectList
    .filter((item) => item.name)
    .map((item) => {
      return {
        name: item.name,
        orgId: item.orgId,
        checked: true,
        disabled: false,
      };
    });
};

// 设置默认数据
const defaultTreeDisableStatus = (node: Organization) => {
  node.checked = orgTreeDefaultCheckedKeys.value.includes(node.orgId);
  arr.value.push(node);
  if (node.children && node.children.length > 0) {
    node.children = node.children.map((item: Organization) => {
      // item.disabled = node.checked;
      item.checked = orgTreeDefaultCheckedKeys.value.includes(item.orgId);
      defaultTreeDisableStatus(item);
      return item;
    });
  }
};
</script>
<style lang="scss" scoped>
.content{
  background: #fff;
  padding: 20px;
}
:deep(.el-cascader) {
  width: 100%;
}
.authorizationRange {
  width: 100%;
  height: 310px;
  display: flex;
  &_left {
    height: 310px;
    width: 420px;
    border: 1px solid $mainBorderColor;
    padding: 0px $mainPadding;
    .el-tree-node__content {
      padding-left: 0px !important;
    }
  }
  &_right {
    height: 310px;
    width: 480px;
    border: 1px solid $mainBorderColor;
    border-left: none;
  }
}
:deep(.icon-arrow-down) {
  &::before {
    content: '' !important;
  }
}

</style>
<style>
 .commonPopWin .el-dialog__footer{
  margin-top: 0 !important;
  line-height: unset !important;
}
</style>
