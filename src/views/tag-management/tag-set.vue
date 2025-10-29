<template>
<!--  标签设置-->
  <div class="detail-config">
    <div class="tagType-content content-wrapper">
      <div class="search-content flex justify-between">
        <AdvancedSearch :formItemList="formItemList"  @on-search="handleFilterSearch"
                        @on-reset="resetSearch" @onClear="handleFilterClear">
        </AdvancedSearch>

      </div>
      <div class="content-main">
        <div class="table-operate">
          <el-button type="primary" @click="addNewTag">新增 </el-button>
        </div>
        <el-table :data="tableList" class="table-content" border>
          <el-table-column type="index" label="序号" width="50" >
            <template #default="scope">
              {{ (tableConfig.paginationConfig.currentPage - 1) * tableConfig.paginationConfig.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="tagName" label="标签名称" show-overflow-tooltip />
          <el-table-column prop="tagTypeName" label="标签类型" show-overflow-tooltip />
          <el-table-column prop="updateUser" label="更新人" show-overflow-tooltip />
          <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.updateTime ? formatDate(row.updateTime, 'YYYY-MM-DD HH:mm:ss') : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="{ row }">
              <el-button link type="primary" @click="editData(row)">编辑</el-button>
              <el-button link type="primary" @click="deleteData(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <be-pager
            v-model:current-page="tableConfig.paginationConfig.currentPage"
            v-model:page-size="tableConfig.paginationConfig.pageSize"
            :total="tableConfig.paginationConfig.total"
            :list="tableList"
            :page-sizes="TABLE_LIST_PAGE_RANGE"
            @callback="getTableList"
        />
      </div>
      <el-drawer
        v-model="showDrawer"
        :title="tagForm.title"
        direction="rtl"
        size="550"
        :close-on-click-modal="false"
        :before-close="cancelClick"
      >
        <template #default>
          <el-form
            ref="addTagRef"
            label-position="top"
            label-width="auto"
            :model="tagForm"
            style="max-width: 600px"
            :rules="rules"
          >
            <el-form-item label="标签名称" label-position="left" prop="tagName">
              <el-input v-model="tagForm.tagName" maxlength="7" />
            </el-form-item>
            <el-form-item label="标签类型" label-position="left" prop="tagTypeId">
              <el-select-v2
                v-model="tagForm.tagTypeId"
                :options="tagTypeLIstData"
                placeholder="请选择标签类型"
                style="width: 100%"
                :props="selectProps"
                clearable
                filterable
              />
            </el-form-item>
            <el-form-item label="备注" label-position="left">
              <el-input
                v-model="tagForm.remark"
                class="w-full"
                :autosize="{ minRows: 4, maxRows: 4 }"
                type="textarea"
              />
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="handleSave">确定</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch,onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { formatDate } from '@/utils/date'
import { tagTypeList } from '@/api/tagType'
import { tagPage, tagDelete, tagSaveOrUpdate } from '@/api/tag'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";
import AdvancedSearch from "~/components/AdvancedSearch/index.vue";
import {getInitialValue} from "~/utils";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})
const tagTypeLIstData = ref([])
const tableConfig = ref({
  settingTable: false,
  tableId: 'tag-set-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: 'id'
})
const rules = ref<FormRules>({
  tagName: [{ required: true, message: '请输入标签名称', trigger: ['blur', 'change'] }],
  tagTypeId: [{ required: true, message: '请选择标签类型', trigger: ['blur', 'change'] }]
})
// 搜索条件
const fromData = ref({
  tagName: '',
  tagTypeId: ''
})
const formItemList = ref([
  {
    type: 'input',
    label: '标签名称',
    paramKey: 'tagName',
    placeholder: '请输入',
    modelValue: fromData.value.tagName
  },


  {
    type: 'select',
    label: '标签类型',
    paramKey: 'tagTypeId',
    placeholder: '请选择',
    modelValue: fromData.value.tagTypeId,
    selectOptions: []
  },

])
// 添加和编辑的表单
const tagForm = ref({
  title: '创建标签',
  id: '',
  tagName: '',
  remark: '',
  tagTypeId: ''
})
const selectProps = {
  label: 'tagTypeName',
  value: 'id'
}
const pageData = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20
})

// 获取标签类型列表

const getTagTypeFn = () => {
  tagTypeLIstData.value = []
  tagTypeList().then((res) => {
    const { data } = res
    tagTypeLIstData.value = data
    if(tagTypeLIstData.value.length > 0){
      formItemList.value[1].selectOptions = tagTypeLIstData.value.map(item => {
        return {
          label: item.tagTypeName,
          value: item.id
        }
      })
    }
  })

}
watch(
  () => props.isActive,
  () => {
    if (props.isActive) {
      getTagTypeFn()
    }
  }
)
// 获取tag列表
const tableList = ref([])
// 搜索
const handleFilterSearch = (data: any) => {
  Object.keys(fromData.value).forEach((key) => {
      fromData.value[key] = data[key] !== null && data[key] !== undefined ? data[key] : formData.value[key]
  })
  getTableList()
}
const getTableList = () => {
  tagPage({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize,
    tagName: fromData.value.tagName,
    tagTypeId: fromData.value.tagTypeId
  }).then((res) => {
    const { data } = res
    tableConfig.value.paginationConfig.total = res.data.total
    tableList.value =
      data?.body.map((item) => {
        return {
          ...item,
          tagTypeName: item.tagTypeName || '-',
          updateUser: item.updateUser || '-'
        }
      }) || []
  })
}
getTableList()
// 搜索条件的重置
const resetSearch = () => {
  tableConfig.value.paginationConfig.currentPage = 1
  ;(fromData.value.tagName = ''), (fromData.value.tagTypeId = ''), getTableList()
}
const handleFilterClear = (key) => {
  fromData.value[key] = ''
}
const showDrawer = ref(false)
// 创建标签
const addNewTag = () => {
  ;(tagForm.value.title = '创建标签'), (tagForm.value.id = '')
  tagForm.value.tagName = ''
  tagForm.value.remark = ''
  tagForm.value.tagTypeId = ''
  showDrawer.value = true
}
// 编辑标签
const editData = (data) => {
  ;(tagForm.value.title = '编辑标签'), (tagForm.value.id = data.id)
  tagForm.value.tagName = data.tagName
  tagForm.value.remark = data.remark
  tagForm.value.tagTypeId = data.tagTypeId
  showDrawer.value = true
}
// 关闭抽屉
const addTagRef = ref()
const cancelClick = () => {
  addTagRef.value.resetFields()
  showDrawer.value = false
  tagForm.value.id = ''
  tagForm.value.tagName = ''
  tagForm.value.remark = ''
  tagForm.value.tagTypeId = ''
}
// 抽屉保存事件
const handleSave = async () => {
  await addTagRef.value.validate((valid: boolean) => {
    if (valid) {
      tagSaveOrUpdate({
        id: tagForm.value.id,
        tagName: tagForm.value.tagName,
        remark: tagForm.value.remark,
        tagTypeId: tagForm.value.tagTypeId
      }).then((res) => {
        const {code } = res
        if (code === 0) {
          ElMessage.success(`${tagForm.value.id ? '编辑' : '添加'}标签成功`)
          getTableList()
          cancelClick()
        }
      })
    }
  })
}
const deleteData = (data) => {
  ElMessageBox.confirm('确定删除当前标签?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tagDelete({
      id: data.id
    }).then((res) => {
      const { code } = res
      if (code === 0) {
        ElMessage.success('删除标签成功')
        getTableList()
      }
    })
  })
}
onMounted(()=>{
  getTagTypeFn()

})
</script>
<style lang="postcss">
.tagType-content {
  .table-content {
    @apply overflow-y-auto my-2;
    height: calc(100% - 50px);
  }
  .search-content {
    @apply flex-row;
  }
}
</style>
