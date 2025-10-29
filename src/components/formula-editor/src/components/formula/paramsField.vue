<template>
  <div class="params-field" :style="{ height: domHeight + 'px' }">
    <div class="drag" @mousedown="mouseDown"></div>
    <div class="params-field-title">
      <div>
        <span class="label-text">配置参数</span>
        <el-popover :width="200">
          <template #reference>
            <el-icon class="label-icon" :size="16"><InfoFilled /></el-icon>
          </template>
          <div>数学函数内的参数只能是多值，其他为单值</div>
        </el-popover>
      </div>

      <el-button type="primary" @click="addParams()" link v-if="!disabled"
        >添加</el-button
      >
    </div>
    <el-scrollbar class="params-field-params">
      <template v-for="(item, index) in paramsList" :key="item.uid!">
        <div
          class="params-field-item"
          :class="{ isAdd: item.addType }"
          @click="onFieldSelect(item)"
        >
          <template v-if="item.addType">
            <el-input
              v-model.trim="editParams[item.uid!].key"
              placeholder="参数"
              size="small"
            ></el-input>
            <el-tree-select
              v-model="editParams[item.uid!].value"
              node-key="enCode"
              default-expand-all
              placeholder="变量"
              :props="{
                label: 'name',
              }"
              size="small"
              :data="fieldList"
              filterable
            />
            <el-select
              v-model="editParams[item.uid!].singleValue"
              size="small"
              placeholder="单、多值"
            >
              <el-option label="单值" value="0"></el-option>
              <el-option label="多值" value="1"></el-option>
            </el-select>
            <el-button
              link
              size="small"
              type="primary"
              @click.stop="saveParams(editParams[item.uid!], index)"
              >确定</el-button
            >
            <el-button
              link
              size="small"
              type="primary"
              @click.stop="cancelParams(editParams[item.uid!], index)"
              >取消</el-button
            >
          </template>
          <template v-else>
            <span>{{ item.key }}</span
            >&nbsp;<strong>-></strong>&nbsp;
            <el-tag
              >{{ item.name }}({{
                item.singleValue === '0' ? '单值' : '多值'
              }})</el-tag
            >
            <el-dropdown
              class="MoreFilled"
              v-if="!disabled"
              @command="handleCommand($event, item)"
            >
              <el-icon :size="14" @click.stop>
                <MoreFilled />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MoreFilled, InfoFilled } from '@element-plus/icons-vue'
import { CodemirrorMarksVo, FieldDataVo, ParamsFieldVo } from '../../types'
import { generateRandomString } from '../../utils'
import FormulaEditorCore from '../../core'
const props = defineProps({
  formulaCore: {
    type: Object as PropType<FormulaEditorCore>,
  },
  fieldList: {
    type: Array<FieldDataVo>,
    default: () => [],
  },
  maxHeight: {
    type: Number,
    default: 450,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const editParams = ref<{ [name: string]: ParamsFieldVo }>({})

const paramsList = ref<ParamsFieldVo[]>([])

const domHeight = ref(300)

const mouseY = ref(0)
onMounted(() => {
  initDrag()
})

const initDrag = () => {}
/**
 * 操作按钮点击事件
 * @param command  事件类型
 * @param data   数据
 */
const handleCommand = (command: string, data: ParamsFieldVo) => {
  switch (command) {
    case 'edit': //编辑
      data.addType = 2
      editParams.value[data.uid!] = JSON.parse(JSON.stringify(data))
      break
    case 'delete': //删除
      if (props.formulaCore?.text.includes(data.key)) {
        return ElMessage.warning('该参数已使用无法删除')
      }
      const _index = paramsList.value.findIndex((item) => item.key === data.key)
      if (_index >= 0) {
        paramsList.value.splice(_index, 1)
      }
      break
  }
}
const onFieldSelect = (field: ParamsFieldVo) => {
  if (field.addType) {
    return
  }
  props.formulaCore?.insertText(field, 'field')
}
/**
 * 新增参数
 * @param params
 */
const addParams = (params?: ParamsFieldVo) => {
  const uid = params?.uid ?? generateRandomString(20)
  const data: ParamsFieldVo = {
    key: params?.key ?? `p${paramsList.value.length + 1}`,
    value: params?.value ?? '',
    name: params?.name ?? '',
    singleValue: params?.singleValue ?? '1',
    addType: params?.addType ?? 1,
    uid,
  }
  paramsList.value.push(data)
  editParams.value[uid] = JSON.parse(JSON.stringify(data))
}
/**
 * 保存参数
 * @param item
 * @param index
 */
const saveParams = (item: ParamsFieldVo, index: number) => {
  if (!item.key) {
    return ElMessage.warning('请填写参数名称')
  }
  const filterList = paramsList.value.filter((item) => !item.addType)
  if (filterList.find((field) => field.key === item.key)) {
    return ElMessage.warning('参数名称重复，请修改在保存')
  }
  delete item.addType
  const field = getFieldData(item.value)
  if (field) {
    item.name = field.name
  }
  const oldField = paramsList.value[index]
  const data = props.formulaCore?.getData()
  const filterMarks = data!.marks.filter(
    (mark: CodemirrorMarksVo) => mark.enCode === oldField.key,
  )
  props.formulaCore?.updateMarks(filterMarks, item.key)
  paramsList.value.splice(index, 1, JSON.parse(JSON.stringify(item)))
  delete editParams.value[item.uid!]
}

/**
 * 取消参数
 * @param item
 * @param index
 */
const cancelParams = (item: ParamsFieldVo, index: number) => {
  switch (item.addType) {
    case 1:
      paramsList.value.splice(paramsList.value.length - 1, 1)
      break
    case 2:
      delete paramsList.value[index].addType
      break
  }
  delete editParams.value[item.uid!]
}
/**查找树结构内的数据 */
const getFieldData = (enCode: string): FieldDataVo | undefined => {
  let field: FieldDataVo | undefined = undefined
  getField(props.fieldList, enCode)
  function getField(list: FieldDataVo[], enCode: string) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].enCode === enCode) {
        field = list[i]
        break
      }
      const children = list[i].children
      if (children && children.length) {
        getField(children, enCode)
      }
    }
  }
  return field
}

const getData = () => {
  const params: Record<string, any> = {}
  paramsList.value.forEach((item) => {
    params[item.key] = {
      indicatorCode: item.value,
      singleValue: item.singleValue === '0',
    }
  })
  return params
}

const setData = (params: { [key: string]: ParamsFieldVo } = {}) => {
  const list: ParamsFieldVo[] = []
  for (let key in params) {
    const field = getFieldData(params[key].value)
    list.push({
      key,
      value: params[key].value,
      singleValue: params[key].singleValue,
      name: field?.name ?? '',
      uid: generateRandomString(20),
    })
  }
  paramsList.value = list
}

const mouseDown = (event: MouseEvent) => {
  console.log('mouseDown', event)
  mouseY.value = event.pageY
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}

const mouseMove = (event: MouseEvent) => {
  let height = domHeight.value + (mouseY.value - event.pageY)
  if (height > props.maxHeight) {
    height = props.maxHeight
  }
  domHeight.value = Math.max(150, height)
  mouseY.value = event.pageY
}
const mouseUp = (event: MouseEvent) => {
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
}
defineExpose({
  getData,
  setData,
  addParams,
})
</script>
