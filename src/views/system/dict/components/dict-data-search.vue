<!-- 搜索表单 -->
<template>
  <a-row :gutter="16">
    <a-col :xl="6" :lg="8" :md="11" :sm="24" :xs="24">
      <a-input
        v-model:value.trim="where.keywords"
        placeholder="输入关键字搜索"
        allow-clear
      />
    </a-col>
    <a-col :xl="18" :lg="16" :md="13" :sm="24" :xs="24">
      <a-space :size="10" style="flex-wrap: wrap">
        <a-button type="primary" class="ele-btn-icon" @click="search">
          <template #icon>
            <SearchOutlined />
          </template>
          <span>查询</span>
        </a-button>
        <a-button type="primary" class="ele-btn-icon" @click="add">
          <template #icon>
            <PlusOutlined />
          </template>
          <span>新建</span>
        </a-button>
        <a-button danger type="primary" class="ele-btn-icon" @click="remove">
          <template #icon>
            <DeleteOutlined />
          </template>
          <span>删除</span>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import {
    PlusOutlined,
    DeleteOutlined,
    SearchOutlined
  } from '@ant-design/icons-vue';
  import useSearch from '@/utils/use-search';
  import type { DictDataParam } from '@/api/system/dict-data/model';

  const emit = defineEmits<{
    (e: 'search', where?: DictDataParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<DictDataParam>({
    keywords: ''
  });

  /* 搜索 */
  const search = () => {
    emit('search', where);
  };

  /* 添加 */
  const add = () => {
    emit('add');
  };

  /* 删除 */
  const remove = () => {
    emit('remove');
  };
</script>
