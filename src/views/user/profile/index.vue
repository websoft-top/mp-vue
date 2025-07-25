<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col
        v-bind="
          styleResponsive
            ? { xxl: 6, xl: 7, lg: 9, md: 10, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-card :bordered="false">
          <div class="ele-text-center">
            <div class="user-info-avatar-group" @click="openCropper">
              <a-avatar :size="110" :src="form.avatar">
                <template v-if="!form.avatar" #icon>
                  <user-outlined />
                </template>
              </a-avatar>
              <upload-outlined class="user-info-avatar-icon" />
            </div>
            <h1>{{ loginUser.nickname }}</h1>
            <div>{{ loginUser.introduction }}</div>
          </div>
          <div class="user-info-list">
            <div class="ele-cell">
              <ShopOutlined />
              <div class="ele-cell-content">
                <a-tooltip
                  class="ele-cell"
                  title="门店名称"
                  placement="topLeft"
                >
                  {{ loginUser.merchantName || tenantName }}
                </a-tooltip>
              </div>
            </div>
            <div class="ele-cell">
              <IdcardOutlined />
              <div class="px-3">
                    <a-tag v-for="(d, i) in loginUser.roles" :key="i">
                      {{ d.roleName }}
                    </a-tag>
              </div>
            </div>
<!--            <div class="ele-cell">-->
<!--              <SolutionOutlined />-->
<!--              <div class="ele-cell-content">-->
<!--                <a-tooltip-->
<!--                  class="ele-cell"-->
<!--                  title="所属部门"-->
<!--                  placement="topLeft"-->
<!--                >-->
<!--                  {{ loginUser.organizationName }}-->
<!--                </a-tooltip>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="ele-cell">-->
<!--              <VerifiedOutlined />-->
<!--              <div class="ele-cell-content">-->
<!--                <div class="ele-cell">-->
<!--                  {{ loginUser.gradeName }}-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
            <div class="ele-cell">
              <environment-outlined />
              <div class="ele-cell-content">
                {{ loginUser.province }} • {{ loginUser.city }} •
                {{ loginUser.region }} {{ loginUser.address }}
              </div>
            </div>
            <div class="ele-cell">
              <mail-outlined />
              <div class="ele-cell-content">
                {{ loginUser.email }}
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xxl: 14, xl: 14, lg: 15, md: 14, sm: 24, xs: 24 }
            : { span: 18 }
        "
      >
        <a-card
          :bordered="false"
          :body-style="{ paddingTop: '0px', minHeight: '600px' }"
        >
          <a-tabs v-model:active-key="active" size="large">
            <a-tab-pane tab="基本信息" key="info">
              <a-form
                :label-col="
                  styleResponsive
                    ? { lg: 4, md: 6, sm: 4, xs: 24 }
                    : { flex: '100px' }
                "
                :wrapper-col="
                  styleResponsive
                    ? { lg: 20, md: 18, sm: 20, xs: 24 }
                    : { flex: '1' }
                "
                style="max-width: 580px; margin-top: 20px"
              >
                <a-form-item label="登录账号" v-bind="validateInfos.username">
                  <a-input
                    disabled
                    v-model:value="form.username"
                    placeholder="请输入登录账号"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item label="手机号码" v-bind="validateInfos.phone">
                  <a-input
                    :disabled="form.phone"
                    v-model:value="form.phone"
                    placeholder="请输入手机号码"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item label="昵称" v-bind="validateInfos.nickname">
                  <a-input
                    v-model:value="form.nickname"
                    placeholder="请输入昵称"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item label="邮箱" v-bind="validateInfos.email">
                  <a-input
                    v-model:value="form.email"
                    placeholder="请输入邮箱"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item label="性别">
                  <a-radio-group v-model:value="form.sex">
                    <a-radio value="1">男</a-radio>
                    <a-radio value="2">女</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="个人简介">
                  <a-textarea
                    v-model:value="form.introduction"
                    placeholder="请输入个人简介"
                    :rows="4"
                  />
                </a-form-item>
                <a-form-item label="所在地区" name="region">
                  <div class="flex-sb">
                    <regions-select
                      v-model:value="city"
                      valueField="label"
                      placeholder="请选择省市区"
                      class="ele-fluid"
                    />
                  </div>
                </a-form-item>
                <a-form-item label="街道地址">
                  <a-input
                    v-model:value="form.address"
                    placeholder="请输入街道地址"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  :wrapper-col="
                    styleResponsive
                      ? {
                          lg: { offset: 4 },
                          md: { offset: 6 },
                          sm: { offset: 4 }
                        }
                      : { offset: 4 }
                  "
                >
                  <a-button type="primary" :loading="loading" @click="save">
                    {{ loading ? '保存中..' : '保存更改' }}
                  </a-button>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
    <!-- 头像裁剪弹窗 -->
    <ele-cropper-modal
      :src="form.avatar"
      v-model:visible="visible"
      :to-blob="true"
      :options="{ autoCropArea: 1, viewMode: 1, dragMode: 'move' }"
      @done="onDone"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import {
    ShopOutlined,
    UploadOutlined,
    UserOutlined,
    IdcardOutlined,
    EnvironmentOutlined,
    SolutionOutlined,
    MailOutlined,
    VerifiedOutlined
  } from '@ant-design/icons-vue';
  import { Form, message } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import type { User } from '@/api/system/user/model';
  import { uploadOssAvatar } from '@/api/system/file';
  import { authUser } from '@/api/user';

  const useForm = Form.useForm;

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const userStore = useUserStore();

  // tab 页选中
  const active = ref('info');

  // 保存按钮 loading
  const loading = ref(false);

  // 是否显示裁剪弹窗
  const visible = ref(false);
  const tenantName = localStorage.getItem('TenantName');
  // 登录用户信息
  const loginUser = computed(() => userStore.info ?? {});

  // 表单数据
  const form = reactive<User>({
    // 用户id
    userId: loginUser.value.userId,
    // 登录账号
    username: loginUser.value.username,
    // 昵称
    nickname: loginUser.value.nickname,
    // 头像
    avatar: loginUser.value.avatar,
    // 性别(字典)
    sex: loginUser.value.sex,
    // 手机号
    phone: loginUser.value.phone,
    province: '',
    city: '',
    region: '',
    gradeId: loginUser.value.gradeId,
    gradeName: loginUser.value.gradeName,
    // 街道地址
    address: loginUser.value.address,
    // 邮箱
    email: loginUser.value.email,
    // 出生日期
    birthday: loginUser.value.birthday,
    // 个人简介
    introduction: loginUser.value.introduction,
    // 机构id
    organizationId: loginUser.value.organizationId,
    // 性别名称
    sexName: loginUser.value.sexName,
    // 机构名称
    organizationName: loginUser.value.organizationName
  });
  // 省市区
  const city = ref<string[]>([
    String(loginUser.value.province),
    String(loginUser.value.city),
    String(loginUser.value.region)
  ]);

  // 表单验证规则
  const rules = reactive({
    username: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    phone: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    nickname: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string'
      }
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        type: 'string'
      }
    ]
  });

  const { validate, validateInfos } = useForm(form, rules);

  /* 保存更改 */
  const save = () => {
    validate()
      .then(() => {
        loading.value = true;
        form.province = city.value[0];
        form.city = city.value[1];
        form.region = city.value[2];
        authUser(form).then(() => {
          loading.value = false;
          setTimeout(() => {
            message.success('保存成功');
          }, 500);
        });
      })
      .catch(() => {});
  };

  const onDone = (blob: Blob | null) => {
    // 裁剪完成的回调
    uploadOssAvatar(blob, 'avatar.png').then((res) => {
      form.avatar = res.path;
      visible.value = false;
      authUser(form).then(() => {
        loading.value = false;
        setTimeout(() => {
          message.success('保存成功');
        }, 500);
      });
    });
  };

  /* 打开图片裁剪 */
  const openCropper = () => {
    visible.value = true;
  };
</script>

<script lang="ts">
  export default {
    name: 'UserProfile'
  };
</script>

<style lang="less" scoped>
  /* 用户资料卡片 */
  .user-info-avatar-group {
    margin: 16px 0;
    display: inline-block;
    position: relative;
    cursor: pointer;

    .user-info-avatar-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 30px;
      display: none;
      z-index: 2;
    }

    &:hover .user-info-avatar-icon {
      display: block;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: transparent;
      transition: background-color 0.3s;
    }

    &:hover:after {
      background-color: rgb(228, 255, 215);
    }

    & + h1 {
      margin-bottom: 8px;
    }
  }

  /* 用户角色 */
  .role-list {
    padding-top: 22px;
  }

  /* 用户信息列表 */
  .user-info-list {
    margin: 47px 0 32px 0;

    .ele-cell + .ele-cell {
      margin-top: 16px;
    }

    & + .ant-divider {
      margin-bottom: 16px;
    }
  }

  /* 用户标签 */
  .user-info-tags {
    margin: 16px 0 4px 0;

    .ant-tag {
      margin: 0 12px 8px 0;
    }
  }

  /* 用户账号绑定列表 */
  .user-account-list {
    & > .ele-cell {
      padding: 16px 8px;
    }

    .user-account-icon {
      color: #fff;
      padding: 8px;
      font-size: 26px;
      border-radius: 50%;

      &.anticon-qq {
        background: #3492ed;
      }

      &.anticon-wechat {
        background: #4daf29;
      }

      &.anticon-alipay {
        background: #1476fe;
      }
    }
  }
</style>
