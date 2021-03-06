<template>
  <page-container>
    <el-card>
      <!-- <template #header> 数据筛选 </template> -->
      <el-form
          :inline="true"
          ref="form"
          :model="listParams"
          :disabled="listLoading"
          @submit.prevent="handleQuery"
      >
        <el-form-item label="状态">
          <el-select v-model="listParams.is_show" placeholder="请选择" clearable>
            <el-option label="全部" value="" />
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input
              v-model="listParams.cate_name"
              clearable
              placeholder="请输入身份昵称"
          />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <el-button type="primary" @click="formVisible = true"> 添加分类 </el-button>
      </template>
      <vxe-table
          :data="list"
          row-id="id"
          :tree-config="{ children: 'children' }"
          v-loading="listLoading">
        <vxe-column field="id" title="ID" />
        <vxe-column field="cate_name" title="名称" tree-node />
        <vxe-column title="分类图标">
          <template #default="{ row }">
            <el-image :src="row.pic"></el-image>
          </template>
        </vxe-column>
        <vxe-column field="sort" title="排序" />
        <vxe-column title="状态">
          <template #default="{ row }">
            <el-switch
                v-model="row.is_show"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                :loading="row.statusLoading"
                @change="handleStatusChange(row)"
            />
          </template>
        </vxe-column>
        <vxe-column title="操作" min-width="100">
          <template #default="scope">
            <el-button type="text" @click="handleUpdate(scope.row.id)"> 编辑 </el-button>
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
      <el-pagination
          :currentPage="listParams.page"
          :page-size="listParams.limit"
          :page-sizes="[5, 10, 15, 20]"
          @size-change="onPageSizeChange"
          @current-change="onCurrentPageChange"
          :disabled="listLoading"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listCount"
      />
    </el-card>
  </page-container>
  <RoleForm
      v-model="formVisible"
      v-model:cate-id="cateId"
      @success="handleFormSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {getCategoryList, deleteCategory, changeState} from '@/api/product-category'
import type {Category, CategoryListParams} from '@/api/types/product-category'
import { ElMessage } from 'element-plus'
import RoleForm from './ClassifyForm.vue'

const list = ref<Category[]|null>() // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive<CategoryListParams>({
  // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  cate_name: '',
  is_show: undefined
})

const formVisible = ref(false)
const cateId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const [_err, data] = await getCategoryList(listParams).finally(() => {
    listLoading.value = false
  })
  if (_err) {
    return
  }
  data.list.forEach((item) => {
    item.statusLoading = false // 控制切换状态的 loading 效果
  })
  list.value = data.list
  listCount.value = data.count
}

const handleQuery = () => {
  listParams.page = 1 // 查询默认从第1页开始
  loadList()
}

const handleDelete = async (id: number) => {
  const [err] = await deleteCategory(id)
  if (!err)ElMessage.success('删除成功')
  await loadList()
}

const handleStatusChange = async (item: Category) => {
  item.statusLoading = true
  await changeState(item.id, item.is_show).finally(() => {
    item.statusLoading = false
  })
  ElMessage.success(`${item.is_show === 1 ? '启用' : '禁用'}成功`)
}

const handleUpdate = (id: number) => {
  cateId.value = id
  formVisible.value = true
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadList()
}
const onPageSizeChange = (size: number) => {
  listParams.limit = size
  listParams.page = 1
  loadList()
}
const onCurrentPageChange = (page: number) => {
  listParams.page = page
  loadList()
}
</script>

<style lang="scss" scoped>
.text-nowrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
