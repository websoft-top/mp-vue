// 获取商户ID
export const getMerchantId = () => {
  const merchantId = localStorage.getItem('MerchantId');
  if (merchantId) {
    return Number(merchantId);
  }
  return undefined;
};

// 获取商户名称
export const getMerchantName = () => {
  const MerchantName = localStorage.getItem('MerchantName');
  if (MerchantName) {
    return MerchantName;
  }
  return undefined;
};

// 获取商户Logo
export const getMerchantAvatar = () => {
  const MerchantLogo = localStorage.getItem('MerchantLogo');
  if (MerchantLogo) {
    return MerchantLogo;
  }
  return undefined;
};

export const getRoleIdByMerchant = () => {
  const id = localStorage.getItem('RoleIdByMerchant');
  if (id) {
    return Number(id);
  }
  return undefined;
};

export const getRoleNameByMerchant = () => {
  const name = localStorage.getItem('RoleNameByMerchant');
  if (name) {
    return name;
  }
  return undefined;
};
