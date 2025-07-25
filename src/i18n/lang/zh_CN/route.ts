/* 菜单路由 */
export default {
  login: { _name: '登录' },
  forget: { _name: '忘记密码' },
  result: {
    _name: '结果页面',
    success: { _name: '成功页' },
    fail: { _name: '失败页' }
  },
  exception: {
    _name: '异常页面',
    '403': { _name: '403' },
    '404': { _name: '404' },
    '500': { _name: '500' }
  }
};
