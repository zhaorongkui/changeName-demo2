<template>
  <div class="table-demo">
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange" max-height="350px">
      <!-- 多选框列 -->
      <el-table-column type="selection" width="55" :selectable="handleSelectable" />
      <!-- 字段名称列 -->
      <el-table-column prop="fieldName" label="字段名称" min-width="150px">
        <template #default="{ row }">
          {{ row.fieldName }}
          <span v-if="row.flag" class="match-content">已匹配</span>
          <!-- <span v-else><el-icon size="16" style="vertical-align: middle;margin-left: 5px;cursor: pointer">
              <Edit />
            </el-icon></span> -->
        </template>
      </el-table-column>
      <!-- 字段描述列（带下拉选择，可编辑） -->
      <el-table-column label="字段描述" prop="fieldDesc">
        <template #default="{ row }">
          <el-input v-model="row.fieldDesc" placeholder="请输入" :disabled="row.flag"></el-input>

        </template>
      </el-table-column>
      <!-- 字段类型列（带下拉选择，可编辑） -->
      <el-table-column label="字段类型" prop="fieldType">
        <template #default="{ row }">
          <el-select v-model="row.fieldType" placeholder="请选择" style="width: 100%;" :disabled="row.flag">
            <el-option label="文本" value="文本" />
            <el-option label="数值" value="数值" />
            <!-- 可根据实际需求补充更多选项 -->
          </el-select>
        </template>
      </el-table-column>
      <!-- 单位列 -->
      <el-table-column label="单位" prop="fieldUnit">
        <template #default="{ row }">
          <el-input v-model="row.fieldUnit" placeholder="请输入" :disabled="row.flag" style="width: 100%;" />
        </template>
      </el-table-column>
      <el-table-column label="样例1" prop="demo1">
        <!-- <template #default="{ row }">
          <el-input v-model="row.example1" placeholder="请输入" :disabled="row.flag" style="width: 100%;" />
        </template> -->
      </el-table-column>
      <el-table-column label="样例2" prop="demo2">
      </el-table-column>
      <el-table-column label="样例3" prop="demo3"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { saveFieldUpload } from '@/api/dataSet.ts'
import { ElMessage } from 'element-plus'
// import { table } from 'console'
// 表格数据（模拟与截图一致的示例数据）
const tableData = ref([])
const checkedData = ref([])
// 禁用已匹配行的多选框
const handleSelectable = (row) => {
  console.log(row);
  return !row.flag; // 如果行已匹配，则禁用选择
};

// 多选框选中项变化时的回调
const handleSelectionChange = (val) => {
  console.log('当前选中行：', val)
  checkedData.value = val;
}

// 获取当前所有选中行（演示用）
const getSelectedRows = () => {
  const selected = tableData.value.filter((row) => row._selection)
  console.log('当前选中数据：', selected)
}
const emit = defineEmits(['close', 'finish']);
const responseData = inject('responseData', ref({}));
tableData.value = responseData.value.row || [];
// 提交数据（演示用，可根据实际业务发请求等）
const submitData = () => {
  // console.log('提交的数据：', tableData.value)
  // 这里可写请求后端接口的逻辑，将 tableData 传给后端
  const disabledData = ref([])
  disabledData.value = tableData.value.filter(item =>(item.flag) )
  const {
    name,
    orgId,
    beginTime,
    endTime,
    importType,
    hasHeader,
    encoding,
    delimiter,
  } = responseData.value;
  let params = {
    name,
    orgId,
    beginTime,
    endTime,
    importType,
    hasHeader,
    encoding, 
    delimiter,
  };
  params.creator = 'admin'; // 当前登录人
  params.row = [...disabledData.value, ...checkedData.value];
  params.fileId = responseData.value.fileId;
  // console.log(params, 232323232323, tableData.value);
  saveFieldUpload(params).then(res => {
    // console.log('定时器开始', res);
    const {
      code,
      message
    } = res
    if (code === 0) {
      ElMessage.success(`${message || '创建数据集成功'}`)
      // 回传父组件关闭弹出框
      emit('finish')
    } else {
      ElMessage.error(res.msg || '创建数据集失败')
    }
  }).catch(err => {
    console.log('上传失败', err)
  })
}
defineExpose({
  submitData
})
</script>

<style scoped>
.table-demo {
  padding: 20px;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.match-content {
  width: 55px;
  height: 25px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  background: #cae3ff;
  color: #314BF9;
  border-radius: 5px;
}
</style>