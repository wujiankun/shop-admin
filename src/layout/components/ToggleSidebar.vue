<template>
  <el-icon @click="handleCollapse">
    <Expand v-if="isCollapse"/>
    <Fold v-else />
  </el-icon>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { computed } from 'vue'
import {Expand, Fold} from '@element-plus/icons-vue'

const store = useStore()

const isCollapse = computed(() => {
  return store.state.isCollapse
})

const handleCollapse = () => {
  store.commit('setIsCollapse', !store.state.isCollapse)
}
</script>

<style lang="scss" scoped>
i {
  font-size: 19px;
  cursor: pointer;
}
</style>
