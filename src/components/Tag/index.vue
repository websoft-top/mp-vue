<template>
  <template v-for="(item, index) in data" :key="index">
    <a-tag v-if="item.value == value" :color="item.comments">
      {{ item.label }}
    </a-tag>
  </template>
</template>

<script lang="ts" setup>
  import { getDictionaryOptions } from '@/utils/common';

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      dictCode?: string;
    }>(),
    {
      placeholder: undefined
    }
  );

  // 字典数据
  const data = getDictionaryOptions(props.dictCode);
</script>
