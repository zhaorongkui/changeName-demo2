<template>
  <div class="agent">
    <h1>智能体</h1>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Agent',
  components: {},
  setup() {
    return {}
  }
})
</script>

<style scoped>
.agent {
  padding: 20px;
}
</style>
