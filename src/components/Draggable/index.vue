<template>
  <div ref="draggableContainer">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import type { PropType } from 'vue'
import Sortable from 'sortablejs'

interface EmitType{
  (e:'update:model-value', value:any[]) : void
}
const emit = defineEmits<EmitType>()

const draggableContainer = ref<HTMLDivElement | null>(null)

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  // 参考：https://github.com/SortableJS/Sortable#options
  options: {
    type: Object as PropType<Sortable.Options>,
    default: () => {}
  }
})

const sortable = ref<Sortable | null>(null)

onMounted(() => {
  initDraggable()
})

const initDraggable = () => {
  if (!draggableContainer.value) {
    console.error('容器不能为空')
    return
  }
  sortable.value = Sortable.create(draggableContainer.value, {
    animation: 300,
    onUpdate (e:any) {
      if (e.oldIndex !== undefined && e.newIndex !== undefined) {
        // 删除拖拽的元素
        const tempList = props.modelValue.slice(0)
        const item = tempList.splice(e.oldIndex, 1)[0]
        // 把删除的元素放到新的位置
        tempList.splice(e.newIndex, 0, item)
        emit('update:model-value', tempList)
      }
    },
    ...props.options
  })
}

onUnmounted(() => {
  sortable.value?.destroy()
})
</script>

<style lang="scss" scoped>
:deep(.el-tag) {
  margin-right: 5px;
}
</style>
