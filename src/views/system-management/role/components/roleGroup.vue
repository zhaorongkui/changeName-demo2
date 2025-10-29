<!-- drawer 编辑角色组 -->
<template>
  <el-drawer
    v-model="dialogFormVisible"
    :title="drawerType === 'add' ? '添加角色组' : '编辑角色组'"
    direction="rtl"
    :size="EL_DRAWER_WIDTH"
    :modal="false"
    class="commonDrawer"
  >
    <el-form ref="roleGroupRef" label-position="left" :model="roleGroup" :rules="rules" @submit.prevent>
      <el-row>
        <el-col>
          <el-form-item label="角色组名称" prop="name">
            <el-input v-model="roleGroup.name" placeholder="请输入" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="来源" prop="source">
            <el-select
              v-model="roleGroup.source"
              :disabled="!isBootstrap() && (roleGroup.source === 1 || roleGroup.source === '内置') ? true : false"
              placeholder="请选择"
              size="large"
            >
              <el-option v-for="item in BootstrapType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
import { ref, nextTick} from 'vue'
import { isBootstrap } from '@/utils/index';
import { EnumValue } from '@/utils/enum';
import { roleSource } from '../enum';
import { ElMessage, ElForm } from 'element-plus';
import { updateRoleGroupApi, addRoleGroupApi, roleGroupSingularApi } from '@/api/role';
import { EL_DRAWER_WIDTH } from '@/utils/constant';
import type { roleGroupModel } from '~/types/user';
const dialogFormVisible = ref(false);
const roleGroup = ref<roleGroupModel>({
  name: '',
  ordering: 0,
  roles: [],
  source: '自定义',
  tenantId: '0',
});
const groupOrdering = ref(0);
let BootstrapType: any[] = [];
const roleGroupCheckServe = async (rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await roleGroupSingularApi({
      name: value,
      id: roleGroup.value.id ? roleGroup.value.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('角色组名称重复'));
    } else {
      callback();
    }
  }
};
const rules = ref({
  name: [
    { required: true, message: '请输入角色组名称', trigger: ['blur', 'change'] },
    { validator: roleGroupCheckServe, trigger: 'blur' },
  ],
});
const drawerType = ref('add');

const roleGroupRef = ref();
const emit = defineEmits(['refreshList']);
const submit = () => {
  roleGroupRef.value.validate(async (valid: boolean) => {
    if (valid) {
      dialogFormVisible.value = false;
      if (drawerType.value === 'add') {
        // 新增角色组
        roleGroup.value.source = roleGroup.value.source === '内置' ? 1 : 2;
        roleGroup.value.ordering = groupOrdering.value;
        const result = await addRoleGroupApi(roleGroup.value);
        if (result.success) {
          ElMessage.success('添加成功');
          emit('refreshList');
        }
      } else {
        //    编辑角色组
        roleGroup.value.source = roleGroup.value.source === '内置' ? 1 : 2;
        const result = await updateRoleGroupApi(roleGroup.value);
        if (result.success) {
          ElMessage.success('编辑成功');
          emit('refreshList');
        }
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
};
const cancel = () => {
  dialogFormVisible.value = false;
  ElMessage(drawerType.value === 'add' ? '取消添加角色组' : '取消编辑角色组');
};

const init = async (type: string, ordering: number) => {
  dialogFormVisible.value = true;
  drawerType.value = type;
  if (drawerType.value === 'add') {
    nextTick(() => {
      roleGroupRef.value.resetFields();
      roleGroup.value = {
        name: '',
        ordering: 0,
        roles: [],
        source: '自定义',
        tenantId: '0',
      };
    });
  }
  BootstrapType = isBootstrap()
    ? [
        {
          value: 1,
          label: '内置',
        },
        {
          value: 2,
          label: '自定义',
        },
      ]
    : [
        {
          value: 2,
          label: '自定义',
        },
      ];
  groupOrdering.value = ordering + 1;
  setTimeout(() => {
    roleGroupRef.value?.clearValidate();
  }, 0);
};
const update = async (type: string, groupData: roleGroupModel, ordering: number) => {
  roleGroup.value = groupData;
  roleGroup.value.source = EnumValue.getLabelByValue(roleSource, roleGroup.value.source);
  init(type, ordering);
};

defineExpose({
  init,
  update,
});
</script>
<style lang="scss" scoped></style>
