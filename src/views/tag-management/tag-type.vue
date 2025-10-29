<template>
  <div class="detail-config">
    <div class="tagType-content content-wrapper">
      <div class="text-right">
        <el-button type="primary" @click="addTagType">新增</el-button>
      </div>
      <div class="flex-1 overflow-auto">
        <el-table :data="tableList" class="table-content" border>
          <el-table-column type="index" label="序号" width="50" >
            <template #default="scope">
              {{ (tableConfig.paginationConfig.currentPage - 1) * tableConfig.paginationConfig.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
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
        :title="tagTypeForm.title"
        direction="rtl"
        size="550"
        :close-on-click-modal="false"
        :before-close="cancelClick"
        :modal="false"
      >
        <template #default>
          <el-form
            ref="addTagTypeRef"
            label-position="top"
            label-width="auto"
            :model="tagTypeForm"
            style="max-width: 600px"
            :rules="rules"
          >
            <el-form-item label="标签类型" label-position="left" prop="tagTypeName">
              <el-input v-model="tagTypeForm.tagTypeName" maxlength="7" />
            </el-form-item>
            <el-form-item label="备注" label-position="left">
              <el-input
                v-model="tagTypeForm.remark"
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { formatDate } from '@/utils/date'
import { tagTypePage, tagTypeDelete, tagTypeSaveOrUpdate } from '@/api/tagType'
import {TABLE_LIST_PAGE_RANGE} from "~/utils/constant";

const rules = ref<FormRules>({
  tagTypeName: [{ required: true, message: '请输入标签类型', trigger: ['blur', 'change'] }]
})
const tableConfig = ref({
  settingTable: false,
  tableId: 'tag-type-table',
  height: '100%',
  paginationConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 20
  },
  rowKey: 'id'
})
const tableList = ref([])
// 获取类型列表
const getTableList = () => {
  tableList.value = []
  tagTypePage({
    currentPage: tableConfig.value.paginationConfig.currentPage,
    pageSize: tableConfig.value.paginationConfig.pageSize
  }).then((res) => {
    console.log(res)
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
// 新增标签类型
const showDrawer = ref(false)
const tagTypeForm = ref({
  tagTypeName: '',
  remark: '',
  id: '',
  title: '添加标签类型'
})

const addTagTypeRef = ref()
// 添加标签类型
const addTagType = () => {
  showDrawer.value = true
  tagTypeForm.value.title = '添加标签类型'
}
// 编辑标签类型
const editData = (data) => {
  tagTypeForm.value.tagTypeName = data.tagTypeName
  tagTypeForm.value.remark = data.remark
  tagTypeForm.value.id = data.id
  showDrawer.value = true
  tagTypeForm.value.title = '编辑标签类型'
}
// 关闭抽屉
const cancelClick = () => {
  addTagTypeRef.value.resetFields()
  showDrawer.value = false
  tagTypeForm.value.tagTypeName = ''
  tagTypeForm.value.remark = ''
  tagTypeForm.value.id = ''
}
// 确定按钮
const handleSave = async () => {
  await addTagTypeRef.value.validate((valid: boolean) => {
    if (valid) {
      tagTypeSaveOrUpdate({
        id: tagTypeForm.value.id,
        tagTypeName: tagTypeForm.value.tagTypeName,
        remark: tagTypeForm.value.remark
      }).then((res) => {
        const {
         code 
        } = res
        if (code === 0) {
          ElMessage.success(`${tagTypeForm.value.id ? '编辑' : '添加'}标签类型成功`)
          getTableList()
          cancelClick()
        }
      })
    }
  })
}

const deleteData = (data) => {
  ElMessageBox.confirm('确定删除当前标签类型?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tagTypeDelete({
      id: data.id
    }).then((res) => {
      const { code } = res
      if (code === 0) {
        ElMessage.success('删除标签类型成功')
        getTableList()
      }
    })
  })
}
</script>
<style lang="postcss">
.tagType-content {
  @apply overflow-auto;
  .table-content {
    @apply overflow-y-auto my-2;
    height: calc(100% - 50px);
  }
}
</style>
