<template>
    <div class="exchangeForum">
        <!-- 所有的论坛 -->
        <div class="flex flex-row justify-between mb-2">
            <el-select
                v-model="pageData.sort"
                placeholder="综合排序"
                clearable
                style="width: 240px;"
                @change="toSearch"
            >
                <el-option label="更新时间倒序" :value="1" />    
                <el-option label="更新时间正序" :value="0" />  
            </el-select>
            <el-button v-if="isEdit" @click="postComment" round>发布评论</el-button>
        </div>
        <div class="overflow-y-auto">
            <el-empty description="暂无数据" v-if="commonDataList.length === 0"/>
            <div class="commonListCss" v-for="(item, index) in commonDataList">
                <p class="title">{{ item.content }}</p>
                <div class="item-info">
                    <img class="inline-flex" :src="item.imgUrl || useImg" alt="">
                    <span class="inline-flex">{{ item.updateUser || '-' }}</span>
                    <Calendar class="inline-flex ml-[22px] mx-[10px] h-4 w-4"/>
                    <span class="inline-flex">{{ item.updateTime ? formatDate(item.updateTime, "YYYY-MM-DD HH:mm:ss") : '-' }}</span>
                    <ChatDotRound class="inline-flex ml-[22px] mx-[10px] h-4 w-4 cursor-pointer" @click="commentHandle(item)"/>
                    <span class="inline-flex">{{ item.count || 0 }}</span>
                </div>
            </div>
        </div>
        <el-pagination
            class="justify-center mt-2"
            v-model:current-page="pageData.currentPage"
            v-model:page-size="pageData.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            :total="pageData.total"
            @size-change="getForumListData"
            @current-change="getForumListData"
        />
        <!-- 一个评论下的具体列表 -->
        <div class="w-full h-full p-4 px-6 overflow-y-auto absolute z-[2] left-0 top-0 bg-white" v-show="showForumDetails">
            <div class="border-b">
                <div>
                    <ArrowLeftBold class="inline-flex h-4 w-4 cursor-pointer" @click="hideHandler"/>
                    <img class="inline-flex h-9 w-9" :src="forumDetailsObj.imgUrl || useImg" alt="">
                    <span class="font-[250] text-sm text-gray-400 pl-4 pr-6">{{ forumDetailsObj.updateUser }}</span>
                    <span class="font-[250] text-sm text-gray-400">{{ forumDetailsObj.updateTime ? formatDate(new Date(forumDetailsObj.updateTime), "YYYY-MM-DD HH:mm:ss") : '-' }}</span>
                </div>
                <p class="font-[400] text-sm text-gray-700 my-2"> {{ forumDetailsObj.content }}</p>
            </div>
            <div class="w-full py-2">
                <p class="font-bold text-sm text-gray-700 my-2">{{ forumDetailsObj.dataList.length }}条评论</p>
                <div class="flex flex-row" v-if="isEdit">
                    <img class="inline-flex h-9 w-9 mr-3" :src="forumDetailsObj.imgUrl || useImg" alt="">
                    <div class="flex-1">
                        <el-input
                            v-model="forumDetailsObj.childContent"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            type="textarea"
                            maxlength="500"
                            :show-word-limit="true"
                            placeholder="请输入评论内容"
                            class="border rounded"
                        />
                        <el-button class="px-3 mt-1" @click="addChildContent">评论</el-button>
                    </div>
                </div>
                <div class="mt-3 flex flex-row" v-for="(item, index) in forumDetailsObj.dataList" :key="index">
                    <img class="inline-flex h-5 w-5 mx-4" :src="item.imgUrl || useImg" alt="">
                    <div>
                        <span class="font-[250] text-sm text-gray-400 pl-0 pr-6">{{ item.updateUser || '-' }}</span>
                        <span class="font-[250] text-sm text-gray-400">回复</span>
                        <span class="font-[250] text-sm text-gray-400 pl-4 pr-6">{{ item.updateUser || '-' }}</span>
                        <span class="font-[250] text-sm text-gray-400">{{ item.updateTime ? formatDate(new Date(item.updateTime), "YYYY-MM-DD HH:mm:ss") : '-' }}</span>
                        <p class="font-[400] text-sm text-gray-700 my-2"> {{ item.content }}</p>
                        <ChatDotRound class="inline-flex h-4 w-4 cursor-pointer" v-if="isEdit" @click="dialoaAddCommont(item)"/>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :modelValue="dialogVisible"
            title="发布评论"
            destroy-on-close
            top="1vh"
            width="600"
            :close-on-click-modal="false"
            @closed="handleClose"
            >
            <div class="bg-white p-3 px-7">
                <el-input
                    v-model="dialogAddObj.postCommentStr"
                    :autosize="{ minRows: 10, maxRows: 10 }"
                    type="textarea"
                    maxlength="500"
                    :show-word-limit="true"
                    placeholder="请输入评论内容"
                    class="border"
                />
            </div>
            <template #footer>
                <div class="dialog-footer text-center">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import TokenInfo from '@/hooks/tokenStatus'
import { ChatDotRound, Calendar, ArrowLeftBold } from '@element-plus/icons-vue'
import useImg from '@/assets/images/top_view/avatar.png'
import {forumPage, forumSave, forumList} from '@/api/forum'
import TypeInfo from '@/hooks/dataType'
import {formatDate} from '@/utils/date'
import commonDetailsFn from '@/hooks/modelAndDatas'

const { token } = TokenInfo()
const isEdit = computed(() => {
    return Boolean(token.value);
})

const { dataType } = TypeInfo()
const {detailsData} = commonDetailsFn()
const currentDetailsData = computed(() => {
    return detailsData.value
})
const pageData = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  sort: 1,
})

const dialogVisible = ref(false);
// 发布内容的变量
const dialogAddObj = ref({
    postCommentStr: '',
    targetUpdateUser: ''
})
// 没有父节点的发表评论
const postComment = () => {
    dialogAddObj.value.postCommentStr = ''
    dialogVisible.value = true
}
const handleClose = () => {
    dialogAddObj.value.postCommentStr = ''
    dialogVisible.value = false
}

const commonDataList = ref([])
// 获取没有父元素的所有评论分页列表
const getForumListData = () => {
    commonDataList.value = []
    forumPage({
        currentPage: pageData.value.currentPage,
        pageSize: pageData.value.pageSize,
        type: dataType.value.key,
        assetId: currentDetailsData.value.id,
        sort: pageData.value.sort,
    }).then((res) => {
        const {data: {data}} = res;
        commonDataList.value = data?.body || [];
        pageData.value.total = data?.total || 0;
    })
}
getForumListData()
// 切换排序方式
const toSearch = () => {
    pageData.value.currentPage = 1
    pageData.value.pageSize = 10
    getForumListData()
}
// 子集的弹框加评论
const handleSubmit = () => {
    let content = ''
    if (forumDetailsObj.value.id) {
        content = JSON.stringify({
            updateUser: dialogAddObj.value.targetUpdateUser,
            content: dialogAddObj.value.postCommentStr
        })
    } else {
        content = dialogAddObj.value.postCommentStr
    }
    forumSave({
        parentId: forumDetailsObj.value.id || null,
        content: content,
        assetId: currentDetailsData.value.id,
        type: dataType.value.key,
    }).then((res) => {
        const {data: {code}} = res;
        if (code === 0) {
            ElMessage.success('发布讨论成功')
            if (forumDetailsObj.value.id) {
                getForumDetailList()
            } else {
                getForumListData()
            }
            handleClose()
        }
    })
}

const forumDetailsObj = ref({
    id: '',
    content: '',
    imgUrl: '',
    updateTime: '',
    updateUser: '',
    childContent: '',
    dataList: []
})
const showForumDetails = ref(false)
// 获取一个评论下的的评论列表
const getForumDetailList = () => {
    forumDetailsObj.value.dataList = []
    forumList({
        id: forumDetailsObj.value.id,
        type: dataType.value.key,
        assetId: currentDetailsData.value.id,
        sort: pageData.value.sort,
    }).then((res) => {
        const {data: {data}} = res;
        forumDetailsObj.value.dataList = data.map(item => {
            let newObj = {
                content: '',
                targetUpdateUser: '',
            }
            if (item.content.includes('updateUser') && item.content.includes('content')) {
                const contentObj = JSON.parse(item.content)
                newObj.content = contentObj.content
                newObj.targetUpdateUser = contentObj.updateUser
            } else {
                newObj.content = item.content
            }
            return {
                ...item,
                ...newObj
            }
        }) || []
    })
}
const commentHandle = (obj) => {
    showForumDetails.value = true
    forumDetailsObj.value.id = obj.id
    forumDetailsObj.value.content = obj.content
    forumDetailsObj.value.imgUrl = obj.imgUrl
    forumDetailsObj.value.updateTime = obj.updateTime
    forumDetailsObj.value.updateUser = obj.updateUser
    getForumDetailList()
}
// 回复一级的评论
const addChildContent = () => {
    let content = JSON.stringify({
        imgUrl: '',
        updateUser: '',
        content: forumDetailsObj.value.childContent
    })
    forumSave({
        parentId: forumDetailsObj.value.id,
        content: content,
        assetId: currentDetailsData.value.id,
        type: dataType.value.key,
    }).then((res) => {
        const {data: {code}} = res;
        if (code === 0) {
            ElMessage.success('发布讨论成功')
            forumDetailsObj.value.childContent = ''
            getForumDetailList()
        }
    })
}
// 关闭评论列表的页面
const hideHandler = () => {
    showForumDetails.value = false
    forumDetailsObj.value.id = ''
    forumDetailsObj.value.content = ''
    forumDetailsObj.value.imgUrl = ''
    forumDetailsObj.value.updateTime = ''
    forumDetailsObj.value.updateUser = ''
    forumDetailsObj.value.dataList = []
    getForumListData()
}
const dialoaAddCommont = (obj) => {
    dialogAddObj.value.postCommentStr = ''
    dialogAddObj.value.targetUpdateUser = obj.updateUser
    dialogVisible.value = true
}

</script>
<style lang="postcss" scoped>
.exchangeForum {
    @apply rounded-md bg-white overflow-y-auto px-4 py-2 flex flex-col relative;
    .commonListCss {
        @apply p-5;
        &:hover{
            background-color: rgba(0, 0, 0, .05);
        }
        border-bottom: 1px solid #ddd;
        .title {
            @apply mb-[20px] text-sm leading-[21px];
        }
        .item-info {
            @apply text-sm leading-[20px] h-[20px] w-full flex flex-row items-center;
            vertical-align: top;
            img {
                @apply w-4 h-4 rounded-[50%] mr-[5px];
            }
           
        }
    }

}
</style>
