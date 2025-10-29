// 模型管理
import http from './axios'
import { PageResult } from '~/types/common'
import { ModelInfo,ModelListParams } from '~/types/modelManagement'
import projectEnv from '@/config/runtimeEnv.js'
let baseurlType = projectEnv.VITE_APP_BASEURL
/**
 *  获取模型广场列表
 * @param params 查询参数
 * @returns
 */
export const getModelList = (params: ModelListParams ) => {
  return http.request({
    url: baseurlType+'/apiLabModel/page',
    method: 'post',
      data:params,
  })
}

/**
 * 获取模型详情
 * @param id 模型ID
 * @returns
 */
export const getModelDetail = (id: string | number) => {
    console.log(id,'id==')
  return http.request({
    url: baseurlType+`/apiLabModel/detail?id=${id}`,
    method: 'get',
  })
}
/**
 *  获取模型评估列表
 * @param params 查询参数
 * @returns
 */
export const getmodelApprovallList = (params: {currentPage: number,pageSize:number,modelName: string} ) => {
    return http.request({
        url: baseurlType+'/modelApproval/modelTrialList',
        method: 'post',
        data:params,
    })
}

/**
 *  获取模型试用列表
 * @param params 查询参数
 * @returns
 */
export const getModelOntrialList = (params: {currentPage: number,pageSize:number,sort:number,searchWord: string} ) => {
    return http.request({
        url: baseurlType+'/modelTrial/page',
        method: 'post',
        data:params,
    })
}
/**
 *  获取模型试用列表-查看
 * @param id 查询参数
 * @returns
 */
export const getModelTrialDetail = (id: number | string ) => {
    return http.request({
        url: baseurlType+`/modelTrial/detail?id=${id}`,
        method: 'get',
    })
}
/**
 *  获取模型试用列表-查看-试用记录列表
 * @param params 查询参数
 * @returns
 */
export const getModelTrialRecord = (params: {currentPage: number,pageSize:number,sort:number,modelId: string | number} ) => {
    return http.request({
        url: baseurlType+'/modelTrial/pageRecord',
        method: 'post',
        data:params,
    })
}
/**
 *  获取模型试用列表-试用
 * @param id 查询参数
 * @returns
 */
export const getModelTrialDetailInfo = (id: number | string ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/detailForTrial?id=${id}`,
        method: 'get',
    })
}
/**
 *  模型-试用 根据字段反查数据集和业务实体
 * @param params 查询参数
 * @returns
 */
export const getPegging = (params) => {
    return http.request({
        url: baseurlType+'/datasetSquare/pegging',
        method: 'post',
        data:params,
    })
}
/**
 *  获取模型试用列表-试用-运行
 * @param params 查询参数
 * @returns
 */
export const getModelRunData = (params: any ) => {
    return http.request({
        url: baseurlType+'/modelTrial/executeMachineTrial',
        method: 'post',
        data:params,
    })
}


/**
 *  获取机器学习模型列表
 * @param params 查询参数
 * @returns
 */
export const getModelMachineList = (params: {currentPage: number,pageSize:number,sort?:number,searchWord: string} ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/pageAppend',
        method: 'post',
        data:params,
    })
}
/**
 *  删除机器学习模型列表
 * @param id 查询参数
 * @returns
 */
export const getModelMachineDel = (id: number | string ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/delete?id=${id}`,
        method: 'get',
    })
}
/**
 *  发布机器学习模型列表
 * @param params 查询参数
 * @returns
 */
export const getModelMachineRelease = (params:{id:number| string,instructions:string}) => {
    return http.request({
        url: baseurlType+`/apiLabModel/release`,
        method: 'post',
        data: params
    })
}

/**
 *  获取数据规则模型列表
 * @param params 查询参数
 * @returns
 */
export const getModelDataRuleList = (params: {currentPage: number,pageSize:number,sort?:number,searchWord: string} ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/page',
        method: 'post',
        data:params,
    })
}

/**
 *  模型-版本管理列表-取消发布
 * @param id 查询参数
 * @returns
 */
export const getVersionControUnpublish = (id: string | number ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/unReleaseVersion?id=${id}`,
        method: 'get',
    })
}
/**
 *  模型-新建模型-添加标签
 * @param params 查询参数
 * @returns
 */
export const getModelAddTag = (params:{tagTypeId:number | string} ) => {
    return http.request({
        url: baseurlType+`/tag/list`,
        method: 'post',
        data:params
    })
}
/**
 *  新增模型
 * @param params 查询参数
 * @returns
 */
export const getSaveModel = (params ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/saveModel',
        method: 'post',
        data:params,
    })
}
/**
 *  新增模型的参数配置-选择参数名
 * @param params 查询参数
 * @returns
 */
export const getFieldListl = (params:{idList:string[],pageNum: number,pageSize:number,} ) => {
    return http.request({
        url: baseurlType+'/datasetSquare/fieldList',
        method: 'post',
        data:params,
    })
}
/**
 *  编辑模型-确定
 * @param params 查询参数
 * @returns
 */
export const getUpdateModel = (params) => {
    return http.request({
        url: baseurlType+'/apiLabModel/updateModel',
        method: 'post',
        data:params,
    })
}
/**
 *  模型-版本管理列表
 * @param params 查询参数
 * @returns
 */
export const getPageVersion = (params) => {
    return http.request({
        url: baseurlType+'/apiLabModel/pageVersion',
        method: 'post',
        data:params,
    })
}

/**
 *  数据规则模型-编辑器-右侧变量
 * @param params 查询参数
 * @returns
 */
export const getObjectField = (params ) => {
    return http.request({
        url: baseurlType+`/dataDirectory/objectField`,
        method: 'post',
        data:params
    })
}

/**
 *  模型评价-新增
 * @param params 查询参数
 * @returns
 */
export const saveModelEvaluate = (params ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/saveModelEvaluate`,
        method: 'post',
        data:params
    })
}
/**
 *  机器模型试用-右侧参数设置列表
 * @param id 查询参数
 * @returns
 */
export const getDetailForTrial = (id: string | number ) => {
    return http.request({
        url: baseurlType+`/datasetSquare/detailForTrial?id=${id}`,
        method: 'get',
    })
}

/**
 *  模型部署列表
 * @param params 查询参数
 * @returns
 */
export const getDeployList= (params ) => {
    return http.request({
        url: baseurlType+`/modelDeploy/page`,
        method: 'post',
        data:params
    })
}
/**
 *  模型部署-新增-选择模型
 * @param params 查询参数
 * @returns
 */
export const getSaveApply= (params ) => {
    return http.request({
        url: baseurlType+`/modelDeploy/saveApply`,
        method: 'post',
        data:params
    })
}
/**
 *  模型训练-新增
 * @param params 查询参数
 * @returns
 */
export const getSaveTrain= (params ) => {
    return http.request({
        url: baseurlType+`/modelTrain/saveTrain`,
        method: 'post',
        data:params
    })
}
/**
 *  模型训练-列表
 * @param params 查询参数
 * @returns
 */
export const getTrainPage = (params ) => {
    return http.request({
        url: baseurlType+`/modelTrain/page`,
        method: 'post',
        data:params
    })
}

/**
 *  获取数据规则模型-数据规则模型编辑器 - 结果试算区域列表
 * @param params 查询参数
 * @returns
 */
export const getRuleModelVarData = (params ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/rule-model/var/data',
        method: 'post',
        data:params,
    })
}
/**
 *  获取数据规则模型-数据规则模型编辑器 - 结果试算区域-试算
 * @param params 查询参数
 * @returns
 */
export const getRuleModelCalcTrial= (params ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/rule-model/calc/trial',
        method: 'post',
        data:params,
    })
}

/**
 *  智能体模型-模型编排
 *
 * @returns
 */
export const getAllModelArranges = ( ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/getAllModelArranges`,
        method: 'get',
    })
}

/**
 *  模型详情-模型评价-当前人评价详情
 * @param id 查询参数
 * @returns
 */
export const getEvaluateDetail = (id: string | number ) => {
    return http.request({
        url: baseurlType+`/apiLabModel/getEvaluateDetail?modelId=${id}`,
        method: 'get',
    })
}
/**
 *  机器学习模型-判断是否有训练中的任务
 * @param id 查询参数
 * @returns
 */
export const getJudgeModelTrain = (id: string | number ) => {
    return http.request({
        url: baseurlType+`/modelTrain/judgeModelTrain?modelId=${id}`,
        method: 'get',
    })
}

/**
 *  数据规则模型-数据规则模型编辑器 - 根据公式提示词生成公式
 * @param params 查询参数
 * @returns
 */
export const getRuleScript= (params ) => {
    return http.request({
        url: baseurlType+'/apiLabModel/text-to-script',
        method: 'post',
        data:params,
    })
}