<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-input-search
      placeholder="请输入GPS编号"
      style="width: 280px"
      :disabled="gpsNo"
      v-model:value="where.keywords"
      @search="reload"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import type { HjmGpsLogParam } from '@/api/hjm/hjmGpsLog/model';
  import { watch } from 'vue';
  import useSearch from "@/utils/use-search";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      gpsNo?: string;
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: HjmGpsLogParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<HjmGpsLogParam>({
    id: undefined,
    keywords: props.gpsNo,
    userId: undefined
  });

  const reload = () => {
    console.log(where,props.gpsNo)
    emit('search', where);
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
