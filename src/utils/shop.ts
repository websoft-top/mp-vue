// 支付方式
export function getPayType(index?: number): any {
  const payType = [
    {
      value: 0,
      label: '余额支付',
    },
    {
      value: 1,
      label: '微信支付',
    },
    {
      value: 2,
      label: '积分',
    },
    {
      value: 3,
      label: '支付宝',
    },
    {
      value: 4,
      label: '现金',
    },
    {
      value: 5,
      label: 'POS机',
    },
    {
      value: 6,
      label: '会员卡',
    },
    // {
    //   value: 7,
    //   label: 'VIP年卡',
    // },
    // {
    //   value: 8,
    //   label: 'VIP次卡',
    // },
    // {
    //   value: 9,
    //   icon: 'IdcardOutlined',
    //   label: 'IC月卡',
    // },
    // {
    //  value: 10,
    //   icon: 'IdcardOutlined',
    //   label: 'IC年卡',
    // },
    // {
    //   value: 11,
    //   icon: 'IdcardOutlined',
    //   label: 'IC次卡',
    // },
    // {
    //   value: 12,
    //   icon: '',
    //   label: '免费',
    // },
    // {
    //   value: 13,
    //   icon: 'IdcardOutlined',
    //   label: 'VIP充值卡',
    // },
    // {
    //   value: 14,
    //   icon: 'IdcardOutlined',
    //   label: 'IC充值卡',
    // },
    // {
    //   value: 15,
    //   icon: '',
    //   label: '积分支付',
    // },
    // {
    //   value: 16,
    //   icon: 'IdcardOutlined',
    //   label: 'VIP季卡',
    // },
    // {
    //   value: 17,
    //   icon: 'IdcardOutlined',
    //   label: 'IC季卡',
    // },
  ];
  if(index){
    return payType[index].label || '';
  }
  return payType;
}
