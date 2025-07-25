<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑订单' : '添加订单'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="订单编号" name="orderNo">
        <a-input
          allow-clear
          placeholder="请输入订单编号"
          v-model:value="form.orderNo"
        />
      </a-form-item>
      <a-form-item label="订单类型，0产品 1插件" name="type">
        <a-input
          allow-clear
          placeholder="请输入订单类型，0产品 1插件"
          v-model:value="form.type"
        />
      </a-form-item>
      <a-form-item label="下单渠道，0网站 1小程序 2其他" name="channel">
        <a-input
          allow-clear
          placeholder="请输入下单渠道，0网站 1小程序 2其他"
          v-model:value="form.channel"
        />
      </a-form-item>
      <a-form-item label="微信支付订单号" name="transactionId">
        <a-input
          allow-clear
          placeholder="请输入微信支付订单号"
          v-model:value="form.transactionId"
        />
      </a-form-item>
      <a-form-item label="微信退款订单号" name="refundOrder">
        <a-input
          allow-clear
          placeholder="请输入微信退款订单号"
          v-model:value="form.refundOrder"
        />
      </a-form-item>
      <a-form-item label="使用的优惠券id" name="couponId">
        <a-input
          allow-clear
          placeholder="请输入使用的优惠券id"
          v-model:value="form.couponId"
        />
      </a-form-item>
      <a-form-item label="真实姓名" name="realName">
        <a-input
          allow-clear
          placeholder="请输入真实姓名"
          v-model:value="form.realName"
        />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input
          allow-clear
          placeholder="请输入手机号码"
          v-model:value="form.phone"
        />
      </a-form-item>
      <a-form-item label="订单总额" name="totalPrice">
        <a-input
          allow-clear
          placeholder="请输入订单总额"
          v-model:value="form.totalPrice"
        />
      </a-form-item>
      <a-form-item label="减少的金额，使用VIP会员折扣、优惠券抵扣、优惠券折扣后减去的价格" name="reducePrice">
        <a-input
          allow-clear
          placeholder="请输入减少的金额，使用VIP会员折扣、优惠券抵扣、优惠券折扣后减去的价格"
          v-model:value="form.reducePrice"
        />
      </a-form-item>
      <a-form-item label="实际付款" name="payPrice">
        <a-input
          allow-clear
          placeholder="请输入实际付款"
          v-model:value="form.payPrice"
        />
      </a-form-item>
      <a-form-item label="用于统计" name="price">
        <a-input
          allow-clear
          placeholder="请输入用于统计"
          v-model:value="form.price"
        />
      </a-form-item>
      <a-form-item label="价钱，用于积分赠送" name="money">
        <a-input
          allow-clear
          placeholder="请输入价钱，用于积分赠送"
          v-model:value="form.money"
        />
      </a-form-item>
      <a-form-item label="退款金额" name="refundMoney">
        <a-input
          allow-clear
          placeholder="请输入退款金额"
          v-model:value="form.refundMoney"
        />
      </a-form-item>
      <a-form-item label="购买数量" name="totalNum">
        <a-input
          allow-clear
          placeholder="请输入购买数量"
          v-model:value="form.totalNum"
        />
      </a-form-item>
      <a-form-item label="0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机" name="payType">
        <a-input
          allow-clear
          placeholder="请输入0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机"
          v-model:value="form.payType"
        />
      </a-form-item>
      <a-form-item label="0未付款，1已付款" name="payStatus">
        <a-input
          allow-clear
          placeholder="请输入0未付款，1已付款"
          v-model:value="form.payStatus"
        />
      </a-form-item>
      <a-form-item label="0未完成，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款" name="orderStatus">
        <a-input
          allow-clear
          placeholder="请输入0未完成，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款"
          v-model:value="form.orderStatus"
        />
      </a-form-item>
      <a-form-item label="优惠类型：0无、1抵扣优惠券、2折扣优惠券、3、VIP月卡、4VIP年卡，5VIP次卡、6VIP会员卡、7IC月卡、8IC年卡、9IC次卡、10IC会员卡、11免费订单、12VIP充值卡、13IC充值卡、14VIP季卡、15IC季卡" name="couponType">
        <a-input
          allow-clear
          placeholder="请输入优惠类型：0无、1抵扣优惠券、2折扣优惠券、3、VIP月卡、4VIP年卡，5VIP次卡、6VIP会员卡、7IC月卡、8IC年卡、9IC次卡、10IC会员卡、11免费订单、12VIP充值卡、13IC充值卡、14VIP季卡、15IC季卡"
          v-model:value="form.couponType"
        />
      </a-form-item>
      <a-form-item label="优惠说明" name="couponDesc">
        <a-input
          allow-clear
          placeholder="请输入优惠说明"
          v-model:value="form.couponDesc"
        />
      </a-form-item>
      <a-form-item label="二维码地址，保存订单号，支付成功后才生成" name="qrcode">
        <a-input
          allow-clear
          placeholder="请输入二维码地址，保存订单号，支付成功后才生成"
          v-model:value="form.qrcode"
        />
      </a-form-item>
      <a-form-item label="预约详情开始时间数组" name="startTime">
        <a-input
          allow-clear
          placeholder="请输入预约详情开始时间数组"
          v-model:value="form.startTime"
        />
      </a-form-item>
      <a-form-item label="是否已开具发票：0未开发票，1已开发票，2不能开具发票" name="isInvoice">
        <a-input
          allow-clear
          placeholder="请输入是否已开具发票：0未开发票，1已开发票，2不能开具发票"
          v-model:value="form.isInvoice"
        />
      </a-form-item>
      <a-form-item label="发票流水号" name="invoiceNo">
        <a-input
          allow-clear
          placeholder="请输入发票流水号"
          v-model:value="form.invoiceNo"
        />
      </a-form-item>
      <a-form-item label="支付时间" name="payTime">
        <a-input
          allow-clear
          placeholder="请输入支付时间"
          v-model:value="form.payTime"
        />
      </a-form-item>
      <a-form-item label="退款时间" name="refundTime">
        <a-input
          allow-clear
          placeholder="请输入退款时间"
          v-model:value="form.refundTime"
        />
      </a-form-item>
      <a-form-item label="申请退款时间" name="refundApplyTime">
        <a-input
          allow-clear
          placeholder="请输入申请退款时间"
          v-model:value="form.refundApplyTime"
        />
      </a-form-item>
      <a-form-item label="过期时间" name="expirationTime">
        <a-input
          allow-clear
          placeholder="请输入过期时间"
          v-model:value="form.expirationTime"
        />
      </a-form-item>
      <a-form-item label="对账情况：0=未对账；1=已对账；3=已对账，金额对不上；4=未查询到该订单" name="checkBill">
        <a-input
          allow-clear
          placeholder="请输入对账情况：0=未对账；1=已对账；3=已对账，金额对不上；4=未查询到该订单"
          v-model:value="form.checkBill"
        />
      </a-form-item>
      <a-form-item label="订单是否已结算(0未结算 1已结算)" name="isSettled">
        <a-input
          allow-clear
          placeholder="请输入订单是否已结算(0未结算 1已结算)"
          v-model:value="form.isSettled"
        />
      </a-form-item>
      <a-form-item label="系统版本号 0当前版本 value=其他版本" name="version">
        <a-input
          allow-clear
          placeholder="请输入系统版本号 0当前版本 value=其他版本"
          v-model:value="form.version"
        />
      </a-form-item>
      <a-form-item label="用户id" name="userId">
        <a-input
          allow-clear
          placeholder="请输入用户id"
          v-model:value="form.userId"
        />
      </a-form-item>
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="排序号" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="是否删除, 0否, 1是" name="deleted">
        <a-input
          allow-clear
          placeholder="请输入是否删除, 0否, 1是"
          v-model:value="form.deleted"
        />
      </a-form-item>
      <a-form-item label="修改时间" name="updateTime">
        <a-input
          allow-clear
          placeholder="请输入修改时间"
          v-model:value="form.updateTime"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addOrder, updateOrder } from '@/api/system/order';
  import { Order } from '@/api/system/order/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';

  // 是否是修改
  const isUpdate = ref(false);
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: Order | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 提交状态
  const loading = ref(false);
  // 是否显示最大化切换按钮
  const maxable = ref(true);
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const images = ref<ItemType[]>([]);

  // 用户信息
  const form = reactive<Order>({
    orderId: undefined,
    orderNo: undefined,
    type: undefined,
    channel: undefined,
    transactionId: undefined,
    refundOrder: undefined,
    couponId: undefined,
    realName: undefined,
    phone: undefined,
    totalPrice: undefined,
    reducePrice: undefined,
    payPrice: undefined,
    price: undefined,
    money: undefined,
    refundMoney: undefined,
    totalNum: undefined,
    payType: undefined,
    payStatus: undefined,
    orderStatus: undefined,
    couponType: undefined,
    couponDesc: undefined,
    qrcode: undefined,
    startTime: undefined,
    isInvoice: undefined,
    invoiceNo: undefined,
    payTime: undefined,
    refundTime: undefined,
    refundApplyTime: undefined,
    expirationTime: undefined,
    checkBill: undefined,
    isSettled: undefined,
    version: undefined,
    userId: undefined,
    comments: undefined,
    sortNumber: undefined,
    deleted: undefined,
    tenantId: undefined,
    updateTime: undefined,
    createTime: undefined,
    orderId: undefined,
    orderName: '',
    status: 0,
    comments: '',
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    orderName: [
      {
        required: true,
        type: 'string',
        message: '请填写订单名称',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.image = data.path;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.image = '';
  };

  const { resetFields } = useForm(form, rules);

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const formData = {
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateOrder : addOrder;
        saveOrUpdate(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          if(props.data.image){
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
            })
          }
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
