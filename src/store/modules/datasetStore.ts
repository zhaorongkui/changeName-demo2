// src/stores/datasetStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义数据集接口
export interface Dataset {
    id: number
    name: string
    status: number // 1: 公开, 0: 未公开
    createTime: string
}

export const useDatasetStore = defineStore('dataset', () => {
    // 🔹 State
    const datasetList = ref([])      //  新增模型关联的数据集
    const currentCoreObjectID = ref<number|null>(null) //数据集详情-业务实体id


    // 数据集详情-业务实体
    const clickCoreObject = (id: number) => {
        currentCoreObjectID.value = id
    }
    // 新增模型-关联数据集
    const getDatasetList = (data) => {
        console.log(data,'dddd')
        datasetList.value = data
    }

    // 🔹 暴露给组件使用的内容
    return {
        datasetList,
        currentCoreObjectID,
        clickCoreObject,
        getDatasetList

    }
})