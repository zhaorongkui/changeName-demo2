
<template>
  <div class="dataset-info">
    <el-form label-width="120px" class="dataset-info-content">
      <el-form-item label="数据集名称:" class="dataset-info-item">
        <span class="item-content">
          {{ baseInfoObj.name }}
          <template v-if="isEdit">
            <el-popover
              placement="bottom"
              ref="editNamePopoverRef"
              :width="320"
              popper-class="edit-name-popover"
              trigger="click"
              persistent
            >
              <template #reference>
                <el-button type="text" :icon="Edit" />
              </template>
              <template #default>
                <el-input v-model="baseInfoObj.name" placeholder="请输入数据集名称" />
                <div class="popover-action">
                  <el-button @click="handleCancel">取消</el-button>
                  <el-button type="primary" @click="handleSaveName">确定</el-button>
                </div>
              </template>
            </el-popover>
          </template>
        </span>
      </el-form-item>
      <el-form-item label="数据集ID:" class="dataset-info-item">
        {{ baseInfoObj.datasetsId }}
      </el-form-item>
<!--      <el-form-item label="数据集版本:" class="dataset-info-item">-->
<!--        <span class="item-content">-->
<!--          {{ baseInfoObj.version }}-->
<!--        </span>-->
<!--      </el-form-item>-->
      <el-form-item label="组织维度:" class="dataset-info-item">
        {{ baseInfoObj.orgDimension }}
      </el-form-item>
      <el-form-item label="时间范围:" class="dataset-info-item">
        {{ baseInfoObj.timeRange }}
      </el-form-item>
      <el-form-item label="数据集类型:" class="dataset-info-item">
        {{ baseInfoObj.type == 1 ?'公开数据集' :'未公开数据集' }}
      </el-form-item>
      <el-form-item label="业务实体:" class="dataset-info-item">
        {{ baseInfoObj.businessObject }}
      </el-form-item>
      <el-form-item label="到期时间:" class="dataset-info-item">
        {{ baseInfoObj.deadline }}
      </el-form-item>
    </el-form>
  </div>
  <VersionModal v-if="showVersionModal" :dialogTitle="'版本记录'" @close="showVersionModal = false" />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed,watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { ElDialog, ElPopover } from 'element-plus'
import VersionModal from './VersionModal.vue'
import { BaseInfo } from '@/types/dataSandbox'
const props = defineProps({
  currentDataset:{
    type:Object,
    default:{}
  },
  isEdit:{
    type:Boolean,
    default:false
  },
  datasetId:{
    type:String,
    default:''
  }
})

// 数据集基本信息
const baseInfoObj = ref<BaseInfo>({} as BaseInfo )
// const baseInfoObj = ref({})





const isEdit = ref(props.isEdit ?? false)
const editNamePopoverRef = ref<InstanceType<typeof ElPopover>>()
const handleCancel = () => {
  // 取消编辑逻辑
  editNamePopoverRef.value?.hide()
}
const handleSaveName = () => {
  // 保存数据集名称逻辑
  editNamePopoverRef.value?.hide()
}
const showVersionModal = ref(false)
const versionModalRef = ref<InstanceType<typeof ElDialog>>()
const handleOpenVersion = () => {
  // 打开版本记录逻辑
  console.log('打开版本记录')
  showVersionModal.value = true
}
watch(()=>props.currentDataset,(val)=>{
  baseInfoObj.value = val as BaseInfo
  const ldmList = val.ldmList
  console.log(val,'val===')
  console.log(baseInfoObj.value,'baseInfoObj===')

},{
  deep:true
})
onMounted(() => {
  // initInfo()
})
</script>
<style lang="scss">
.edit-name-popover {
  .popover-action {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
<style lang="scss" scoped>
.dataset-info-content {
  :deep(.el-descriptions__label) {
    text-align: right;
  }
  .dataset-info-item {
    margin-bottom: 4px;
    .item-content {
      display: inline-flex;
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
