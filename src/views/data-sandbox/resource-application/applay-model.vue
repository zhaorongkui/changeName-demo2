<template>
    <!-- 外层包裹 抽屉 -->
    <el-drawer v-model="visible" title="申请数据集" :size="'80%'" @close="handleDrawerClose" class="custom-drawer"
        :modal="false">
        <el-steps :active="active" align-center class="stepsBox">
            <el-step :title="getStepTitle(0)" description="基本信息" />
            <el-step :title="getStepTitle(1)" description="选择业务实体" />
            <el-step :title="getStepTitle(2)" description="确认创建" />
        </el-steps>

        <div class="my-application detail-config">
            <div class="content-wrapper">
                <div v-show="active === 0">
                    <div class="apply-modal-form w-3/5 mx-auto mt-50" prop="name">
                        <el-form :model="addDataForm" ref="addFormRef" :rules="rules" label-width="100" class="w-full ">
                            <el-form-item :label="`数据集名称:`" prop="name">
                                <el-input v-model="addDataForm.name" :placeholder="`请输入申请描述`" clearable />
                            </el-form-item>
                            <el-form-item :label="`申请描述:`" prop="datasetDesc">
                                <el-input v-model="addDataForm.datasetDesc" :placeholder="`请输入申请描述`" clearable />
                            </el-form-item>
                            <el-form-item label="组织维度" prop="orgId">
                                <el-tree-select node-key="orgId" v-model="addDataForm.orgId" :data="treeData" multiple
                                    collapse-tags collapse-tags-tooltip :props="propsTree" show-checkbox
                                    placeholder="请选择" style="width: 100%" />
                                <!--                                <OrgSelect v-model="addDataForm.orgId" :show-checkbox="true" :multiple="true"-->
                                <!--                                    :cascader="true" @update:modelValue="handleCheckedNodes" />-->
                            </el-form-item>
                            <el-form-item label="时间范围" prop="timeRange">
                                <el-date-picker v-model="addDataForm.timeRange" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY/MM/DD"
                                    value-format="YYYY-MM-DD" />
                            </el-form-item>
                            <el-form-item label="到期时间" prop="deadline">
                                <el-date-picker v-model="addDataForm.deadline" :disabled-date="disabledBeforeOptions"
                                    type="date" placeholder="请选择到期时间" class="w-full endTimeStyle" />
                            </el-form-item>
                            <el-form-item label="申请说明:">
                                <el-input v-model="addDataForm.explanation" :autosize="{ minRows: 4, maxRows: 6 }"
                                    type="textarea" placeholder="请输入描述信息" class="border" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-show="active === 1">
                    <div class="apply-modal-content">
                        <div class="table-operate">
                            <el-form-item label="业务实体:">
                                <div class="check-tag-list">
                                    <el-tag class="check-tag-item" v-for="(tag, index) in checkedBusinessObject"
                                        :checked="queryData.tags.includes(tag.id)" type="primary" closable
                                        @close="handleTagClose(index)">
                                        {{ tag.businessObject }}-{{ tag.dataType }}-{{ tag.propertyCount }}个字段
                                    </el-tag>
                                </div>
                            </el-form-item>
                        </div>
                        <!-- 查询条件区域 -->
                        <div class="search-criteria">
                            <AdvancedSearch :formItemList="formItemList" @on-search="handleFilterSearch"
                                @on-reset="handleFilterReset" @onClear="handleFilterClear">
                            </AdvancedSearch>
                        </div>
                        <div class="content-main">
                            <!-- 表格数据展示 -->
                            <el-table ref="tableRef" :data="tableData" class="table-content" border
                                v-loading="isLoading" type="selection" row-key="id"
                                @selection-change="handleSelectChange">
                                <el-table-column type="selection" :reserve-selection="true"></el-table-column>/>
                                <!-- <el-table-column type="index" label="序号" width="60" /> -->
                                <!-- 自定义序号列 -->
                                <el-table-column label="序号" width="60">
                                    <template #default="{ $index }">
                                        {{ getIndex($index) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="业务实体" property="businessObject"
                                    min-width="100"></el-table-column>

                                <el-table-column label="所属系统/单元" property="businessObjectType"
                                    min-width="100"></el-table-column>

                                <el-table-column label="对象层级" property="objectHierarchy"
                                    min-width="100"></el-table-column>
                                <el-table-column label="数据分类" property="dataType" min-width="100"></el-table-column>
                                <el-table-column label="数据更新频率" property="dateDim" min-width="100"></el-table-column>
                                <el-table-column label="包含指标数" property="propertyCount"
                                    min-width="100"></el-table-column>
                                <el-table-column label="业务场景" property="dataTag" min-width="100"></el-table-column>
                                <el-table-column label="操作" min-width="100">
                                    <template #default="scope">
                                        <el-button link type="primary" size="small"
                                            @click.prevent="handleViewPreview(scope.row)">
                                            详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <be-pager v-model:current-page="tableConfig.paginationConfig.currentPage"
                                v-model:page-size="tableConfig.paginationConfig.pageSize"
                                :total="tableConfig.paginationConfig.total" :list="tableData"
                                :page-sizes="[10, 30, 50, 100]" @callback="handlePageChange" />
                        </div>
                    </div>
                    <CoreObjectDetailModal @close="closeCoreObjectDetail" ref="childRef" :dataChecked="dataChecked" />
                </div>
                <div v-show="active === 2">
                    <div class="panel-title">{{addDataForm.name}}</div>
                    <div class="content-title-extra mb-5">
                        <div class="extra-info" style="margin-bottom: 20px">
                            <el-row style="width: 100%">
                                <el-col :span="6">
                                    <div class="field-content">
                                        <span class="label">组织维度: </span> <span class="text-info org-spn" :title="getOrganizationNames(treeData,
                                            addDataForm.orgId).join('、')">{{
                                                getOrganizationNames(treeData,
                                                    addDataForm.orgId).join('、') }}</span>

                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="field-content">
                                        <div><span class="label">时间范围: </span><span class="text-info">{{
                                            addDataForm.timeRange.join('-') }}</span>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="field-content">
                                        <div><span class="label">申请人: </span><span class="text-info">{{
                                            getCreator() }}</span></div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="field-content">
                                        <div><span class="label">申请时间: </span><span class="text-info">{{
                                            addDataForm.createTime = formatDate(new Date(), 'YYYY-MM-DD') }}</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="extra-info">
                            <el-row style="width: 100%">
                                <el-col :span="6">
                                    <div>
                                        <div><span class="label">到期时间: </span><span class="text-info">{{
                                            formatDate(addDataForm.deadline, 'YYYY-MM-DD') }}</span></div>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div>
                                        <div><span class="label">申请描述: </span><span class="text-info">{{
                                            addDataForm.datasetDesc }}</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <CoreObjectModal @close="coreObjectClose" :leftCoreData="tableData" ref="CoreObjectModaltest" />
                </div>
            </div>
        </div>
        <!-- 底部操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleDrawerClose">取消</el-button>
                <el-button type="primary" @click="before" v-if="active > 0">上一步</el-button>
                <el-button type="primary" @click="next" v-if="active !== 2">下一步</el-button>
                <el-button type="primary" @click="handleSubmit" v-if="active === 2" :loading="isLoadingSubmit">确认创建</el-button>
            </span>
        </template>
    </el-drawer>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, ref, watch, PropType, computed, provide, nextTick } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { formatDate, disabledBeforeOptions } from '@/utils/date'
import { getOrganizationNames, getInitialValue } from '@/utils/index'
import CoreObjectModal from './components/CoreObjectModal.vue'
import CoreObjectDetailModal from './components/CoreObjectDetailModal.vue'
import { tagTypeList } from '@/api/tagType'
import { tagList } from '@/api/tag'
import { getbusinessObjectList, creatbusinessObject, getSelector } from '@/api/dataSet.ts'
import { getfieldTree } from '@/api/common.ts'
// 模型接口

import type { BusinessObjectType } from '@/types/dataSandbox'
import { on } from 'node:events'
const pageKey = 'dataset-apply'
onMounted(() => {
    initTreeOrgData()
})
const { t } = useI18n()
const propsTree = ref({
    label: 'name',
    children: 'children',
    value: 'orgId',
})

interface ModelForm {
    id?: string | number
    modelCategory: string
    modelName: string
    features: string
    description: string
}
// 定义组件暴露的事件
const emit = defineEmits(['close', 'success', 'next', 'drawerClose'])
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    modelData: {
        type: Object as PropType<ModelForm>,
        default: () => ({})
    }
})
// 从mockData.ts导入选项数据
const topicOptions = ref([])
const businessOptions = ref([])
const tagOptions = ref([])
const treeData = ref([])

const addDataForm = ref({
    name: '',
    datasetDesc: '',
    orgId: [],
    explanation: '',
    licence: '',
    tagTypeId: '',
    tagIds: [],
    timeRange: [],
    createTime: '',
    creator: '',
    deadline: ''
})

const rules = ref<FormRules>({
    name: [{ required: true, message: `请输入数据集名称`, trigger: ['blur', 'change'] }],
    datasetDesc: [{ required: true, message: `请输入申请描述`, trigger: ['blur', 'change'] }],
    orgId: [{ required: true, type: 'array', min: 1, message: '请选择组织维度', trigger: ['blur', 'change'] }],
    timeRange: [{ required: true, type: 'array', min: 2, message: '请选择时间范围', trigger: ['blur', 'change'] }],
    deadline: [{ required: true, message: '请选择到期时间', trigger: ['blur', 'change'] }],
})
const visible = ref(false)
const cordObjectShow = ref(false)
const coreObjectClose = () => {
    cordObjectShow.value = false
}
// 对话框可见状态
const dialogVisible = ref(true)
// 获取标签类型列表
const tagTypeLIstData = ref([])
const getTagTypeFn = () => {
    tagTypeLIstData.value = []
    tagTypeList().then((res) => {
        const { data } = res
        tagTypeLIstData.value = data
    })
}
getTagTypeFn()
// 获取当前申请人
const getCreator = ()=>{
  let createor =''
  let userInfo = JSON.parse(localStorage.getItem('app')).userInfo
  if(userInfo){
    createor = userInfo.orgName ?  `${userInfo.orgName}/${userInfo.name}` : `${userInfo.name}`
  }
  return createor
}
// 获取标签列表
const tagListData = ref([])
const queryData = ref({
    objectHierarchy: '',
    businessObjectType: '',
    dataType: '',
    dateDim: '',
    organization: '',
    timeRange: [],
    tags: [],
    businessObject: ''
})
const formItemList = ref([
    {
        type: 'input',
        label: '业务实体',
        paramKey: 'businessObject',
        placeholder: '请输入业务实体',
        modelValue: queryData.value.businessObject
    },
    {
        type: 'select',
        label: '对象层级',
        paramKey: 'objectHierarchy',
        placeholder: '请选择对象层级',
        modelValue: queryData.value.objectHierarchy,
        selectOptions: topicOptions.value
    },
    {
        type: 'select',
        label: '数据分类',
        paramKey: 'dataType',
        placeholder: '请选择数据分类',
        modelValue: queryData.value.dataType,
        selectOptions: businessOptions.value
    },
    {
        type: 'select',
        label: '数据更新频率',
        paramKey: 'dateDim',
        placeholder: '请选择数据更新频率',
        modelValue: queryData.value.dateDim,
        selectOptions: tagOptions.value
    },
    {
        type: 'select',
        label: '属性',
        paramKey: 'organization',
        placeholder: '请输入属性',
        modelValue: queryData.value.organization,
        selectOptions: [],
        filterable: true,
    }
])
const handleCheckedNodes = (nodes) => {
    addDataForm.value.orgId = nodes; // 同步到queryData,临时处理
};
const handleFilterSearch = (data: any) => {
    console.log('搜索条件:', data)
    Object.keys(queryData.value).forEach((key) => {
        queryData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : queryData.value[key]
    })
    getTableList()
}
// 获取搜索栏下拉框的枚举值
const getSelectorData = () => {
    getSelector({
        field: ["object_hierarchy",
            "data_type",
            "date_dim"]
    }).then(res => {
        if (res.success) {
            formItemList.value[1].selectOptions = res.data.object_hierarchy.map((item, index) => {
                return {
                    name: item,
                    id: item,
                }
            })
            formItemList.value[2].selectOptions = res.data.data_type.map((item, index) => {
                return {
                    name: item,
                    id: item,
                }
            })
            formItemList.value[3].selectOptions = res.data.date_dim.map((item, index) => {
                return {
                    name: item,
                    id: item,
                }
            })
        } else {
            ElMessage.error(res.msg)
        }
    })
}
const getfieldTreeFun = () => {
    getfieldTree({ keyWord: '' }).then(res => {
        if (res.success) {
            console.log('res.data.organization', res)
            formItemList.value[4].selectOptions = res.data
        } else {
            ElMessage.error(res.msg)
        }
    })
}
// 初始化获取下拉选项数据
onMounted(() => {
    getSelectorData()
    getfieldTreeFun()
})
const handleFilterClear = (key) => {
    queryData.value[key] = getInitialValue(key);
}
const handleFilterReset = () => {
    queryData.value = {
        objectHierarchy: '',
        businessObjectType: '',
        dataType: '',
        dateDim: '',
        organization: '',
        timeRange: [],
        tags: [],
        businessObject: ''
    }
    getTableList()
}

/**
 * 分页参数
 */
const tableConfig = ref({
    settingTable: false,
    tableId: `${pageKey}-table`,
    height: '100%',
    paginationConfig: {
        total: 1,
        currentPage: 1,
        pageSize: 10
    },
    rowKey: `${pageKey}Id`
})
const tableRef = ref()
// 分页事件
const handlePageChange = async () => {
    await getTableList(); // 确保 getTableList 返回 Promise
    // 等待数据更新和 DOM 渲染完成
    await nextTick();
    // 稍微延迟确保表格完全渲染
    setTimeout(() => {
        syncSelection();
    }, 50);
}

const dataChecked = ref([]);
provide('checked', dataChecked);

const handleSelectChange = (selection: BusinessObjectType[]) => {
    // 1. 先移除当前页已选中但不在新选择中的项
    const currentPageIds = tableData.value.map(row => row.id);
    const currentPageSelections = selection.filter(row =>
        currentPageIds.includes(row.id)
    );
    // 2. 先移除当前页的所有项
    checkedBusinessObject.value = checkedBusinessObject.value.filter(
        item => !currentPageIds.includes(item.id)
    );
    // 3. 添加新选择的项（自动去重）
    currentPageSelections.forEach(row => {
        const exists = checkedBusinessObject.value.some(item => item.id === row.id);
        if (!exists) {
            checkedBusinessObject.value.push({ ...row });
        }
    });
    dataChecked.value = checkedBusinessObject.value
}
// 处理标签关闭（单个移除） checkedBusinessObject.value比对
const handleTagClose = (index) => {
    const removedItem = checkedBusinessObject.value[index];
    checkedBusinessObject.value.splice(index, 1);
    console.log('单个删除后剩余的：---》', checkedBusinessObject.value)
    // 同步表格中的选中状态,并且还要将“选中的”数据中去掉上面勾选掉的
    if (tableRef.value) {
        const rowInCurrentPage = tableData.value.find(
            row => row.id === removedItem.id
        );
        if (rowInCurrentPage) {
            tableRef.value?.toggleRowSelection(rowInCurrentPage, false);
        }
    }
    // 3. 关键：更新 dataChecked（如果需要）
    dataChecked.value = [...checkedBusinessObject.value];
};
// 同步选中状态（翻页后调用）
const syncSelection = () => {
    if (!tableRef.value) return;
    // 1. 先提取 checkedBusinessObject 中所有数据的唯一标识（如 id），存成 Set（查询更快）
    const checkedIds = new Set(
        checkedBusinessObject.value.map(item => item.id) // 替换成你的唯一标识字段（如 businessId）
    );
    // 2. 过滤 tableData：只保留“id不在 checkedIds 中”的数据
    const filteredTableData = tableData.value.filter(item => {
        // 同样使用唯一标识字段，判断是否在 checkedIds 中
        return !checkedIds.has(item.id); // 不在则保留
    });
    filteredTableData.forEach(item => {
        tableRef.value?.toggleRowSelection(item, false);
    })
}
// 计算序号的方法
const getIndex = (index: number) => {
    return (tableConfig.value.paginationConfig.currentPage - 1) * tableConfig.value.paginationConfig.pageSize + index + 1
}
const tableData = ref<BusinessObjectType[]>([])
const isLoading = ref(false)
function getTableList() {
    isLoading.value = true
    getbusinessObjectList({
        pageNum: tableConfig.value.paginationConfig.currentPage,
        pageSize: tableConfig.value.paginationConfig.pageSize,
        directory: 1,
        fieldAttribute: queryData.value.organization, // 属性
        businessObject: queryData.value.businessObject, // 业务实体
        businessObjectType: queryData.value.businessObjectType, //所属系统单元
        objectHierarchy: queryData.value.objectHierarchy, //对象层级
        dataType: queryData.value.dataType, // 数据分类
        dateDim: queryData.value.dateDim, //数据更新频率
    }).then((res) => {
        if (res.success) {
            tableData.value = res.data.records
            tableConfig.value.paginationConfig.total = res.data.total
            nextTick(() => {
                syncSelection();
            });
            provide('leftCoreData', tableData.value);
        }
    })
        .finally(() => {
            isLoading.value = false
        })
}
getTableList()

const childRef = ref(null);
const coreObjectItem = ref<BusinessObjectType>({});
const handleViewPreview = (row: BusinessObjectType) => {
    console.log('查看预览详情:', row)
    if (childRef.value) {
        // 调用子组件暴露的方法，并可传递参数
        const result = childRef.value.openDialog(row);
        console.log('子组件返回结果：', result);
        coreObjectItem.value = row;
        provide('coreObjectItem', coreObjectItem.value);
    }

}
const closeCoreObjectDetail = () => {
    cordObjectShow.value = false
}

/**
 *  已选择的业务对象
 */
const checkedBusinessObjectMap = ref<Map<string | number, BusinessObjectType>>(new Map())
const checkedBusinessObject = ref<BusinessObjectType[]>([])
const handleDrawerClose = (data) => {
    visible.value = false
    emit('drawerClose', data)
}
const openDrawer = () => {
    visible.value = true
}
// 暴露给父组件的方法
defineExpose({
    openDrawer,
})
// 关闭对话框
const handleClose = () => {
    dialogVisible.value = false
    emit('close')
}
// 点击了确定按钮
const addFormRef = ref()
const isLoadingSubmit = ref(false)
const handleSubmit = async () => {
    await addFormRef.value.validate((valid: boolean) => {
        if (valid) {
          isLoadingSubmit.value = true
                const {
                    name,
                    datasetDesc,
                    orgId,
                    explanation,
                    tagIds,
                    creator,
                    timeRange,
                    deadline
                } = addDataForm.value;
                const ldmIds = dataChecked.value.map(item => item.id)
                // 只包含需要的字段
                const formObj = {
                    name,
                    datasetDesc,
                    // orgId: orgId[orgId.length - 1], // 只取最后一级组织ID
                    orgId: orgId.join(','),
                    explanation,
                    ldmIds: ldmIds || [],
                    creator,
                    beginTime: timeRange[0],
                    endTime: timeRange[1],
                    deadline: formatDate(deadline, 'YYYY-MM-DD')
                };
                creatbusinessObject(formObj).then((res) => {
                    const {
                        code
                    } = res
                    if (code === 0) {
                        emit('success')
                        ElMessage.success(`创建数据集成功`)
                        handleDrawerClose(true)
                    } else {
                        ElMessage.error(res.msg || '创建数据集失败')
                    }
                }).finally(() => {
                  isLoadingSubmit.value = false
                })

        }
    })
}

const CoreObjectModaltest = ref(null)
const active = ref(0)
const next = () => {
    if (active.value < 2) {
        // 第一步需要校验才能添加
        if (active.value === 0) {
            addFormRef.value.validate((valid: boolean) => {
                if (valid) {
                    active.value++;
                } else {
                    ElMessage.warning('请完善表单信息')
                }
            })
            // active.value++;  // 临时打开注释,方便测试
        }
        else if (active.value === 1) {
            if (checkedBusinessObject.value.length === 0) {
                ElMessage.warning('请至少选择一个业务实体对象')
                return
            }
            active.value++;
            if (active.value === 2) {
                // 右侧要主动触发
                setTimeout(() => {
                    CoreObjectModaltest.value.getField()
                })

            }
        }
        else {
            // 第二步不需要校验,直接跳转下一步
            active.value++;

        }
    }
}
const before = () => {
    if (active.value > 0) {
        active.value--
    };
}
// 根据步骤索引和active值，返回对应标题
const getStepTitle = (index) => {
    if (index < active.value) {
        // 步骤索引小于active：已完成
        return '已完成';
    } else if (index === active.value) {
        // 步骤索引等于active：进行中
        return '进行中';
    } else {
        // 步骤索引大于active：待进行
        return '待进行';
    }
};
// 获取组织
const initTreeOrgData = async () => {
    treeData.value = [];
    const newTreeData = localStorage.getItem('selectListFactory')
        ? JSON.parse(localStorage.getItem('selectListFactory') as string)
        : [];
    recursionTree(newTreeData, treeData.value);

};
const recursionTree = (oldArr, newArr) => {
    oldArr.forEach((item) => {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.children = [];
        if (item.children && item.children.length === 1 && !item.children[0].name) {
            item.children = [];
        }
        if (item.children && Array.isArray(item.children)) {
            recursionTree(item.children, newItem.children);
        }
        newArr.push(newItem);
    });
};
</script>

<style lang="scss" scoped>
.header-title {
    background-color: #fff;
    padding: 1.5rem;
    margin: 15px 0;
    border-radius: 0.5rem;

    h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: rgb(25, 25, 25);
    }
}

.stepsBox {
    padding: 15px 0
}

.my-application {
    @apply flex flex-col h-full;
}

.table-operate {
    display: flex;
    justify-content: start;
}

.modal-container {
    // height: calc(100vh - 120px);

    .main-content {
        .apply-modal-form {
            padding: 12px 16px 0;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #ccc;
        }

        .apply-modal-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 12px;
            // overflow-y: auto;
            overflow: hidden;
        }
    }
}

.table-operate {
    .check-tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-right: 8px;

        max-height: 125px;
        overflow: auto;
        padding: 10px;
        // border: 1px solid #ccc;
        // border-radius: 5px;
        // width: 100%;
        // min-height:50px;

        .check-tag-item {
            --el-color-info: #909399;
            --el-color-info-light-9: rgb(244, 244, 245);

            .el-check-tag {
                cursor: pointer;
                transition: background-color 0.3s, color 0.3s;

                &:hover {
                    background-color: #e6f4ff;
                    color: #409eff;
                }
            }
        }
    }
}

.panel-title {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
}

.content-title-extra {
    padding: 0 60px;
}

.el-form-item__content {
    :deep(.el-cascader) {
        width: 100% !important;
    }

}

:deep(.endTimeStyle) {
    width: 100%;

    .el-input__wrapper {
        width: 100%;
    }
}

.content-main {
    overflow: scroll;
    // height: 690px;
    height: 480px;
}

.org-spn {
    display: inline-block;
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.field-content {
    display: flex;
    align-items: center;
}
:deep(.el-popper) {
  z-index: 4000 !important;
}
</style>
<style>
.custom-drawer .el-drawer__body {
    overflow: hidden;
}
</style>
