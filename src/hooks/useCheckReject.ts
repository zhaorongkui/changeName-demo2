import { ref } from 'vue';
import { reviewBack, reviewApproval, getGeneral } from '@/api/thirdparty'; // 导入接口
import { ElMessageBox, ElMessage } from 'element-plus'; // 导入 Element Plus 的消息弹窗和消息组件
import projectEnv from '@/config/runtimeEnv.js'

export function useCheckReject(goBack) {
    // 获取 localStorage 中的 app 数据
    const appDataStr = localStorage.getItem('app');
    // 初始化 userName 变量
    let userName = '';
    if (appDataStr) {
        try {
            // 解析 JSON 字符串为对象
            const appData = JSON.parse(appDataStr);
            // 逐级获取 userName，注意判断各层级是否存在，避免报错
            if (appData.userInfo && appData.userInfo.username) {
                userName = appData.userInfo.username;
            }
        } catch (error) {
            console.error('解析 localStorage 中的 app 数据失败：', error);
        }
    }
    // 审批通过
    const approval = (taskId, applyUserName, formValuesJson, message) => {
        ElMessageBox.confirm("确定此操作吗?", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            const params = {
                taskId: taskId,
                applyUserName: userName,
                formValuesJson: formValuesJson,
                message: message
            }
            console.log('审核通过', params);
            reviewApproval(params).then((res) => {
                const {
                    code
                } = res
                if (code === 0) {
                    ElMessage.success(res.message || `操作成功`)
                    // router.back()
                    goBack()
                } else {
                    ElMessage.error(res.msg || '操作失败')
                }
            })
        });

    }
    // 审批驳回（调用sass平台的接口）
    const reject = (taskId, formValuesJson, message) => {
        ElMessageBox.confirm("确定此操作吗?", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
        }).then(() => {
            const params = {
                taskId: taskId,
                applyUserName: userName,
                formValuesJson: formValuesJson,
                message: message,
                values: { // 域名
                    zFlowProclnfo: {
                        bsBackendUri: projectEnv.VITE_APP_MODEL_SANDBOX
                    }
                }
            }
            reviewBack(params).then((res) => {
                const {
                    code
                } = res
                if (code === 0) {
                    ElMessage.success(res.message || `操作成功`)
                    // router.back()
                    goBack()
                } else {
                    ElMessage.error(res.msg || '操作失败')
                }
            })
        });
    }
    const chartUrl = ref('');
    const getGeneralData = async (id) => {
        try {
            // 1. 发起接口请求，等待响应（确保 getGeneral 返回的是正确的响应对象）
            const res = await getGeneral(id, userName);
            // 2. 校验响应数据（避免空数据导致 Blob 异常）
            if (!res || !res.data) {
                throw new Error('接口返回数据为空，无法生成图片');
            }
            // 3. 生成 Blob 和 URL（注意：getGeneral 需配置响应类型为 blob，否则可能解析错误）
            const blob = new Blob([res.data], { type: 'image/png' }); // 显式指定图片类型（如 png/jpg，根据你的接口返回调整）
            const imageUrl = URL.createObjectURL(blob);
            // 4. 关键：返回生成的 URL，供页面使用
            return imageUrl;
        } catch (error) {
            // 错误捕获：方便调试，且避免页面卡死
            console.error('获取图片失败：', error.message);
            // 可返回一个默认图片 URL（如占位图），提升用户体验
            return 'https://via.placeholder.com/400x200?text=图片加载失败';
        }
    }
    // 返回响应式数据和方法
    return {
        approval,
        reject,
        getGeneralData
    };
}