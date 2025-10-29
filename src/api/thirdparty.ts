import http from './axios'
let baseUrl = ''

/**
 * 查询代办
 * @param 
 * @returns {}
 */

export const getTaskTodo = (userName: string | number, page: string | number, size: string | number) => {
    return http.request({
        url: `/workflow/api/v1/workflow/task/todo?userName=${userName}&page=${page}&size=${size}`,
        method: 'get'
    })
}
/**
 * 查询流程图
 * @param 
 * @returns {}
 */
export const getGeneral = (id, name) => {
    return http.request({
        url: `/workflow/api/v1/xflowable/process/instance/image?userName=${name}&processInstanceId=${id}`,
        method: 'get',
        responseType: 'blob',

    })
}
/**
 * 查询流程进度
 * @param 
 * @returns {}
 */
export const getHistoryProgress = (id) => {
    return http.request({
        url: `/workflow/api/v1/xflowable/process/instance/history?processInstanceId=${id}`,
        method: 'get'
    })
}
/**
 *  审批驳回
 * @param params 
 * taskId！ 当前任务节点id
 * targetActivityId 需要回退的节点id(只有当回退策略是用户指定时必填,调用#10接口返回参数nodeId)
 * targetActivityName 需要回退的节点名称
 * applyUserName！ 当前用户名称
 * @returns
 */
export const reviewBack = (params) => {
    return http.request({
        url: `/workflow/api/v1/xflowable/task/${params.taskId}/back`,
        method: 'post',
        data: {
            applyUserName: params.applyUserName,
            formValuesJson: params.formValuesJson,
            values: params.values,
            message: params.message
        }
    })
}
/**
 *  审批通过
 * @param params 
 * taskId！ 当前任务节点id
 * formValuesJson 表单元素
 * applyUserName！ 当前用户名称
 * @returns
 */
export const reviewApproval = (params: {
    taskId: number | string;
    applyUserName: string;
    formValuesJson?: string;
    message: string;
}) => {
    return http.request({
        url: `/workflow/api/v1/xflowable/task/${params.taskId}/approval`,
        method: 'post',
        data: {
            applyUserName: params.applyUserName,
            formValuesJson: params.formValuesJson,
            message: params.message
        }
    })
}