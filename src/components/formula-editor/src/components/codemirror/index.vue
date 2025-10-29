<!--
 * @Author: linyongcai
 * @Date: 2025-01-09 16:29:42
 * @FilePath: \formula-editor\formula-editor\src\components\codemirror\index.vue
 * @Description: 页面描述
-->
<template>
  <div
    class="codemirror-container"
    :class="{ 'original-style': props.originalStyle }"
  >
    <textarea ref="textareaRef" :name="name" :placeholder="placeholder" />
  </div>
</template>

<script lang="ts" setup>
import { computed, markRaw, onMounted, PropType, ref, watch } from 'vue'
import CodeMirror from 'codemirror'
import type { Editor } from 'codemirror'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

import { DEFAULT_OPTIONS } from '../../config'

const props = defineProps({
  name: { type: String, default: `code-textarea-${+new Date()}` },
  placeholder: { type: String, default: '' },
  originalStyle: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:instance', 'update:modelValue', 'ready'])
const textareaRef = ref<HTMLTextAreaElement>()

const instance = ref<Editor | null>(null)
const cmOptions = computed(() => {
  return {
    foldGutter: true,
    ...DEFAULT_OPTIONS,
    gutters: [...new Set(['CodeMirror-linenumbers', 'CodeMirror-foldgutter'])],
  }
})

/**初始化数据 */
const initialize = () => {
  instance.value = markRaw(
    CodeMirror.fromTextArea(textareaRef.value!, cmOptions.value),
  )

  instance.value.setOption('readOnly', props.disabled)
  refresh()
  emits('update:instance', instance.value)
  emits('ready', instance.value)
}
/**当容器大小改变时调用，更新布局 */
const refresh = () => {
  instance.value?.refresh()
}

onMounted(() => {
  initialize()
})

watch(
  () => props.disabled,
  (val) => {
    instance.value?.setOption('readOnly', val)
  },
)
defineExpose({
  refresh,
})
</script>
