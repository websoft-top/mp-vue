<template>
  <a-form
    class="login-form ele-bg-white"
    ref="formRef"
    :model="form"
    :rules="rules"
  >
    <a-form-item name="companyName" v-if="form.type === 10">
      <a-input
        size="large"
        placeholder="请输入应用名称"
        v-model:value="form.companyName"
        :maxlength="24"
        allow-clear
      />
    </a-form-item>
    <a-form-item name="email">
      <a-input
        size="large"
        placeholder="请输入电子邮箱地址"
        v-model:value="form.email"
        :maxlength="24"
        allow-clear
      />
    </a-form-item>
    <a-form-item name="phone">
      <a-input
        size="large"
        placeholder="请输入手机号码"
        v-model:value="form.phone"
        :maxlength="11"
        allow-clear
      />
    </a-form-item>
    <a-form-item name="password">
      <a-input
        size="large"
        allow-clear
        :maxlength="24"
        type="password"
        v-model:value="form.password"
        placeholder="请输入密码"
      />
    </a-form-item>
    <a-form-item name="password2">
      <a-input
        size="large"
        allow-clear
        :maxlength="24"
        type="password"
        v-model:value="form.password2"
        placeholder="请输入确认密码"
      />
    </a-form-item>
    <!--    <a-form-item label="昵称" name="nickname">-->
    <!--      <a-input-->
    <!--        placeholder="请输入昵称"-->
    <!--        v-model:value="form.nickname"-->
    <!--        :maxlength="24"-->
    <!--        allow-clear-->
    <!--      />-->
    <!--    </a-form-item>-->
    <!--    <a-form-item label="  " name="register" v-if="form.type === 1">-->
    <!--      我已阅读并同意 <a>用户协议</a> 和 <a>隐私权政策</a>-->
    <!--    </a-form-item>-->
    <a-form-item>
      <a-button
        block
        size="large"
        type="primary"
        :loading="loading"
        @click="submit"
      >
        下一步
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import type { StepForm } from '../model';
  import { emailReg, phoneReg } from 'ele-admin-pro/es';
  import type { RuleObject } from 'ant-design-vue/es/form';
  import { createCode } from '@/utils/common';
  import { checkExistence } from '@/api/system/company';
  import type { User } from '@/api/system/user/model';

  const emit = defineEmits<{
    (e: 'done', data: StepForm): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
  }>();

  const formRef = ref<FormInstance | null>(null);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const form = reactive<User>({
    type: 10,
    phone: '',
    username: createCode(),
    nickname: '',
    organizationName: '',
    companyName: '',
    email: '',
    password: '',
    password2: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    companyName: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请填写应用名称');
            }
            checkExistence('shortName', value)
              .then(() => {
                if (form.type === 10) {
                  reject('该名称已经存在');
                }
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    type: [
      {
        required: true,
        message: '请选择账号类型',
        type: 'number',
        trigger: 'blur'
      }
    ],
    nickname: [
      {
        required: true,
        message: '请选择账号类型',
        type: 'string',
        trigger: 'blur'
      }
    ],
    email: [
      {
        pattern: emailReg,
        message: '邮箱格式不正确',
        type: 'string',
        trigger: 'blur'
      },
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入邮箱地址');
            }
            checkExistence('email', value)
              .then(() => {
                reject('该邮箱已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    phone: [
      {
        pattern: phoneReg,
        message: '手机号格式不正确',
        type: 'string',
        trigger: 'blur'
      },
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入手机号码');
            }
            checkExistence('phone', value)
              .then(() => {
                reject('该手机号码已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        type: 'string',
        validator: async (_rule: Rule, value: string) => {
          if (/^[\S]{8,32}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('密码必须为8-32位非空白字符');
        },
        trigger: 'blur'
      }
    ],
    password2: [
      {
        required: true,
        validator: async (_rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请再次输入新密码');
          }
          if (value !== form.password) {
            return Promise.reject('两次输入密码不一致');
          }
          return Promise.resolve();
        }
      }
    ]
  });

  /* 步骤一提交 */
  const submit = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        emit('done', form);
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
      } else {
        formRef.value?.clearValidate();
      }
    }
  );
</script>
<style lang="less" scoped>
  /* 验证码 */
  .login-input-group {
    display: flex;
    align-items: center;

    :deep(.ant-input-affix-wrapper) {
      flex: 1;
    }

    .login-captcha {
      width: 102px;
      margin-left: 10px;
      padding: 0;

      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
