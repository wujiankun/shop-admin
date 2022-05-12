<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :collapse="store.state.isCollapse"
    :defaultActive="$route.path"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-menu-item index="/">
      <el-icon>
        <House />
      </el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-sub-menu index="0">
      <template #title>
        <el-icon>
          <Monitor />
        </el-icon>
        <span>内容</span>
      </template>
      <el-menu-item index="/media/article">文章管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <IconMenu />
        </el-icon>
        <span>设置</span>
      </template>
      <el-menu-item index="/permission/admin">管理</el-menu-item>
      <el-menu-item index="/permission/role">角色</el-menu-item>
      <el-menu-item index="/permission/rule">规则</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>商品</span>
      </template>
      <el-menu-item index="/product/list">
        <el-icon>
          <Document />
        </el-icon>
        <template #title>列表</template>
      </el-menu-item>
      <el-menu-item index="/product/classify">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>分类</template>
      </el-menu-item>
      <el-menu-item index="/product/attr">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>规格</template>
      </el-menu-item>
      <el-menu-item index="/product/reply">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>回复</template>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <Tools />
        </el-icon>
        <span>维护</span>
      </template>
      <el-menu-item index="/maintain/attachment">附件管理</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import {
  Document,
  House,
  Monitor,
  Menu as IconMenu,
  Setting,
    Tools
} from '@element-plus/icons-vue'
import { useStore } from '@/store'

const store = useStore()
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  // 1-4 ['1', '1-4']
}
</script>
<style scoped lang="scss">
.el-menu {
  height: 100%;
  width: 200px;

  &.el-menu--collapse {
    width: auto;
  }
}
</style>
