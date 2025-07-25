<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="开发者ID(AppID)" name="appId">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入开发者ID"
          v-model:value="form.appId"
        />
      </a-form-item>
      <a-form-item label="开发者秘钥(AppSecret)" name="appSecret">
        <a-input-password
          :maxlength="100"
          placeholder="请输入开发者秘钥AppSecret"
          v-model:value="form.appSecret"
        />
      </a-form-item>
      <a-form-item label="原始ID" name="originalId">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入原始ID"
          v-model:value="form.originalId"
        />
      </a-form-item>
      <a-form-item label="微信号" name="wxOfficialAccount">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入微信号"
          v-model:value="form.wxOfficialAccount"
        />
      </a-form-item>
      <div style="margin-bottom: 22px; width: 750px">
        <a-divider>网页授权域名</a-divider>
      </div>
      <a-form-item label="网页授权域名" name="authorize">
        <a-input-group compact>
          <a-input
            :value="`https://server.gxwebsoft.com`"
            placeholder="请输入网页授权域名"
            style="width: calc(100% - 50px)"
          />
          <a-tooltip title="复制">
            <a-button @click="onCopyText(`https://server.gxwebsoft.com`)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>

        <a-button
          type="primary"
          class="ele-btn-icon"
          style="margin-top: 10px"
          @click="save"
        >
          <span>保存</span>
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { Setting } from '@/api/system/setting/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { FormInstance } from 'ant-design-vue/es/form';
  import useFormData from '@/utils/use-form-data';
  import { addSetting, updateSetting } from '@/api/system/setting';
  import { copyText } from '@/utils/common';
  import { CopyOutlined } from '@ant-design/icons-vue';

  const props = defineProps<{
    value?: string;
    // 修改回显的数据
    data?: Setting | null;
  }>();

  // const emit = defineEmits<{
  //   (e: 'done', value): void;
  // }>();

  // 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
  // const settingId = ref(null);
  // const settingKey = ref('');
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  // 提交状态
  const loading = ref(false);
  // 是否是修改
  const isUpdate = ref(false);
  //
  const formRef = ref<FormInstance | null>(null);
  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Setting>({
    appId: '',
    appSecret: '',
    wxOfficialAccount: '',
    originalId: '',
    tenantId: localStorage.getItem('TenantId')
  });

  // 表单验证规则
  const rules = reactive({
    chatKey: [
      {
        required: true,
        message: '请输入KEY',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const appForm = {
          ...form,
          content: JSON.stringify(form)
        };
        const saveOrUpdate = isUpdate.value ? updateSetting : addSetting;
        saveOrUpdate(appForm)
          .then(() => {
            message.success('保存成功');
          })
          .catch((e) => {
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  const onCopyText = (text) => {
    copyText(text);
  };

  watch(
    () => props.data,
    (data) => {
      if (data?.settingId) {
        isUpdate.value = true;
        // 表单赋值
        if (data.content) {
          const jsonData = JSON.parse(data.content);
          assignFields(jsonData);
        }
        // 其他必要参数
        form.settingId = data.settingId;
        form.settingKey = data.settingKey;
      } else {
        // 新增
        isUpdate.value = false;
        resetFields();
        form.settingKey = props.value;
      }
    }
  );
</script>
