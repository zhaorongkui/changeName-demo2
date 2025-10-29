<template>
  <i :class="['node-icon', type]"></i>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => {
      return ['params-input', 'condition', 'calculation', 'params-output'].includes(value)
    },
    default: 'params-input'
  }
})
</script>

<style lang="postcss" scoped>
.node-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  margin-left: 8px;
  border-radius: 3px;
  display: inline-block;
  position: relative;
  flex-shrink: 0;
}

.node-icon::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  top: 3px;
  left: 3px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.node-icon.params-input {
  background-color: #e6f7ff;
}
.node-icon.params-input::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231890ff"><path d="M4 6h16v2H4zm0 6h16v-2H4zm0 4h16v-2H4zm0 4h16v-2H4z"/></svg>');
}

.node-icon.condition {
  background-color: #fff7e6;
}
.node-icon.condition::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fa8c16"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/></svg>');
}

.node-icon.calculation {
  background-color: #f6ffed;
}
.node-icon.calculation::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2352c41a"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10zm-2-12h-2V3h2v2zm0 12h2v2h-2v-2z"/></svg>');
}

.node-icon.params-output {
  background-color: #f9f0ff;
}
.node-icon.params-output::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239254de"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>');
}
</style>
