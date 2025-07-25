<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button
      type="primary"
      class="ele-btn-icon"
      @click="add"
      v-any-role="['superAdmin', 'merchant']"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      <span>发消息</span>
    </a-button>
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      v-model:value="where.keywords"
      @pressEnter="search"
      @search="search"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { GradeParam } from '@/api/user/grade/model';
  import { watch } from 'vue';
  import useSearch from '@/utils/use-search';
  import { ChatMessageParam } from '@/api/system/chat/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: GradeParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<ChatMessageParam>({
    keywords: '',
    formUserId: undefined
  });

  /* 搜索 */
  const search = () => {
    emit('search', {
      ...where
    });
  };

  // 新增
  const add = () => {
    emit('add');
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
