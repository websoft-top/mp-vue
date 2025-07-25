<!-- 搜索表单 -->
<template>
  <div style="display: flex; justify-content: space-between">
    <a-space style="flex-wrap: wrap">
      <!--      <a-button type="primary" class="ele-btn-icon" @click="add">-->
      <!--        <template #icon>-->
      <!--          <PlusOutlined />-->
      <!--        </template>-->
      <!--        <span>添加订单</span>-->
      <!--      </a-button>-->
      <a-button
        danger
        type="primary"
        class="ele-btn-icon"
        v-if="selection?.length > 0"
        @click="removeBatch"
      >
        <template #icon>
          <DeleteOutlined />
        </template>
        <span>批量删除</span>
      </a-button>
    </a-space>
    <a-space :size="10" style="flex-wrap: wrap; margin-right: 20px">
      <a-input-search
        allow-clear
        placeholder="请输入关键词"
        v-model:value="searchText"
        @pressEnter="search"
        @search="search"
      />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import useSearch from '@/utils/use-search';
  import { ref, watch } from 'vue';
  import { CompanyParam } from '@/api/system/company/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: CompanyParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'update', status?: number): void;
    (e: 'import'): void;
  }>();

  // 表单数据
  const { where, resetFields } = useSearch<CompanyParam>({
    companyId: undefined,
    companyName: undefined,
    keywords: '',
    authentication: undefined,
    version: undefined,
    province: '',
    city: '',
    region: ''
  });
  const tenantId = ref<number>();
  if (localStorage.getItem('TenantId')) {
    tenantId.value = Number(localStorage.getItem('TenantId'));
  }

  // 搜索内容
  const searchText = ref('');

  // 新增
  const add = () => {
    emit('add');
  };

  /* 搜索 */
  const search = () => {
    emit('search', {
      ...where
    });
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };

  // 批量删除
  const removeBatch = () => {
    emit('remove');
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
