<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>发布插件</span>
    </a-button>
    <!--    <a-input-search-->
    <!--      allow-clear-->
    <!--      placeholder="请输入搜索关键词"-->
    <!--      v-model:value="searchText"-->
    <!--      @pressEnter="search"-->
    <!--      @search="search"-->
    <!--    />-->
  </a-space>
</template>

<script lang="ts" setup>
  import useSearch from '@/utils/use-search';
  import type { CustomerParam } from '@/api/oa/customer/model';
  import { computed, ref, watch } from 'vue';
  import { AppParam } from '@/api/app/model';
  import { useUserStore } from '@/store/modules/user';

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
  const plugType = ref<number>(0);
  // 搜索内容
  const searchText = ref(null);
  const userId = ref(0);

  /* 搜索 */
  const search = () => {
    resetFields();
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    emit('search', where);
  };

  // 新增
  const add = () => {
    emit('add');
  };

  // 批量删除
  const removeBatch = () => {
    emit('remove');
  };

  const handleTabs = (e) => {
    const index = Number(e.target.value);
    const userStore = useUserStore();
    const loginUser = computed(() => userStore.info ?? {});
    plugType.value = index;
    if (index > 0) {
      userId.value = Number(loginUser.value.userId);
      where.status = undefined;
      where.userId = Number(loginUser.value.userId);
    }
    if (index == 0) {
      where.userId = undefined;
      where.status = 20;
    }
    search();
  };

  const reload = () => {
    // 刷新当前路由
    emit('search', where);
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
