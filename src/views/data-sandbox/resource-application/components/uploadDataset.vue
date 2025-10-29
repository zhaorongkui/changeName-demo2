<template>
  <!-- 外层包裹 el-dialog -->
  <el-drawer v-model="visible" title="本地上传" size="50%" @close="handleClose" :modal="false">
    <div class="content-main">
      <!-- 表单区域 -->
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" label-position="right">
        <!-- 基本信息 -->
        <el-form-item label="数据集名称" prop="name">
          <!-- 这里示例写死几个选项，实际可从接口获取 -->
          <el-input v-model="formData.name" placeholder="请输入数据集名称" class="w-full" />
        </el-form-item>
        <el-form-item label="数据集所属组织" prop="orgId">

<!--            <OrgSelect v-model="formData.orgId" :show-checkbox="true" :multiple="true"-->
<!--                                    :cascader="true" @update:modelValue="handleCheckedNodes" />-->
          <el-tree-select
              class="org-tree-select"
              node-key="orgId"
              v-model="formData.orgId"
              :data="treeData"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :props="propsTree"
              show-checkbox
              placeholder="请选择"
              style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="数据时间范围" prop="timeRange">
          <el-date-picker v-model="formData.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
        </el-form-item>

        <!-- 导入数据集 -->
        <el-form-item label="导入方式" prop="importType">
          <el-select v-model="formData.importType" placeholder="请选择导入方式" clearable filterable>
            <el-option label="上传excel文档" value="excel" />
            <!-- 可根据需要添加其他导入方式 -->
          </el-select>
        </el-form-item>

        <el-form-item label="是否有表头" prop="hasHeader">
          <el-select v-model="formData.hasHeader" placeholder="请选择是否有表头" clearable filterable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="上传文档" prop="fileList">
          <!-- Element Plus 的上传组件 -->
          <el-upload ref="uploadRef" :action="baseURL + '/ms/dataApplication/upload'" :on-change="changeFun"
            :auto-upload="false" :limit="1" :on-exceed="(files) => handleExceed(files, uploadRef)"
            :on-success="handleUploadSuccess" :before-upload="beforeUpload" :file-list="formData.fileList"
            :on-remove="handleRemove" accept=".csv,.xlsx,.xls">
            <el-button type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传csv/xls/xlsx格式文件，且限上传1个文档
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="编码格式" prop="encoding">
          <el-select v-model="formData.encoding" placeholder="请选择编码格式" clearable filterable>
            <el-option label="UTF-8" value="UTF-8" />
            <el-option label="GBK" value="GBK" />
            <!-- 可根据需要添加其他编码 -->
          </el-select>
        </el-form-item>

        <el-form-item label="列分隔符" prop="delimiter">
          <el-select v-model="formData.delimiter" placeholder="请选择列分隔符" clearable filterable>
            <el-option label="半角逗号" value="," />
            <el-option label="制表符" value="\t" />
            <el-option label="分号" value=";" />
            <!-- 可根据需要添加其他分隔符 -->
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部操作按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </span>
    </template>
    <el-dialog v-model="dialogVisibleWarning" width="20%" center :show-close="false" :close-on-click-modal="false">
      <div class="progress-content">
        <el-progress type="circle" :percentage="percentage" :status="status" class="custom-circle-progress" />
        <span class="warning-progress-text">上传成功，系统元数据匹配中,请稍等......</span>
      </div>

    </el-dialog>
    <!--  字段设置弹窗-->
    <fieldSetting v-if="isShowFieldSetting" @closeDrawer="handleCloseOk"></fieldSetting>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, provide,onMounted  } from 'vue'
import { ElMessage } from 'element-plus'
import fieldSetting from './fieldSettings.vue'
import projectEnv from '@/config/runtimeEnv.js'
import { dataApplicationUpload } from '@/api/dataSet.ts'
import { initTreeData } from '@/utils/dataSandbox'
const baseURL = projectEnv.VITE_APP_MODEL_SANDBOX
// 控制对话框显示/隐藏的 ref
const visible = ref(false)
const dialogVisibleWarning = ref(false)
const status = ref('')
const percentage = ref(0)
const isShowFieldSetting = ref(false)
const treeData = ref([])
const propsTree = ref({
  label: 'name',
  children: 'children',
  value: 'orgId',
})

// 暴露一个方法给父组件，用于打开对话框
const openDialog = () => {
  visible.value = true
}

// 表单实例 ref
const formRef = ref(null)
// 上传组件实例 ref
const uploadRef = ref(null)

// 表单数据对象
const formData = reactive({
  name: '',           // 数据集名称
  orgId: [],          // 数据集所属组织
  timeRange: '',      // 数据时间范围
  importType: '',     // 导入方式
  hasHeader: true,    // 是否有表头
  fileList: [],       // 上传的文件列表
  encoding: 'UTF-8',  // 编码格式
  delimiter: ',',     // 列分隔符
})
const emits = defineEmits(['close'])
// 表单验证规则
const formRules = reactive({
  name: [
    { required: true, message: '请选择数据集名称', trigger: 'change' },
  ],
  orgId: [
    { required: true, message: '请选择数据集所属组织', trigger: 'change' },
  ],
  timeRange: [
    { required: true, message: '请选择数据时间范围', trigger: 'change' },
  ],
  importType: [
    { required: true, message: '请选择导入方式', trigger: 'change' },
  ],
  hasHeader: [
    { required: true, message: '请选择是否有表头', trigger: 'change' },
  ],
  // fileList: [
  //   { required: true, message: '请上传文档', trigger: 'change' },
  // ],
  encoding: [
    { required: true, message: '请选择编码格式', trigger: 'change' },
  ],
  delimiter: [
    { required: true, message: '请选择列分隔符', trigger: 'change' },
  ],
})
const handleCheckedNodes = (nodes) => {
  formData.orgId = nodes; // 同步到queryData,临时处理
};
// 处理文件超出数量限制
const handleExceed = (files, uploadRef) => {
  ElMessage.warning(`最多只能上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + formData.fileList.length} 个文件`)
  uploadRef.clearFiles() // 清空已选文件
}
const changeFun = (file, fileList) => {
  // console.log('文件变化：', file, fileList);
  formData.fileList = fileList
  formData.fille = file
}
const handleRemove = (file, fileList) => {
  formData.fileList = [];
}
// 上传成功回调（关键：获取上传后的文件信息）
const handleUploadSuccess = (response, file, fileList) => {
  // 保存文件信息到表单（根据需求处理）
  formData.fileList = fileList;

  // 这里可以获取文件的原始信息
  const fileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    url: file.url, // 如果有临时URL
    raw: file.raw  // 原生File对象（如需进一步处理）
  };
  ElMessage.success('文件上传成功');
  // 可以在这里调用接口，将文件信息提交到后端
};

// 关闭前的回调，可用于表单未保存时的提示
const handleBeforeClose = (done) => {
  // 如果表单有修改，可以弹出确认框询问是否离开
  ElMessageBox.confirm('表单内容尚未保存，确定关闭？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      done() // 关闭对话框
    })
    .catch(() => {
      // 用户点击取消，不做任何操作
    })
}
const responseData = ref({})
provide('responseData', responseData)
// 下一步按钮点击事件（示例：先校验表单，再处理上传/下一步逻辑）
const handleNext = async () => {
  try {
    // 先校验整个表单
    await formRef.value.validate()
    if (formData.fileList.length === 0) {
      ElMessage.error('请上传文档')
      return
    }
    dialogVisibleWarning.value = true
    percentage.value = 0       // 从 0 开始
    status.value = ''          // 清空状态

    const MAX_DURATION_MS = 5000 // 模拟总运行时间：5秒
    const INTERVAL_MS = 200      // 每 200ms 增加一次进度
    let elapsed = 0

    // 使用 setInterval 每隔一段时间增加 percentage
    const timer = setInterval(() => {
      elapsed += INTERVAL_MS

      // 计算当前进度百分比
      percentage.value = Math.min(Math.round((elapsed / MAX_DURATION_MS) * 100), 100)

      // 根据当前进度设置状态颜色（可选）
      if (percentage.value >= 95) {
        // status.value = 'success' // 完成
        clearInterval(timer)     // 停止定时器
        // 可选：进度完成后，延迟关闭弹窗或做其他操作
        // setTimeout(() => {
        //   dialogVisibleWarning.value = false // 关闭加载弹窗
        //   // 这里可以触发后续逻辑，比如显示结果、跳转等
        //   isShowFieldSetting.value = true
        // }, 500)
      } else if (percentage.value >= 50) {
        // status.value = 'warning' // 进行中，可以是黄色
      } else {
        status.value = '' // 初始阶段，无特殊状态，也可以设为 'primary' 等
      }
    }, INTERVAL_MS)
    // uploadRef.value.submit()

    // 这里只是演示：打印表单数据 + 文件列表
    console.log('表单数据：', formData)
    console.log('文件列表：', formData.fileList)
    // 2. 构造 FormData 对象（用于同时传文件 + 普通字段）
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('orgId', formData.orgId.length > 0 && formData.orgId.join(',')); // 组织ID，多个用逗号分隔
    submitData.append('beginTime', formData.timeRange[0]); // 开始时间  
    submitData.append('endTime', formData.timeRange[1]); // 结束时间
    submitData.append('importType', formData.importType);
    submitData.append('hasHeader', formData.hasHeader); 
    submitData.append('encoding', formData.encoding);
    submitData.append('delimiter', formData.delimiter); 
    submitData.append('file', formData.fille.raw); // 上传的文件对象  
    // return;
    dataApplicationUpload(submitData).then(res => {
      setTimeout(() => {
          percentage.value = 100
          status.value = 'success' // 完成
          dialogVisibleWarning.value = false // 关闭加载弹窗
          // 这里可以触发后续逻辑，比如显示结果、跳转等
          isShowFieldSetting.value = true
        }, 1500)
      // console.log('上传成功', res)
      responseData.value = res.data;
      
      // isShowFieldSetting.value = true
    }).catch(err => {
      dialogVisibleWarning.value = false // 关闭加载弹窗
      // console.log('上传失败', err)
    }).finally(() => {
      clearInterval(timer)     // 停止定时器
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('表单验证失败：', error)
    } else {
      // el-form validate 抛出的不是 Error 对象时（比如手动调用 validate 失败）
      console.log('表单验证未通过')
    }
  }
}

// 关闭弹窗
const handleClose = () => {
  emits('close')
  visible.value = false
}
const handleCloseOk = () => {
  visible.value = false
  emits('close', true)
}
onMounted(()=>{
  treeData.value = initTreeData()
})
// 暴露给父组件的方法
defineExpose({
  openDialog,
})
</script>

<style scoped>
.content-main {
  background: #fff;
  padding: 20px;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

:deep(.custom-circle-progress .el-progress-circle__track) {
  stroke: #e4e7ed !important;
}

:deep(.custom-circle-progress .el-progress-circle__path) {
  stroke: #67c23a !important;
}

.warning-progress-text {
  display: inline-block;
  margin-top: 30px;
  font-size: 20px;
}
</style>
<style>
.el-dialog:before {
  display: none !important;
}

.el-drawer__body .el-form-item {
  flex-direction: row;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  /* 按钮间距 */
  padding: 10px 16px;
  border-top: 1px solid #eee;
}
</style>