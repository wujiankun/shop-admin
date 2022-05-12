<template>
  <page-container>
    <el-card>
      <template #header>
        <el-button @click="$router.back()" :icon="Back">返回 </el-button>
      </template>
      <el-form ref="form" :model="article" :rules="formRules" inline>
        <div class="section-title"><span>文章信息</span></div>
        <el-form-item label="标题" prop="title" >
          <el-input v-model="article.title" />
        </el-form-item>
        <el-form-item label="作者" prop="author" >
          <el-input v-model="article.author" />
        </el-form-item>
        <el-form-item label="文章分类"  prop="cid" >
          <el-select v-model="article.cid">
            <el-option label="全部" :value="0" />
            <el-option label="营销" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章简介" >
          <el-input  type="textarea" autosize v-model="article.synopsis" />
        </el-form-item>
        <el-form-item label="文章封面" >
          <el-button v-if="article.image_input.length<1" @click="formVisible=true">添加图片</el-button>
          <el-image v-else :src="article.image_input[0]" style="width: 100px"/>
        </el-form-item>
        <div class="section-title"><span>文章内容</span></div>
        <el-form-item label=""  prop="content" >
          <app-text-editor v-model="article.content" />
        </el-form-item>
        <div class="section-title"  ><span>其它设置</span></div>
        <el-form-item label="热门文章">
          <el-radio-group v-model="article.is_hot">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" > 保存 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <DialogWrapper title="上传图片" v-model="formVisible" >
      <FileList @onChoose="onImageChoose" forChoose/>
    </DialogWrapper>
  </page-container>
</template>

<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue'
import {onMounted, ref } from 'vue'
import {ArticleItem, getArticleById, postArticle} from '@/api/article'
import type { TElForm } from '@/types/element-plus'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router';
import FileList from '@/views/maintain/Attachment.vue'

const formVisible = ref(false)
const article = ref<Partial<ArticleItem>>({
  title: '', author: '', synopsis: '', content: '', image_input: [], cid: 0, is_hot: 0
})

const onImageChoose = (url:any) => {
  article.value.image_input?.push(url)
  formVisible.value = false
}

const formRules = ref({
  title: [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  cid: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入', trigger: 'blur' }
  ]
})
const form = ref<TElForm | null>(null)
const router = useRouter()
onMounted(async () => {
  console.log('route', router.currentRoute.value)
  const id = router.currentRoute.value.query.id
  if (id) {
    const [err, data] = await getArticleById(id)
    if (err) {
      ElMessage.error(err)
    }
    article.value = (data as any).info
  }
})

const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) return false
  const [err] = await postArticle(article.value)
  if (!err) {
    ElMessage.success('保存成功')
    router.back()
  }
}

</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  overflow: hidden;
}
.section-title{
  border-bottom: 1px solid rgba(0,0,0,.09);
  margin-bottom: 25px;
  span{
    display: inline-block;
    border-bottom: 2px solid #1890ff;
    padding: 0 8px 12px 5px;
    color: #000;
    font-size: 14px;
  }
}

:deep(.el-space) {
  max-width: 100%;
  .el-space__item {
    max-width: 100%;
  }
}
</style>
