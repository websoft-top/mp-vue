<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
<!--    <a-button type="primary" class="ele-btn-icon" @click="add">-->
<!--      <template #icon>-->
<!--        <PlusOutlined />-->
<!--      </template>-->
<!--      <span>添加</span>-->
<!--    </a-button>-->
    <a-radio-group v-model:value="where.type">
      <a-radio-button :value="0" @click="push(`/system/user-verify`)">个人</a-radio-button>
      <a-radio-button :value="1" @click="push(`/system/user-verify2`)">企业</a-radio-button>
    </a-radio-group>
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 240px"
      v-model:value="where.keywords"
      @search="reload"
    />
  </a-space>
</template>

<script lang="ts" setup>
  // import { PlusOutlined } from '@ant-design/icons-vue';
  import { watch } from 'vue';
  import useSearch from "@/utils/use-search";
  import {UserVerifyParam} from "@/api/system/userVerify/model";
  import {push} from "@/utils/common";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: UserVerifyParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const {where} = useSearch<UserVerifyParam>({
    id: undefined,
    type: undefined,
    keywords: '',
    userId: undefined
  });

  // 新增
  // const add = () => {
  //   emit('add');
  // };

  const reload = () => {
    emit('search', where);
  }

  watch(
    () => props.selection,
    () => {}
  );
</script>
