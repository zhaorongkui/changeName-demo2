/*
 * @Author: linyongcai
 * @Date: 2025-01-20 10:39:12
 * @FilePath: \sed-saas-frontend\src\store\modules\layout.ts
 * @Description: 页面描述
 */
/*
 * @Description:
 */
import { defineStore } from 'pinia'
import { reactive, toRefs } from "vue"
import Cookies from 'js-cookie';
interface WorkBenchState {
    isWorkbench: boolean
    systemNavName: string
    userTodoListNum: number
    userMessageNum:number
    sidebar: {
        withoutAnimation: boolean
    },
    treeIsExpand:boolean
}

const layoutStore = defineStore('layout', () => {
    const state = reactive<WorkBenchState>({
        isWorkbench: true,
        systemNavName: '导航',
        userTodoListNum: 0,
        userMessageNum:0,
        sidebar: {
            withoutAnimation: false
        },
        treeIsExpand:true
    });

    const selectFactory = reactive({
        selectFactoryName: '',
        selectFactoryCode: ''
    })

    const setFactory = (params: { code: string; name: string; }) => {
        const { name, code } = params
        selectFactory.selectFactoryName = name
        selectFactory.selectFactoryCode = code
    }


    const setSystemNavName = (name: string): void => {
        state.systemNavName = name
    }
    const CLOSE_SIDEBAR= (withoutAnimation:boolean): void =>{
        Cookies.set('sidebarStatus', "0");
        state.sidebar.withoutAnimation = withoutAnimation;
    }
    const setTreeIsExpand = (isExpand:boolean): void =>{
        state.treeIsExpand = isExpand
    }

    return {
        ...toRefs(state),
        ...toRefs(selectFactory),
        setSystemNavName,
        setTreeIsExpand,
        CLOSE_SIDEBAR,
        setFactory
    }
}, {
    persist: {
        paths: ['routerGroup']
    }
})

export default layoutStore
