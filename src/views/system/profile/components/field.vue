<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    width="500px"
    :visible="visible"
    :confirm-loading="loading"
    :title="title"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form layout="horizontal">
      <template v-for="(value, key) in data" :key="key">
        <template v-if="field === key">
          <a-form-item>
            <template v-if="field === 'city'">
              <regions-select
                v-model:value="city"
                valueField="label"
                placeholder="请选择省市区"
                class="ele-fluid"
              />
            </template>
            <template v-else-if="field === 'freeDomain'">
              <a-input
                v-model:value="form.freeDomain"
                placeholder="huawei"
                addon-before="https://"
                addon-after=".websoft.top"
              />
            </template>
            <template v-else-if="field === 'industryParent'">
              <industry-select
                v-model:value="industry"
                valueField="label"
                placeholder="请选择所属行业"
                class="ele-fluid"
              />
            </template>
            <template v-else-if="field === 'companyType'">
              <a-select
                :options="companyType"
                :value="form.companyType"
                placeholder="请选择主体类型"
                @change="onCompanyType"
              />
            </template>
            <template v-else-if="field === 'appType'">
              <a-select
                :options="appType"
                :value="form.appType"
                placeholder="请选择应用类型"
                @change="onAppType"
              />
            </template>
            <template v-else-if="field === 'comments'">
              <a-textarea
                :rows="4"
                :maxlength="200"
                placeholder="请输入备注"
                v-model:value="form.comments"
              />
            </template>
            <template v-else>
              <a-input
                v-model:value="content"
                @input="onInput"
                :placeholder="`请输入${field}的内容`"
                @pressEnter="save"
              />
            </template>
          </a-form-item>
        </template>
      </template>
    </a-form>
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
    freeDomain: undefined,
    phone: '',
    invoiceHeader: '',
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
    requestUrl: '',
    socketUrl: '',
    serverUrl: '',
    modulesUrl: '',
    status: undefined,
    userId: undefined,
    tenantId: undefined,
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
      value: 'web',
      label: '应用'
    },
    {
      value: 'plug',
      label: '插件'
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
  .tab-pane {
    min-height: 300px;
  }
</style>
