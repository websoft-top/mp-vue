<template>
  <a-card
    style="background-color: transparent"
    :bordered="false"
    :body-style="{ padding: '0px' }"
  >
    <a-alert
      message="欢迎使用"
      description="请选择需要安装的插件"
      type="success"
      show-icon
      closable
    />
    <div style="margin: 30px auto; display: flex; justify-content: center">
      <a-space style="flex-wrap: wrap">
        <industry-select
          v-model:value="industry"
          valueField="label"
          size="large"
          placeholder="按行业筛选"
          class="ele-fluid"
          @change="onIndustry"
        />
        <a-input-search
          allow-clear
          size="large"
          style="width: 360px"
          placeholder="请输入搜索关键词"
          v-model:value="where.keywords"
          @pressEnter="reload"
          @search="reload"
        />
        <a-button size="large" @click="reset">重置</a-button>
      </a-space>
    </div>
    <a-tabs v-model:active-key="where.sceneType" @change="onTabs">
      <a-tab-pane tab="热门推荐" key="recommend" />
      <a-tab-pane tab="免费热榜" key="free" />
      <a-tab-pane tab="付费热榜" key="pay" />
      <a-tab-pane tab="最新上架" key="new" />
      <a-tab-pane tab="我的收藏" key="collect" />
    </a-tabs>
    <a-row :gutter="16">
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 6, md: 6, sm: 24, xs: 24 }
            : { span: 12 }
        "
        class="gutter-row"
        v-for="(item, index) in list"
        :key="index"
        :span="6"
      >
        <a-card hoverable>
          <div class="gutter-box">
            <div class="plug-item">
              <a-image
                :height="80"
                :width="80"
                :preview="false"
                :src="item.companyLogo"
                @click="openUrl('/system/plug/detail/' + item.companyId)"
                fallback="https://file.wsdns.cn/20230218/550e610d43334dd2a7f66d5b20bd58eb.svg"
              />
              <div class="info">
                <a
                  class="name ele-text-heading"
                  @click="openUrl('/system/plug/detail/' + item.companyId)"
                  >{{ item.tenantName }}</a
                >
                <a-rate class="rate" v-model:value="rate" disabled allow-half />
                <div class="company ele-text-placeholder">
                  <a-typography-text
                    type="secondary"
                    :ellipsis="{ rows: 1, expandable: true, symbol: '...' }"
                  >
                    {{ item.companyName }}
                  </a-typography-text>
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
              <div class="downloads ele-text-placeholder"
                >安装 {{ item.clicks }}
              </div>
              <a-button type="primary" disabled v-if="planId === item.tenantId"
                >已安装
              </a-button>
              <a-button v-else type="primary" @click="onClone(item)"
                >安装
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div class="plug-page" v-if="list.length">
      <a-pagination
        v-model:current="where.page"
        v-model:pageSize="where.limit"
        size="large"
        :total="total"
        @change="reload"
      />
    </div>
    <a-empty v-else />
  </a-card>
</template>
<script setup lang="ts">
  import { openUrl } from '@/utils/common';
  import { onClone } from '@/utils/plug-uitl';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { Company, CompanyParam } from '@/api/system/company/model';
  import useSearch from '@/utils/use-search';
  import { pagePlug } from "@/api/system/plug";

  const props = defineProps<{
    // 修改回显的数据
    use: boolean;
  }>();

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const searchText = ref('');
  const rate = ref(3.5);
  const list = ref<Company[]>([]);
  const industry = ref<any>();
  const total = ref<any>(0);
  const planId = ref<number>(Number(localStorage.getItem('PlanId')));

  // 查询条件
  const { where, resetFields } = useSearch<CompanyParam>({
    keywords: undefined,
    industryParent: '',
    industryChild: '',
    recommend: undefined,
    authoritative: 1,
    sceneType: 'recommend',
    limit: 20,
    page: 1
  });

  const onIndustry = (item: any) => {
    where.industryChild = item[1];
  };

  const onTabs = (index) => {
    if (index == 'recommend') {
      where.recommend = true;
    }
    if (index == 'free') {
      where.recommend = false;
    }
    if (index == 'pay') {
      where.recommend = false;
    }
    if (index == 'new') {
      where.sceneType = 'new';
    }
    if (index == 'collect') {
      where.sceneType = 'collect';
    }
    reload();
  };

  const reset = () => {
    resetFields();
    reload();
  };

  const reload = () => {
    where.sort = 'buys';
    where.order = 'desc';
    pagePlug({}).then((data) => {
      total.value = data?.count;
      if (data?.list) {
        list.value = data?.list;
      }
    });
  };
  reload();
</script>
