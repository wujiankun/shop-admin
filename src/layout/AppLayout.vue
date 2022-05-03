<template>
  <el-container>
    <el-aside style="width: auto">
      <AppMenu />
    </el-aside>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import AppMenu from './components/Menu.vue'
import Header from '@/layout/components/Header.vue';
</script>
<style lang="scss" scoped>
.el-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::-webkit-scrollbar {
  width: 0;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>
