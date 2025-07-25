<template>
  <a-page-header
    :title="title"
    :sub-title="subTitle"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-tabs v-model:activeKey="activeKey" @change="onTabs">
        <a-tab-pane key="free" tab="免费热门" />
        <a-tab-pane key="pay" tab="付费热门" />
        <a-tab-pane key="new" tab="最新上架" />
        <a-tab-pane key="collect" tab="我的收藏" />
      </a-tabs>
    </template>
    <template v-if="list.length > 0">
      <a-row :gutter="16">
        <a-col
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 12 }
          "
          class="gutter-row"
          v-for="(item, index) in list"
          :key="index"
          :span="6"
        >
          <a-card class="gutter-box" hoverable>
            <div class="plug-item">
              <a-image
                :height="80"
                :width="80"
                :preview="false"
                :src="item.companyLogo"
                style="margin-right: 10px"
                fallback="https://file.wsdns.cn/20230218/550e610d43334dd2a7f66d5b20bd58eb.svg"
              />
              <div class="info">
                <a
                  class="name ele-text-heading"
                  @click="openUrl('/system/plug/detail/' + item.companyId)"
                  >{{ item.tenantName }}</a
                >
                <a-rate
                  class="rate"
                  v-model:value="rate"
                  disabled
                  allow-half
                />
                <div class="company ele-text-placeholder">
                  <a-typography-paragraph
                    type="secondary"
                    :ellipsis="{ rows: 2, expandable: true, symbol: '...' }"
                  >
                    {{ item.companyName }}
                  </a-typography-paragraph>
                </div>
              </div>
            </div>
            <div class="plug-desc ele-text-secondary">
              <a-typography-paragraph
                type="secondary"
                :ellipsis="{ rows: 2, expandable: true, symbol: '显示' }"
                :content="item.comments"
              />
            </div>
            <div class="plug-bottom">
              <div
                class="downloads ele-text-placeholder"
                @click="() => openNotification('success', '开发中')"
              >
                安装 {{ item.clicks }}</div
              >
              <a-button type="primary" disabled v-if="planId === item.tenantId"
                >已安装</a-button
              >
              <a-button v-else type="primary" @click="onClone(item)"
                >安装</a-button
              >
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </a-page-header>
</template>

<script lang="ts" setup>
  import { ref, unref, watch } from 'vue';
  import { pageCompanyAll } from '@/api/system/company';
  import { Company, CompanyParam } from '@/api/system/company/model';
  import { openUrl } from '@/utils/common';
  import { notification } from 'ant-design-vue';
  import useSearch from '@/utils/use-search';
  import { useRouter } from 'vue-router';
  import { setPageTabTitle } from '@/utils/page-tab-util';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { onClone } from '@/utils/plug-uitl';
  import { message } from 'ant-design-vue/es';
  const ROUTE_PATH = '/system/plug/list';
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const rate = ref(3.5);
  const title = ref('Tenant');
  const subTitle = ref('租户系统');
  const { currentRoute } = useRouter();
  const list = ref<Company[]>([]);
  const searchText = ref('');
  const activeKey = ref('free');
  const planId = ref<number>(Number(localStorage.getItem('PlanId')));

  /**
   * 通知提醒框
   */
  const openNotification = (type: string, text: string) => {
    notification[type]({
      message: '通知提醒框',
      description: text
    });
  };

  // 查询条件
  const { where, resetFields } = useSearch<CompanyParam>({
    keywords: undefined,
    limit: 500,
    recommend: undefined,
    authoritative: 1,
    sort: 'buys',
    order: 'desc'
  });

  const onTabs = () => {
    resetFields();
    if (activeKey.value == 'new') {
      where.sort = 'createTime';
      where.order = 'desc';
    }
    if (activeKey.value == 'free') {
      where.sort = 'buys';
      where.order = 'desc';
    }
    if (activeKey.value == 'pay') {
      where.sort = 'likes';
      where.order = 'desc';
    }
    if (activeKey.value == 'collect') {
      where.sceneType = 'collect';
      where.limit = 0;
    }
    reload();
  };

  const reload = () => {
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    const hide = message.loading('加载中...');
    pageCompanyAll(where)
      .then((data) => {
        if (data?.list) {
          list.value = data.list;
        }
      })
      .finally(() => {
        hide();
      });
  };

  reload();

  watch(
    currentRoute,
    (route) => {
      const { path } = unref(route);
      if (path !== ROUTE_PATH) {
        return;
      }

      const { query } = unref(currentRoute);
      const { type } = query;
      if (type == 'Tenant') {
        title.value = 'Tenant';
        subTitle.value = '租户系统';
        setPageTabTitle('租户系统');
      } else if (type == 'Vue') {
        title.value = 'Vue';
        subTitle.value = 'Vue开发的应用';
        setPageTabTitle('Vue开发的应用');
      } else if (type == 'UniApp') {
        title.value = 'UniApp';
        subTitle.value = '使用UniApp开发的移动应用';
        setPageTabTitle('使用UniApp开发的移动应用');
      } else if (type == 'WebSite') {
        title.value = 'WebSite';
        subTitle.value = '网站应用';
        setPageTabTitle('网站应用');
      }
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  import * as PlugIcons from '@/layout/menu-icons';

  export default {
    name: 'SystemPlug',
    components: PlugIcons
  };
</script>

<style lang="less" scoped>
  .ele-body-card {
    background-color: transparent;
    padding: 20px;
  }

  .gutter-row {
    margin: 15px auto;
    .gutter-box {
      .plug-item {
        display: flex;
        .info {
          font-size: 14px;
          .name {
            font-size: 20px;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            font-weight: 500;
          }
          .rate {
            font-size: 13px;
          }
          .company {
          }
        }
      }
      .plug-desc {
        padding: 10px 0;
        font-size: 16px;
      }
      .plug-bottom {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
