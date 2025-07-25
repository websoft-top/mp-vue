<!-- 顶栏右侧区域 -->
<template>
  <div class="ele-admin-header-tool">
    <!-- 消息通知 -->
    <div class="ele-admin-header-tool-item" @click="openUrl(`/user/notice`)">
      <header-notice/>
    </div>
    <!-- 全屏切换 -->
    <div
      :class="[
        'ele-admin-header-tool-item',
        { 'hidden-sm-and-down': styleResponsive }
      ]"
      @click="toggleFullscreen"
    >
      <fullscreen-exit-outlined v-if="fullscreen"/>
      <fullscreen-outlined v-else/>
    </div>
    <!-- 用户信息 -->
    <div class="ele-admin-header-tool-item">
      <a-dropdown placement="bottom" :overlay-style="{ minWidth: '280px' }">
        <div class="ele-admin-header-avatar">
          <a-avatar :src="loginUser?.avatar">
            <template v-if="!loginUser?.avatar" #icon>
              <user-outlined/>
            </template>
          </a-avatar>
          <span :class="{ 'hidden-sm-and-down': styleResponsive }">
            {{ loginUser.nickname }}
          </span>
          <down-outlined style="margin-left: 6px"/>
        </div>
        <template #overlay>
          <a-menu :selectable="false" @click="onUserDropClick">
            <a-card :bordered="false" :body-style="{ padding: '16px' }">
              <div class="user-profile">
                <div class="user-info">
                  <div class="nickname">
                    <div class="ele-text-placeholder">
                      <span class="text-gray-500 text-lg">{{
                          website?.websiteName
                        }}</span>
                    </div>
                    <div class="text-gray-400">
                      用户ID：<span class="ele-text-secondary" @click="copyText(loginUser.userId)">{{
                        loginUser.userId
                      }}</span>
                    </div>
                    <div class="text-gray-400">
                      昵称：<span class="ele-text-secondary">{{
                        loginUser.nickname
                      }}</span>
                    </div>
                    <div class="text-gray-400">
                      手机：<span class="ele-text-secondary">{{
                        loginUser.mobile
                      }}</span>
                    </div>
                    <div class="text-gray-400">
                      租户：<span class="ele-text-secondary" @click="copyText(loginUser.tenantId)">{{
                        loginUser.tenantId
                      }}</span>
                    </div>
                    <div class="text-gray-400">
                      角色：
                      <template
                        v-for="(item, index) in loginUser.roles"
                        :key="item.roleId"
                      >
                        <a-tag v-if="index === 0">
                          <div class="role-name">
                            <span>{{ item.roleName }}</span>
                          </div>
                        </a-tag>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </a-card>
            <a-menu-divider/>
            <a-menu-item key="profile">
              <div class="ele-cell">
                <div class="ele-cell-content"> {{ t('layout.header.profile') }}</div>
              </div>
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="password">
              <div class="ele-cell">
                <div class="ele-cell-content"> {{ t('layout.header.password') }}</div>
              </div>
            </a-menu-item>
            <template v-if="loginUser.username == 'admin' || loginUser.username == 'superAdmin'">
              <a-menu-divider/>
              <a-menu-item key="accessKey">
                <div class="ele-cell">
                  <div class="ele-cell-content"> {{ t('layout.header.accessKey') }}</div>
                </div>
              </a-menu-item>
              <a-menu-divider/>
              <a-menu-item key="system">
                <div class="ele-cell">
                  <div class="ele-cell-content"> {{ t('layout.header.system') }}</div>
                </div>
              </a-menu-item>
            </template>
            <a-menu-divider/>
            <a-menu-item key="logout">
              <div class="ele-cell" align="center">
                <div class="ele-cell-content">
                  {{ t('layout.header.logout') }}
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 主题设置 -->
<!--    <div class="ele-admin-header-tool-item" @click="openSetting">-->
<!--      <more-outlined/>-->
<!--    </div>-->
  </div>
  <!-- 修改密码弹窗 -->
  <password-modal v-model:visible="passwordVisible"/>
  <!-- 主题设置抽屉 -->
  <setting-drawer v-model:visible="settingVisible"/>
  <!-- 二维码 -->
  <Qrcode v-model:visible="showQrcode" :data="SiteUrl" @done="hideShare"/>
</template>

<script lang="ts" setup>
import {computed, createVNode, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {Modal} from 'ant-design-vue/es';
import {
  DownOutlined,
  ExclamationCircleOutlined,
  FullscreenOutlined,
  MoreOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue';
import {storeToRefs} from 'pinia';
import {copyText, openUrl} from '@/utils/common';
import {useThemeStore} from '@/store/modules/theme';
import HeaderNotice from './header-notice.vue';
import PasswordModal from './password-modal.vue';
import SettingDrawer from './setting-drawer.vue';
import {useUserStore} from '@/store/modules/user';
import {logout} from '@/utils/page-tab-util';
import {listRoles} from '@/api/system/role';
import {getSiteInfo} from "@/api/layout";
import {CmsWebsite} from "@/api/cms/cmsWebsite/model";
import Qrcode from "@/components/QrCode/index.vue";

// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);
const SiteUrl = localStorage.getItem('SiteUrl');
// 是否显示二维码
const showQrcode = ref(false);
// const TENANT_ID = localStorage.getItem('TenantId');
// const TENANT_NAME = localStorage.getItem('TenantName');
const emit = defineEmits<{
  (e: 'fullscreen'): void;
}>();

defineProps<{
  // 是否是全屏
  fullscreen: boolean;
}>();

const {push} = useRouter();
const {t} = useI18n();
const userStore = useUserStore();
// 是否显示修改密码弹窗
const passwordVisible = ref(false);

// 是否显示主题设置抽屉
const settingVisible = ref(false);

// 当前用户信息
const loginUser = computed(() => userStore.info ?? {});
const website = ref<CmsWebsite>();

/* 用户信息下拉点击 */
const onUserDropClick = ({key}) => {
  if (key === 'password') {
    passwordVisible.value = true;
  } else if (key === 'profile') {
    push('/user/profile');
  } else if (key === 'accessKey') {
    push('/system/access-key');
  } else if (key === 'taskAdd') {
    push('/user/task/add');
  } else if (key === 'myTask') {
    push('/user/task/index');
  } else if (key === 'skin') {
    settingVisible.value = true;
  } else if (key === 'system') {
    push('/system/setting');
  } else if (key === 'logout') {
    // 退出登录
    Modal.confirm({
      title: t('layout.logout.title'),
      content: t('layout.logout.message'),
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        logout();
      }
    });
  }
};

const onQrCode = () => {
  showQrcode.value = true;
}

const hideShare = () => {
  showQrcode.value = false;
}

/* 打开主题设置抽屉 */
const openSetting = () => {
  settingVisible.value = true;
};

/* 切换全屏 */
const toggleFullscreen = () => {
  emit('fullscreen');
};

const reload = () => {
  // 查询网站信息
  if (!localStorage.getItem('Domain')) {
    getSiteInfo().then((data) => {
      localStorage.setItem('Domain', `${data.domain}`)
      localStorage.setItem('SiteUrl', `${data.prefix}${data.domain}`)
    })
  }
  // 查询商户角色的roleId
  if (!localStorage.getItem('RoleIdByMerchant')) {
    listRoles({roleCode: 'merchant'}).then((res) => {
      if (res.length > 0) {
        const item = res[0];
        localStorage.setItem('RoleIdByMerchant', `${item.roleId}`);
        localStorage.setItem('RoleNameByMerchant', `${item.roleName}`);
      }
    });
  }
};

reload();
</script>

<script lang="ts">
import * as icons from '@/layout/menu-icons';

export default {
  components: icons,
  data() {
    return {
      iconData: [
        {
          title: '已引入的图标',
          icons: Object.keys(icons)
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.ant-select {
  color: #bfbfbf;
}

.user-profile {
  display: flex;

  .user-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nickname {
      display: flex;
      flex-direction: column;
    }
  }
}

.ele-admin-header-tool-item {
  :deep(.ant-select-tree-switcher) {
    background-color: #ff00fe;
  }

  :deep(.ant-select-tree-indent) {
    display: none;
  }
}
</style>
