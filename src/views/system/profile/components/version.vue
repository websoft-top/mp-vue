<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    width="80%"
    :visible="visible"
    :confirm-loading="loading"
    :title="`商业授权`"
    :footer="null"
    :body-style="{ paddingBottom: '16px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <div class="version-select">
      <div class="item">1 </div>
      <div class="item">2</div>
      <div class="item">3</div>
    </div>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message, SelectProps } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addCompany, updateCompany } from '@/api/system/company';
  import { Company } from '@/api/system/company/model';

  const useForm = Form.useForm;
  // 是否是修改
  const isUpdate = ref(false);
  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    data?: Company | null;
    title?: string;
    field?: string | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 提交状态
  const loading = ref(false);
  const content = ref();
  const activeKey = ref('1');
  const placeholder = ref('请输入修改内容');
  // 用户信息
  const form = reactive<Company>({
    companyId: undefined,
    shortName: '',
    companyName: '',
    companyType: undefined,
    appType: '',
    companyLogo: '',
    domain: '',
    phone: '',
    InvoiceHeader: '',
    startTime: '',
    expirationTime: '',
    version: undefined,
    members: undefined,
    departments: undefined,
    country: '',
    province: '',
    city: '',
    region: '',
    address: '',
    comments: '',
    authentication: undefined,
    modules: '',
    requestUrl: '',
    socketUrl: '',
    serverUrl: '',
    modulesUrl: '',
    status: undefined,
    userId: undefined,
    tenantId: undefined,
    code: undefined,
    createTime: '',
    updateTime: ''
  });

  // 省市区
  const city = ref<string[]>([
    String(form.province),
    String(form.city),
    String(form.region)
  ]);

  const industry = ref<string[]>([
    String(form.industryParent),
    String(form.industryChild)
  ]);

  const companyType = ref<SelectProps['options']>([
    {
      value: '企业',
      label: '企业'
    },
    {
      value: '政府',
      label: '政府'
    },
    {
      value: '个人',
      label: '个人'
    },
    {
      value: '其他组织',
      label: '其他组织'
    }
  ]);

  const appType = ref<SelectProps['options']>([
    {
      value: 'Tenant',
      label: 'Tenant'
    },
    {
      value: 'Vue',
      label: 'Vue'
    },
    {
      value: 'UniApp',
      label: 'UniApp'
    },
    {
      value: '网站应用',
      label: '网站应用'
    }
  ]);

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  const { resetFields, validate } = useForm(form);

  const onInput = () => {
    // 对象赋值
    Object.keys(form).forEach((key) => {
      if (key === props.field) {
        form[key] = content.value;
      }
    });
  };

  const onCompanyType = (e) => {
    form.companyType = e;
  };

  const onAppType = (e) => {
    form.appType = e;
  };

  /* 保存编辑 */
  const save = () => {
    validate()
      .then(() => {
        loading.value = true;
        form.province = city.value[0];
        form.city = city.value[1];
        form.region = city.value[2];
        form.industryParent = industry.value[0];
        form.industryChild = industry.value[1];
        form.authoritative = true;
        const saveOrUpdate = form.companyId ? updateCompany : addCompany;
        saveOrUpdate(form)
          .then(() => {
            loading.value = false;
            message.success('保存成功');
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
        if (props.data) {
          loading.value = false;
          console.log(props.data);
          city.value[0] = String(props.data.province);
          city.value[1] = String(props.data.city);
          city.value[2] = String(props.data.region);
          industry.value[0] = String(props.data.industryParent);
          industry.value[1] = String(props.data.industryChild);
          assignObject(form, props.data);
          // 对象赋值
          Object.keys(form).forEach((key) => {
            if (key === props.field) {
              console.log(key);
              console.log(form[key]);
              content.value = form[key];
            }
          });
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }

      if (props.field == 'tenantCode') {
        placeholder.value = '请输入要绑定的主体编号';
        // content.value = undefined;
      }
    }
  );
</script>
<style lang="less">
  .version-select {
    display: flex;
    justify-content: space-around;
    .item {
      width: 300px;
      border: 1px solid #f0f0f0;
      display: block;
    }
  }
</style>
