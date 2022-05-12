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
        <el-form-item label="评价状态">
          <el-select v-model="listParams.is_reply" placeholder="请选择" clearable>
            <el-option label="已回复" :value="1" />
            <el-option label="未回复" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-input v-model="listParams.store_name" clearable placeholder="请输商品名称" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="listParams.account" clearable placeholder="请输用户名" />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <vxe-table
          :data="list"
          row-id="id"
          :tree-config="{ children: 'children' }"
          v-loading="listLoading">
        <vxe-column field="id" title="ID" />
        <vxe-column title="商品信息" min-width="160">
          <template #default="{ row }">
            <div style="display:flex;align-items: center">
              <el-image :src="row.image"></el-image>
              <span>{{row.store_name}}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="account" title="用户名称" tree-node />
        <vxe-column field="score" title="评分" />
        <vxe-column title="评价内容">
          <template #default="{ row }">
            <div v-html="row.comment"></div>
          </template>
        </vxe-column>
        <vxe-column title="操作" min-width="100">
          <template #default="scope">
            <el-button type="text" @click="handleUpdate(scope.row.id)"> 回复 </el-button>
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
  <DialogWrapper
      v-model="formVisible"
      title="添加回复"
      @confirm="handleSubmit"
      @cancel="formVisible=false"
  >
    <el-form
        ref="form"
        :model="doReplyData"
        label-width="100px"
        v-loading="doReplyData.formLoading"
    >
      <el-form-item label="回复内容" prop="content">
        <el-input v-model="doReplyData.content" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
  </DialogWrapper>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {getReplyList, deleteReply, doReply, ReplyItem, ReplyListParams} from '@/api/reply'
import { ElMessage } from 'element-plus'

const list = ref<ReplyItem[]|null>() // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive<ReplyListParams>({
  // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  account: '',
  is_reply: undefined,
  store_name: '',
  product_id: 0
})

const doReplyData = reactive({
  content: '', formLoading: false
})

const formVisible = ref(false)
const cateId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const [_err, data] = await getReplyList(listParams).finally(() => {
    listLoading.value = false
  })
  if (_err) {
    return
  }
  list.value = data.list
  listCount.value = data.count
}

const handleQuery = () => {
  listParams.page = 1 // 查询默认从第1页开始
  loadList()
}

const handleDelete = async (id: number) => {
  const [err] = await deleteReply(id)
  if (!err)ElMessage.success('删除成功')
  await loadList()
}

const handleUpdate = (id: number) => {
  cateId.value = id
  formVisible.value = true
}

const handleSubmit = async () => {
  const [err] = await doReply(doReplyData, cateId.value as number)
  if (!err) {
    formVisible.value = false
    await loadList()
  }
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
