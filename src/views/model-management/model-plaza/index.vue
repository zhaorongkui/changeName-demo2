<template>
  <div class="detail-config" v-show="!isChildRoute">
    <div class="left-content">
      <div class="content-title">
        <h3>全部模型</h3>
        <div class="content-title-extra">
          <el-button
              :type="classification === 'organization' ? 'primary' : 'text'"
              @click="handleClass('organization')"
              link
          >
            按组织
          </el-button>
          <el-divider direction="vertical" />
          <el-button :type="classification === 'business' ? 'primary' : 'text'" @click="handleClass('business')" link>
            按标签
          </el-button>
        </div>
      </div>

      <div class="catalog-tree" v-if="classification == 'organization'">
        <OrganizationTree ref="businessTreeRef" @node-click="handleNodeClick" />
      </div>
        <div v-else>
          <div class="tag-target-body">
            <TagDetails
                v-for="(newItem, index) in commonTags"
                :key="newItem.id"
                :background="'#b3e4ff'"
                :name="newItem.tagName"
                class="cursor-pointer"
                :class="{ isActive: newItem.id == currentTagId }"
                @click="tagHeadle(newItem)"
            />
          </div>
      </div>
    </div>
    <div class="right-content">
      <div class="content-title">
        <h3>模型列表</h3>
      </div>
      <!-- 查询条件区域 -->
      <div class="search-criteria">
        <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch" @on-reset="handleFilterReset" @on-clear="handleClear">
          <template #applicableScenario>
            <el-tree-select
                v-model="formData.applicableScenario"
                :data="modelApplicableOptions"
                :render-after-expand="false"
            />
          </template>
        </AdvancedSearch>
      </div>
      <div class="content-main">
<!--        <el-button class="add-model-btn" type="primary" @click="handleAddModel">创建模型</el-button>-->
        <div class="data-table-container">
          <div class="card-wrapper" v-loading="loading">
            <CardInfo
                style="width: calc( 33% - 8px)"
                v-if="dataList && dataList.length > 0"
                v-for="(item, index) in dataList"
                :data="item"
                @click="clickItem(item)"
            />
            <div  v-else class="empty-content">
              <el-empty :image-size="150" description="暂无数据" />

            </div>
          </div>
        </div>
        <el-pagination
            class="inline-block justify-end mt-1"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
  <!--  新建模型-->
  <addModel v-if="isShowAddModel"  @close="handleCloseModel"></addModel>
  <router-view :key="route.path"></router-view>
</template>
<script setup lang="ts">
import {ref, watch, nextTick, computed, onMounted} from 'vue'
import CardInfo from './components/CardInfo.vue'
import TagDetails from '@/components/TagData/index.vue'
// 模型接口
import { getModelList } from '@/api/modelManage'
import BusinessTree from '@/views/data-sandbox/components/BusinessTree.vue'
import OrganizationTree from '@/views/data-sandbox/components/OrganizationTree.vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import {
  modelTypeOptions as mockModelTypeOptions,
} from './mockData'
import { modelApplicableOptions } from '@/utils/constant'
import addModel from '@/views/model-develop/editor/components/add-model.vue'
import type {ModelInfo, TableConfig, FormData, ModelPageParams} from '@/types/modelManagement'
import { tagPage,  } from '@/api/tag'
import { useRoute,useRouter } from 'vue-router';
const route = useRoute();
const isChildRoute = computed(() => route.path.includes('detail'));
const businessTreeRef = ref<InstanceType<typeof BusinessTree>>()
const isShowAddModel =ref(false)
// 左侧模型选择的分类
const classification = ref<'business' | 'organization'>('organization')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const currentTreeId = ref<number | string | null>(null)
const formData = ref<FormData>({
  name: '', //模型名称
  publicStatus: '', //模型公开
  modelType: '', //模型类型
  applicableScenario: '', //场景
})

// 选中的标签
const currentTagId = ref<number | null>(null)
const businessOptions = ref(mockModelTypeOptions)
const formItemList = ref([
  // {
  //   type: 'select',
  //   label: '模型公开',
  //   paramKey: 'publicStatus',
  //   placeholder: '请选择',
  //   modelValue: formData.value.publicStatus,
  //   selectOptions: themeOptions.value.map((item) => ({
  //     name: item.label,
  //     id: item.value
  //   }))
  // },
  {
    type: 'input',
    label: '模型名称',
    paramKey: 'name',
    placeholder: '请输入',
    modelValue: formData.value.name
  },
  {
    type: 'select',
    label: '模型类型',
    paramKey: 'modelType',
    placeholder: '请选择',
    modelValue: formData.value.modelType,
    selectOptions: businessOptions.value.map((item) => ({
      name: item.label,
      id: item.value
    }))
  },
  {
    type: 'select',
    label: '适用场景',
    paramKey: 'applicableScenario',
    placeholder: '请选择',
    isSlot: true,
  },


])
// 按分类
const commonTags = ref([])

const getTagList = () => {
  tagPage({
    currentPage: 1,
    pageSize: 500,
  }).then((res) => {
    const { data } = res
    commonTags.value =
        data?.body.map((item) => {
          return {
            ...item,
            value: item.id,
          }
        }) || []
  })

}
getTagList()
const loading = ref<boolean>(false)
const dataList = ref<ModelInfo[]>([])
/**
 * 获取右侧模型的列表
 */
const getModelPageList = (id?: string | number | null) => {
  loading.value = true
  getModelList({
        releaseStatus: 2,
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    name: formData.value.name,
    modelType: formData.value.modelType,
        applicableScenario: formData.value.applicableScenario,
        sort:1,
        orgId: classification.value == 'organization'  ? id : null, //组织  默认部门不传
        tagId:  classification.value == 'business'? id : null,//分类
  }
  ).then((res) => {
        dataList.value = res.data?.body || []
        total.value = res.data?.total || 0
      })
      .finally(() => {
        loading.value = false
      })
}

/**
 * 初始化表格数据
 */
const getNewTableList = (id?) => {
  dataList.value = []
  loading.value = true
  getModelPageList(id)
}


/**
 * 点击分类切换标签
 * @param item
 */
//
const tagHeadle = (item) => {
  console.log(item,'item[==')
  if (currentTagId.value == item.id) {
    currentTagId.value = null
  } else {
    currentTagId.value = item.id
  }
  getNewTableList(currentTagId.value)

  console.log(currentTagId,'id==')
}
const router = useRouter()
/**
 * 跳转详情
 * @param data
 */
const clickItem = (data: ModelInfo) => {
  router.push({
    name: 'model-plaza-detail',
        // path:'/model-management/model-detail',
    query: {
      modelId: data.id,
      square:'广场'
    }
  })
}
/**
 * 切换左侧分类添加动态class
 * @param type
 */
const handleClass = (type: 'business' | 'organization') => {
  classification.value = type
  if(type === 'organization') {
    currentTagId.value = null
  }
}
// 点击左侧树
const handleNodeClick = (data) => {
  currentTreeId.value = data.name =='默认部门' ? null : data.orgId
  getModelPageList(currentTreeId.value)

}

const handleCloseModel = ()=> {
  isShowAddModel.value = false
}
/**
 * 搜索
 * @param data
 */
const handleFilterSearch = (data: any) => {
  console.log(data,'data')
  Object.keys(formData.value).forEach((key) => {
    if(key !='applicableScenario'){
     formData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
    }
  })
  getNewTableList(currentTreeId.value)
}
// 重置
const handleFilterReset = () => {
  formData.value.applicableScenario = ''
  formData.value.name = ''
  formData.value.publicStatus = ''
  formData.value.modelType = ''
  currentPage.value = 1
  pageSize.value = 20
  getNewTableList(currentTreeId.value)
}
// 清空某个搜索项
const handleClear = (parimaryKey: string)=> {
  formData.value[parimaryKey] = ''
}
/**
 * 切换分页条数
 * @param val
 */
const handlePageSizeChange = (val:number)=>{
  currentPage.value = 1
  pageSize.value = val
  getNewTableList(currentTreeId.value)
}
/**
 * 切换分页
 * @param val
 */
const handlePageChange = (val:number)=>{
  currentPage.value = val
  getNewTableList(currentTreeId.value)
}
onMounted(()=>{
  nextTick(()=>{
    if(businessTreeRef.value?.treeData[0]){
      console.log(businessTreeRef.value?.treeData[0],'businessTreeRef.value?.treeData[0]')
      currentTreeId.value = businessTreeRef.value?.treeData[0].name == '默认部门' ? null : businessTreeRef.value?.treeData[0].orgId
      getNewTableList(currentTreeId.value)
    }

  })
})
</script>
<style scoped lang="postcss">
.detail-config {
  .left-content {
    @apply w-[310px] p-0 pr-6 h-full overflow-hidden overflow-y-auto;
    border-right: 1px solid #ddd;
    .tag-type-header-container {
      display: flex;
      justify-content: space-between;
      .tag-type-container-class {
        margin-top: 5px;
        span {
          display: inline-block;
        }
        .tag-type-active {
          color: #1775ff;
        }
        .tag-type-container-divider {
          margin: 0 10px;
        }
      }
    }
    .tag-type-header {
      @apply text-[18px] leading-[32px] font-semibold mb-6;
    }
    .tag-target {
      @apply mb-3;
      .tag-target-header {
        @apply mb-4 text-sm leading-[21px] flex items-center cursor-pointer;
        color: rgb(25, 25, 25);
        .icon {
          @apply inline-flex ml-2 h-[14px] w-[14px];
        }
        .truncate {
          @apply text-[16px] font-bold;
        }
      }
      .tag-target-body {
        @apply flex flex-row flex-wrap overflow-hidden;
      }
    }

  }
}
.isActive {
  color: #fff !important;
  background: #ff8929;
}
.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .empty-content{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>