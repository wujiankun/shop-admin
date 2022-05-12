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
        <el-form-item label="规格搜索：">
          <el-input
              v-model="listParams.rule_name"
              clearable
              placeholder="请输入规格昵称"
          />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <el-button type="primary" @click="formVisible = true"> 添加规格 </el-button>
      </template>
      <el-table :data="list" stripe style="width: 100%" v-loading="listLoading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="rule_name" label="规格名称" />
        <el-table-column prop="attr_name" label="商品规格" />
        <el-table-column prop="attr_value" label="商品属性" >
          <template #default="scope">
            {{scope.row.attr_value.join(',')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="100" align="center">
          <template #default="scope">
            <el-button type="text" @click="handleUpdate(scope.row.id)"> 编辑 </el-button>
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button type="text"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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
      v-model:rule-id="ruleId"
      @success="handleFormSuccess"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {deleteRules, getProductRules} from '@/api/rule'
import { ElMessage } from 'element-plus'
import RoleForm from './AttrForm.vue'

const list = ref() // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive({
  // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  rule_name: ''
})

const formVisible = ref(false)
const ruleId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const [_err, data] = await getProductRules(listParams).finally(() => {
    listLoading.value = false
  })
  if (_err) {
    return
  }
  const data2 = data as any
  data2.list.forEach((item:any) => {
    item.statusLoading = false // 控制切换状态的 loading 效果
  })
  list.value = data2.list
  listCount.value = data2.count
}

const handleQuery = () => {
  listParams.page = 1 // 查询默认从第1页开始
  loadList()
}

const handleDelete = async (id: number) => {
  const [err] = await deleteRules({ids: id + ''})
  if (!err)ElMessage.success('删除成功')
  await loadList()
}

const handleUpdate = (id: number) => {
  ruleId.value = id
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
