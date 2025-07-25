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
          <a-form-item :label="title">
            <template v-if="field === 'city'">
              <regions-select
                v-model:value="city"
                valueField="label"
                placeholder="请选择省市区"
                class="ele-fluid"
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
            <template v-else-if="field === 'websiteType'">
              <a-select
                :options="websiteType"
                :value="form.websiteType"
                placeholder="请选择主体类型"
                @change="onWebsiteType"
              />
            </template>
            <template v-else-if="field === 'websiteType'">
              <a-select
                :options="websiteType"
                :value="form.websiteType"
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
                :placeholder="`请输入${title}`"
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
  import {
    addCmsWebsite,
    removeSiteInfoCache,
    updateCmsWebsite
  } from '@/api/cms/cmsWebsite';
  import { CmsWebsite } from '@/api/cms/cmsWebsite/model';

  const useForm = Form.useForm;
  // 是否是修改
  const isUpdate = ref(false);
  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    data?: CmsWebsite | null;
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
  const form = reactive<CmsWebsite>({
    websiteId: undefined,
    websiteName: '',
    websiteType: undefined,
    websiteLogo: '',
    keywords: '',
    domain: '',
    phone: '',
    email: '',
    address: '',
    expirationTime: '',
    templateId: undefined,
    country: '',
    province: '',
    city: '',
    region: '',
    comments: '',
    industryParent: undefined,
    industryChild: undefined,
    icpNo: '',
    policeNo: '',
    status: 0,
    tenantId: undefined,
    createTime: ''
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

  const websiteType = ref<SelectProps['options']>([
    {
      value: '企业官网',
      label: '企业官网'
    },
    {
      value: '小程序商城',
      label: '小程序商城'
    },
    {
      value: '其他',
      label: '其他'
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

  const onWebsiteType = (e) => {
    form.websiteType = e;
  };

  const onAppType = (e) => {
    form.websiteType = e;
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
        form.websiteId = props.data?.websiteId;
        // form.authoritative = true;
        const saveOrUpdate = form.websiteId ? updateCmsWebsite : addCmsWebsite;
        saveOrUpdate(form)
          .then(() => {
            loading.value = false;
            message.success('保存成功');
            // 清除缓存
            removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
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
