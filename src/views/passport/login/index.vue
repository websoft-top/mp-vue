<template>
  <div
    :class="[
      'login-wrapper',
      ['', 'login-form-right', 'login-form-left'][direction]
    ]"
    :style="{
      backgroundImage: 'url(' + config?.loginBgImg + ')'
    }"
  >
    <div class="logo-login" v-if="config?.siteName">
      <img
        :src="
          config.sysLogo ||
          'https://oss.wsdns.cn/20240822/0252ad4ed46449cdafe12f8d3d96c2ea.svg'
        "
        class="logo"
      />
      <h4>{{ config.siteName }}</h4>
    </div>
    <div class="company-name" v-if="config?.loginTitle">{{
        config?.loginTitle
      }}
    </div>
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="login-form ele-bg-white"
    >
      <div class="login-title flex justify-center items-center px-12">
        <template v-if="loginType === 'scan'">
          <h4
            class="title-btn"
          >扫码登录</h4
          >
        </template>
        <template v-else>
          <h4
            class="title-btn"
            :class="loginType === 'sms' ? 'active' : ''"
            @click="onLoginType('sms')"
          >短信登录</h4
          >
          <a-divider type="vertical" style="height: 20px"/>
          <h4
            class="title-btn"
            :class="loginType === 'account' ? 'active' : ''"
            @click="onLoginType('account')"
          >密码登录</h4
          >
        </template>
      </div>
      <div class="login-bar absolute top-0 z-50 right-0 cursor-pointer" @click="onScan">
        <div class="go-to-register cursor-pointer">
          <img src="https://img.alicdn.com/imgextra/i3/O1CN01yz6fEl1MwaRtkJyvf_!!6000000001499-55-tps-70-70.svg"
               alt=""/>
        </div>
        <div class="absolute top-3 right-3 text-lg text-white font-bold cursor-pointer">
          <QrcodeOutlined/>
        </div>
        <!--        <span class="absolute top-3 right-1.5 text-sm text-white font-bold cursor-pointer">{{ '登录' }}</span>-->
      </div>
      <template v-if="loginType === 'account'">
        <a-form-item name="userId">
          <a-input
            allow-clear
            size="large"
            v-model:value="form.userId"
            :placeholder="`请输入用户ID`"
          >
            <template #prefix>
              <UserOutlined/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            size="large"
            v-model:value="form.password"
            placeholder="请输入登录密码"
            @pressEnter="submit"
          >
            <template #prefix>
              <lock-outlined/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="code">
          <div class="login-input-group">
            <a-input
              allow-clear
              size="large"
              type="text"
              :maxlength="5"
              v-model:value="form.code"
              placeholder="图形验证码"
              @pressEnter="submit"
            >
              <template #prefix>
                <safety-certificate-outlined/>
              </template>
            </a-input>
            <a-button class="login-captcha" @click="changeCaptcha">
              <img v-if="captcha" :src="captcha" alt=""/>
            </a-button>
          </div>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="form.remember">
            {{ t('login.remember') }}
          </a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button
            block
            size="large"
            type="primary"
            :loading="loading"
            @click="submit"
          >
            {{ loading ? t('login.loading') : t('login.login') }}
          </a-button>
<!--          <div class="register text-center pt-5"><a @click="push('/register')">免费注册</a></div>-->
        </a-form-item>
      </template>
      <template v-if="loginType === 'sms'">
        <a-form-item name="phone">
          <a-input
            allow-clear
            size="large"
            :maxlength="11"
            v-model:value="form.phone"
            :placeholder="`请输入手机号码`"
          >
            <template #addonBefore> +86</template>
          </a-input>
        </a-form-item>
        <a-form-item name="smsCode">
          <div class="login-input-group">
            <a-input
              placeholder="请输入验证码"
              v-model:value="form.smsCode"
              size="large"
              :maxlength="6"
              allow-clear
              @pressEnter="onLoginBySms"
            />
            <a-button
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
            @click="onLoginBySms"
          >
            {{ loading ? t('login.loading') : t('login.login') }}
          </a-button>
<!--          <div class="register text-center pt-5"><a @click="push('/register')">免费注册</a></div>-->
        </a-form-item>
      </template>
      <template v-if="loginType == 'scan'">
        二维码
      </template>
    </a-form>
    <div class="login-copyright">
      <a-space>
        <span>© {{ new Date().getFullYear() }}</span>
        <span>{{ config?.copyright || 'websoft.top Inc.' }}</span>
      </a-space>
    </div>
    <!-- 编辑弹窗 -->
    <a-modal
      :width="340"
      :footer="null"
      title="发送验证码"
      v-model:visible="visible"
    >
      <div class="login-input-group" style="margin-bottom: 16px">
        <a-input
          v-model:value="imgCode"
          :maxlength="5"
          size="large"
          placeholder="请输入图形验证码"
          allow-clear
          @pressEnter="sendCode"
        />
        <a-button class="login-captcha">
          <img alt="" :src="captcha" @click="changeCaptcha"/>
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

    <!-- 多账户选择登录 -->
    <a-modal
      :width="500"
      :footer="null"
      title="选择账号登录"
      v-model:visible="showSelectLoginUser"
    >
      <div class="flex flex-col justify-start">
        <a-list item-layout="horizontal" :data-source="admins">
          <template #renderItem="{ item }">
            <a-list-item class="cursor-pointer hover:border-gray-100" @click="onSelectUser(item)">
              <a-list-item-meta
                :description="`租户ID: ${item.tenantId}`"
              >
                <template #title>
                  {{ item.tenantName }}
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar"/>
                </template>
              </a-list-item-meta>
              <template #actions>
                <RightOutlined/>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, unref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {Form, message} from 'ant-design-vue';
import {
  LockOutlined,
  UserOutlined,
  QrcodeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons-vue';
import {goHomeRoute, cleanPageTabs} from '@/utils/page-tab-util';
import {login, loginBySms, getCaptcha} from '@/api/passport/login';

import {User} from '@/api/system/user/model';
import {TEMPLATE_ID, THEME_STORE_NAME} from '@/config/setting';
import {sendSmsCaptcha} from '@/api/passport/login';
import useFormData from '@/utils/use-form-data';
import {FormInstance} from 'ant-design-vue/es/form';
import {configWebsiteField} from '@/api/cms/cmsWebsiteField';
import {Config} from '@/api/cms/cmsWebsiteField/model';
import {phoneReg} from 'ele-admin-pro';
import {push} from "@/utils/common";
import router from "@/router";
import {listAdminsByPhoneAll} from "@/api/system/user";
// import {pageOrderGoods} from "@/api/system/orderGoods";
// import {push} from "@/utils/common";

const useForm = Form.useForm;
const {currentRoute} = useRouter();
const {t} = useI18n();
const {locale} = useI18n();

// 登录框方向, 0 居中, 1 居右, 2 居左
const direction = ref(0);
// 加载状态
const loading = ref(false);
// 是否显示tenantId填写输入框
const showTenantId = ref(true);
const loginType = ref('sms');
const config = ref<Config>();
// 配置信息
const {form} = useFormData<User>({
  userId: undefined,
  username: '',
  phone: '',
  password: '',
  code: '',
  smsCode: '',
  tenantId: undefined,
  templateId: TEMPLATE_ID,
  isSuperAdmin: true,
  remember: true
});

// 验证码 base64 数据
const captcha = ref('');
// 验证码内容, 实际项目去掉
const text = ref('');
// 是否显示图形验证码弹窗
const visible = ref(false);
// 图形验证码
const imgCode = ref('');
// 发送验证码按钮loading
const codeLoading = ref(false);
// 验证码倒计时时间
const countdownTime = ref(0);
// 验证码倒计时定时器
let countdownTimer: number | null = null;
// 多用户选择账号登录
const showSelectLoginUser = ref<boolean>(false)
const admins = ref<User[]>([]);
// const tenantId = getTenantId();

// 表格选中数据
const formRef = ref<FormInstance | null>(null);

// 表单验证规则
const rules = reactive({
  userId: [
    {
      required: true,
      message: t('login.username'),
      type: 'string'
    }
  ],
  phone: [
    {
      pattern: phoneReg,
      required: true,
      type: 'string',
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('login.password'),
      type: 'string'
    }
  ],
  code: [
    {
      required: true,
      message: t('login.code'),
      type: 'string'
    }
  ],
  smsCode: [
    {
      required: true,
      message: t('login.code'),
      type: 'string'
    }
  ]
});

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

/* 发送短信验证码 */
const sendCode = () => {
  if (!imgCode.value) {
    message.error('请输入图形验证码');
    return;
  }
  if (text.value !== imgCode.value.toLowerCase()) {
    message.error('图形验证码不正确');
    return;
  }
  codeLoading.value = true;
  sendSmsCaptcha({phone: form.phone}).then((res) => {
    message.success('短信验证码发送成功, 请注意查收!');
    visible.value = false;
    codeLoading.value = false;
    countdownTime.value = 30;
    // 开始对按钮进行倒计时
    countdownTimer = window.setInterval(() => {
      if (countdownTime.value <= 1) {
        countdownTimer && clearInterval(countdownTimer);
        countdownTimer = null;
      }
      countdownTime.value--;
    }, 1000);
  });
};

// const { clearValidate, validate, validateInfos } = useForm(form, rules);

const {resetFields} = useForm(form, rules);

const goHome = () => {
  const {query} = unref(currentRoute);
  goHomeRoute(query.from as string);
  localStorage.removeItem(THEME_STORE_NAME);
};

const onLoginBySms = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      form.code = form.smsCode?.toLowerCase();
      loginBySms(form)
        .then((msg) => {
          if (msg == '请选择登录用户') {
            showSelectLoginUser.value = true;
            listAdminsByPhoneAll({phone: form.phone, templateId: TEMPLATE_ID}).then(data => {
              admins.value = data;
            })
            return false;
          } else {
            message.success(msg);
            loading.value = false;
            resetFields();
            cleanPageTabs();
            goHome();
          }
        })
        .catch((e: Error) => {
          message.error(e.message);
          loading.value = false;
        });
    })
    .catch(() => {
    });
};

const onSelectUser = (item: User) => {
  form.tenantId = item.tenantId;
  onLoginBySms();
}

/* 保存编辑 */
const submit = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      // if (form.code?.toLowerCase() !== text.value) {
      //   message.error('验证码错误');
      //   changeCaptcha();
      //   return;
      // }
      loading.value = true;
      form.code = form.code?.toLowerCase();
      form.phone = undefined;
      login(form)
        .then((msg) => {
          if(msg == '请选择登录用户'){
            showSelectLoginUser.value = true;
            return false;
          }
          // 登录成功
          message.success(msg);
          loading.value = false;
          resetFields();
          cleanPageTabs();
          goHome();
        })
        .catch((e: Error) => {
          message.error(e.message);
          loading.value = false;
        });
    })
    .catch(() => {
    });
};

// const doRegister = () => {
//   registerUser(form)
//     .then(() => {
//       loading.value = false;
//       message.success('注册成功');
//     })
//     .catch((e) => {
//       loading.value = false;
//       message.error(e.message);
//     });
// };

const onLoginType = (text) => {
  loginType.value = text;
};

const onScan = () => {
  if(loginType.value == 'scan'){
    loginType.value = 'sms'
  }else {
    loginType.value = 'scan'
  }
}

// const goBack = () => {
//   openUrl(getDomain());
//   return;
// };

const loginConnect = () => {
  // getWxWorkQrConnect().then((result) => {
  //   console.log(result);
  //   qrConnect.value = result;
  // });
};

/* 获取图形验证码 */
const changeCaptcha = () => {
  configWebsiteField({lang: locale.value}).then((data) => {
    config.value = data;
  });
  // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
  getCaptcha()
    .then((data) => {
      captcha.value = data.base64;
      // 实际项目后端一般会返回验证码的key而不是直接返回验证码的内容, 登录用key去验证, 你可以根据自己后端接口修改
      text.value = data.text;
      // 自动回填验证码, 实际项目去掉这个
      // form.code = data.text;
      // resetFields();
    })
    .catch((e) => {
      message.error(e.message);
    });
};

// 首次加载
changeCaptcha();
loginConnect();

watch(
  router.currentRoute,
  (data) => {
    if(data.query?.loginPhone){
      form.phone = `${data.query?.loginPhone}`;
    }else {
      localStorage.clear();
    }
  },
  {immediate: true}
);
</script>

<style lang="less" scoped>
/* 背景 */
.login-wrapper {
  padding: 48px 16px 0 16px;
  position: relative;
  box-sizing: border-box;
  background-image: url('@/assets/bg-2.jpeg');
  background-color: var(--grey-5);
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }
}

.company-name {
  position: absolute;
  top: 17%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #ffffff;
}

/* 卡片 */
.login-form {
  width: 380px;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 28px;
  box-sizing: border-box;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  position: relative;
  z-index: 2;

  h4 {
    padding: 22px 0;
    text-align: center;
  }

  .title-btn {
    cursor: pointer;
  }

  .login-title {
    display: flex;
    justify-content: space-around;
    line-height: 50px;

    .active {
      color: #007dff;
    }
  }
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
  background-repeat: no-repeat;

  :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }

  .login-captcha {
    width: 102px;
    height: 40px;
    margin-left: 10px;
    padding: 0;

    & > img {
      width: 100%;
      height: 100%;
    }
  }
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #fff;
  padding: 5px;
  margin: 0 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

.work-icon {
  width: 50px;
  height: 50px;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  text-align: center;
  padding: 48px 0 22px 0;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 640px) {
  .login-wrapper {
    padding-top: 0;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -230px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -230px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    margin-left: 0;
    margin-right: auto;
    transform: translateX(-50%);
  }
}

.wwLogin_qrcode_head {
  padding: 10px 0 40px 0 !important;
}

.logo-login {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    width: 28px;
    height: 28px;
    border-radius: 4px;
  }

  h4 {
    margin-left: 6px;
    color: #ffffff;
    font-size: 20px;
  }
}
</style>
