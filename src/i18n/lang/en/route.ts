/* 菜单路由 */
export default {
  login: { _name: 'Login' },
  forget: { _name: 'Forget' },
  dashboard: {
    _name: 'Dashboard',
    workplace: { _name: 'Workplace' },
    analysis: { _name: 'Analysis' },
    monitor: { _name: 'Monitor' }
  },
  result: {
    _name: 'Result',
    success: { _name: 'Success' },
    fail: { _name: 'Fail' }
  },
  exception: {
    _name: 'Exception',
    '403': { _name: '403' },
    '404': { _name: '404' },
    '500': { _name: '500' }
  }
};
