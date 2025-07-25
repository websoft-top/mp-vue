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
    <SelectData
      v-model:visible="showEdit"
      :data="current"
      :title="placeholder"
      :customer-type="customerType"
      :shopType="shopType"
      @done="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BulbOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';
  import SelectData from './components/select-data.vue';
  import { ShopMerchant } from '@/api/shop/shopMerchant/model';

 const props = withDefaults(
    defineProps<{
      value?: any;
      customerType?: string;
      placeholder?: string;
      shopType?: string;
    }>(),
    {
      placeholder: '请选择商户'
    }
  );

  const emit = defineEmits<{
    (e: 'done', ShopMerchant): void;
    (e: 'clear'): void;
  }>();

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  const content = ref<string>(props.value)
  // 当前编辑数据
  const current = ref<ShopMerchant | null>(null);

  /* 打开编辑弹窗 */
  const openEdit = (row?: ShopMerchant) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  const onChange = (row) => {
    emit('done', row);
  };
</script>
