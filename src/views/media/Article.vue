<template>
  <page-container>
    <el-card>
      <el-form
          :inline="true"
          ref="form"
          :model="listParams"
          :disabled="listLoading"
          @submit.prevent="handleQuery"
      >
        <el-form-item label="文章分类">
          <el-select v-model="listParams.pid" placeholder="请选择" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="营销" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题">
          <el-input v-model="listParams.title" clearable placeholder="请输用标题" />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <el-button
            type="primary"
            :icon="Plus"
            @click="$router.push('/media/article-add')"
        > 添加文章</el-button>
      </template>
      <vxe-table
          :data="list"
          row-id="id"
          v-loading="listLoading">
        <vxe-column field="id" title="ID" />
        <vxe-column title="文章图片">
          <template #default="{ row }">
            <el-image :src="img" v-for="img in row.image_input" :key="img" style="width: 50px"></el-image>
          </template>
        </vxe-column>
        <vxe-column field="title" title="文章标题" tree-node />
        <vxe-column field="store_name" title="关联商品" />
        <vxe-column field="visit" title="浏览量" />
        <vxe-column field="add_time" title="时间" />
        <vxe-column title="操作" min-width="100">
          <template #default="scope">
            <el-button type="text" @click="handleUpdate(scope.row.id)"> 编辑 </el-button>
            <el-popconfirm :title="`确认${scope.row.product_id!==0?'取消':''}关联吗？`" @confirm="doUnRelate(scope.row)">
              <template #reference>
                <el-button type="text" v-if="scope.row.product_id!==0"> 取消关联 </el-button>
                <el-button type="text" v-else> 关联商品 </el-button>
              </template>
            </el-popconfirm>
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
    <DialogWrapper
        v-model="formVisible"
        title="选择关联商品"
        width="80%"
        @confirm="formVisible=false"
        @cancel="formVisible=false"
    >
      <ProductList
          :for-article="true"
          @onChoose="onProductId"
      />
    </DialogWrapper>
  </page-container>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {getArticleList, unRelation, deleteArticle, ArticleItem, ArticleListParams, relation} from '@/api/article'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import {Plus} from '@element-plus/icons-vue'
import ProductList from '@/views/product/List.vue'

const router = useRouter()
const list = ref<ArticleItem[]|null>() // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const formVisible = ref(false)
const listParams = reactive<ArticleListParams>({
  // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  pid: 0,
  title: ''
})
const cateId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const [_err, data] = await getArticleList(listParams).finally(() => {
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
  const [err] = await deleteArticle(id)
  if (!err)ElMessage.success('删除成功')
  await loadList()
}

const handleUpdate = (id: number) => {
  cateId.value = id
  router.push({
    name: 'article-add',
    query: {
      id
    }
  })
}
const doUnRelate = async (article: ArticleItem) => {
  if (article.product_id !== 0) {
    const [err] = await unRelation(article.id)
    if (!err)ElMessage.success('操作成功')
    await loadList()
  } else {
    formVisible.value = true
    cateId.value = article.id
  }
}

// 选中了要关联的文章 id
const onProductId = async (id:number) => {
  formVisible.value = false
  const [err] = await relation(cateId.value as number, {product_id: id})
  if (!err)ElMessage.success('操作成功')
  await loadList()
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
