<template>
  <el-dialog
      v-model="visible"
      title="字段设置"
      width="50%"
      :before-close="handleClose"
  >
    <div class="content-main">
    <!-- 错误提示 -->
    <div class="error-tip" v-if="!responseData.match">
      <el-alert
          type="error"
          :closable="false"
          show-icon
      >
        {{ errorMsg }}
      </el-alert>
    </div>

    <!-- 说明文本 -->
    <div class="description">
      <div class="desc-item">(1) 字段设置内可对数据集字段名称、业务归属及其单位重新定义</div>
      <div class="desc-item">(2) 字段取消勾选后，被取消的字段列数据将不会添加至数据集中</div>
    </div>

    <fieldSettingTable ref="fieldTable" @finish="actionOk"></fieldSettingTable>
    </div>
    <!-- 底部操作区 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch, inject } from 'vue'
import fieldSettingTable from './fieldSettingTable.vue'
import { c } from 'vite/dist/node/types.d-aGj9QkWt'
import { submitBarProps } from 'vant'
const visible = ref(true)
const match = ref(false)
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 初始字段数据
  fieldsData: {
    type: Array,
    default: () => []
  }
})
const responseData = inject('responseData', ref({}));
match.value = responseData.value?.match || false;
const emit = defineEmits(['update:modelValue', 'confirm', 'closeDrawer'])
const errorMsg = ref('系统解析文件结构，与现有数据目录元数据匹配失败，请完善元数据定义后重新提交。')

// 监听visible变化以更新父组件状态
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 处理取消操作
const handleCancel = () => {
  visible.value = false
}
const fieldTable = ref(null);
// 处理确认操作
const handleConfirm = () => {
  if (!fieldTable.value) return;
  fieldTable.value.submitData();
  // return;
  // // 检查是否有未命名的字段
  // const unnamedFields = fields.value.filter(field => !field.name.trim())
  // if (unnamedFields.length > 0) {
  //   errorMsg.value = '请为所有选中的字段输入名称'
  //   return
  // }

  // // 过滤掉未选中的字段
  // const selectedFields = fields.value.filter(field => field._originalSelected)

  // // 处理业务归属列，只有选中并且已匹配的才保留值
  // selectedFields.forEach(field => {
  //   if (!field.disabledBusiness) {
  //     field.business = field.business.trim() || ''
  //   }
  // })

  // emit('confirm', selectedFields)
  // visible.value = false
}

// 处理关闭弹窗前的操作
const handleClose = () => {
  handleCancel()
  // done()
}
const actionOk = () => {
  console.log('关闭弹出、抽屉');
  emit('closeDrawer', true);
  handleClose('');
}

// function injects(arg0: string, arg1: Ref<{}, {}>) {
//   throw new Error('Function not implemented.')
// }
</script>

<style scoped>
.content-main{
  background: #fff;
  padding: 20px;
}
.error-tip {
  margin-bottom: 15px;
}

.description {
  margin-bottom: 15px;
  color: #E6A23C;
  font-size: 12px;
  background: #FFF3E0;
  padding: 10px 15px;
}

.desc-item {
  margin-bottom: 5px;
}

.field-table {
  margin-bottom: 20px;
}

.sample-items {
  display: flex;
  flex-direction: column;
}

.sample-item {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
:deep(.el-alert__icon){
  display: none;
}
</style>