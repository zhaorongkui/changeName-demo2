<template >
  <div v-show="!isChildRoute" class="detail-config">
    <el-aside v-if="leftTreeExpand" width="320px" :class="{ asideunexpand: !leftTreeExpand }">
      <RoleOrgTree
        ref="roleTree"
        style="margin-bottom: 50px"
        title-name="角色列表"
        placeholder="搜索角色名称"
        :data="roleGroupList"
        :default-props="roleTreeDefaultProps"
        :draggable="true"
        :is-expand-all="true"
        :filter-node="roleFilterNode"
        @update-role-list="getRolesList"
        @update-role-group="udateRoleGroup"
        @edit-role="editRoleAction"
        @copy-create-role="copyCreateNewRole"
        @move-role-group="moveRoleGroup"
        @delete-role-group="deleteGroup"
      >
        <template #header>
          <div v-permission="`${permissionKey}create`"  class="addBtns">
            <el-button @click="addRoleAction">
              <svg-base icon-name="icon-color-jiaose" size="20"></svg-base>
              新增角色
            </el-button>
            <el-button @click="addRoleGroup">
              <svg-base icon-name="icon-color-yonghuzu" size="20"></svg-base>
              新增角色组
            </el-button>
          </div>
          <Transition v-show="isShowRemind" :class="['moveRemind', { moveRemindh_hdden: !isShowRemind }]">
            <fragment>
              <el-icon style="margin-right: 12px" size="16"></el-icon>
              拖动下方节点即可排序
              <svg-base
                style="margin-left: 44px"
                icon-name="icon-color-guanbi"
                size="16"
                @click="closeRemind"
              ></svg-base>
            </fragment>
          </Transition>
        </template>
      </RoleOrgTree>
    </el-aside>
      <el-main :class="{ hiddenAside: !leftTreeExpand }">
        <div class="roleInfoHeader view_title">
          <div>角色信息</div>
          <div>
            <el-button
                v-permission="'settings:user:grant'"
              :disabled="currentRole == undefined"
              type="primary"
              @click="authorizationToUser"
              >授权用户</el-button
            >
          </div>
        </div>
        <div class="roleInfoContent">
          <div class="header">
            <svg-base
              icon-name="icon-color-xiala"
              style="margin-right: 10px"
              size="16"
            ></svg-base>
            <span>基本信息</span>
          </div>
          <el-form ref="roleDetailRef" label-width="90px" style="margin: 12px 0px" :model="currentRole">
            <el-row>
              <el-col :span="6">
                <el-form-item label="角色名称:" prop="roleName">
                  <el-tooltip
                    popper-class="el-tooltip__popper"
                    placement="top"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="currentRole?.name"
                    :disabled="!isShowToolTip(currentRole?.name ? currentRole?.name : '', 280)"
                  >
                    <el-text line-clamp="1" class="mx-1">{{ currentRole?.name }}</el-text>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属组:" prop="roleGroup">
                  <el-tooltip
                    popper-class="el-tooltip__popper"
                    placement="top"
                    :content="currentRole?.groupName"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :disabled="!isShowToolTip(currentRole?.groupName ? currentRole?.groupName : '', 280)"
                  >
                    <el-text line-clamp="1" class="mx-1">{{ currentRole?.groupName }}</el-text>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="角色类型:" prop="roleType">
                  <el-text line-clamp="1" class="mx-1">{{
                    EnumValue.getLabelByValue(roleType, currentRole?.type)
                  }}</el-text>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="可管理范围:" prop="manageRoleRange">
                  <el-tooltip
                    popper-class="el-tooltip__popper"
                    placement="top"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="roleGrantedData?.desc"
                    :disabled="!isShowToolTip(roleGrantedData ? roleGrantedData?.desc : '', 260)"
                  >
                    <el-text style="max-width: 260px" class="mx-1" line-clamp="1">{{
                      !roleGrantedData?.grantedRoles || roleGrantedData?.grantedRoles.length === 0
                        ? '--'
                        : roleGrantedData!.desc
                    }}</el-text>
                  </el-tooltip>
                  <el-popover
                    v-if="roleGrantedData?.grantedRoles && roleGrantedData!.grantedRoles.length > 0"
                    placement="top-start"
                    :width="300"
                    trigger="hover"
                    :content="manageRangestr"
                  >
                    <template #reference>
                      <el-text class="mx-1" style="color: #0076f9; margin-left: 5px"
                        >[{{ roleGrantedData!.grantedRoles.length }}]
                      </el-text>
                    </template>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="来源:" prop="source">
                  <el-text line-clamp="1" class="mx-1">{{
                    EnumValue.getLabelByValue(roleSource, currentRole?.source)
                  }}</el-text>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态:" prop="status">
                  <el-text line-clamp="1" class="mx-1">{{
                    EnumValue.getLabelByValue(roleStatus, currentRole?.status)
                  }}</el-text>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色描述:" prop="roleDes">
                  <el-tooltip
                    popper-class="el-tooltip__popper"
                    placement="top"
                    :show-after="TOOLTIP_SHOW_AFTER"
                    :content="currentRole?.remark"
                    :disabled="!isShowToolTip(currentRole?.remark ? currentRole?.remark : '', 1000)"
                  >
                    <el-text line-clamp="1" class="mx-1 safari-oneline">{{ currentRole?.remark }}</el-text>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="header" style="margin-top: 0px">
            <svg-base
              icon-name="icon-color-xiala"
              style="margin-right: 10px"
              size="16"
            ></svg-base>
            <span>权限配置</span>
            <el-button
              v-show="!isEditAuth"
              style="margin-left: auto"
              class="edit"
              type="primary"
              text
              @click="configPermissions"
              >配置</el-button
            >
            <div v-show="isEditAuth" style="margin-left: auto">
              <el-button class="edit" text type="primary" @click="updateAuthAction">确定</el-button>
              <el-button class="delete" text @click="cancelConfigAuthAction">取消</el-button>
            </div>
          </div>
          <el-tabs v-model="activeModules" class="permissionTab" @tab-change="handleModulesClick">
            <el-tab-pane
              v-for="(item, index) in userModulesPC"
              :key="index"
              :label="`${item.name.trim() || '-'}`"
              :name="String(index)"
            ></el-tab-pane>
          </el-tabs>
          <el-table
              v-if="userModulesPC.length > 0"
              :data="userModulesPC[activeModules].permissionList"
              style="width: 100%"
              border
          >
            <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
            <el-table-column width="280" prop="menuName" align="left">
              <template #header>
                <el-checkbox
                    v-model="meunAllSelect"
                    :disabled="!isEditAuth"
                    label="菜单页面"
                    @change="allMenuCheckedChanged()"
                />
              </template>
              <template #default="scope">
                <el-checkbox
                    v-model="scope.row.menuChecked"
                    :disabled="!isEditAuth"
                    :label="scope.row.menuName"
                    @change="menuCheckedChanged(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="authList" label="功能点" align="left">
              <template #default="scope">
                <div v-if="scope.row.authList.length > 0" style="display: flex">
                  <el-checkbox
                      v-model="scope.row.authChecked"
                      :disabled="!isEditAuth"
                      label="全选"
                      @change="allAuthCheckedChanged(scope.row)"
                  />
                  <i class="split-line"></i>
                  <div>
                    <el-checkbox
                        v-for="auth in scope.row.authList"
                        :key="auth.id"
                        v-model="auth.checked"
                        :disabled="!isEditAuth"
                        :label="auth.name"
                        @change="authCheckedChanged(scope.row, auth)"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无数据" />
        </div>
      </el-main>
<!--    新增角色-->
  <add-role ref="addRoleRef" :refresh-list="refreshList"></add-role>
<!--    新增角色组-->
  <role-group ref="roleGroupRef" @refresh-list="refreshList"></role-group>
  </div>
  <router-view :key="route.path"></router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import AddRole from './components/addRole.vue';
import RoleGroup from './components/roleGroup.vue';
import { useRouter } from 'vue-router';
import {
  getRolesWithGroupApi,
  getRoleGroupDetailApi,
  getRoleOfGranted,
  resourcesToRoleApi,
  // updateRoleApi,
  updateRoleGroupApi,
} from '@/api/role';
import { roleType, roleSource, roleStatus } from './enum';
import { EnumValue } from '@/utils/enum';
import * as buses from '@/utils/bus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getRoleMenus, getUserAllMenus, isHasCheckCurrentNode } from './roleUtils';
import { getRoleMenusApi, deleteRoleGroupApi } from '@/api/role';
import { isBootstrap } from '@/utils/index';
import { TOOLTIP_SHOW_AFTER } from '@/utils/constant';
import SvgBase from '@/components/SvgBase/index.vue';
import _ from 'lodash';
import { Tree, Resource } from '~/types/org';
import {
  roleGroupModel,
  roleModel,
  authorizedRolesModel,
  roleGrantedModel,
  permissionListModel,
  authModel,
} from '~/types/user';
import RoleOrgTree from '@/components/RoleOrgTree/index.vue'
import { useRoute } from 'vue-router';
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('/authorize'));
const permissionKey = 'settings:role:';
const leftTreeExpand = ref(true);
console.log('Current route:', route.path, route.name);
onMounted(async () => {
  await getRolesList(); // 获取左侧角色树、当前角色管理范围和当前角色权限范围
  const data = await getUserAllMenus(); //获取用户的所有角色权限
  userModulesPC.value = data.userModulesPC;
  // buses.bus.on(buses.TREE_EXPAND, (isExpand: any) => {
  //   leftTreeExpand.value = isExpand;
  // });
  // 监听左侧树点击事件
  buses.bus.on(buses.ORGANIZATION_TREE_NODE_CLICK, async (data: any) => {
    console.log(data,'data===')
    if (!data.roles) {
      // 选择角色才做操作
      currentRole.value = data;
      isEditAuth.value = false;
      meunAllSelect.value = false;
      // 切换角色后，切换右侧的角色管理范围，角色菜单权限，和角色菜单的勾选情况
      getRoleManageRange();
      await getRoleMenus(currentRole.value?.id);
      updatePermissionListCheckStatus();
    }
  });
});
onUnmounted(() => {
  buses.bus.off(buses.ORGANIZATION_TREE_NODE_CLICK);
  buses.bus.off(buses.TREE_EXPAND);
});
const addRoleRef = ref();
const roleGroupRef = ref();
const router = useRouter();
const userModulesPC = ref([]);
const activeModules = ref('0');
const meunAllSelect = ref(false);
const isEditAuth = ref(false);
const roleGroupList = ref([]); //按角色组显示角色
const currentRole = ref<roleModel>();
const isShowRemind = ref(true);
const roleTreeDefaultProps = ref({
  label: 'name',
  value: 'id',
  children: 'roles',
});

const isShowToolTip = (content: string, maxlength: number) => {
  if (content.length > 0) {
    const span = document.createElement('span');
    span.innerHTML = content;
    span.style.fontSize = '14px';
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width > maxlength;
  } else {
    return false;
  }
};
// const currentRoleBrothers = computed(() => {
//   return getNodeBrothers(currentRole.value!);
// });
const roleFilterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};
const roleTree = ref();
const manageRangestr = computed(() => {
  return roleGrantedData.value?.grantedRoles
    .map((item: authorizedRolesModel) => {
      return item.name;
    })
    .join(',');
});
// 获取当前角色的兄弟角色
// const getNodeBrothers = (node: any) => {
//   const parent = roleGroupList.value!.find((item: roleGroupModel) => item.id === node.groupId);
//   return parent ? parent.roles : [];
// };
const roleGrantedData = ref<roleGrantedModel>();
// 按分组获取左侧的角色列表
const getRolesList = async (isRefreshList = false) => {
  getRolesWithGroupApi().then(res => {
    if(res.success){
      roleGroupList.value = res.data;
      //获取角色组
      if (!isRefreshList) {
        currentRole.value = roleGroupList.value!.find((t) => t.roles.length)?.roles[0];
      } else {
        roleGroupList.value?.map((group) => {
          group.roles.map((role) => {
            if (role.id === currentRole.value!.id) {
              currentRole.value = role;
            }
          });
        });
      }

      roleTree.value.setCurrentKey(currentRole.value!.id);
      console.log(roleGroupList.value,'roletree')
      getRoleManageRange();
      getRoleMenus(currentRole.value?.id);
    }else{
      ElMessage.error(res.message);
    }
  })
};
// 更新角色权限，修改权限配置勾选状态
function updatePermissionListCheckStatus() {
  let isAllMenuSelect = 0;
  userModulesPC.value.forEach((element) => {
    const arr = element.permissionList.map((item: permissionListModel) => {
      item.menuChecked = isHasCheckCurrentNode(item.id);
      if (item.menuChecked === false) {
        isAllMenuSelect += 1;
      }
      item.authList = item.authList.map((auth: authModel) => {
        auth.checked = isHasCheckCurrentNode(auth.id);
        return auth;
      });
      if (
        item.authList.length === 0 ||
        item.authList.filter((auth: authModel) => {
          return auth.checked === false;
        }).length > 0
      ) {
        item.authChecked = false;
      } else {
        item.authChecked = true;
      }
      return item;
    });
    element.permissionList = arr;
    if (isAllMenuSelect === 0) {
      meunAllSelect.value = true;
    }
  });
  console.log(userModulesPC.value,'userModulesPC.value')
}

//获取可管理范围
async function getRoleManageRange() {
  const result = await getRoleOfGranted(currentRole.value?.id);
  if (result && result.success) {
    roleGrantedData.value = result.data;
  }
}

//添加角色
function addRoleAction() {
  addRoleRef.value.initDialog('add', roleGroupList);
}
// 编辑角色
async function editRoleAction(role: roleModel) {
  //先获取当前角色可管理的角色范围
  const result = await getRoleOfGranted(role.id!);
  if (result && result.success) {
    //获取授权范围成功后,显示编辑页面
    addRoleRef.value.initDialog('edit', roleGroupList, { ...role, authorizedRoles: result.data.grantedRoles });
  } else {
    ElMessage.warning('获取可管理范围失败,请重试');
  }
}
//添加角色组
function addRoleGroup() {
  roleGroupRef.value.init('add', roleGroupList.value!.length);
}
//编辑角色组
const udateRoleGroup = async (roleGroup: roleGroupModel) => {
  //角色组的来源：内置和自定义，需要单独请求角色组的来源，角色列表中不返回
  if (roleGroup.source !== null && roleGroup.source !== undefined) {
    if (bootStrapEdit(roleGroup)) {
      return;
    }
    const roleG = _.cloneDeep(roleGroup);
    roleGroupRef.value.update('edit', roleG, roleG.ordering);
  } else {
    const result = await getRoleGroupDetailApi(roleGroup.id!);
    if (result.success) {
      roleGroup.source = result.data.source;
      if (bootStrapEdit(roleGroup)) {
        return;
      }
      const roleG = _.cloneDeep(roleGroup);
      roleGroupRef.value.update('edit', roleG, roleG.ordering);
    }
  }
};
const bootStrapEdit = (roleGroup: roleGroupModel) => {
  if (!isBootstrap() && roleGroup.source === 1) {
    ElMessage.warning('系统内置角色组不能编辑！');
    return true;
  }
};
const deleteGroup = async (roleGroup: roleGroupModel) => {
  if (roleGroup.source !== null && roleGroup.source !== undefined) {
    deleteRoleGroupConfirm(roleGroup);
  } else {
    const result = await getRoleGroupDetailApi(roleGroup.id!);
    if (result.success) {
      roleGroup.source = result.data.source;
      deleteRoleGroupConfirm(roleGroup);
    }
  }
};
const deleteRoleGroupConfirm = (roleGroup: roleGroupModel) => {
  if (!isBootstrap() && roleGroup.source === 1) {
    ElMessage.warning('系统内置角色组不能删除！');
    return;
  }
  ElMessageBox.confirm('确定要删除该分组吗？（如果分组下有角色，会连带删除）', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await deleteRoleGroupApi(roleGroup);
    if (result.success) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      await getRolesList();
    }
  });
};
// 复制创建新角色
async function copyCreateNewRole(role: roleModel) {
  if (role.type === 3) {
    ElMessage.warning('超级管理员不可复制');
    return;
  }
  // 复制创建角色，需要复制角色的所有信息，包括授权范围 菜单权限，除了角色id
  const grantedResult = await getRoleOfGranted(role.id!); //获取授权范围
  const menuResult = await getRoleMenusApi(role.id!);
  if (grantedResult.success && menuResult.success) {
    const currentRoleMenu: string[] = menuResult.data.map((item: Resource) => {
      return item.id;
    });
    addRoleRef.value.initDialog(
      'add',
      roleGroupList,
      { ...role, authorizedRoles: grantedResult.data.grantedRoles },
      currentRoleMenu
    );
  }
}
// 拖动修改角色组排序
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const moveRoleGroup = (draggingNode: roleGroupModel, dropNode: roleGroupModel) => {
  const promiseAll: any[] = [];
  roleGroupList.value!.forEach(async (item: roleGroupModel, index: number) => {
    const item1 = { ...item, ordering: index + 1 };
    // eslint-disable-next-line no-async-promise-executor
    const p1 = new Promise(async (resolve) => {
      const result = await updateRoleGroupApi(item1);
      resolve(result);
    });
    promiseAll.push(p1);
  });
  Promise.all(promiseAll)
    .then((res) => {
      let faildNum = 0;
      res.forEach((item) => {
        if (!item.success) {
          faildNum++;
        }
      });
      if (faildNum === 0) {
        ElMessage({
          type: 'success',
          message: '操作成功',
        });
        refreshList();
      }
    })
    .catch((err) => {
      console.log(err); // reject1
    });
};
// 判断是否是非0号租户并且内置角色
const isBootstrapAndsource_1 = () => {
  return !isBootstrap() && currentRole.value!.source === 1;
};
//授权角色
function authorizationToUser() {
  router.push({
    name: 'authorize',
    query: {
      from: 'roleManage',
      roleId: currentRole.value?.id,
      roleName: currentRole.value?.name,
      groupName: currentRole.value?.groupName,
      roleRemark: currentRole.value?.remark,
    },
  });
}

//功能点选择改变之后，如果功能点有勾选，菜单必须勾选上
function authCheckedChanged(row: permissionListModel, auth: authModel) {
  if (auth.checked) {
    row.menuChecked = true;
  }
}

// 菜单操作权限全勾选操作 :如果全部checkbox的状态，影响全部功能点的勾选状态，全部功能点的勾选状态不影响全部按钮的状态
function allAuthCheckedChanged(row: permissionListModel) {
  row.authList = row.authList.map((item: authModel) => {
    item.checked = row.authChecked;
    return item;
  });
  if (row.authChecked) {
    row.menuChecked = row.authChecked;
  }
}
//菜单勾选权限变化:如果菜单取消勾选，那么后面的整个功能取消勾选，包括全部勾选；如果菜单勾选上，那么不影响后面操作功能的勾选
function menuCheckedChanged(row: permissionListModel) {
  console.log(row,'row===')
  if (row.menuChecked === false) {
    row.authChecked = false;
    row.authList = row.authList.map((item: authModel) => {
      item.checked = false;
      return item;
    });
    meunAllSelect.value = false;
  }
  //如果勾选了水厂配置，要同步勾选组织管理；取消勾选水厂配置，不取消组织管理；如果勾选了组织管理，不勾选水厂配置，要取消组织管理同时取消水厂配置
  if (row.name === 'WaterFactory' && row.menuChecked === true) {
    userModulesPC.value[activeModules.value].permissionList.forEach((item: permissionListModel) => {
      if (item.name === 'Organization') {
        item.menuChecked = row.menuChecked;
      }
    });
  }
  if (row.name === 'Organization' && row.menuChecked === false) {
    userModulesPC.value[activeModules.value].permissionList.forEach((item: permissionListModel) => {
      if (item.name === 'WaterFactory') {
        item.menuChecked = row.menuChecked;
      }
    });
  }
}
// 菜单列：全部勾选菜单的操作
function allMenuCheckedChanged() {
  console.log(userModulesPC.value[activeModules.value])
  let permissionList = userModulesPC.value[activeModules.value].permissionList;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  permissionList = permissionList.map((item: permissionListModel) => {
    item.menuChecked = meunAllSelect.value;
    if (meunAllSelect.value === false) {
      item.authChecked = false;
      item.authList = item.authList.map((item: authModel) => {
        item.checked = false;
        return item;
      });
    }
    return item;
  });
  console.log(permissionList,'permissionList===')
}
// 模块tab切换
function handleModulesClick(tab) {
  console.log(userModulesPC.value[tab])
  meunAllSelect.value = userModulesPC.value[tab].permissionList.every((item) => item.menuChecked);
}
//确定，修改权限配置
const updateAuthAction = async () => {
  isEditAuth.value = false;
  const resourceArr: string[] = roleMemuListIds(userModulesPC.value);
  const result = await resourcesToRoleApi(
    {
      roleId: currentRole.value!.id,
      unassign: true, //false是增量授权，true是全量授权body中传入页面中勾选的全部菜单和操作权限
    },
    resourceArr
  );
  if (result.success) {
    ElMessage.success('授权成功');
  }
};
// 组装要配置的菜单权限，用于确定和复制创建角色用
const roleMemuListIds = (modules) => {

  let resourceArr: string[] = [];
  const userModules = modules;
  userModules.forEach((module) => {
    const arr: string[] = [];
    module.permissionList.forEach((item: permissionListModel) => {
      if (item.menuChecked) {
        arr.push(item.id ? String(item.id) : '');
      }
      if (item.authList.length > 0) {
        item.authList.forEach((auth: authModel) => {
          if (auth.checked) {
            arr.push(auth.id ? String(auth.id) : '');
          }
        });
      }
    });
    if (arr.length > 0) {
      resourceArr.push(module.id ? String(module.id) : '');
      resourceArr = resourceArr.concat(arr);
    }
  });
  return resourceArr;
};
// 取消编辑菜单权限
const cancelConfigAuthAction = async () => {
  isEditAuth.value = false;
  meunAllSelect.value = false;
  updatePermissionListCheckStatus();
};

const configPermissions = () => {
  if (isBootstrapAndsource_1()) {
    ElMessage('内置角色不可修改菜单权限');
  } else {
    isEditAuth.value = true;
  }
};
const refreshList = () => {
  getRolesList(true);
};
const closeRemind = () => {
  isShowRemind.value = false;
  roleTree.value.updateViewLayout();
};
</script>

<style scoped lang="scss">
@use '@/style/color.scss';
@use '@/style/layout-container.scss';
@use '@/style/mainButton.scss';

$tabHeight: 26px;
.groupButton:hover {
  background: #fff !important;
}
.groupButton {
  background: #fff !important;
}
.addRoleGroup {
  position: absolute;
  top: 5px;
  right: 20px;
  color: $primary-color;
  size: 18px;
  display: flex;
  align-items: center;
}

.manageRoleGroup {
  position: absolute;
  bottom: 20px;
  color: $primary-color;
  size: 18px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roleInfoHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $mainPadding;
}
.roleInfoContent {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: $fs-14;
  height: calc(100% - 70px);
  .el-row {
    height: 40px;
  }
  .header {
    display: flex;
    align-items: center;
    background-color: #eaeaea;
    margin-top: 20px;
    display: flex;
    align-items: center;
    border-radius: $mainBorderRadius;
    height: 36px;
    padding: 0px 12px;
    .el-icon {
      margin-right: 8px;
    }
    .delete {
      color: $mainCommonButtonTextColor !important;
      margin-left: 0px;
    }
    .edit:hover,
    .delete:hover,
    .edit:focus,
    .delete:focus {
      background-color: #eaeaea;
    }
  }
  .permissionTab {
    :deep(.el-tabs__header .el-tabs__item.is-active) {
      color: $color_primary !important;
    }
    :deep(.el-tabs__item) {
      font-size: 14px;
      // padding: 0 12px;
      color: $menuText;
    }
  }
  .el-table {
    flex: 1;
    margin-top: 5px;
    .split-line {
      display: inline-block;
      width: 1px;
      height: 24px;
      background: #dcdbdb;
      margin: 5px 15px;
    }
    :deep(.el-checkbox__label) {
      font-size: $fs-12;
    }
  }
}
.addBtns {
  display: flex;
  justify-content: space-between;
  padding-top: 18px;
}
.moveRemind {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $mainBorderRadius;
  background-color: #d6ebfa;
  font-size: 14px;
  margin: 18px 0px;
}
.moveRemindh_hdden {
  height: 0px;
  margin: 0px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.layout-container {
  .el-main {
    padding: 0px $mainPadding !important;
  }
}
.svgbaseColor {
  color: --el-color-primary;
}
:deep(.el-aside){
  border-right: 1px solid #e5e6f7;
  padding-right: 5px;
  overflow: hidden;
}
</style>
