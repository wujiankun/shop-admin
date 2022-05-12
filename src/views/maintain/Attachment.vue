<template>
  <page-container>
    <el-card>
      <!-- <template #header> 数据筛选 </template> -->
      <el-form inline ref="form" :model="listParams" :disabled="listLoading" @submit.prevent="handleQuery" >
        <el-form-item label="类型">
        <!-- 0编辑器,1产品图片,2拼团图片,3砍价图片,4秒杀图片,5文章图片,6组合数据图-->
          <el-select v-model="listParams.pid" placeholder="请选择" clearable>
            <el-option :label="item" :value="idx" v-for="(item, idx) in ImageType" :key="item"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <el-button type="primary" @click="formVisible = true"> 上传图片 </el-button>
      </template>
      <vxe-table
          :data="list"
          row-id="id"
          :tree-config="{ children: 'children' }"
          v-loading="listLoading">
        <vxe-column field="att_id" title="ID" />
        <vxe-column title="选择"  width="100" v-if="props.forChoose">
          <template #default="{row}">
            <el-button type="primary" @click="emit('onChoose',row.att_dir)" >选我</el-button>
          </template>
        </vxe-column>
        <vxe-column field="real_name" title="原始名称" tree-node />
<!--        <vxe-column title="预览-大">
          <template #default="{ row }">
            <el-image :src="row.att_dir"></el-image>
          </template>
        </vxe-column>-->
        <vxe-column title="预览-缩略">
          <template #default="{ row }">
            <el-image :src="row.satt_dir" style="height: 80px"></el-image>
          </template>
        </vxe-column>
<!--        <vxe-column field="attr_size" title="大小" />
        <vxe-column field="attr_type" title="文件类型" />-->
        <vxe-column title="分类" >
          <template #default="{ row }">
            {{ImageType[row.pid]}}
          </template>
        </vxe-column>
        <vxe-column title="操作" min-width="100">
          <template #default="scope">
            <el-button type="text" @click="handleUpdate(scope.row)"> 编辑名称 </el-button>
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row.att_id)">
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
  <DialogWrapper title="上传图片" v-model="formVisible" >
    <course-image @success="handleFormSuccess"/>
  </DialogWrapper>
  <el-dialog v-model="updateDialogShow" destroy-on-close :close-on-click-modal="false" :close-on-press-escape="false" >
    <el-form ref="updateNameForm" :model="updateNameFormData"
             :rules="{real_name:[[{ required: true, message: '请输入名称', trigger: 'blur' }]]}" >
      <el-form-item label="名称" prop="role_name">
        <el-input v-model="updateNameFormData.real_name" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialogShow = false">Cancel</el-button>
        <el-button type="primary" @click="onUpdateName" >Confirm</el-button >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {getAttachList, ImageType, updateAttachInfo, deleteAttach, ParamType} from '@/api/attachment'
import { ElMessage } from 'element-plus'
import CourseImage from './CourseImage.vue'
import {TElForm} from '@/types/element-plus';

const list = ref() // 列表数据
const listCount = ref(0)
const listLoading = ref(true)
const listParams = reactive<ParamType>({
  // 列表数据查询参数
  page: 1, // 当前页码
  limit: 10, // 每页大小
  pid: undefined
})
const props = defineProps({
  forChoose: {
    type: Boolean,
    default: false,
    required: false
  }
})
interface EmitsType {
  (e: 'onChoose', value: number): void
}
const emit = defineEmits<EmitsType>()
const formVisible = ref(false)
const updateDialogShow = ref(false)
const cateId = ref<number | null>(null)

onMounted(() => {
  loadList()
})

const loadList = async () => {
  listLoading.value = true
  const [_err, data] = await getAttachList(listParams).finally(() => {
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

const handleDelete = async (id: string) => {
  const [err] = await deleteAttach({ids: id})
  if (!err)ElMessage.success('删除成功')
  await loadList()
}
const updateNameForm = ref<TElForm | null>(null)
const updateNameFormData = ref({
  real_name: ''
})
const handleUpdate = (row:any) => {
  cateId.value = row.att_id
  updateNameFormData.value.real_name = row.real_name
  updateDialogShow.value = true
}
const onUpdateName = async () => {
  const valid = await updateNameForm.value?.validate()
  if (!valid) {
    return
  }
  const [err] = await updateAttachInfo(updateNameFormData.value, cateId.value!)
  if (!err) {
    ElMessage.success('操作成功')
    updateDialogShow.value = false
    await loadList()
  }
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
