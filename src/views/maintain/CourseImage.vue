<template>
  <div class="course-image">
    <el-progress
      v-if="isUploading"
      type="circle"
      :percentage="percentage"
      :width="178"
      :status="percentage === 100 ? 'success' : undefined"
    />
    <el-upload
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="handleUpload"
    >
      <img v-if="value" :src="value" class="avatar"  alt=""/>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { uploadImage } from '@/api/attachment'
import {ElMessage} from 'element-plus';

const props = defineProps({
  value: {
    type: String
  },
  limit: {
    type: Number,
    default: 2
  }
})
const isUploading = ref(false)
const percentage = ref(0)
interface EmitsType {
  (e: 'success'): void
}
const emit = defineEmits<EmitsType>()

const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < props.limit

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error(`上传头像图片大小不能超过 ${props.limit}MB!`)
  }
  return isJPG && isLt2M
}

const handleUpload = async (options: any) => {
    try {
      isUploading.value = true
      const fd = new FormData()
      fd.append('file', options.file)
      const [err, data] = await uploadImage(fd)
      if (!err) {
        isUploading.value = false
        percentage.value = 0
        console.log(data)
        emit('success')
      } else {
        ElMessage.error('上传失败')
      }
    } catch (err) {
      console.log(err)
    }
    isUploading.value = false
    percentage.value = 0
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
