<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="`80%`"
    :visible="visible"
    :confirm-loading="loading"
    :maxable="maxAble"
    :title="isUpdate ? '编辑订单' : '订单详情'"
    :body-style="{ paddingBottom: '8px', background: '#f3f3f3' }"
    @update:visible="updateVisible"
    :maskClosable="false"
    :footer="null"
    @ok="save"
  >
    <a-card style="margin-bottom: 20px" :bordered="false">
      <a-descriptions :column="3">
        <!-- 第一排-->
        <a-descriptions-item
          label="订单编号"
          span="3"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <span @click="copyText(form.orderNo)">{{ form.orderNo }}</span>
        </a-descriptions-item>
        <!-- 第二排-->
        <a-descriptions-item
          label="买家信息"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-space class="flex items-center">
            <a-avatar :src="form.avatar" size="small"/>
            {{ form.realName }}
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item
          label="订单金额"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          ￥{{ form.totalPrice }}
        </a-descriptions-item>
        <a-descriptions-item
          label="订单状态"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tag v-if="form.orderStatus === 0">未完成</a-tag>
          <a-tag v-if="form.orderStatus === 1" color="green">已完成</a-tag>
          <a-tag v-if="form.orderStatus === 2" color="red">已取消</a-tag>
          <a-tag v-if="form.orderStatus === 3" color="red">取消中</a-tag>
          <a-tag v-if="form.orderStatus === 4" color="red">退款申请中</a-tag>
          <a-tag v-if="form.orderStatus === 5" color="red">退款被拒绝</a-tag>
          <a-tag v-if="form.orderStatus === 6" color="orange">退款成功</a-tag>
          <a-tag v-if="form.orderStatus === 7" color="pink">客户端申请退款</a-tag>
        </a-descriptions-item>
        <!-- 第三排-->
        <a-descriptions-item
          label="手机号码"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          {{ form.phone }}
        </a-descriptions-item>
        <a-descriptions-item
          label="实付金额"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          ￥{{ form.payPrice }}
        </a-descriptions-item>
        <a-descriptions-item
          label="支付状态"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tag v-if="form.payStatus == 1" color="green">已付款</a-tag>
          <a-tag v-if="form.payStatus == 0">未付款</a-tag>
          <a-tag v-if="form.payStatus == 3">未付款,占场中</a-tag>
        </a-descriptions-item>
        <!-- 第四排-->
        <a-descriptions-item
          label="收货地址"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          {{ form.address }}
        </a-descriptions-item>
        <a-descriptions-item
          label="减少的金额"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          ￥{{ form.reducePrice }}
        </a-descriptions-item>
        <a-descriptions-item
          label="核销状态"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tag v-if="form.deliveryStatus == 10">未核销</a-tag>
          <a-tag v-if="form.deliveryStatus == 20" color="green">已核销</a-tag>
          <a-tag v-if="form.deliveryStatus == 30" color="bule">部分核销</a-tag>
        </a-descriptions-item>
        <!-- 第五排-->
        <a-descriptions-item
          label="备注信息"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          {{ form.comments }}
        </a-descriptions-item>
        <a-descriptions-item
          label="支付方式"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tooltip :title="`支付时间：${form.payTime || ''}`">
            <template v-if="form.payStatus == 1">
              <a-tag v-if="form.payType == 0">余额支付</a-tag>
              <a-tag v-if="form.payType == 1">
                <WechatOutlined class="tag-icon"/>
                微信支付
              </a-tag>
              <a-tag v-if="form.payType == 2">积分</a-tag>
              <a-tag v-if="form.payType == 3">
                <AlipayCircleOutlined class="tag-icon"/>
                支付宝
              </a-tag>
              <a-tag v-if="form.payType == 4">
                <IdcardOutlined class="tag-icon"/>
                现金
              </a-tag>
              <a-tag v-if="form.payType == 5">
                <IdcardOutlined class="tag-icon"/>
                POS机
              </a-tag>
              <a-tag v-if="form.payType == 6">
                <IdcardOutlined class="tag-icon"/>
                VIP月卡
              </a-tag>
              <a-tag v-if="form.payType == 7">
                <IdcardOutlined class="tag-icon"/>
                VIP年卡
              </a-tag>
              <a-tag v-if="form.payType == 8">
                <IdcardOutlined class="tag-icon"/>
                VIP次卡
              </a-tag>
              <a-tag v-if="form.payType == 9">
                <IdcardOutlined class="tag-icon"/>
                IC月卡
              </a-tag>
              <a-tag v-if="form.payType == 10">
                <IdcardOutlined class="tag-icon"/>
                IC年卡
              </a-tag>
              <a-tag v-if="form.payType == 11">
                <IdcardOutlined class="tag-icon"/>
                IC次卡
              </a-tag>
              <a-tag v-if="form.payType == 12">
                <IdcardOutlined class="tag-icon"/>
                免费
              </a-tag>
              <a-tag v-if="form.payType == 13">
                <IdcardOutlined class="tag-icon"/>
                VIP充值卡
              </a-tag>
              <a-tag v-if="form.payType == 14">
                <IdcardOutlined class="tag-icon"/>
                IC充值卡
              </a-tag>
              <a-tag v-if="form.payType == 15">
                <IdcardOutlined class="tag-icon"/>
                积分支付
              </a-tag>
              <a-tag v-if="form.payType == 16">
                <IdcardOutlined class="tag-icon"/>
                VIP季卡
              </a-tag>
              <a-tag v-if="form.payType == 17">
                <IdcardOutlined class="tag-icon"/>
                IC季卡
              </a-tag>
            </template>
          </a-tooltip>
        </a-descriptions-item>
        <a-descriptions-item
          label="开票状态"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tag v-if="form.isInvoice == 0">未开具</a-tag>
          <a-tag v-if="form.isInvoice == 1" color="green">已开具</a-tag>
          <a-tag v-if="form.isInvoice == 2" color="blue">不能开具</a-tag>
        </a-descriptions-item>
        <!-- 第六排-->
        <a-descriptions-item
          label="下单时间"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          {{ toDateString(form.createTime, 'yyyy-MM-dd HH:mm') }}
        </a-descriptions-item>
        <a-descriptions-item
          label="交易流水号"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tooltip :title="form.payTime">{{ form.transactionId }}</a-tooltip>
        </a-descriptions-item>
        <a-descriptions-item
          label="结算状态"
          :labelStyle="{ width: '90px', color: '#808080' }"
        >
          <a-tag v-if="form.isSettled == 0">未结算</a-tag>
          <a-tag v-if="form.isSettled == 1" color="green">已结算</a-tag>
        </a-descriptions-item>

<!--        <a-descriptions-item span="3">-->
<!--          <a-divider/>-->
<!--        </a-descriptions-item>-->

      </a-descriptions>
    </a-card>
    <a-card class="order-card" :bordered="false">
      <a-spin :spinning="loading">
        <a-table
          :data-source="orderInfo"
          :columns="columns"
          :pagination="false"
        />
      </a-spin>
    </a-card>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form} from 'ant-design-vue';
import {assignObject} from 'ele-admin-pro';
import {ColumnItem} from 'ele-admin-pro/es/ele-pro-table/types';
import {
  CheckOutlined,
  CloseOutlined,
  CoffeeOutlined
} from '@ant-design/icons-vue';
import {ShopOrder} from '@/api/shop/shopOrder/model';
import {BszxPay} from '@/api/bszx/bszxPay/model';
import {pageBszxPay} from '@/api/bszx/bszxPay';
import {toDateString} from 'ele-admin-pro';
import {copyText} from "@/utils/common";

const useForm = Form.useForm;

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: ShopOrder | null;
}>();

export interface step {
  title?: String | undefined;
  subTitle?: String | undefined;
  description?: String | undefined;
}

// 是否是修改
const isUpdate = ref(false);
// 是否显示最大化切换按钮
const maxAble = ref(true);
// 订单信息
const orderInfo = ref<BszxPay[]>([]);

// 步骤条
const steps = ref<step[]>([
  {
    title: '报餐',
    description: undefined
  },
  {
    title: '付款',
    description: undefined
  },
  {
    title: '发餐',
    description: undefined
  },
  {
    title: '取餐',
    description: undefined
  },
  {
    title: '完成',
    description: undefined
  }
]);
const active = ref(2);

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 订单信息
const form = reactive<ShopOrder>({
  // 订单号
  orderId: undefined,
  // 订单编号
  orderNo: undefined,
  // 订单类型，0商城订单 1预定订单/外卖 2会员卡
  type: undefined,
  // 快递/自提
  deliveryType: undefined,
  // 下单渠道，0小程序预定 1俱乐部训练场 3活动订场
  channel: undefined,
  // 微信支付订单号
  transactionId: undefined,
  // 微信退款订单号
  refundOrder: undefined,
  // 商户ID
  merchantId: undefined,
  // 商户名称
  merchantName: undefined,
  // 商户编号
  merchantCode: undefined,
  // 使用的优惠券id
  couponId: undefined,
  // 使用的会员卡id
  cardId: undefined,
  // 关联管理员id
  adminId: undefined,
  // 核销管理员id
  confirmId: undefined,
  // IC卡号
  icCard: undefined,
  // 头像
  avatar: undefined,
  // 真实姓名
  realName: undefined,
  // 手机号码
  phone: undefined,
  // 收货地址
  address: undefined,
  //
  addressLat: undefined,
  //
  addressLng: undefined,
  // 自提店铺id
  selfTakeMerchantId: undefined,
  // 自提店铺
  selfTakeMerchantName: undefined,
  // 配送开始时间
  sendStartTime: undefined,
  // 配送结束时间
  sendEndTime: undefined,
  // 发货店铺id
  expressMerchantId: undefined,
  // 发货店铺
  expressMerchantName: undefined,
  // 订单总额
  totalPrice: undefined,
  // 减少的金额，使用VIP会员折扣、优惠券抵扣、优惠券折扣后减去的价格
  reducePrice: undefined,
  // 实际付款
  payPrice: undefined,
  // 用于统计
  price: undefined,
  // 价钱，用于积分赠送
  money: undefined,
  // 退款金额
  refundMoney: undefined,
  // 教练价格
  coachPrice: undefined,
  // 购买数量
  totalNum: undefined,
  // 教练id
  coachId: undefined,
  // 支付的用户id
  payUserId: undefined,
  // 0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机，6VIP月卡，7VIP年卡，8VIP次卡，9IC月卡，10IC年卡，11IC次卡，12免费，13VIP充值卡，14IC充值卡，15积分支付，16VIP季卡，17IC季卡，18代付
  payType: undefined,
  // 代付支付方式,0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机，6VIP月卡，7VIP年卡，8VIP次卡，9IC月卡，10IC年卡，11IC次卡，12免费，13VIP充值卡，14IC充值卡，15积分支付，16VIP季卡，17IC季卡，18代付
  friendPayType: undefined,
  // 0未付款，1已付款
  payStatus: undefined,
  // 0未使用，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款
  orderStatus: undefined,
  // 发货状态(10未发货 20已发货 30部分发货)
  deliveryStatus: undefined,
  // 发货时间
  deliveryTime: undefined,
  // 优惠类型：0无、1抵扣优惠券、2折扣优惠券、3、VIP月卡、4VIP年卡，5VIP次卡、6VIP会员卡、7IC月卡、8IC年卡、9IC次卡、10IC会员卡、11免费订单、12VIP充值卡、13IC充值卡、14VIP季卡、15IC季卡
  couponType: undefined,
  // 优惠说明
  couponDesc: undefined,
  // 二维码地址，保存订单号，支付成功后才生成
  qrcode: undefined,
  // vip月卡年卡、ic月卡年卡回退次数
  returnNum: undefined,
  // vip充值回退金额
  returnMoney: undefined,
  // 预约详情开始时间数组
  startTime: undefined,
  // 是否已开具发票：0未开发票，1已开发票，2不能开具发票
  isInvoice: undefined,
  // 发票流水号
  invoiceNo: undefined,
  // 支付时间
  payTime: undefined,
  // 退款时间
  refundTime: undefined,
  // 申请退款时间
  refundApplyTime: undefined,
  // 过期时间
  expirationTime: undefined,
  // 对账情况：0=未对账；1=已对账；3=已对账，金额对不上；4=未查询到该订单
  checkBill: undefined,
  // 订单是否已结算(0未结算 1已结算)
  isSettled: undefined,
  // 系统版本号 0当前版本 value=其他版本
  version: undefined,
  // 用户id
  userId: undefined,
  // 备注
  comments: undefined,
  // 排序号
  sortNumber: undefined,
  // 是否删除, 0否, 1是
  deleted: undefined,
  // 租户id
  tenantId: undefined,
  // 修改时间
  updateTime: undefined,
  // 创建时间
  createTime: undefined,
  // 自提码
  selfTakeCode: undefined,
  // 是否已收到赠品
  hasTakeGift: undefined,
});

// 请求状态
const loading = ref(true);

const {resetFields} = useForm(form);

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

const columns = ref<ColumnItem[]>([
  {
    title: '场馆名称',
    dataIndex: 'siteName',
    key: 'siteName',
    align: 'center'
  },
  {
    title: '场地',
    dataIndex: 'fieldName',
    align: 'center'
  },
  {
    title: '价格',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '儿童价',
    dataIndex: 'childrenPrice',
    align: 'center'
  },
  {
    title: '成人数',
    dataIndex: 'adultNum',
    align: 'center'
  },
  {
    title: '儿童数',
    dataIndex: 'childrenNum',
    align: 'center'
  },
  {
    title: '预定信息',
    dataIndex: 'dateTime',
    key: 'dateTime',
    align: 'center'
  },
  {
    title: '是否免费',
    dataIndex: 'isFree',
    align: 'center',
    customRender: ({text}) => ['', '免费', '付费'][text]
  }
]);

/* 制作步骤条 */
const loadSteps = (order) => {
  steps.value = [];
  steps.value.push({
    title: '下单'
  });
  steps.value.push({
    title: '付款'
  });
  steps.value.push({
    title: '发货'
  });
  steps.value.push({
    title: '收货'
  });
  steps.value.push({
    title: '完成'
  });

  // 下单
  if (order.payStatus == 10) {
    active.value = 0;
    steps.value[0].description = order.createTime;
  }
  // 付款
  if (order.payStatus == 20) {
    active.value = 1;
    steps.value[0].description = order.createTime;
    steps.value[1].description = order.payTime;
  }
  // 发货
  if (order.payStatus == 20 && order.deliveryStatus == 20) {
    active.value = 2;
    steps.value[0].description = order.createTime;
    steps.value[1].description = order.payTime;
    steps.value[2].description = order.deliveryTime;
  }
  // 收货
  if (order.payStatus == 20 && order.receiptStatus == 20) {
    active.value = 3;
    steps.value[0].description = order.createTime;
    steps.value[1].description = order.payTime;
    steps.value[2].description = order.deliveryTime;
    steps.value[3].description = order.receiptTime;
  }
  // 完成
  if (order.payStatus == 20 && order.orderStatus == 30) {
    active.value = 4;
    steps.value[0].description = order.createTime;
    steps.value[1].description = order.payTime;
    steps.value[2].description = order.deliveryTime;
    steps.value[3].description = order.receiptTime;
  }
  // 已取消
  if (order.orderStatus == 20) {
    active.value = 4;
  }
};

// const getOrderInfo = () => {
//   const orderId = props.data?.orderId;
//   listOrderInfo({ orderId }).then((data) => {
//     orderInfo.value = data.filter((d) => d.totalNum > 0);
//   });
// };

/* 保存编辑 */
const save = () => {
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (props.data) {
        loading.value = true;
        assignObject(form, props.data);
        pageBszxPay({orderId: form.orderId}).then((res) => {
          if (res?.list) {
            orderInfo.value = res?.list;
          }
          loading.value = false;
        });
        loadSteps(props.data);
      }
    } else {
      resetFields();
    }
  }
);
</script>

<script lang="ts">
import * as MenuIcons from '@/layout/menu-icons';

export default {
  name: 'BszxOrderInfo',
  components: MenuIcons
};
</script>
