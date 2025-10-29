<template>
    <el-dialog v-model="props.visible" title="工作流" width="65%" modal-class="dataset-apply-dialog"
        @close="handleWorkClose">
        <div class="modal-container2">
            <div class="main-content2">
                <div class="apply-modal-form2 flex">
                    <el-image :src="imgUrl" show-progress class="">
                    </el-image>
                </div>
                <div class="apply-modal-content2">
                    <el-timeline style="max-width: 600px">
                        <el-timeline-item :timestamp="item.createTime" placement="top" color="#0bbd87"
                            v-for="(item, index) in progressList" :key="index">
                            <el-card class="cardStyle flex flex-col space-y-4 ">
                                <p class="flex justify-between rounded"><span>节点名称</span><span>{{ item.name }}</span>
                                </p>
                                <p class="flex justify-between rounded"><span>状态</span><span>{{
                                    !item.flag && index > 1 ? '' : (
                                        !item.flag ? '待审核' : (item.flag === 'normal' ?
                                            '正常执行' : '执行驳回'))
                                        }}</span></p>
                                <p class="flex justify-between rounded"><span>执行人</span><span>{{ item.userName }}</span>
                                </p>
                                <p class="flex justify-between rounded"><span>审核意见</span><span class="message-span" :title="item.message">{{ item.message }}</span>
                                </p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCheckReject } from '@/hooks/useCheckReject';
import { reviewBack, reviewApproval, getGeneral, getHistoryProgress } from '@/api/thirdparty';
const props = defineProps<{
    // imgUrl: string | undefined,
    // progressList: any[],
    workflowId: string | number,
    visible: boolean
}>()
const route = useRoute()
const router = useRouter()
const goBack = () => {
    router.go(-1);
}
const imgUrl = ref('')
// 引入Hook，并传入当前页面的列表方法
const { getGeneralData } = useCheckReject(goBack); // 导出
const getGeneralDataFun = async () => {
    getHistoryProgressFun();
    imgUrl.value = await getGeneralData(props.workflowId);
    //   visible.value = true;
}
const progressList = ref([])
const getHistoryProgressFun = () => {
    getHistoryProgress(props.workflowId).then((res) => {
        if (res.code === 0) {
            progressList.value = res.data;
        }
    })
}
const emit = defineEmits(['update:visible'])
const handleWorkClose = () => {
    emit('update:visible', false)
}
onMounted(() => {
    getGeneralDataFun()
})   
</script>
<style lang="scss" scoped>
.modal-container2 {
    .main-content2 {
        display: flex;

        .apply-modal-form2 {
            width: 75%;
            background-color: #e0e0e0;
            padding: 12px 16px 0;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #ccc;
            margin: auto;
            text-align: center;

            :deep(img) {
                width: 70% !important;
            }

            .el-image {
                display: flex;
                justify-content: center;
            }
        }

        .apply-modal-content2 {
            background-color: #f0f0f0;
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 12px;
            overflow: hidden;

        }
    }

    :deep(.el-card__body) {
        // background-color: red;
        display: flex;
        flex-direction: column;
        /* 设置为垂直布局 */
        justify-content: space-around;
        /* 垂直方向均匀分布 */
        gap: 20px;
    }
  .message-span{
    display: inline-block;
    width: 50%;
    text-align: end;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>