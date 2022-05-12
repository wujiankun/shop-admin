<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ store.state.user?.account }}
      <i class="el-icon-arrow-down el-icon--right" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人中心</el-dropdown-item>
        <el-dropdown-item @click="doLogout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import {ElMessage, ElMessageBox} from 'element-plus';
import {logout} from '@/api/common';
import store from '@/store';
import {useRouter} from 'vue-router'
const router = useRouter()
const doLogout = () => {
  ElMessageBox.confirm('are you sure to logout', 'confirm').then(async () => {
    const [err] = await logout()
    if (!err) {
      ElMessage.success('logout success')
      store.commit('setUser', null)
      await router.push({
        name: 'login'
      })
    }
  }).catch((e) => {
    console.log(e)
  })
}
</script>

<style lang="scss" scoped></style>
