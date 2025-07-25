<!-- 选择下拉框 -->
<template>
  <a-select
    :allow-clear="true"
    :show-search="true"
    optionFilterProp="label"
    :options="options"
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    :style="`width: 200px`"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { SelectProps } from 'ant-design-vue';

  const emit = defineEmits<{
    (e: 'update:value', value: string, item: any): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: any;
      type?: any;
      placeholder?: string;
      dictCode?: string;
    }>(),
    {
      placeholder: '请选择支付方式'
    }
  );

  // 字典数据
  const options = ref<SelectProps['options']>([
    {
      value: 0,
      label: '余额支付',
      key: 'balancePay',
      icon: 'PayCircleOutlined'
    },
    { value: 1, label: '微信支付', key: 'wxPay', icon: 'WechatOutlined' },
    {
      value: 2,
      label: '会员卡支付',
      key: 'userCardPay',
      icon: 'IdcardOutlined'
    },
    {
      value: 3,
      label: '支付宝支付',
      key: 'aliPay',
      icon: 'AlipayCircleOutlined'
    },
    {
      value: 4,
      label: '现金支付',
      key: 'cashPayment',
      icon: 'PayCircleOutlined'
    }
  ]);

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    const item = options.value?.find((d) => d.value == value);
    console.log(item);
    emit('update:value', value, item);
  };
  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
