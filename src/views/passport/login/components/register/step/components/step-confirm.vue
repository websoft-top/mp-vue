<template>
  <a-form
    class="login-form ele-bg-white"
    ref="formRef"
    :model="form"
    :rules="rules"
  >
    <a-form-item name="phone">
      <a-input
        size="large"
        allow-clear
        :maxlength="11"
        v-model:value="form.phone"
        disabled
        placeholder="请输入手机号码"
      >
        <template #addonBefore> +86 </template>
      </a-input>
    </a-form-item>
    <a-form-item name="code">
      <div class="login-input-group">
        <a-input
          size="large"
          placeholder="请输入验证码"
          v-model:value="form.code"
          :maxlength="6"
          allow-clear
        />
        <a-button
          size="large"
          class="login-captcha"
          :disabled="!!countdownTime"
          @click="openImgCodeModal"
        >
          <span v-if="!countdownTime">发送验证码</span>
          <span v-else>已发送 {{ countdownTime }} s</span>
        </a-button>
      </div>
    </a-form-item>
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
  <!-- 编辑弹窗 -->
  <a-modal
    :width="340"
    :footer="null"
    title="发送验证码"
    v-model:visible="visible"
  >
    <div class="login-input-group" style="margin-bottom: 16px">
      <a-input
        size="large"
        v-model:value="imgCode"
        :maxlength="5"
        placeholder="请输入图形验证码"
        allow-clear
        @pressEnter="sendCode"
      />
      <a-button size="large" class="login-captcha">
        <img alt="" :src="captcha" @click="changeCaptcha" />
      </a-button>
    </div>
    <a-button
      block
      size="large"
      type="primary"
      :loading="codeLoading"
      @click="sendCode"
    >
      立即发送
    </a-button>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import type { StepForm } from '../model';
  import { assignObject, phoneReg } from 'ele-admin-pro';
  import { message } from 'ant-design-vue';
  import {
    getCaptcha,
    sendSmsCaptcha,
    registerUser
  } from '@/api/passport/login';
  import { User } from '@/api/system/user/model';

  const props = defineProps<{
    // 修改回显的数据
    data?: StepForm | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: StepForm): void;
    (e: 'back'): void;
  }>();

  // 是否显示图形验证码弹窗
  const visible = ref(false);
  // 图形验证码
  const imgCode = ref('');
  // 发送验证码按钮loading
  const codeLoading = ref(false);
  // 验证码倒计时时间
  const countdownTime = ref(0);
  // 图形验证码地址
  const captcha = ref('');
  const text = ref('');
  // 验证码倒计时定时器
  let countdownTimer: number | null = null;
  const formRef = ref<FormInstance | null>(null);

  /* 发送短信验证码 */
  const sendCode = () => {
    if (!imgCode.value) {
      message.error('请输入图形验证码');
      return;
    }
    if (text.value !== imgCode.value) {
      message.error('图形验证码不正确');
      return;
    }
    codeLoading.value = true;
    sendSmsCaptcha({ phone: form.phone, key: imgCode.value })
      .then(() => {
        message.success('短信验证码发送成功, 请注意查收!');
        visible.value = false;
        codeLoading.value = false;
        countdownTime.value = 60;
        // 开始对按钮进行倒计时
        countdownTimer = window.setInterval(() => {
          if (countdownTime.value <= 1) {
            countdownTimer && clearInterval(countdownTimer);
            countdownTimer = null;
          }
          countdownTime.value--;
        }, 1000);
      })
      .catch((e) => {
        codeLoading.value = false;
        message.error(e.message);
      });
  };

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const form = reactive<User>({
    type: 10,
    phone: '',
    username: '',
    nickname: '',
    roles: [],
    companyName: '',
    organizationName: '',
    email: '',
    password: '',
    password2: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    phone: [
      {
        pattern: phoneReg,
        message: '手机号格式不正确',
        type: 'string'
      }
    ],
    code: [
      {
        required: true,
        message: '请填写短信验证码',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /* 获取图形验证码 */
  const changeCaptcha = () => {
    // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
    getCaptcha()
      .then((data) => {
        captcha.value = data.base64;
        // 实际项目后端一般会返回验证码的key而不是直接返回验证码的内容, 登录用key去验证, 你可以根据自己后端接口修改
        text.value = data.text;
        // 自动回填验证码, 实际项目去掉这个
        // form.code = data.text;
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  /* 显示发送短信验证码弹窗 */
  const openImgCodeModal = () => {
    if (!form.phone) {
      message.error('请输入手机号码');
      return;
    }
    imgCode.value = '';
    changeCaptcha();
    visible.value = true;
  };

  const submit = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      ?.validate()
      .then(() => {
        loading.value = true;
        // roleId 6开发者 10商户
        const addData = {
          ...form,
          username: props.data?.username,
          password: props.data?.password,
          phone: props.data?.phone,
          nickname: props.data?.nickname,
          roles: [{ roleId: form.type }]
        };
        registerUser(addData)
          .then((data) => {
            loading.value = false;
            message.success('注册成功');
            form.tenantId = Number(data) || 0;
            emit('done', form);
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  const back = () => {
    emit('back');
  };

  if (props.data) {
    assignObject(form, props.data);
  }
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
