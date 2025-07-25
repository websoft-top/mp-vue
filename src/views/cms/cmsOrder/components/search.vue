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
      <a-select-option :value="2">未付款</a-select-option>
    </a-select>
    <a-select
      v-model:value="where.orderStatus"
      style="width: 150px"
      placeholder="订单状态"
      @change="search"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option :value="1">已完成</a-select-option>
      <a-select-option :value="2">未使用</a-select-option>
      <a-select-option :value="3">已取消</a-select-option>
      <a-select-option :value="4">退款中</a-select-option>
      <a-select-option :value="5">退款被拒</a-select-option>
      <a-select-option :value="6">退款成功</a-select-option>
    </a-select>
    <a-select
      v-model:value="where.payType"
      style="width: 150px"
      placeholder="付款方式"
      @change="search"
    >
      <a-select-option value="">全部</a-select-option>
      <a-select-option :value="1">微信支付</a-select-option>
      <a-select-option :value="2">余额支付</a-select-option>
      <a-select-option :value="3">支付宝</a-select-option>
      <a-select-option :value="4">现金</a-select-option>
      <a-select-option :value="5">POS机</a-select-option>
<!--      <a-select-option :value="6">VIP月卡</a-select-option>-->
<!--      <a-select-option :value="7">VIP年卡</a-select-option>-->
<!--      <a-select-option :value="8">VIP次卡</a-select-option>-->
<!--      <a-select-option :value="9">IC月卡</a-select-option>-->
<!--      <a-select-option :value="10">IC年卡</a-select-option>-->
<!--      <a-select-option :value="11">IC次卡</a-select-option>-->
      <a-select-option :value="12">免费</a-select-option>
<!--      <a-select-option :value="13">VIP充值卡</a-select-option>-->
<!--      <a-select-option :value="14">IC充值卡</a-select-option>-->
<!--      <a-select-option :value="15">积分支付</a-select-option>-->
<!--      <a-select-option :value="16">VIP季卡</a-select-option>-->
<!--      <a-select-option :value="17">IC季卡</a-select-option>-->
    </a-select>
    <a-select
      v-model:value="where.isInvoice"
      style="width: 150px"
      placeholder="开票状态"
      @change="search"
    >
      <a-select-option value="1">已开票</a-select-option>
      <a-select-option :value="2">未开票</a-select-option>
      <a-select-option :value="3">不能开票</a-select-option>
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
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';
  import useSearch from "@/utils/use-search";
  import {listBszxPay} from "@/api/bszx/bszxPay";
  import {ShopOrder, ShopOrderParam} from "@/api/shop/shopOrder/model";

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
        '客户姓名',
        '手机号码',
        '实付金额',
        '支付方式',
        '付款时间',
        '下单时间'
      ]
    ];

    // 按搜索结果导出
    where.sceneType = 'Content';
    await listBszxPay(where)
      .then((list) => {
        orders.value = list;
        list?.forEach((d: ShopOrder) => {
          array.push([
            `${d.orderNo}`,
            `${d.comments}`,
            `${d.realName}`,
            `${d.phone}`,
            `${d.payPrice}`,
            `${d.payType}`,
            `${d.payTime}`,
            `${d.createTime}`
          ]);
        });
        const sheetName = `导出订单记录${dayjs(new Date()).format('YYYYMMDD')}`;
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
