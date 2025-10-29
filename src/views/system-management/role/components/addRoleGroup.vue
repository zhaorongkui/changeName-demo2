<!--
 * @Description: 弹框式角色组管理---废弃
-->
<template>
  <el-dialog v-model="dialogFormVisible" class="pop-win" width="1100" title="管理角色组" @close="cancelAction" :close-on-click-modal="false">
    <div class="content">
      <el-form ref="formRef" :inline="true" :model="formData" label-width="0px" :rules="rules">
        <div
          v-for="(item, i) in formData.draglist"
          :key="item.id"
          class="item"
          draggable="true"
          @dragstart="dragstart($event, i)"
          @dragenter="dragenter($event, i)"
          @dragend="dragend"
          @dragover="dragover"
          @mouseover="mouseOver(i)"
          @mouseleave="mouseLeave(i)"
        >
          <el-form-item>
            <el-icon style="margin-left: 20px" color="#888787" size="20">
              <Operation />
            </el-icon>
          </el-form-item>
          <el-form-item
            :prop="`draglist.${i}.name`"
            label=""
            :rules="[
              { ...rules.name[0], row: item },
              { ...rules.name[1], row: item },
              { ...rules.name[2], row: item },
            ]"
          >
            <el-input
              v-model="item.name"
              :disabled="!isBootstrap() && (item.source === 1 || item.source === '内置') ? true : false"
              style="width: 350px; height: 40px"
              placeholder="请输入角色组名称"
              @focus="focusAction(item)"
            />
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="item.source"
              :disabled="!isBootstrap() && (item.source === 1 || item.source === '内置') ? true : false"
              placeholder="请选择"
              size="large"
              style="width: 300px; height: 40px"
            >
              <el-option
                v-for="optionItem in BootstrapType"
                :key="optionItem.value"
                :label="optionItem.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <div class="buttons">
            <el-icon color="#0c6dd4" size="20" @click="addGroup(i)">
              <CirclePlusFilled />
            </el-icon>
            <el-icon
              v-if="!(!isBootstrap() && (item.source === 1 || item.source === '内置'))"
              color="#ff0000"
              size="20"
              style="margin-left: 10px"
              @click="deleteGroup(i)"
            >
              <DeleteFilled />
            </el-icon>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @mousedown="cancelAction">取消</el-button>
        <el-button type="primary" @mousedown="submit()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref,onUnmounted,onMounted,} from 'vue'
// import type { roleGroupModel } from '../types/user';
import {
  getRoleGroupApi,
  updateRoleGroupApi,
  addRoleGroupApi,
  deleteRoleGroupApi,
  roleGroupSingularApi,
} from '@/api/role';
import { isBootstrap } from '@/utils/index';
import { ElMessage, ElMessageBox } from 'element-plus';
import { FormConstants } from '@/utils/globalConstants';
const dialogFormVisible = ref(false);
let BootstrapType: any[] = [];
const formRef = ref();
const emit = defineEmits(['refreshList']);
const activeGroup = ref();
const initDialog = () => {
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
  dialogFormVisible.value = true;
  getGroups();
};
const getGroups = async () => {
  const apiresult = await getRoleGroupApi();
  if (apiresult.success) {
    formData.value.draglist = apiresult.data.map((item) => {
      const result = {
        ...item,
        isMoveOn: false,
      };
      result.source = !result.source || result.source === 1 ? '内置' : result.source;
      return result;
    });
  }
};
const roleGroupCheckServe = async (rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await roleGroupSingularApi({
      name: value,
      id: rule.row.id ? rule.row.id : null,
    });
    if (request.success && request.data === false) {
      callback(Error('角色组名称重复'));
    } else {
      callback();
    }
  }
};
const roleGroupCheckLocal = async (rule: any, value: string, callback: any) => {
  const itemArr = formData.value.draglist.filter((item) => {
    if (item.name === value) {
      return item;
    }
  });
  if (itemArr.length > 1) {
    callback(Error('角色组名称重复'));
  } else {
    callback();
  }
};
const rules = ref({
  name: [
    { required: true, message: '请输入角色组名称', trigger: ['blur', 'change'] },
    { validator: roleGroupCheckServe, trigger: 'blur' },
    { validator: roleGroupCheckLocal, trigger: 'blur' },
  ],
});

const focusAction = (item) => {
  activeGroup.value = item;
};
const submit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const groupList = formData.value.draglist.map((item, index: number) => {
        item.ordering = index + 1;
        item.source = item.source === '内置' ? 1 : 2;
        return item;
      });
      const promiseAll: any[] = [];
      groupList.forEach(async (item) => {
        if (item.id) {
          // eslint-disable-next-line no-async-promise-executor
          const p1 = new Promise(async (resolve) => {
            const result = await updateRoleGroupApi(item);
            resolve(result);
          });
          promiseAll.push(p1);
        } else {
          // eslint-disable-next-line no-async-promise-executor
          const p1 = new Promise(async (resolve) => {
            const result = await addRoleGroupApi(item);
            resolve(result);
          });
          promiseAll.push(p1);
        }
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
            setTimeout(() => {
              dialogFormVisible.value = false;
            }, 100);
            ElMessage({
              type: 'success',
              message: '操作成功',
            });
            emit('refreshList');
          }
        })
        .catch((err) => {
          console.log(err); // reject1
        });
    } else {
      return false;
    }
  });
};
const cancelAction = () => {
  emit('refreshList');
  setTimeout(() => {
    dialogFormVisible.value = false;
  }, 100);
};
const formData = ref({
  draglist: [] ,
});
let dragIndex = 0;

const addGroup = (index: number) => {
  let source = 2;
  if (isBootstrap()) {
    source = 1;
  }
  formData.value.draglist.splice(index + 1, 0, {
    name: '',
    ordering: 0,
    roles: [],
    source: source,
    tenantId: '',
    isMoveOn: false,
  });
};
const deleteGroup = async (index: number) => {
  if (formData.value.draglist[index].id) {
    ElMessageBox.confirm('确定要删除该分组吗？（如果分组下有角色，会连带删除）', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const result = await deleteRoleGroupApi(formData.value.draglist[index]!);
        if (result.success) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
          getGroups();
        }
      })
      .catch(() => {
        ElMessage(FormConstants.MESSAGE_TIP_CANCEL);
      });
  } else {
    formData.value.draglist.splice(index, 1);
  }
};
function dragstart(e: any, index: number) {
  e.stopPropagation();
  dragIndex = index;
  setTimeout(() => {
    e.target.classList.add('moveing');
  }, 0);
}
function dragenter(e: any, index: number) {
  e.preventDefault();
  // 拖拽到原位置时不触发
  if (dragIndex !== index) {
    const source = formData.value.draglist[dragIndex];
    formData.value.draglist.splice(dragIndex, 1);
    formData.value.draglist.splice(index, 0, source);
    // 更新节点位置
    dragIndex = index;
  }
}
function dragover(e: any) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}
function dragend(e: any) {
  e.target.classList.remove('moveing');
}
function mouseOver(i: any) {
  formData.value.draglist[i].isMoveOn = !formData.value.draglist[i].isMoveOn;
}
function mouseLeave(i: number) {
  formData.value.draglist[i].isMoveOn = !formData.value.draglist[i].isMoveOn;
}

defineExpose({
  initDialog,
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    text-align: center;
    margin: 10px;
    color: #fff;
    position: relative;
    border-radius: 6px;
    .buttons {
      width: 120px;
      display: flex;
      height: 20px;
      margin-top: 10px;
    }
  }
}

.container {
  position: relative;
  padding: 0;
}

.moveing {
  opacity: 0;
}
</style>
