<template>
  <div>
    <a-input-group compact>
      <a-input
        disabled
        style="width: calc(100% - 32px)"
        v-model:value="content"
        :placeholder="placeholder"
      />
      <a-button @click="openEdit">
        <template #icon><BulbOutlined class="ele-text-warning" /></template>
      </a-button>
    </a-input-group>
    <!-- 选择弹窗 -->
    <select-data
      v-model:visible="showEdit"
      :data="current"
      :dictCode="dictCode"
      :title="placeholder"
      @done="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BulbOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import SelectData from './components/select-data.vue';
  import { Dict } from '@/api/system/dict/model';

  const props = withDefaults(
    defineProps<{
      value?: any;
      placeholder?: string;
      index?: number;
      dictCode?: string;
    }>(),
    {
      placeholder: '请选择字典'
    }
  );

  const emit = defineEmits<{
    (e: 'done', Dict): void;
    (e: 'clear'): void;
  }>();

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 当前编辑数据
  const current = ref<Dict | null>(null);
  const content = ref<any>(props.value);

  /* 打开编辑弹窗 */
  const openEdit = (row?: Dict) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  const onChange = (row) => {
    row.index = Number(props.index);
    emit('done', content.value);
  };
  // 查询租户列表
  // const appList = ref<App[] | undefined>([]);
</script>
