<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import useSearch from "@/utils/use-search";
  import { watch } from 'vue';
  import {BszxGradeParam} from "@/api/bszx/bszxGrade/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: BszxGradeParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const {where} = useSearch<BszxGradeParam>({
    branch: undefined,
    keywords: ''
  });

  // 新增
  const add = () => {
    emit('add');
  };

  const handleSearch = () => {
    emit('search', where);
  }
  watch(
    () => props.selection,
    () => {}
  );
</script>
