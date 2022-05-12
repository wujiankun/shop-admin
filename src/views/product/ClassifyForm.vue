<template>
  <DialogWrapper
    :title="props.cateId ? '编辑分类' : '添加分类'"
    @confirm="handleSubmit"
    @cancel="handleDialogClosed"
    @open="handleDialogOpen"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="父级">
        <el-select prop="pid" v-model="formData.pid">
          <el-option v-for="p in parentCategory" :key="p.id"
                     :label="p.cate_name"
                     :value="p.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formData.cate_name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入 sort" type="number"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="1"> 显示 </el-radio>
          <el-radio :label="0"> 隐藏 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </DialogWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import {Category, CategoryForEdit} from '@/api/types/product-category';
import {addCategory, editCategory, getCategories, getCategoryById} from '@/api/product-category';
import {TElForm} from '@/types/element-plus';

const props = defineProps({
  cateId: {
    // 编辑的管理员 ID
    type: Number as PropType<number | null>,
    default: null
  }
})

interface EmitsType {
  (e: 'update:cate-id', value: number | null): void
  (e: 'success'): void
}

const emit = defineEmits<EmitsType>()

const form = ref<TElForm|null>(null)
const parentCategory = ref<Category[]>()
const formLoading = ref(false)
const formData = ref<CategoryForEdit>({
  pid: 0,
  cate_name: '',
  sort: 0,
  pic: '',
  is_show: 0
})
const formRules = ref({
  cate_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
})

const handleDialogOpen = async () => {
  formLoading.value = true
  const [_err, listData] = await getCategories({limit: 100}, 0)
  console.log(_err, listData)
  if (!_err) {
    parentCategory.value = listData.list
  }
  if (props.cateId) {
    const [err, data] = await getCategoryById(props.cateId)
    if (!err) {
      formRules.value = (data as any).rules
    }
  }
  formLoading.value = false
}
const handleDialogClosed = () => {
  emit('update:cate-id', null)
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
}

const handleSubmit = async () => {
  try {
    await form.value?.validate()
  } catch (e) {
    return console.log(e)
  }
  const [err] = !props.cateId
  ? await addCategory(formData.value!)
      : await editCategory(props.cateId!, formData.value!)
  if (!err) {
    emit('success')
    ElMessage.success('保存成功')
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.el-tree {
  height: 250px;
  overflow: auto;
}
</style>
