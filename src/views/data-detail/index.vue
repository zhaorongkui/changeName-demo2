<template>
    <div class="data-detail">
        <div class="data-header">
            <div class="data-header-content">
                <el-breadcrumb separator="/" class="breadCrumb">
                    <el-breadcrumb-item :to="{ path: getBack }">{{ dataType.label }}</el-breadcrumb-item>
                    <el-breadcrumb-item><b>详情</b></el-breadcrumb-item>
                </el-breadcrumb>
                <h3 class="data-header-title">{{ currentDetailsData.name }}</h3>
                <div class="item-info">
                    <img class="inline-flex" :src="currentDetailsData.imgUrl || useImg" alt="">
                    <span class="inline-flex">{{ currentDetailsData.updateUser || '-' }}</span>
                    <Calendar class="inline-flex ml-[22px] mx-[10px] h-4 w-4"/>
                    <span class="inline-flex">{{ formatDate(new Date(currentDetailsData.updateTime), "YYYY-MM-DD")  }}</span>
                </div>
                <div>
                    <TagDetails v-for="(newItem, index) in currentDetailsData.tagType.tags" :key="index" background="linear-gradient(rgba(20, 118, 255, 0.6) 2%, rgb(229, 242, 233) 100%)" color="rgba(20, 118, 255, 0.6)" :name="newItem.tagName" :img="newItem.imgUrl"/>
                </div>
            </div>
        </div>
        <el-tabs v-if="showTabs" v-model="activeName" class="data-body" :class="{'noIntroduce': activeName !== 'modelIntroduce'}" @tab-change="changeTabs">
            <el-tab-pane :label="`${dataType.label}介绍`" name="modelIntroduce" :lazy="true"><DetailsIntroduce @updataData="updataData" :isEdit="getEditStatus" /></el-tab-pane>
            <el-tab-pane v-if="!(getEditStatus === false && dataType.key === 'model')" :label="`${dataType.label}文件`" name="modelFile" :lazy="true">
                <DetailsFile :isEdit="getEditStatus"/>
            </el-tab-pane>
            <el-tab-pane label="交流论坛" name="exchangeForum" :lazy="true"><ExchangeForum/></el-tab-pane>
            <el-tab-pane v-if="getEditStatus" label="设置" name="setUp" :lazy="true"><DetailsSet @updataData="updataData"/></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import TypeInfo from '@/hooks/dataType'
import {formatDate} from '@/utils/date'
import { useRoute } from "vue-router";
import TagDetails from '@/components/TagData/index.vue'
import DetailsIntroduce from './components/details-Introduce.vue'
import DetailsFile from './components/details-file.vue'
import ExchangeForum from './components/exchange-forum.vue'
import DetailsSet from './components/details-set.vue'
import { Calendar } from '@element-plus/icons-vue'
import commonDetailsFn from '@/hooks/modelAndDatas'
import useImg from '@/assets/images/top_view/avatar.png'
// 模型接口
// import {modelDetail} from '@/api/model'
// 数据集接口
// import {datasDetail} from '@/api/dataSet'

const route = useRoute()
const activeName = ref('')
const { dataType } = TypeInfo()
const {detailsData, setDetailsDataFn} = commonDetailsFn()
const currentType = computed(() => {
    return dataType.value
})
const currentDetailsData = computed(() => {
    return detailsData.value
})
const getBack = computed(() => {
    return getEditStatus.value ? '/assets-list' : '/data-list'
})
const getEditStatus = computed(() => {
    return route.path === '/edit-detail'
})

const showTabs = ref(true)
onMounted(() => {
    if (localStorage.getItem('activeName')) {
        activeName.value = localStorage.getItem('activeName')
    } else {
        activeName.value = 'modelIntroduce'
    }
    getDetails()
})
onBeforeUnmount(() => {
    localStorage.removeItem('activeName')
})
const changeTabs = () => {
    localStorage.setItem('activeName', activeName.value)
}
const getDetails = (id?) => {
    showTabs.value = false
    if (currentType.value.label === '模型') {
        // 获取模型的列表
        // modelDetail({
        //     id: id || route.query.dataId as string,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     showTabs.value = true
        //     setDetailsDataFn(data)
        // })
    } else if (currentType.value.label === '数据集') {
        // 获取数据集的列表
        // datasDetail({
        //     id: id || route.query.dataId as string,
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     showTabs.value = true
        //     setDetailsDataFn(data)
        // })
    }
}
const updataData = (id) => {
    getDetails(id)
}
</script>
<style lang="postcss">
    .data-detail {
        @apply flex flex-col;
        background: #F5F5F5;
        .data-header {
            @apply bg-white w-full h-[160px];
            .data-header-content {
                @apply w-full min-w-[1280px] max-w-[1600px] mx-auto h-full py-3;
                .breadCrumb {
                    @apply mb-[11px];
                    span {
                        @apply text-sm leading-[21px] font-normal;
                    }
                    b {
                        color: #191919;
                    }
                }
                .data-header-title {
                    @apply text-2xl leading-[36px] font-bold;
                    color: #191919;
                }
                .item-info {
                    @apply text-sm leading-[20px] h-[20px] w-full flex flex-row items-center mb-4;
                    img {
                        @apply w-4 h-4 rounded-[50%] mr-[5px];
                    }
                }
            }
        }
        .data-body {
            @apply w-full min-w-[1280px] max-w-[1600px] mx-auto pb-[16px];
            &.noIntroduce {
                @apply flex-1 overflow-y-auto;
                .el-tabs__content {
                    @apply flex flex-col;
                    .el-tab-pane {
                        @apply h-full;
                        > div {
                            @apply h-full;
                        }
                    }
                }
            }
            .el-tabs__header {
                @apply mt-[10px] mb-4;
                .el-tabs__nav-wrap:after {
                    height: 0px;
                    @apply !h-0;
                }
            }
            .el-tabs__item {
                @apply h-[40px] leading-[40px];
                &:hover, &.is-active {
                    color: #333333;
                    @apply font-bold;
                }
            }
            .el-tabs__active-bar {
                background-color: #191919;
            }

        }
    }
</style>