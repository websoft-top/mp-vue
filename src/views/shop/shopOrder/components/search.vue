<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-select
      v-model:value="where.payStatus"
      style="width: 150px"
      placeholder="付款状态"
      @change="search"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option :value="1">已付款</a-select-option>
      <a-select-option :value="0">未付款</a-select-option>
    </a-select>
    <a-select
      v-model:value="where.orderStatus"
      style="width: 150px"
      placeholder="订单状态"
      @change="search"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option :value="1">已完成</a-select-option>
      <a-select-option :value="0">未完成</a-select-option>
      <a-select-option :value="2">未使用</a-select-option>
      <a-select-option :value="3">已取消</a-select-option>
      <a-select-option :value="4">退款中</a-select-option>
      <a-select-option :value="5">退款被拒</a-select-option>
      <a-select-option :value="6">退款成功</a-select-option>
    </a-select>
    <a-select
      :options="getPayType()"
      v-model:value="where.payType"
      style="width: 150px"
      placeholder="付款方式"
      @change="search"
    />
    <a-select
      v-model:value="where.isInvoice"
      style="width: 150px"
      placeholder="开票状态"
      @change="search"
    >
      <a-select-option :value="1">已开票</a-select-option>
      <a-select-option :value="0">未开票</a-select-option>
      <a-select-option :value="2">不能开票</a-select-option>
    </a-select>
    <a-range-picker
      v-model:value="dateRange"
      @change="search"
      value-format="YYYY-MM-DD"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 280px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button @click="reset">重置</a-button>
    <a-button @click="handleExport">导出</a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { utils, writeFile } from 'xlsx';
  import { message } from 'ant-design-vue';
  import useSearch from "@/utils/use-search";
  import {ShopOrder, ShopOrderParam} from "@/api/shop/shopOrder/model";
  import {listShopOrder} from "@/api/shop/shopOrder";
  import {getPayType} from "@/utils/shop";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: ShopOrderParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where, resetFields } = useSearch<ShopOrderParam>({
    keywords: '',
    orderId: undefined,
    orderNo: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
    userId: undefined,
    phone: undefined,
    payStatus: undefined,
    orderStatus: undefined,
    payType: undefined,
    isInvoice: undefined,
  });

  const reload = () => {
    emit('search', where);
  };

  /* 搜索 */
  const search = () => {
    const [d1, d2] = dateRange.value ?? [];
    xlsFileName.value = `${d1}至${d2}`;
    where.createTimeStart = d1 ? d1 + ' 00:00:00' : undefined;
    where.createTimeEnd = d2 ? d2 + ' 23:59:59' : undefined;
    emit('search', {
      ...where
    });
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };

  const dateRange = ref<[string, string]>(['', '']);
  // 变量
  const loading = ref(false);
  const orders = ref<ShopOrder[]>([])
  const xlsFileName = ref<string>();

  // 导出
  const handleExport = async () => {
    loading.value = true;
    const array: (string | number)[][] = [
      [
        '订单编号',
        '订单标题',
        '买家姓名',
        '手机号码',
        '实付金额(元)',
        '支付方式',
        '付款时间',
        '下单时间'
      ]
    ];

    await listShopOrder(where)
      .then((list) => {
        orders.value = list;
        list?.forEach((d: ShopOrder) => {
          array.push([
            `${d.orderNo}`,
            `${d.comments}`,
            `${d.realName}`,
            `${d.phone}`,
            `${d.payPrice}`,
            `${getPayType(d.payType)}`,
            `${d.payTime || ''}`,
            `${d.createTime}`
          ]);
        });
        const sheetName = `订单数据`;
        const workbook = {
          SheetNames: [sheetName],
          Sheets: {}
        };
        const sheet = utils.aoa_to_sheet(array);
        workbook.Sheets[sheetName] = sheet;
        // 设置列宽
        sheet['!cols'] = [
          { wch: 10 },
          { wch: 40 },
          { wch: 20 },
          { wch: 20 },
          { wch: 60 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
          { wch: 20 },
          { wch: 10 },
          { wch: 20 }
        ];
        message.loading('正在导出...');
        setTimeout(() => {
          writeFile(
            workbook,
            `${
              where.createTimeEnd ? xlsFileName.value + '_' : ''
            }${sheetName}.xlsx`
          );
          loading.value = false;
        }, 1000);
      })
      .catch((msg) => {
        message.error(msg);
        loading.value = false;
      })
      .finally(() => {});

  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
