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
        <h4
            class="title-btn"
        >注册</h4
        >
      </div>
      <template v-if="loginType === 'account'">
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
        <a-form-item name="code">
          <div class="login-input-group">
            <a-input
              placeholder="请输入验证码"
              v-model:value="form.code"
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
        <a-form-item name="companyName">
          <div class="flex">
            <a-input
              allow-clear
              size="large"
              placeholder="公众号|小程序名称"
              v-model:value="form.companyName"
            >
            </a-input>
            <a-button
              class="ele-btn-icon"
              size="large"
              style="margin-left: 10px; width: 137px"
              @click="openMapPicker"
            >
              <AimOutlined />选取
            </a-button>
          </div>
        </a-form-item>
<!--        <a-form-item name="companyName">-->
<!--          <a-input-->
<!--            allow-clear-->
<!--            size="large"-->
<!--            :maxlength="11"-->
<!--            v-model:value="form.companyName"-->
<!--            :placeholder="`请输入店铺名称`"-->
<!--          />-->
<!--        </a-form-item>-->
<!--        <a-form-item name="email">-->
<!--          <a-input-->
<!--            allow-clear-->
<!--            size="large"-->
<!--            v-model:value="form.email"-->
<!--            :placeholder="`(选填)请输入电子邮箱`"-->
<!--          />-->
<!--        </a-form-item>-->
        <a-form-item name="category">
          <industry-select
            v-model:value="form.category"
            valueField="label"
            allow-clear
            size="large"
            placeholder="所属行业"
            class="ele-fluid"
            @change="onIndustry"
          />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="form.remember">
            同意 <a href="https://website.websoft.top/xieyi/01.html" target="_blank">《服务协议及隐私政策》</a>
          </a-checkbox>
        </a-form-item>
        <a-form-item>
          <a-button
              block
              size="large"
              type="primary"
              :disabled="!form.remember"
              :loading="loading"
              @click="submit"
          >
            注册
          </a-button>
          <div class="register text-center pt-5"><a @click="push('/login')">已有账号，立即登录</a></div>
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
        <a-form-item name="code">
          <div class="login-input-group">
            <a-input
                placeholder="请输入验证码"
                v-model:value="form.code"
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
        </a-form-item>
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
  </div>
  <!-- 地图位置选择弹窗 -->
  <ele-map-picker
    :need-city="true"
    :dark-mode="darkMode"
    v-model:visible="showMap"
    :center="[108.374959, 22.767024]"
    :search-type="1"
    :zoom="12"
    @done="onDone"
  />
</template>

<script lang="ts" setup>
import {ref, reactive, unref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {getTenantId} from '@/utils/domain';
import {Form, message} from 'ant-design-vue';
import { AimOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import {goHomeRoute, cleanPageTabs} from '@/utils/page-tab-util';
import {loginBySms, getCaptcha} from '@/api/passport/login';
import { CenterPoint } from 'ele-admin-pro/es/ele-map-picker/types';
import {TEMPLATE_ID, THEME_STORE_NAME} from '@/config/setting';
import {sendSmsCaptcha} from '@/api/passport/login';
import useFormData from '@/utils/use-form-data';
import {FormInstance} from 'ant-design-vue/es/form';
import {configWebsiteField} from '@/api/cms/cmsWebsiteField';
import {Config} from '@/api/cms/cmsWebsiteField/model';
import {phoneReg} from 'ele-admin-pro';
import {push} from "@/utils/common";
import {useThemeStore} from "@/store/modules/theme";
import {CmsWebsite} from "@/api/cms/cmsWebsite/model";
import {createCmsWebSite} from "@/api/layout";

const useForm = Form.useForm;
const {currentRoute} = useRouter();
const {t} = useI18n();
const { locale } = useI18n();

// 登录框方向, 0 居中, 1 居右, 2 居左
const direction = ref(0);
// 加载状态
const loading = ref(false);
// 是否显示tenantId填写输入框
const showTenantId = ref(true);
const loginType = ref('account');
const config = ref<Config>();
// 是否开启响应式布局
const themeStore = useThemeStore();
const { darkMode } = storeToRefs(themeStore);

// 配置信息
const {form} = useFormData<CmsWebsite>({
// 站点ID
  websiteId: undefined,
  // 网站名称
  websiteName: undefined,
  // 网站标识
  websiteCode: undefined,
  // 网站LOGO
  websiteIcon: undefined,
  // 网站LOGO
  websiteLogo: undefined,
  // 网站LOGO(深色模式)
  websiteDarkLogo: undefined,
  // 网站类型
  websiteType: undefined,
  // 网站关键词
  keywords: undefined,
  // 域名前缀
  prefix: undefined,
  // 绑定域名
  domain: undefined,
  // 全局样式
  style: undefined,
  // 后台管理地址
  adminUrl: undefined,
  // 应用版本 10标准版 20专业版 30永久授权
  version: undefined,
  // 服务到期时间
  expirationTime: undefined,
  // 模版ID
  templateId: TEMPLATE_ID,
  // 行业类型(父级)
  industryParent: undefined,
  // 行业类型(子级)
  industryChild: undefined,
  // 企业ID
  companyId: undefined,
  // 所在国家
  country: undefined,
  // 所在省份
  province: undefined,
  // 所在城市
  city: undefined,
  // 所在辖区
  region: undefined,
  // 经度
  longitude: undefined,
  // 纬度
  latitude: undefined,
  // 街道地址
  address: undefined,
  // 联系电话
  phone: undefined,
  // 电子邮箱
  email: undefined,
  // ICP备案号
  icpNo: undefined,
  // 公安备案
  policeNo: undefined,
  // 备注
  comments: undefined,
  // 是否推荐
  recommend: undefined,
  // 是否运行中
  running: undefined,
  // 状态 0未开通 1运行中 2维护中 3已关闭 4已欠费停机 5违规关停
  status: undefined,
  // 维护说明
  statusText: undefined,
  // 关闭说明
  statusClose: undefined,
  // 全局样式
  styles: undefined,
  // 语言
  lang: undefined,
  // 排序号
  sortNumber: undefined,
  // 用户ID
  userId: undefined,
  // 是否删除, 0否, 1是
  deleted: undefined,
  // 租户id
  tenantId: undefined,
  // 创建时间
  createTime: undefined,
  // 修改时间
  updateTime: undefined,
  // 网站配置
  config: undefined,
  // 短信验证码
  smsCode: undefined,
  // 短信验证码
  code: undefined,
  // 是否管理员
  isSuperAdmin: true,
  // 企业名称
  companyName: undefined,
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
// 是否显示地图选择弹窗
const showMap = ref(false);

// 表格选中数据
const formRef = ref<FormInstance | null>(null);

// 表单验证规则
const rules = reactive({
  companyName: [
    {
      required: true,
      message: '请输入店铺名称',
      type: 'string'
    }
  ],
  category: [
    {
      required: true,
      message: '请选择行业分类',
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
  // address: [
  //   {
  //     required: true,
  //     message: '请选择店铺位置',
  //     type: 'string'
  //   }
  // ],
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
  sendSmsCaptcha({phone: form.phone}).then(() => {
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

const {resetFields} = useForm(form, rules);

const goHome = () => {
  const {query} = unref(currentRoute);
  goHomeRoute(query.from as string);
  localStorage.removeItem(THEME_STORE_NAME);
};

const onIndustry = (item: any) => {
  form.industryParent = item[0];
  form.industryChild = item[1];
  form.category = `${item[0]}/${item[1]}`;
};

/* 打开位置选择 */
const openMapPicker = () => {
  showMap.value = true;
};

/* 地图选择后回调 */
const onDone = (location: CenterPoint) => {
  if (location) {
    console.log(location);
    form.companyName = `${location.name}`;
    form.province = `${location.city?.province}`;
    form.city = `${location.city?.city}`;
    form.region = `${location.city?.district}`;
    form.address = `${location.address}`;
    form.longitude = `${location.lng}`;
    form.latitude = `${location.lat}`;
  }
  showMap.value = false;
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

/* 保存编辑 */
const submit = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        createCmsWebSite(form)
            .then((msg) => {
              setTimeout(() => {
                // 登录成功
                message.success(msg);
                loading.value = false;
                resetFields();
                cleanPageTabs();
                goHome();
              }, 2000)
            })
            .catch(() => {
              message.error('该手机号码已经被注册');
              loading.value = false;
            });
      })
      .catch(() => {
      });
};

/* 获取图形验证码 */
const changeCaptcha = () => {
  configWebsiteField({
    lang: locale.value
  }).then((data) => {
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

watch(
    currentRoute,
    () => {
      // 解析二级域名获取租户ID
      const tenantId = getTenantId();
      if (tenantId) {
        form.tenantId = Number(tenantId);
        showTenantId.value = false;
      }
      const tid = localStorage.getItem('TenantId');
      if (tid) {
        form.tenantId = Number(tid);
        showTenantId.value = false;
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
  width: 450px;
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
