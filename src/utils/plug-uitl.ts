import { createVNode } from 'vue';
import { Company } from '@/api/system/company/model';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { messageLoading } from 'ele-admin-pro';
import { clone } from '@/api/system/menu';
import useFormData from '@/utils/use-form-data';
import { Menu } from '@/api/system/menu/model';

// 表单数据
const { form } = useFormData<Menu>({
  title: '',
  icon: '',
  path: '',
  component: '',
  tenantId: undefined,
  tenantName: ''
});

/**
 * 一键克隆
 * @param item
 */
export const onClone = (item: Company) => {
  const tenantId = Number(localStorage.getItem('TenantId'));
  if (tenantId == item.tenantId) {
    message.error('不能克隆自己');
    return false;
  }
  // 提交状态
  Modal.confirm({
    title: '确认操作吗?',
    content: `将复制【${item.tenantName}】的所有菜单和权限(不含数据)，原有企业数据不会删除。`,
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = messageLoading('模块安装中请稍等...', 0);
      form.tenantId = item.tenantId;
      clone(form)
        .then((msg) => {
          hide();
          message.success(msg);
          setTimeout(() => {
            window.open('/', '_self');
          }, 1000);
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    }
  });
};
