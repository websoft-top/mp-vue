<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap;">
    <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { watch } from 'vue';
  import {CmsModelParam} from "@/api/cms/cmsModel/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: CmsModelParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  const websiteId = localStorage.getItem('WebsiteId')

  // 新增
  const add = () => {
    emit('add');
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
