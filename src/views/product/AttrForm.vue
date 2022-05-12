<template>
  <DialogWrapper
    :title="props.ruleId ? '编辑规格' : '添加规格'"
    @confirm="handleSubmit"
    @cancel="handleDialogClosed"
    @open="handleDialogOpen"
  >
    <el-form size="default"
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="规格模板" prop="rule_name">
        <el-input v-model="formData.rule_name" placeholder="请输入规格模板名称" />
      </el-form-item>
      <el-form-item v-for="(sp,index) in formData.spec" :key="sp.rule_name">
        <div>
          <p style="display: block">
            <el-tag closable effect="dark" @close="formData.spec.splice(index, 1)" >
              {{ sp.value}}
            </el-tag>
          </p>
          <p style="display: flex;align-items: center">
            <el-tag closable v-for="(d, idx) in sp.detail" @close="sp.detail.splice(idx, 1)" :key="d" style="margin-right: 10px">
              {{ d }}
            </el-tag>
            <el-input v-model="sp.tempDetail" style="width: 80px;margin-right: 10px"/>
            <el-button type="primary" @click="handleAddNewAttr(sp)" > Add New</el-button>
          </p>
        </div>
      </el-form-item>
      <el-form-item v-if="!isAdd">
        <el-button  type="primary"  @click="isAdd = true" > 添加新规格 </el-button>
      </el-form-item>
      <el-form-item v-else style="border-top: 1px solid mediumseagreen;padding-top: 8px">
        <el-form :model="attrForm" inline >
          <el-form-item label="规格名称" prop="value" >
            <el-input v-model="attrForm.value" style="width: 100px"/>
          </el-form-item>
          <el-form-item label="规格值"  prop="detail" >
            <el-input v-model="attrForm.detail[0]"  style="width: 100px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddAttr" > 确认 </el-button>
            <el-button @click="isAdd = false">  取消 </el-button>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
  </DialogWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import type { TElForm, IFormRule } from '@/types/element-plus'
import { ElMessage } from 'element-plus'
import { getRuleById, updateRules} from '@/api/rule';

const props = defineProps({
  ruleId: {
    // 编辑的管理员 ID
    type: Number as PropType<number | null>,
    default: null
  }
})

interface EmitsType {
  (e: 'update:rule-id', value: number | null): void
  (e: 'success'): void
}

const emit = defineEmits<EmitsType>()

const isAdd = ref(false)

const form = ref<TElForm | null>(null)
const formLoading = ref(false)
// data: { rule_name:string, spec:{value:string, detail:string[]}[] }
const formData = ref({
  rule_name: '',
  spec: [] as any[]
})
const attrForm = ref({
  value: '',
  detail: [] as string[],
  tempDetail: ''
})
const handleAddAttr = () => {
  if (attrForm.value.value) {
    formData.value.spec.push(JSON.parse(JSON.stringify(attrForm.value)))
    isAdd.value = false
    attrForm.value.value = ''
    attrForm.value.detail = []
  } else {
    ElMessage.warning('请指定规格名称')
  }
}

const handleAddNewAttr = (sp: {value:string, detail:string[], tempDetail:string}) => {
  if (sp.tempDetail) {
    sp.detail.push(JSON.parse(JSON.stringify(sp.tempDetail)))
    sp.tempDetail = ''
  } else {
    ElMessage.warning('请填写具体规格')
  }
}

const formRules: IFormRule = {
  rule_name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }]
}

const handleDialogOpen = async () => {
  formLoading.value = true
  if (props.ruleId) {
    const [err, rule] = await getRuleById(props.ruleId)
    if (!err) {
      formData.value = (rule as any).info as any
    }
  }
  formLoading.value = false
}

const handleDialogClosed = () => {
  emit('update:rule-id', null)
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
  formData.value = {
    rule_name: '',
    spec: [] as any[]
  }
}

const handleSubmit = async () => {
  const valid = await form.value?.validate()
  if (!valid) {
    return
  }
  console.log(formData.value, props.ruleId)
  const [err] = await updateRules(formData.value!, props.ruleId || 0)
  if (!err) {
    emit('success')
    ElMessage.success('保存成功')
  } else {
    console.log(err)
    ElMessage.success(err)
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.no-flex .el-form-item__content{
  display: block;
}
.el-tree {
  height: 250px;
  overflow: auto;
}
</style>
