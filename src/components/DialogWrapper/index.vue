<template>
  <el-dialog
      ref="dialog"
      :before-close="handleDialogClosed"
      destroy-on-close
      @open="onDialogOpen"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
   <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelClick">Cancel</el-button>
        <el-button type="primary" @click=" emit('confirm')"
        >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type {ElDialog} from 'element-plus'
import {ref} from 'vue';

interface EmitsType {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
}

const emit = defineEmits<EmitsType>()

const onDialogOpen = () => {
  emit('open')
}
const dialog = ref<typeof ElDialog|null>(null)
const handleDialogClosed = (done:()=>void) => {
  emit('cancel')
  done()
}
const onCancelClick = () => {
  if (dialog.value !== null) {
    console.log(dialog.value)
    dialog.value.visible = false
  }
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
