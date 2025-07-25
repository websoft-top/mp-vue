<template>
  <div class="alert py-3">
    <a-alert
      description="通过安装扩展程序来满足您的业务需求，该操作将复制菜单和权限到您的系统。"
      type="warning"
      show-icon
      closable
    />
  </div>
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
              :height="72"
              :width="72"
              :preview="false"
              class="app-icon"
              style="
                  border: 1px solid #e3e3e3;
                  box-shadow: 0 0 1px -1px;
                  border-radius: 12px;
                "
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
              <a-rate class="rate" v-model:value="rate" disabled allow-half/>
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
</template>
<script setup lang="ts">
import {getPageTitle, openUrl} from '@/utils/common';
import {onClone} from '@/utils/plug-uitl';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ref} from 'vue';
import {Company, CompanyParam} from '@/api/system/company/model';
import useSearch from '@/utils/use-search';
import {pageCompanyAll} from '@/api/system/company';

const props = defineProps<{
  // 修改回显的数据
  use: boolean;
}>();

// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const searchText = ref('');
const rate = ref(3.5);
const list = ref<Company[]>([]);
const industry = ref<any>();
const total = ref<any>(0);
const planId = ref<number>(Number(localStorage.getItem('PlanId')));

// 查询条件
const {where, resetFields} = useSearch<CompanyParam>({
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
  pageCompanyAll(where).then((data) => {
    total.value = data?.count;
    if (data?.list) {
      list.value = data?.list;
    }
  });
};
reload();
</script>
<style scoped lang="less">
.ele-body-card {
  background-color: transparent;
  padding: 20px;
}

.card-title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.gutter-row {
  margin: 0 auto 30px auto;

  .gutter-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;

    .plug-item {
      display: flex;

      .app-icon {
      }

      .info {
        font-size: 14px;
        margin-left: 12px;
        max-width: 234px;

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

.ele-text-heading {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plug-page {
  display: flex;
  justify-content: center;
}
</style>
