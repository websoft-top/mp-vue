<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="openEdit()">
      <template #icon>
        <plus-outlined/>
      </template>
      <span>新建</span>
    </a-button>
    <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
      展开
    </a-button>
    <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
      折叠
    </a-button>
    <a-divider type="vertical"/>
    <a-radio-group v-model:value="position" @change="reload">
      <a-radio-button :value="1">顶部</a-radio-button>
      <a-radio-button :value="2">底部</a-radio-button>
      <a-radio-button :value="0">不限</a-radio-button>
    </a-radio-group>
    <a-divider type="vertical"/>
    <a-select
      v-model:value="where.model"
      style="width: 150px"
      placeholder="选择模型"
      @change="reload"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option :value="1">文章</a-select-option>
      <a-select-option :value="2">单页</a-select-option>
      <a-select-option :value="3">链接</a-select-option>
      <a-select-option :value="4">帮助</a-select-option>
      <a-select-option :value="5">关于</a-select-option>
    </a-select>
    <!-- 搜索表单 -->
    <a-input-search
      allow-clear
      v-model:value="searchText"
      placeholder="请输入搜索关键词"
      @search="reload"
      @pressEnter="reload"
    />
    <a-button
      type="text"
      @click="openUrl('/website/model')"
    >模型管理
    </a-button
    >
    <a-button type="text" class="ele-btn-icon" @click="clearSiteInfoCache">
      清除缓存
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {PlusOutlined} from '@ant-design/icons-vue';
import type {GradeParam} from '@/api/user/grade/model';
import {watch} from 'vue';
import {openUrl} from "@/utils/common";

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

// 新增
const add = () => {
  emit('add');
};

watch(
  () => props.selection,
  () => {
  }
);
</script>
