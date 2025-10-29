<template>
    <div class="setModel">
        <div>
            <h2>基础设置</h2>
            <el-descriptions :column="2" direction="vertical">
                <el-descriptions-item label="中文名称">{{ baseInfoObj.name }}</el-descriptions-item>
                <el-descriptions-item label="模型描述">{{ baseInfoObj.description }}</el-descriptions-item>
            </el-descriptions>
            <el-button class="absolute top-[20px] right-[25px]" link :icon="Edit" @click="editBaseInfo">编辑</el-button>
        </div>
        <div>
            <h2>关联资产</h2>
            <div>
                <el-input v-model="assetId" style="width: 240px" placeholder="请输入资产ID,多个id用,号分隔" /><el-button round @click="relationAssets" class="ml-3">&emsp;关联&emsp;</el-button>
            </div>
        </div>
        <div>
            <h2>删除资产</h2>
            <div>
                <p class="text-[13px] font-normal">此操作不可撤销，执行此操作后该资产及其相关文件将永久删除，请谨慎操作</p>
                <el-button plain round type="danger" @click="deleteAssets" class="px-4 mt-3">&emsp;删除&emsp;</el-button>
            </div>
        </div>
    </div>
    <el-dialog
        :modelValue="dialogVisible"
        title="修改基础设置"
        destroy-on-close
        top="1vh"
        width="600"
        @closed="handleClose"
        >
        <div class="bg-white p-3 px-7">
            <el-form :model="editBasicinfo" ref="addFormRef" :rules="rules" label-width="90" class="w-full m-auto">
                <el-form-item label="中文名称:"  prop="name">
                    <el-input v-model="editBasicinfo.name" placeholder="请输入中文名称" clearable />
                </el-form-item>
                <el-form-item :label="`${dataType.label}描述:`">
                    <el-input
                    v-model="editBasicinfo.description"
                    :autosize="{ minRows: 6, maxRows: 6 }"
                    type="textarea"
                    maxlength="25"
                    :show-word-limit="true"
                    placeholder="请输入描述信息"
                    class="border"
                    />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer text-center">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Edit } from '@element-plus/icons-vue'
import TypeInfo from '@/hooks/dataType'
import commonDetailsFn from '@/hooks/modelAndDatas'
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
// 模型接口
// import {modelBasic, modelUpdateBasic, modelBindAssetSave, modelDelete, modelBindAssetInfo} from '@/api/model'
// 数据集接口
// import {datasBasic, datasUpdateBasic, datasBindAssetSave, datasDelete, datasBindAssetInfo} from '@/api/dataSet'

const emit = defineEmits(["updataData"]);
const { dataType } = TypeInfo()
const {detailsData} = commonDetailsFn()
const currentDetailsData = computed(() => {
    return detailsData.value
})
// 基础设置回显
const baseInfoObj = ref({
    name: '',
    description: '',
})
// 关联资产
const assetId = ref('')
// 控制编辑基础设置的弹框
const dialogVisible = ref(false)
// 编辑基础设置的对象
const editBasicinfo = ref({
    name: '',
    description: '',
})
const rules = ref<FormRules>({
    name: [
        {required: true, message: '请输入中文名称', trigger: ['blur', 'change']},
    ],
})
// 获取基础设设置
const getBaseInfoFn = () => {
    if (dataType.value.label === '模型') {
        // modelBasic({
        //     id: currentDetailsData.value.id,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     baseInfoObj.value.description = data?.description || '-'
        //     baseInfoObj.value.name = data?.name || '-'
        // })
        // modelBindAssetInfo({
        //     id: currentDetailsData.value.id,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     assetId.value = data
        // })
    } else if (dataType.value.label === '数据集') {
        // datasBasic({
        //     id: currentDetailsData.value.id,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     baseInfoObj.value.description = data?.description || '-'
        //     baseInfoObj.value.name = data?.name || '-'
        // })
        // datasBindAssetInfo({
        //     id: currentDetailsData.value.id,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     assetId.value = data
        // })
    }
}

onMounted(() => {
    getBaseInfoFn()
})

const editBaseInfo = () => {
    editBasicinfo.value.name = baseInfoObj.value.name
    editBasicinfo.value.description = baseInfoObj.value.description
    dialogVisible.value = true

}
const handleClose = () => {
    dialogVisible.value = false
    editBasicinfo.value.name = ''
    editBasicinfo.value.description = ''
}
const addFormRef = ref()
const handleSubmit = async () => {
    await addFormRef.value.validate((valid: boolean) => {
      if (valid) {
        if (dataType.value.label === '模型') {
            // modelUpdateBasic({
            //     id: currentDetailsData.value.id,
            //     name: editBasicinfo.value.name,
            //     description: editBasicinfo.value.description
            // }).then((res) => {
            //     const {data: {code}} = res;
            //     if (code === 0) {
            //         ElMessage.success('编辑成功')
            //         getBaseInfoFn()
            //         handleClose()
            //         emit('updataData')
            //     }
            // })
        } else if (dataType.value.label === '数据集') {
            // datasUpdateBasic({
            //     id: currentDetailsData.value.id,
            //     name: editBasicinfo.value.name,
            //     description: editBasicinfo.value.description
            // }).then((res) => {
            //     const {data: {code}} = res;
            //     if (code === 0) {
            //         ElMessage.success('编辑成功')
            //         getBaseInfoFn()
            //         handleClose()
            //         emit('updataData')
            //     }
            // })
        }
      }
    })
}
const relationAssets = () => {
    if (dataType.value.label === '模型') {
        // modelBindAssetSave({
        //     id: currentDetailsData.value.id,
        //     assetIds: assetId.value,
        // }).then((res) => {
        //     const {data: {code}} = res;
        //     if (code === 0) {
        //         ElMessage.success('关联资产成功')
        //         emit('updataData')
        //     }
        // })
    } else if (dataType.value.label === '数据集') {
        // datasBindAssetSave({
        //     id: currentDetailsData.value.id,
        //     assetIds: assetId.value,
        // }).then((res) => {
        //     const {data: {code}} = res;
        //     if (code === 0) {
        //         ElMessage.success('关联资产成功')
        //         emit('updataData')
        //     }
        // })
    }
}

const router = useRouter();
const deleteAssets = () => {
    ElMessageBox.confirm("确定删除(不可恢复)?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
        if (dataType.value.label === '模型') {
            // modelDelete({
            //     id: currentDetailsData.value.id,
            // }).then((res) => {
            //     const {data: {code}} = res;
            //     if (code === 0) {
            //         ElMessage.success('删除成功')
            //         router.back()
            //     }
            // })
        } else if (dataType.value.label === '数据集') {
            // datasDelete({
            //     id: currentDetailsData.value.id,
            // }).then((res) => {
            //     const {data: {code}} = res;
            //     if (code === 0) {
            //         ElMessage.success('删除成功')
            //         router.back()
            //     }
            // })
        }
    });
}

</script>
<style lang="postcss">
.setModel {
    @apply rounded-md overflow-y-auto p-0;
    > div {
        @apply bg-white rounded-[20px] mb-4 p-5 relative;
        > h2 {
            @apply font-bold text-base leading-[30px] mb-3;
            color: #333333;
        }
        .el-descriptions {
            .el-descriptions__cell {
                @apply !text-[13px] !pb-0;
            }
        }
    }
}
</style>