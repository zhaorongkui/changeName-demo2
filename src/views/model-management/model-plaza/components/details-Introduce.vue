<template>
    <div class="modelIntroduce">
        <div class="flex-1 flex flex-col">
            <h2>基础信息</h2>
            <div v-show="!idEditStatus" class="justify-stretch">
                <p class="inline-block mr-8   mb-4" v-for="(item, index) in currentFormList" :key="index">
                    <span class="mr-1">{{ item.label }}:</span>
                    <span v-if="item.keyCode === 'publicStatus'">{{ currentDetailsData[item.keyCode] ?'公开模型':'未公开模型' }}</span>
                  <span v-if="item.keyCode !== 'publicStatus' && item.keyCode !== 'modelType'">{{ currentDetailsData[item.keyCode] || '-' }}</span>
                  <span v-if="item.keyCode == 'modelType' ">{{modelType  }}</span>
                </p>
            </div>

            <h2>模型描述</h2>
            <div class=" w-full" :class="{'isReadonly': !idEditStatus}" ref="vditorContent" v-loading="vditorLoading" element-loading-text="数据详情加载中...">
                <div v-html='currentDetailsData.notes'></div>
<!--                <div id="vditorRef"></div>-->
            </div>
            <div class="flex justify-center mt-2" v-show="idEditStatus">
<!--                <el-button round type="primary" @click="saveMarkdown">保存</el-button>-->
<!--                <el-button round type="info" @click="cancelEditor">取消</el-button>-->
            </div>
        </div>
        <div v-if="!isEdit" class="w-[433px] ml-3">
            <h2 class="mb-6">关联数据集（{{currentDetailsData?.dataSetList?.length || 0}}）</h2>
            <div class="p-0 data-set-container">
                <div class="info-box cursor-pointer" v-for="(item, index) in currentDetailsData.dataSetList" :key="index" @click="clickItem(item)">
                    <h3>{{ item.name }}</h3>
                    <div class="item-info">
                      <span class="inline-flex">{{item.owner}} <span v-if="item.owner && item.updateUser">/</span>{{ item.updateUser  }}</span>
                        <Calendar class="inline-flex ml-[22px] mx-[10px] h-4 w-4"/>
                        <span class="inline-flex">{{ item.updateTime ? formatDate(item.updateTime, 'YYYY-MM-DD') : '-' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  <div class="params-container" >
    <h2 class="info-title">参数配置</h2>
    <!-- 输入参数表格 -->
    <div class="param-table">
      <div class="table-title">输入参数</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="inputParams"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
      </div>

    </div>

    <!-- 输出参数表格 -->
    <div class="param-table">
      <div class="table-title">输出参数</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="outputParams"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
      </div>

    </div>

    <!-- 评估指标表格 -->
    <div class="param-table">
      <div class="table-title">评估指标</div>
      <div class="data-table-container">
        <be-table
            :is-lock="false"
            :table-data="evalMetrics"
            :columns="tableColumns"
            :options="tableConfig"
        >
        </be-table>
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
import projectEnv from "@/config/runtimeEnv.js";
import { Edit, Calendar } from '@element-plus/icons-vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// 字典类型
import { dictGetAllByCode } from '~/api/dict'
import { tagList } from '@/api/tag'
import { ElMessage } from "element-plus";
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  modelId: {
    type: String,
    default: ''
  },
  currentDetail:{
    type:Object,
    default:{}
  }
});
// be-table 配置
const tableConfig = ref({
  settingTable: false,
  tableId: 'model-detail-table',
  height: '200px',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10
  },
  maxHeight:150,
  rowKey: 'id'
})

// 表格列配置
const tableColumns = [
  //   参数名
  { prop: 'paramName', label: t('PARAM_NAME'), minWidth: 100 },
  //  参数描述
  { prop: 'paramDesc', label: t('PARAM_DESC'), minWidth: 100 },
  //   参数类型
  { prop: 'paramType', label: t('PARAM_TYPE'), minWidth: 120 },
]
// 输入参数list
const inputParams = ref([])
// 输出参数数据源List
const outputParams = ref([])
// 评估指标数据源list
const evalMetrics = ref([])

const emit = defineEmits(["updataData"]);
const fileUrl = projectEnv.VITE_APP_FILE_META
// 模型的基础信息
const formInfoListAll = ref<Array<formInfoItem>>([
  { key: 'name', keyCode: 'name', label: '模型名称',},
  { key: 'modelType', keyCode: 'modelType', label: '模型类型', },
  { key: 'publicStatus', keyCode: 'publicStatus', label: '模型公开', },
  { key: 'owner', keyCode: 'owner', label: '模型所有者', },
  { key: 'developLanguage', keyCode: 'developLanguage',  label: '编程语言',},
  { key: 'applicableScenario',keyCode: 'applicableScenario', label: '模型适用场景', },
])
const currentFormList = computed(() => {
  return formInfoListAll.value
})
const currentDetailsData = ref<any>({})
// "detail": "根据历史参数，构建 外回流比（r）动态控制策略优化方案,梳理已有参数如下：进水流量、外回流流量、进水氨氮、进水TN、出水氨氮、出水TN、厌氧段ORP、缺氧段ORP、好氧段DO；",

// 基础信息接口类型
interface formInfoItem {
    key: string,
    keyCode?: string,
    label: string,
    showType?: string,
    dataType?: string,
    // selectList?: Array<selectItem>
}
//模型类型
const modelType = ref('')
/**
 *  模型类型展示
 */
const getModelType = (type:string | number)=> {
  switch (type){
    case '1':
      modelType.value = '机器学习模型'
    break
    case '2':
      modelType.value = '智能体模型'
      break
    case '3':
      modelType.value = '数据规则模型'
      break
  }
}
// 是否编辑状态
const idEditStatus = ref(false);
// 模型描述
const vditor = ref<Vditor | null>(null);
// 模型描述区域
const vditorContent = ref(null)
const vditorLoading = ref(false)

// 文件整个下载
const vditorStr = ref('')
/**
 * 模型描述展示
 */
const setVditoe = () => {
    // vditorLoading.value = true
  const vditorRef = document.getElementById('vditorRef')
    vditor.value = new Vditor(vditorRef, {
        width: props.isEdit ? '1560px': '',
        value: currentDetailsData.value.notes || '',
        toolbarConfig: {
            pin: true,
        },
        cache: {
            enable: false,
        },
        after: () => {
            if (currentDetailsData.value.notes) {
              vditorLoading.value = false
            } else {
                vditor.value.setValue('')
            }
          vditor.value.disabled()
        },
    })
}
watch(()=>props.currentDetail, (val)=>{
  currentDetailsData.value = val
  getModelType(currentDetailsData.value.modelType)
  inputParams.value =  currentDetailsData.value.paramInList
  outputParams.value = currentDetailsData.value.paramOutList
  evalMetrics.value = currentDetailsData.value.paramEvaList
},{
  deep:true
})
onMounted(() => {
    // getAllTypeList()
    // setVditoe()
})


const clickItem = (data) => {
    // if (dataType.value.label === '模型') {
    //     setTypeFn({
    //         label: '数据集',
    //         key: 'datas',
    //     })
    // } else {
    //     setTypeFn({
    //         label: '模型',
    //         key: 'model',
    //     })
    // }
    // emit('updataData', data.id)
}
</script>
<style lang="postcss">
.modelIntroduce {
    @apply  relative w-full min-w-[1280px] max-w-[1600px] mx-auto flex flex-row ;
    > div {
        @apply flex flex-col rounded-md bg-white  relative;
        margin-bottom: 20px;
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
.params-container{
  padding-left: 20px;
}
.param-table{
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.table-title{
  margin: 10px 0;
}
.info-title{
  font-weight: bold;
}
.data-set-container{
  max-height: 300px;
  overflow-y: auto;
}
:deep(.data-table-container .el-table){
  overflow-y: auto;
}
</style>