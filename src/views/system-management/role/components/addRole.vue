<!--
* @description 
* @fileName addRole.vue
* @author zhangshufeng
* @date 2024/03/08 14:40:32
* @filePath src\views\system\role\components\addRole.vue
!-->
<template>
  <el-drawer
    v-model="dialogFormVisible"
    :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
    direction="rtl"
    :size="EL_DRAWER_WIDTH"
    :modal="false"
    class="commonDrawer"
  >
    <el-form ref="addRoleRef" label-position="left" :model="form" :rules="rules" :disabled="isBootstrapAndsource_1()">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form!.name" placeholder="请输入" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="form!.code" :disabled="!(dialogType === 'add')" placeholder="请输入" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属组" prop="groupId">
            <el-select v-model="form!.groupName" placeholder="请选择" size="default" @change="handleChange">
              <el-option v-for="item in roleGrops" :key="item.value" :label="item.label" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色类型" prop="type">
            <el-radio-group v-model="form!.type">
              <el-radio label="普通角色" :value="1" />
              <el-radio label="子管理员角色" :value="2" />
              <el-radio v-if="form!.type === '超级管理员角色'" label="超级管理员角色" :value="3" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="form.type === '子管理员角色'" :span="24">
          <el-form-item label="可管理范围" prop="authorizedRoles">
            <template #label>
              <i class="required">*</i>
              可管理范围
            </template>
            <el-cascader
              v-model="form.authorizedRoles"
              :options="roleArr"
              :show-all-levels="false"
              :props="roleCascaderDefaultProps"
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="6"
              clearable
              @change="authorizeRoleChanged"
            >
            </el-cascader>
            <el-icon color="#bfbfbf"><InfoFilled /></el-icon
            ><span style="font-size: 12px">当子管理员给他人进行用户授权时可赋予哪些角色</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="来源" prop="source">
            <el-radio-group v-model="form!.source" :disabled="!isBootstrap()">
              <el-radio label="自定义" :value="2" />
              <el-radio label="内置" :value="1" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色描述" prop="remark">
            <el-input
              v-model="form!.remark"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { roleGroupModel, roleModel } from '~/types/user';
import { isBootstrap } from '@/utils/index';
import { roleType } from '../enum';
import { ElMessage } from 'element-plus';
import { addRoleApi, updateRoleApi, getRoleGroupApi, roleSingularApi, resourcesToRoleApi } from '@/api/role';
import { EL_DRAWER_WIDTH } from '@/utils/constant';
import { InfoFilled } from '@element-plus/icons-vue';
const dialogFormVisible = ref(false);
const form = ref<roleModel>({
  groupId: 1, //分组id
  groupName: '默认', //分组名。查询返回用；新建或更新时不用填。
  name: '', //角色名称
  code: '', //角色编码
  remark: '', //角色介绍
  source: 2, //角色来源，1内置，2自定义
  status: 1, //状态，1：启用，2：停用
  type: 1, // 角色类型：1，普通角色，2.子管理员，3超级管理员
  authorizedRoles: [], //可管理范围
});
const roleMenuList = ref<string[]>([]);
const isCopyAddRole = ref(false);
const roleCascaderDefaultProps = ref({
  multiple: true,
  label: 'name',
  value: 'id',
  children: 'roles',
});

interface roleGropusOptions {
  label: string;
  value: string;
}
const roleGrops = ref<roleGropusOptions[]>();
const resetForm = () => {
  form.value = {
    groupId: 1, //分组id
    groupName: '默认', //分组名。查询返回用；新建或更新时不用填。
    name: '', //角色名称
    code: '', //角色编码
    remark: '', //角色介绍
    source: 2, //角色来源，1内置，2自定义
    status: 1, //状态，1：启用，2：停用
    type: 1,
    authorizedRoles: [], //可管理范围
  };
};
const { refreshList } = defineProps({
  refreshList: {
    type: Function,
    default: () => {},
  },
});
const roleArr = ref<roleGroupModel[]>();

const authorizedRolesCheck = (_rule: any, value: string, callback: any) => {
  if (form.value.type === 2) {
    if (value.length === 0 || value === '') {
      callback(Error('请选择管理范围'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
const roleNameCheckServe = async (_rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await roleSingularApi({
      name: value,
      id: form.value.id ? form.value.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('角色名称重复'));
    } else {
      callback();
    }
  }
};
const roleCodeCheckServe = async (_rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await roleSingularApi({
      code: value,
      id: form.value.id ? form.value.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('角色编码重复'));
    } else {
      callback();
    }
  }
};
const rules = ref({
  name: [
    { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
    { validator: roleNameCheckServe, trigger: 'blur' },
  ],
  code: [
    { message: '请输入大小写字母数字和下划线', pattern: /^[5A-Za-z0-9-_]+$/, trigger: ['blur', 'change'] },
    { validator: roleCodeCheckServe, trigger: 'blur' },
  ],
  groupId: { required: true, message: '请选择所属组', trigger: ['blur', 'change'] },
  type: { required: true, message: '请选择角色类型', trigger: ['blur', 'change'] },
  source: { required: true, message: '请选择来源', trigger: ['blur', 'change'] },
  authorizedRoles: { validator: authorizedRolesCheck, trigger: ['blur', 'change'] },
});
const dialogType = ref('add');
const addRoleRef = ref();
async function changeRoleAction() {
  const param = {
    ...form.value,
  };
  param.authorizedRoles = param.type === roleType.normal.value ? [] : roleAutoRoleParamToServe(param.authorizedRoles);
  if (dialogType.value === 'edit') {
    // 编辑接口
    param.id = form.value.id;
    const result = await updateRoleApi([param]);
    if (result.success) {
      ElMessage.success('修改成功');
      dialogFormVisible.value = false;
      refreshList();
    }
  } else {
    // 新增接口
    const result = await addRoleApi(param);
    if (result.success) {
      ElMessage.success(isCopyAddRole.value ? '角色复制成功' : '角色添加成功');
      dialogFormVisible.value = false;
      if (isCopyAddRole.value) {
        const resourceResult = await resourcesToRoleApi(
          {
            roleId: result.data,
            unassign: true, //false是增量授权，true是全量授权body中传入页面中勾选的全部菜单和操作权限
          },
          roleMenuList.value
        );
        if (resourceResult.success) {
          ElMessage.success('角色菜单复制成功');
        }
      }
      refreshList();
    }
  }
}
// 可管理范围数据转换
const roleAutoRoleParamToServe = (authorizedRoles: Array<any>) => {
  if (authorizedRoles.length > 0) {
    return typeof authorizedRoles[0] === 'object'
      ? authorizedRoles.map((item) => {
          return item[1];
        })
      : authorizedRoles;
  } else {
    return [];
  }
};
const submit = () => {
  setTimeout(() => {
    addRoleRef.value.validate(async (valid: boolean) => {
      if (valid) {
        dialogFormVisible.value = false;
        changeRoleAction();
      } else {
        console.log('error submit!');
        return false;
      }
    });
  }, 100);
};
const cancel = () => {
  dialogFormVisible.value = false;
  ElMessage(dialogType.value === 'add' ? '取消添加角色' : '取消编辑角色');
};
const handleChange = (e: any) => {
  form.value.groupId = e.value;
  form.value.groupName = e.label;
};
const authorizeRoleChanged = () => {
  console.log('aaaaaaaaaa', form.value.authorizedRoles);
};

const initDialog = async (type: string, groupData: any, role?: roleModel, roleMenus?: any) => {
  dialogFormVisible.value = true;
  dialogType.value = type;
  isCopyAddRole.value = false;
  resetForm();
  setTimeout(() => {
    addRoleRef.value?.clearValidate();
  }, 0);
  roleArr.value = groupData.value.map((item: any) => {
    return {
      ...item,
      disabled: !item.roles || item.roles.length === 0 ? true : false,
    };
  });
  const apiresult = await getRoleGroupApi();
  roleGrops.value = apiresult.data.map((item: roleGroupModel) => {
    if (item.id === 1) {
      form.value.groupName = String(item.name);
      form.value.groupId = item.id;
    }
    return {
      label: item.name,
      value: item.id,
    };
  });
  if (role) {
    form.value = role;
    if (type !== 'edit') {
      form.value.id = null;
      form.value.code = null;
    }
    form.value.authorizedRoles = role.authorizedRoles!.map((item: any) => {
      return item.id;
    });
    // 非0号租户，复制创建内置的角色的时候，默认来源改为自定义
    if (!isBootstrap() && form.value!.source === 1 && type === 'add') {
      form.value.source = 2;
    }
    if (roleMenus) {
      roleMenuList.value = roleMenus;
      isCopyAddRole.value = true;
    }
  }
};
const isBootstrapAndsource_1 = () => {
  return !isBootstrap() && form.value!.source === 1 && form.value.id !== null;
};
defineExpose({
  initDialog,
});
</script>
<style lang="scss" scoped>
:deep(.el-cascader) {
  width: 100%;
}
:deep(.icon-arrow-down) {
  &::before {
    content: '' !important;
  }
}
</style>
