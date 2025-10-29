<!--
* @description :新增/编辑字典
* @fileName addDictionary.vue
* @author zhangshufeng
* @date 2024/02/19 16:19:29
* @filePath src\views\system\datadictionary\components\addDictionary.vue
-->
<template>
  <el-drawer
    v-model="dialogFormVisible"
    :title="`${dialogType === 'add' ? '新增字典' : '编辑字典'}`"
    direction="rtl"
    :size="EL_DRAWER_WIDTH"
    class="commonDrawer"
    :modal="false"
    @close="cancelAction"
  >
    <el-form ref="addDictRef" :model="form" label-position="left" label-width="100px" :rules="rules">
      <el-form-item prop="displayName" label="字典名称">
        <el-input v-model="form.displayName" maxlength="100" :placeholder="FormConstants.INPUT_PLACEHOLDER_COMMON" />
      </el-form-item>
      <el-form-item prop="name" label="字典编码">
        <el-input v-model="form.name" :disabled="dialogType === 'edit' ? true : false" maxlength="100" />
      </el-form-item>
      <el-form-item prop="valueProviderType" label="值来源">
        <el-radio-group
          v-if="dialogType === 'add'"
          v-model="form.valueProviderType.name"
          @change="changeValueProviderType"
        >
          <el-radio :label="dictionaryValueSource.enum.value" />
          <el-radio :label="dictionaryValueSource.api.value" />
          <el-radio :label="dictionaryValueSource.xml.value" />
        </el-radio-group>
        <el-input
          v-else
          v-model="form.valueProviderType.name"
          disabled
          maxlength="100"
          :placeholder="FormConstants.INPUT_PLACEHOLDER_COMMON"
        />
      </el-form-item>
      <el-form-item label="配置内容" prop="valueProvider">
        <el-input
          v-model="form.valueProvider"
          :disabled="form.valueProviderType.name === dictionaryValueSource.enum.value ? true : false"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAddBtnAction">{{ FormConstants.CANCEL }}</el-button>
        <el-button type="primary" @click="submitAddAction()">
          {{ FormConstants.CONFIRM }}
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import {ref,reactive,onMounted,onUnmounted,watch} from 'vue';
import * as buses from '@/utils/bus';
import { addDictionaryApi, updateDictionaryApi, dictSingularApi } from '@/api/dict';
import { dictionaryValueSource } from '../enum';
import { EnumValue } from '@/utils/enum';
import { ElMessage } from 'element-plus';
import { EL_DRAWER_WIDTH } from '@/utils/constant';
import { FormConstants } from '@/utils/globalConstants';

const dialogFormVisible = ref(false);
const form = ref({
  id: 0,
  displayName: '',
  name: '',
  valueProvider: '',
  valueProviderType: {
    code: 'e',
    name: '手工录入',
  },
  remark: '',
});

const { refreshList } = defineProps({
  refreshList: {
    type: Function,
    default: () => {},
  },
});
const addDictRef = ref();
watch(
  () => form.value.valueProviderType,
  (newValue, oldValue) => {
    console.log('watch 已触发', newValue, oldValue);
    if (form.value.valueProviderType.name === dictionaryValueSource.enum.value) {
      form.value.valueProvider = '';
    }
  }
);
const dictNameCheckServe = async (_rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await dictSingularApi({
      name: value,
      id: form.value.id === 0 ? null : form.value.id,
    });
    if (request.success && request.data === false) {
      callback(Error('字典编码重复'));
    } else {
      callback();
    }
  }
};
const displayNameCheckServe = async (_rule: any, value: string, callback: any) => {
  if (value === '' || !value) {
    callback();
  } else {
    const request = await dictSingularApi({
      displayName: value,
      id: form.value.id === 0 ? null : form.value.id,
    });
    if (request.success && request.data === false) {
      callback(Error('字典名称重复'));
    } else {
      callback();
    }
  }
};
const rules = ref({
  displayName: [
    { required: true, message: '字典名称必填项未填写，请继续输入', trigger: ['blur', 'change'] },
    { validator: displayNameCheckServe, trigger: 'blur' },
  ],
  //必须由大小写字母和下划线组成，/^(?=.*[A-Z])(?=.*[a-z])(?=.*[_])[a-zA-Z_]{0,100}$/
  // 如果是只限制大小写字母和下划线为/^[a-zA-Z_]{0,100}$/
  name: [
    { required: true, message: '字典编码必填项未填写，请继续输入', trigger: ['blur', 'change'] },
    {
      message: '请输入大小写字母和下划线',
      pattern: /^[a-zA-Z_]{0,100}$/,
      trigger: ['blur', 'change'],
    },
    { validator: dictNameCheckServe, trigger: 'blur' },
  ],
  valueProviderType: { required: true, message: '参数类型必填项未填写，请继续输入', trigger: 'change' },
});

const dialogType = ref('add');
const changeValueProviderType = (e: any) => {
  form.value.valueProviderType.code = EnumValue.getLabelByValue(dictionaryValueSource, e);
};
const cancelAction = () => {
  dialogFormVisible.value = false;
};
const cancelAddBtnAction = () => {
  dialogFormVisible.value = false;
  ElMessage(dialogType.value === 'add' ? '取消新增字典' : '取消编辑字典');
};
const submitAddAction = () => {
  addDictRef.value.validate(async (valid: boolean) => {
    if (valid) {
      dialogFormVisible.value = false;
      if (dialogType.value === 'edit') {
        updateDic();
      } else {
        addDic();
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

onMounted(() => {
  buses.bus.on(buses.DATA_DICTIONARY_SHOW_DIALOG_ADD, (data: any) => {
    dialogFormVisible.value = true;
    resetForm();
    dialogType.value = data.dialogType;
    setTimeout(() => {
      addDictRef.value?.clearValidate();
    }, 0);
    if (dialogType.value === 'edit') {
      form.value.displayName = data.row.displayName;
      form.value.name = data.row.name;
      form.value.remark = data.row.remark;
      form.value.id = data.row.id;
      form.value.valueProvider = data.row.valueProvider;
      form.value.valueProviderType = data.row.valueProviderType;
    }
  });
});
onUnmounted(() => {
  buses.bus.off(buses.DATA_DICTIONARY_SHOW_DIALOG_ADD);
});
function resetForm() {
  form.value.id = 0;
  form.value.displayName = '';
  form.value.name = '';
  form.value.valueProviderType = {
    code: 'e',
    name: '手工录入',
  };
  form.value.valueProvider = '';
  form.value.remark = '';
}

const addDic = async () => {
  const result = await addDictionaryApi({
    type: {
      displayName: form.value.displayName,
      name: form.value.name,
      valueProviderType: form.value.valueProviderType, //值提供器类型，e:枚举（手工录入），a:API（远程请求），x:脚本生成
      valueProvider: form.value.valueProvider,
      source: { code: 2, name: '自定义' },
      remark: form.value.remark,
    },
    values: null,
  });
  if (result.success) {
    ElMessage.success('添加成功');
    refreshList();
  }
};
const updateDic = async () => {
  const result = await updateDictionaryApi({
    id: form.value.id,
    displayName: form.value.displayName,
    name: form.value.name,
    valueProviderType: form.value.valueProviderType, //值提供器类型，e:枚举（手工录入），a:API（远程请求），x:脚本生成
    valueProvider: form.value.valueProvider,
    remark: form.value.remark,
  });
  if (result.success) {
    ElMessage.success('更新成功');
    refreshList();
  }
};
</script>
<style lang="scss" scoped>
:deep(.el-dialog) {
  padding: 5px 10px;
  background-color: #e8f1ff;
  border-radius: 6px;
  display: flex !important;
  width: 60px;
  align-items: center;
}
</style>
