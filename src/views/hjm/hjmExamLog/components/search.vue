<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-range-picker
      v-model:value="dateRange"
      @change="search"
      value-format="YYYY-MM-DD"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { watch } from 'vue';
  import useSearch from "@/utils/use-search";
  import {HjmExamLogParam} from "@/api/hjm/hjmExamLog/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  // 表单数据
  const {where} = useSearch<HjmExamLogParam>({
    id: undefined,
    keywords: '',
    status: undefined
  });

  const emit = defineEmits<{
    (e: 'search', where?: HjmExamLogParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 新增
  const add = () => {
    emit('add');
  };

  const reload = () => {
    emit('search', where);
  }

  watch(
    () => props.selection,
    () => {}
  );
</script>
