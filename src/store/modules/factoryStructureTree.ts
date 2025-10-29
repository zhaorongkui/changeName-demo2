/*
 * @Author: linyongcai
 * @Date: 2025-02-14 17:28:05
 * @FilePath: \sed-saas-frontend\src\store\modules\factoryStructureTree.ts
 * @Description: 页面描述
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFacDescribeText, getOrgAmdFactoryTree } from '@/api/org'
// import { bfsSearch } from '@/utils/tree'

export const useFactoryStructureTreeStore = defineStore('factoryStructureTree', () => {
    /**组织树数据 */
    const orgTreeData = ref([])
    let userCodes = ref<any>([])
    /**当前选中的组织树 */
    const currentOrg = ref()
    /**水厂标识信息*/
    const facDescribeText = ref('')
    const setCurrentOrg = (data) => {
        currentOrg.value = data
    }
    const getUserOrgTree = async () => {
        return await getOrgAmdFactoryTree().then(res => {
            if (res.code === 0) {
                // const userNode = JSON.parse(sessionStorage.getItem('userNode') || '{}')
                // if (userNode?.type === 5) {
                //   currentOrg.value = userNode
                // } else {
                //   // currentOrg.value = res.data.userOrgTree?.[0] ?? undefined
                //   if (res.data.userOrgTree?.[0]) {
                //     filterTreeData(res.data.userOrgTree?.[0])
                //     for (let index = 0; index < 4; index++) {
                //       hideTreeData(res.data.userOrgTree?.[0])
                //     }
                //     bfsSearch(res.data.userOrgTree?.[0], e => filterCodeHandle(e, res.data.orgCodeList), false, 'childrenList')
                //   }
                // }
                // orgTreeData.value = res.data.userOrgTree
                userCodes.value = res.data.orgCodeList.map(item => item.orgCode)
                res.data.userOrgTree.forEach(item => {
                    setHandle(item)
                })
                const cacheFactory = JSON.parse(window.localStorage.getItem('selectFactory') || '{}  ')
                currentOrg.value = Object.keys(cacheFactory).length ? cacheFactory : orgTreeData.value?.[0]
                getFacDescribe()
            }
            return res
        })
    }
    const setHandle = e => {
        e.isSet = false
        if (userCodes.value.indexOf(e.code) !== -1) {
            e.isSet = true
            orgTreeData.value.push(e)
            userCodes.value = userCodes.value.filter(item => item !== e.code)
        }
        if (!e.isSet && userCodes.value.length) {
            if (e?.childrenList?.length) {
                e?.childrenList.forEach(i => {
                    setHandle(i)
                })
            }
        }
    }
    const filterTreeData = e => {
        if (e.type !== 5) {
            if (!e.childrenList) {
                e.hide = true
            } else {
                for (let index = 0; index < e.childrenList.length; index++) {
                    filterTreeData(e.childrenList[index])
                }
            }
        }
    }

    const hideTreeData = e => {
        if (e.type !== 5) {
            if (e.childrenList) {
                debugger
                if (e.childrenList.length) {
                    e.childrenList = e.childrenList.filter(item => !item.hide)
                    if (e.childrenList.length) {
                        for (let index = 0; index < e.childrenList.length; index++) {
                            hideTreeData(e.childrenList[index])
                        }
                    } else {
                        delete e.childrenList
                        e.hide = true
                    }
                } else {
                    delete e.childrenList
                    e.hide = true
                    console.log('1111')
                }
            } else {
                e.hide = true
            }
        }
    }
    // const filterCodeHandle = (e, orgCodeList) => {
    //   orgCodeList.forEach(item => {
    //     if (item.orgCode === e.code) {
    //       item.isHas = true
    //     }
    //   })
    //   return false
    // }

    /**
     * 获取水厂相关特殊配置项及项目标识信息
     */
    const getFacDescribe = () => {
        if (currentOrg.value?.factoryNo) {
            getFacDescribeText(currentOrg.value.factoryNo)
                .then(res => {
                    if (res.code === 0) {
                        facDescribeText.value = res.data.platName ?? ''
                    } else {
                        facDescribeText.value = ''
                    }
                })
                .catch(() => {
                    facDescribeText.value = ''
                })
        } else {
            facDescribeText.value = ''
        }
    }
    return {
        orgTreeData,
        currentOrg,
        facDescribeText,
        setCurrentOrg,
        getUserOrgTree,
        getFacDescribe,
    }
})
