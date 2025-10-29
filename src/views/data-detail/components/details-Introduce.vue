<template>
    <div class="modelIntroduce">
        <div class="flex-1 flex flex-col">
            <h2>基础设置</h2>
            <el-button v-show="!idEditStatus && isEdit" class="absolute top-[20px] right-[25px]" link :icon="Edit" @click="editIntroduceInfo">编辑</el-button>
            <div v-show="!idEditStatus" class="justify-stretch">
                <p class="inline-block mr-8 text-sm font-[250] mb-4" v-for="(item, index) in currentFormList" :key="index">
                    <span class="mr-1">{{ item.label }}:</span>
                    <span v-if="item.keyCode !== 'distributedSupport' && item.keyCode !== 'id'">{{ currentDetailsData[item.keyCode] || '-' }}</span>
                    <span v-if="item.keyCode === 'id'">{{ String(currentDetailsData[item.keyCode]).padStart(5, '0') || '-' }}</span>
                    <span v-if="item.keyCode === 'distributedSupport'">{{ currentDetailsData[item.keyCode] === 0 ? '否' : (currentDetailsData[item.keyCode] === 1 ? '是' : '-') }}</span>
                </p>
            </div>
            <el-form v-show="idEditStatus" :inline="true" class="demo-form-inline w-full" :model="editBaseInfo" label-position="top">
                <el-form-item v-for="(item, index) in editFormList" :label="item.label"  class="w-1/3" :key="index">
                    <el-input v-if="item.dataType === 'input'" v-model="editBaseInfo[item.key]"></el-input>
                    <el-select
                        v-if="item.dataType === 'select' && item.key !== 'tagTypeId' && item.key !== 'tagIds'"
                        v-model="editBaseInfo[item.key]"
                        :placeholder="`请选择${item.label}`"
                        clearable
                        :multiple="item.key === 'tagIds'"
                        @change="selectChange(item)"
                    >
                        <el-option v-for="(newItem, index) in item.selectList" :key="index" :label="newItem.dictName"  :value="newItem.dictCode"/>
                    </el-select>
                    <el-select
                        v-if="item.dataType === 'select' && (item.key === 'tagTypeId' || item.key === 'tagIds')"
                        v-model="editBaseInfo[item.key]"
                        :placeholder="`请选择${item.label}`"
                        clearable
                        :multiple="item.key === 'tagIds'"
                        @change="selectChange(item)"
                    >
                        <el-option v-for="(newItem, index) in item.selectList" :key="index" :label="newItem.dictName"  :value="newItem.dictCode"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <h2>{{ dataType.label }}详情</h2>
            <div class="flex-1 w-full" :class="{'isReadonly': !idEditStatus}" ref="vditorContent" v-loading="vditorLoading" element-loading-text="数据详情加载中...">
                <div id="vditorRef"></div>
            </div>
            <div class="flex justify-center mt-2" v-show="idEditStatus">
                <el-button round type="primary" @click="saveMarkdown">保存</el-button>
                <el-button round type="info" @click="cancelEditor">取消</el-button>
            </div>
        </div>
        <div v-if="!isEdit" class="w-[433px] ml-3">
            <h2 class="mb-6">关联{{ dataType.label === '模型' ? "数据集" : "模型" }}（{{assetsList?.length || 0}}）</h2>
            <div class="p-0">
                <div class="info-box cursor-pointer" v-for="(item, index) in assetsList" :key="index" @click="clickItem(item)">
                    <h3>{{ item.name }}</h3>
                    <div class="item-info">
                        <img class="inline-flex" :src="item.imgUrl || useImg" alt="">
                        <span class="inline-flex">{{ item.updateUser || '-' }}</span>
                        <Calendar class="inline-flex ml-[22px] mx-[10px] h-4 w-4"/>
                        <span class="inline-flex">{{ item.updateTime ? formatDate(item.updateTime, 'YYYY-MM-DD') : '-' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import TypeInfo from '@/hooks/dataType'
import {formatDate} from '@/utils/date'
import useImg from '@/assets/images/top_view/avatar.png'
import Vditor from 'vditor'
import 'vditor/dist/index.css';
import '@/assets/css/client.css'
import axios from 'axios'
import projectEnv from "@/config/runtimeEnv.js";
import { Edit, Calendar } from '@element-plus/icons-vue'
import commonDetailsFn from '@/hooks/modelAndDatas'
import { useDebounce } from "@/utils/debounce"
// 模型接口
import { modelBindAsset, modelUpdate } from '@/api/model'

import { ElMessage } from "element-plus";

const emit = defineEmits(["updataData"]);
const fileUrl = projectEnv.VITE_APP_FILE_META
const props = defineProps({
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
});
// 模型的编辑对象
const {detailsData} = commonDetailsFn()
const currentDetailsData = computed(() => {
    return detailsData.value
})
const { dataType, setTypeFn } = TypeInfo()
interface selectItem {
    dictName: string,
    dictCode: string | number,
}
interface formInfoItem {
    key: string,
    keyCode?: string,
    label: string,
    showType: string,
    dataType?: string,
    selectList?: Array<selectItem>
}
// 模型的基础信息
const formInfoListAll = ref<Array<formInfoItem>>([
    { key: 'id', keyCode: 'id', label: `${dataType.value.label}id`, showType:'model,datas'},
    { key: 'name', keyCode: 'name', label: '中文名称', showType:'model,datas', dataType: 'input'},
    { key: 'license', keyCode: 'license', label: '许可证 License', showType: 'model,datas', dataType: 'input'},
    { key: 'langueCode', keyCode: 'langueName', label: '语言 Language', showType: 'model,datas', dataType: 'select', selectList: []},
    { key: 'frameCode', keyCode: 'frameName', label: '框架 Framework', showType: 'model', dataType: 'select', selectList: []},
    { key: 'tagTypeId', label: '选择标签类型', showType: 'model,datas', dataType: 'select', selectList: []},
    { key: 'tagIds', label: '选择标签', showType: 'model,datas', dataType: 'select', selectList: []},
    { key: 'hardwareCode', keyCode: 'hardwareName', label: '硬件资源 Hardware', showType: 'model', dataType: 'select', selectList: []},
    { key: 'serverConfigCode', keyCode: 'serverConfigName', label: '最低可运行规格  Minimum_hardware_requirement', showType: 'model', dataType: 'select', selectList: []},
    { key: 'distributedSupport', keyCode: 'distributedSupport', label: '是否支持分布式训练  Distributed_support', showType: 'model', dataType: 'select', selectList: [
        {dictName: '否', dictCode: 0},
        {dictName: '是', dictCode: 1},
    ]},
    { key: 'platformCode', keyCode: 'platformName', label: '运行平台Operating_platform', showType: 'datas', dataType: 'select', selectList: []},
    { key: 'integral', label: '积分', showType: 'model,datas' },
])
const currentFormList = computed(() => {
    return formInfoListAll.value.filter(item => item.showType.includes(dataType.value.key) && item.keyCode)
})
const editFormList = computed(() => {
    return formInfoListAll.value.filter(item => item.showType.includes(dataType.value.key) && item.dataType)
})
const editBaseInfo = ref({
    updateUser: '',
    updateTime: '',
    imgUrl: '',
    id: '',
    name: '',
    license: '',
    langueName: '',
    langueCode: '',
    frameName: '',
    frameCode: '',
    tagType: {
        id: 0,
        tags: []
    },
    platformName: '',
    platformCode: '',
    hardwareName: '',
    hardwareCode: '',
    serverConfigName: '',
    serverConfigCode: '',
    distributedSupport: 0,
    detail: '',
    integral: '-',
    tagTypeId: null,
    tagIds: [],
})

// 关联资产
const assetsList = ref([])
// 获取绑定的资产列表信息
const getBindAsset = useDebounce(() => {
    assetsList.value = []
    if (dataType.value.label === '模型') {
        // modelBindAsset({
        //     id: currentDetailsData.value.id
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     assetsList.value = data || []
        // })
    } else if (dataType.value.label === '数据集') {
        // datasBindAsset({
        //     id: currentDetailsData.value.id
        // }).then((res) => {
        //     const {data: {data}} = res;
        //     assetsList.value = data || []
        // })
    }
}, 500)
const selectChange = (data) => {
    if (data?.key === 'tagTypeId') {
        formInfoListAll.value[6].selectList = []
        editBaseInfo.value['tagIds'] = []
        const newArr = tagListData.value.filter(item => item.tagTypeId === editBaseInfo.value[data.key])
        formInfoListAll.value[6].selectList = newArr.map(item => {
            return {
                dictName: item.tagName,
                dictCode: item.id,
            }
        })
    }
}
// 所有的标签列表
const tagListData = ref([])
const getAllTypeList = () => {
    // dictGetAllByCode({
    //     type: 'langue'
    // }).then((res) => {
    //     const {data: {data}} = res;
    //     formInfoListAll.value[3].selectList = data || []
    // })
    // dictGetAllByCode({
    //     type: 'frame'
    // }).then((res) => {
    //     const {data: {data}} = res;
    //     formInfoListAll.value[4].selectList = data || []
    // })
    // dictGetAllByCode({
    //     type: 'hardware'
    // }).then((res) => {
    //     const {data: {data}} = res;
    //     formInfoListAll.value[7].selectList = data || []
    // })
    // dictGetAllByCode({
    //     type: 'serverConfig'
    // }).then((res) => {
    //     const {data: {data}} = res;
    //     formInfoListAll.value[8].selectList = data || []
    // })
    // dictGetAllByCode({
    //     type: 'platform'
    // }).then((res) => {
    //     const {data: {data}} = res;
    //     formInfoListAll.value[10].selectList = data || []
    // })
    // tagList().then((res) => {
    //     const newArr = []
    //     const {data: {data}} = res;
    //     tagListData.value = data || []
    //     data?.forEach(item => {
    //         const findIndex = newArr.findIndex(newItem => newItem.dictCode === item.tagTypeId)
    //         if (findIndex === -1) {
    //             newArr.push({
    //                 dictName: item.tagTypeName,
    //                 dictCode: item.tagTypeId,
    //             })
    //         }
    //     });
    //     formInfoListAll.value[5].selectList = newArr || []
    //     if (currentDetailsData.value.tagType.id) {
    //         formInfoListAll.value[6].selectList = tagListData.value.filter(item => item.tagTypeId === currentDetailsData.value.tagType.id).map(item => {
    //             return {
    //                 dictName: item.tagName,
    //                 dictCode: item.id,
    //             }
    //         })
    //     }
    // })
}

const idEditStatus = ref(false);
const vditor = ref<Vditor | null>(null);
const vditorContent = ref(null)
const vditorLoading = ref(false)
// 设置vditor的预览模式
const setVditorPreviewStatus = () => {
    const buttons:NodeListOf<Element> = document.querySelectorAll('.vditor-toolbar button')
    buttons.forEach((button: any) => {
        if (button.getAttribute('data-type') === 'preview') {
            button.click();
            setTimeout(() => {
                vditorLoading.value = false
            }, 500);
        }
    })
}
// 文件整个下载
const vditorStr = ref('')
const downloadCompleteFiles = (fileId) => {
    vditorLoading.value = true
    vditor.value.setValue('')
    axios.get(`${fileUrl}/gfss/api/v1/file/view?fileId=${fileId}`, {
        headers: {
            'Authorization': localStorage.getItem('token') || '',
            'X-Tenant-Id': !localStorage.getItem('token') ? 'bewg' : ''
        },
        responseType: 'blob',
    }).then(res => {
        let reader = new FileReader()
        reader.readAsText(res.data, '');
        reader.onload = () => {
            vditorStr.value = reader.result as string
            vditor.value.setValue(reader.result as string || '')
            setVditorPreviewStatus()
        }
    })
}
const setVditoe = () => {
    vditorLoading.value = true
    vditor.value = new Vditor('vditorRef', {
        width: props.isEdit ? '1560px': '',
        toolbarConfig: {
            pin: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            if (currentDetailsData.value.detail) {
                downloadCompleteFiles(currentDetailsData.value.detail)
            } else {
                vditor.value.setValue('')
                setVditorPreviewStatus()
            }
        },
    })
}
onMounted(() => {
    getAllTypeList()
    setVditoe()
})
watch(() => currentDetailsData.value, () => {
    if (!props.isEdit && currentDetailsData.value.id) {
        getBindAsset()
    }
}, {
    immediate: true,
    deep: true,
})



const editIntroduceInfo = () => {
    Object.keys(currentDetailsData.value).forEach(key => {
        if (key === 'tagType') {
            Object.keys(currentDetailsData.value[key]).forEach(newKey => {
                editBaseInfo.value[key][newKey] = currentDetailsData.value[key][newKey]
            })
        } else if (key === 'distributedSupport') {
            editBaseInfo.value[key] = currentDetailsData.value[key] || 0
        } else {
            editBaseInfo.value[key] = currentDetailsData.value[key]
        }
    })
    editBaseInfo.value.tagTypeId = currentDetailsData.value.tagType.id
    editBaseInfo.value.tagIds = currentDetailsData.value.tagType?.tags?.map(item => item.id) || []
    if (currentDetailsData.value.tagType.id) {
        formInfoListAll.value[6].selectList = tagListData.value.filter(item => item.tagTypeId === currentDetailsData.value.tagType.id).map(item => {
            return {
                dictName: item.tagName,
                dictCode: item.id,
            }
        })
    }
    idEditStatus.value = true
    setVditorPreviewStatus()
}
const saveASFile = (id) => {
    idEditStatus.value = false
    if (dataType.value.label === '模型') {
        modelUpdate({
            id: editBaseInfo.value.id,
            license: editBaseInfo.value.license,
            langueCode: editBaseInfo.value.langueCode,
            frameCode: editBaseInfo.value.frameCode,
            tagTypeId: editBaseInfo.value.tagTypeId,
            tagIds: editBaseInfo.value.tagIds.join(','),
            hardwareCode: editBaseInfo.value.hardwareCode,
            serverConfigCode: editBaseInfo.value.serverConfigCode,
            distributedSupport: editBaseInfo.value.distributedSupport,
            detail: id,
        }).then((res) => {
            const {data: {code}} = res;
            if (code === 0) {
                ElMessage.success('模型更新成功')
                emit('updataData')
            }
        })
    } else if (dataType.value.label === '数据集') {
        // datasUpdate({
        //     id: editBaseInfo.value.id,
        //     license: editBaseInfo.value.license,
        //     langueCode: editBaseInfo.value.langueCode,
        //     frameCode: editBaseInfo.value.frameCode,
        //     tagTypeId: editBaseInfo.value.tagTypeId,
        //     tagIds: editBaseInfo.value.tagIds.join(','),
        //     platformCode: editBaseInfo.value.platformCode,
        //     detail: id,
        // }).then((res) => {
        //     const {data: {code}} = res;
        //     if (code === 0) {
        //         ElMessage.success('模型更新成功')
        //         emit('updataData')
        //     }
        // })
    }
}

const saveMarkdown = () => {
    idEditStatus.value = false
    const myFiles = new File([vditor.value.getValue()], `${new Date().getTime()}.txt`)
    const formData = new FormData()
    formData.append('file', myFiles)
    formData.append('logicId', new Date().getTime().toString())
    if(currentDetailsData.value.detail) {
        formData.append('fileId', currentDetailsData.value.detail)
        axios.post(fileUrl + '/gfss/api/v1/file/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('token'),
                accept: '*/*',
            },
        }).then((res) => {
            saveASFile(res.data?.data?.fileId)
        })
    } else {
        axios.post(fileUrl + '/gfss/api/v1/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: localStorage.getItem('token'),
                accept: '*/*',
            },
        }).then((res) => {
            saveASFile(res.data?.data?.fileId)
        })
    }
}
// 取消编辑
const cancelEditor = () => {
    idEditStatus.value = !idEditStatus.value
    vditor.value.setValue(vditorStr.value)
    setVditorPreviewStatus()
}
const clickItem = (data) => {
    if (dataType.value.label === '模型') {
        setTypeFn({
            label: '数据集',
            key: 'datas',
        })
    } else {
        setTypeFn({
            label: '模型',
            key: 'model',
        })
    }
    emit('updataData', data.id)
}
</script>
<style lang="postcss">
.modelIntroduce {
    @apply  relative w-full min-w-[1280px] max-w-[1600px] mx-auto flex flex-row min-h-[646px];
    > div {
        @apply flex flex-col rounded-md bg-white p-5 relative;
        > h2 {
            @apply font-bold text-base leading-[30px] mb-3;
            color: #333333;
        }
        .el-descriptions {
            @apply mb-3;
            .el-descriptions__cell {
                @apply !text-[13px] !pb-0;
            }
        }
        .el-form {
            .el-form-item {
                @apply w-1/3 mr-0;
                .el-form-item__content {
                    @apply w-11/12;
                }
            }
        }
        .info-box {
            @apply m-0 mb-4 cursor-pointer text-sm rounded-2xl py-5 px-6;
            background-image: linear-gradient(270deg, #fff 39%, #f7f7f7 87%);
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .08);
            h3{
                @apply mb-2 font-bold;
                color: #191919;
            }
            .item-info {
                @apply text-sm leading-[20px] h-[20px] w-full flex flex-row items-center;
                img {
                    @apply w-4 h-4 rounded-[50%] mr-[5px];
                }
            }
            &:hover {
                z-index: 1000;
                box-shadow: 0 8px 22px 0 rgba(0, 0, 0, .08);
            }
        }
    }
    .isReadonly {
        .vditor-toolbar {
            @apply hidden;
        }
        .vditor-reset {
            @apply !ml-0 !pl-0 !w-full;
        }
        * {
            border: none;
        }
    }
    .vditor-ir pre.vditor-reset[contenteditable="false"] {
        @apply !opacity-100;
    }
    .vditor-preview {
        .vditor-preview__action {
            @apply !hidden;
        }
        .vditor-reset {
            @apply !max-w-[100%]
        }
    }
}
</style>