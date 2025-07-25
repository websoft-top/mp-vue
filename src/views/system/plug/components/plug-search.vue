<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <!--    <a-radio-group :defaultValue="plugType" @change="handleTabs">-->
    <!--      <a-radio-button :value="0">插件市场</a-radio-button>-->
    <!--      <a-radio-button :value="10">我的插件</a-radio-button>-->
    <!--    </a-radio-group>-->
    <a-input-search
      allow-clear
      placeholder="请输入搜索关键词"
      v-model:value="searchText"
      @pressEnter="search"
      @search="search"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import useSearch from '@/utils/use-search';
  import type { CustomerParam } from '@/api/oa/customer/model';
  import { ref, watch } from 'vue';
  import { AppParam } from '@/api/oa/app/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: CustomerParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
  }>();

  // 表单数据
  const { where, resetFields } = useSearch<AppParam>({
    appId: undefined,
    userId: undefined,
    keywords: undefined,
    status: 0
  });
  // const plugType = ref<number>(0);
  // 搜索内容
  const searchText = ref(null);

  /* 搜索 */
  const search = () => {
    resetFields();
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    emit('search', where);
  };

  // const reload = () => {
  //   // 刷新当前路由
  //   emit('search', where);
  // };

  watch(
    () => props.selection,
    () => {}
  );
</script>
