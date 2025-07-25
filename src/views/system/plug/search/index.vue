<template>
  <a-page-header :title="title" @back="() => $router.go(-1)">
    <div
      style="
        display: flex;
        margin-bottom: 50px;
        flex-flow: column;
        align-items: center;
      "
    >
      <a-space style="flex-wrap: wrap">
        <a-input-search
          allow-clear
          size="large"
          style="width: 500px"
          placeholder="请输入搜索关键词"
          v-model:value="searchText"
          @pressEnter="reload"
          @search="reload"
        />
        <a-button size="large" @click="reset">重置</a-button>
      </a-space>
    </div>
    <div :bordered="false" class="ele-body-card">
      <ele-split-layout
        width="266px"
        :right-style="{ overflow: 'hidden' }"
        :style="{ minHeight: 'calc(100vh - 15px)' }"
      >
        <div class="ele-bg-white">
          <ele-toolbar theme="default">
            <div class="toolbar">
              <span>应用分类</span>
            </div>
          </ele-toolbar>
          <div class="ele-border-split sys-category-list"> </div>
        </div>
        <template #content>
          <div v-if="list.length > 0">
            <a-row :gutter="16">
              <a-col
                v-bind="styleResponsive ? { lg: 24 } : { span: 12 }"
                class="gutter-row"
                :span="6"
                v-for="(item, index) in list"
                :key="index"
              >
                <a-card class="gutter-box" hoverable>
                  <div class="plug-item">
                    <a-image
                      :height="80"
                      :width="80"
                      :preview="false"
                      :src="item.companyLogo"
                      @click="
                        openUrl('/system/plug/detail/' + item.companyId)
                      "
                      fallback="https://file.wsdns.cn/20230218/550e610d43334dd2a7f66d5b20bd58eb.svg"
                    />
                    <div class="info">
                      <a
                        class="name ele-text-heading"
                        @click="
                          openUrl('/system/plug/detail/' + item.companyId)
                        "
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
                          :ellipsis="{
                            rows: 2,
                            expandable: true,
                            symbol: '...'
                          }"
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
                    <a-button
                      type="primary"
                      disabled
                      v-if="planId === item.tenantId"
                      >已安装</a-button
                    >
                    <a-button v-else type="primary" @click="onClone(item)"
                      >安装</a-button
                    >
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
          <a-space
            v-if="count > 0"
            style="display: flex; justify-content: center"
          >
            <a-pagination
              v-model:current="current"
              :total="count"
              @change="onChange"
            />
          </a-space>
        </template>
      </ele-split-layout>
    </div>
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
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { onClone } from '@/utils/plug-uitl';
  const ROUTE_PATH = '/system/plug/search';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const rate = ref(3.5);
  const title = ref('搜索');
  const { currentRoute } = useRouter();
  const list = ref<Company[]>([]);
  const searchText = ref('');
  const current = ref(1);
  const count = ref(0);
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
    companyName: undefined,
    limit: 10,
    recommend: undefined,
    authoritative: 1,
    page: 1,
    sort: 'buys',
    order: 'desc'
  });

  const onChange = (page) => {
    where.page = page;
    reload();
  };

  const reset = () => {
    searchText.value = '';
    resetFields();
    reload();
  };

  const reload = () => {
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    pageCompanyAll(where).then((data) => {
      if (data?.list) {
        list.value = data.list;
        count.value = data.count;
      }
    });
  };

  watch(
    currentRoute,
    (route) => {
      const { path } = unref(route);
      if (path !== ROUTE_PATH) {
        return;
      }

      const { query } = unref(currentRoute);
      const { type, keywords, companyName } = query;
      if (companyName) {
        where.companyName = String(companyName);
        searchText.value = String(companyName);
      }
      if (keywords) {
        searchText.value = String(keywords);
      }
      reload();
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
    padding: 0;
  }

  .gutter-row {
    margin-bottom: 30px;
    .gutter-box {
      .plug-item {
        display: flex;
        .info {
          margin-left: 10px;
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
  .sys-category-list {
    padding: 12px 6px;
    height: calc(100vh - 242px);
    border-width: 1px;
    border-style: solid;
    overflow: auto;
  }
  .toolbar {
    display: flex;
    justify-content: space-between;
  }
</style>
