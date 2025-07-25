<template>
  <div class="phone-layout" v-if="form">
    <div class="phone-header-black ele-fluid">
      <div class="title ele-fluid">
        <div class="title-bar">
          <span class="back"></span>
          <span>{{ form.title || '首页' }}</span>
          <a class="share" @click="onShare"></a>
        </div>
      </div>
    </div>
    <!--  会员信息卡片  -->
    <template v-if="form.title == '我的'">
      <a-popover>
        <template #content> 点击更换背景 </template>
        <div
          class="user-card"
          :style="{
            backgroundImage: 'url(' + param.mp_user_top + ')'
          }"
          @click="
            openUserCard({
              name: 'mp_user_top',
              value: param.mp_user_top,
              comments: '小程序我的顶部背景图片',
              sortNumber: 100
            })
          "
        >
          <div class="user-avatar">
            <a-avatar :src="param.site_logo" :size="60" />
            <div class="user-info">
              <div class="nickname">昵称</div>
              <div class="phone">手机号码</div>
            </div>
          </div>
        </div>
      </a-popover>
      <UserCardEdit
        v-model:visible="showUserCardEdit"
        :data="current"
        @done="reload"
      />
    </template>
    <template v-if="form.title">
      <div class="phone-body" style="overflow-y: auto; overflow-x: hidden">
        <!-- 幻灯片轮播 -->
        <template v-if="form.showCarousel">
          <div
            class="ad-bar"
            :style="{
              backgroundImage: 'url(' + param.mp_user_top + ')'
            }"
            @click="onCarousel"
          >
            <a-carousel arrows autoplay :dots="true">
              <template v-if="adImageList">
                <template v-for="(img, index) in adImageList" :key="index">
                  <div class="ad-item">
                    <a-image
                      :preview="false"
                      :src="img.url"
                      width="100%"
                      height="200px"
                    />
                  </div>
                </template>
              </template>
            </a-carousel>
          </div>
        </template>
        <!-- 导航菜单 -->
        <template v-if="mpMenus">
          <!--  单排  -->
          <div class="order-card ele-cell">
            <div
              v-for="(item, index) in mpMenus"
              :key="index"
              class="ele-cell-content ele-text-center btn-center"
              @click="openMpMenuEdit(item)"
            >
              <a-image :src="item.avatar" :width="40" :preview="false" />
              <span style="white-space: nowrap">{{ item.title }}</span>
            </div>
          </div>
<!--          <MpMenuEdit-->
<!--            v-model:visible="showMpMenuEdit"-->
<!--            :data="current"-->
<!--            @done="reload"-->
<!--          />-->
        </template>
        <!-- 商户列表 -->
        <template v-if="form.showShopCard">
          <div class="merchant-card-title">场地预定</div>
          <div
            class="merchant-card ele-cell"
            v-for="(item, index) in shopList"
            :key="index"
          >
            <a-image :src="item.image" :width="96" :preview="false" />
            <div class="merchant-info ele-cell-content">
              <div class="merchant-name">{{ item.merchantName }}</div>
              <div class="merchant-desc ele-cell-desc">
                {{ item.comments }}
              </div>
            </div>
            <!--            <div class="">-->
            <!--              <a-button>我要去</a-button>-->
            <!--            </div>-->
          </div>
        </template>
        <!-- 培训课程 -->
        <template v-if="form.showTtrainCard">
          <div class="merchant-card-title">培训课程</div>
          <div
            class="merchant-card ele-cell"
            v-for="(item, index) in shopList"
            :key="index"
            @click="openMpMenuEdit(item)"
          >
            <a-image :src="item.image" :width="96" :preview="false" />
            <div class="merchant-info ele-cell-content">
              <div class="merchant-name">{{ item.merchantName }}</div>
              <div class="merchant-desc ele-cell-desc">
                {{ item.comments }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <a-card
      class="buy-bar"
      :bordered="false"
      v-if="form"
      :body-style="{ padding: '12px 16px' }"
    >
      <div class="ele-cell">
        <template v-for="(item, index) in tabBar" :key="index">
          <a
            class="home-btn ele-cell-content ele-text-secondary"
            @click="openUrl(`/mp-design/${item.id}`)"
          >
            <component
              v-if="item.icon"
              class="icon"
              :class="form.id === item.id ? 'ele-text-danger' : ''"
              :is="item.icon"
            />
            <span :class="form.id === item.id ? 'ele-text-danger' : ''">{{
              item.title
            }}</span>
          </a>
        </template>
      </div>
    </a-card>
    <AdEdit v-model:visible="showAdEdit" :data="ad" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { CmsWebsiteField } from '@/api/cms/cmsWebsiteField/model';
  import { CmsMpMenu } from '@/api/cms/cmsMpMenu/model';
  import type { CmsMpPages } from '@/api/cms/cmsMpPages/model';
  import { openUrl } from '@/utils/common';

  // import MpMenuEdit from './mpMenuEdit.vue';
  import { CmsAd } from '@/api/cms/cmsAd/model';
  import AdEdit from '@/views/cms/ad/components/ad-edit.vue';
  import UserCardEdit from '@/views/cms/field/components/website-field-edit.vue';

  const prpos = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      form?: CmsMpPages;
      tabBar?: CmsMpPages[];
      type?: number;
      mpMenus?: any[] | null;
      refresh?: boolean;
    }>(),
    {
      placeholder: undefined
    }
  );

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const param = ref<any>({});
  const showUserCardEdit = ref(false);
  const showMpMenuEdit = ref(false);
  const showAdEdit = ref(false);
  const ad = ref<CmsAd>();
  // 当前编辑数据
  const current = ref<CmsWebsiteField | null>(null);

  /* 打开编辑弹窗 */
  const openUserCard = (row?: CmsWebsiteField) => {
    current.value = row ?? null;
    showUserCardEdit.value = true;
  };

  /* 打开编辑弹窗 */
  const openMpMenuEdit = (row?: CmsMpMenu) => {
    current.value = row ?? null;
    showMpMenuEdit.value = true;
  };

  const onShare = () => {};

  const onCarousel = (row?: CmsAd) => {
    showAdEdit.value = true;
  };

  const reload = () => {
    emit('done');
  };

  reload();

  watch(
    () => prpos.refresh,
    (refresh) => {
      if (refresh) {
        reload();
      }
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  import * as MenuIcons from '@/layout/menu-icons';
  export default {
    name: 'Simulator',
    components: MenuIcons
  };
</script>

<style lang="less" scoped>
  .phone-layout {
    position: fixed;
    right: 26px;
    width: 390px;
    height: 844px;
    background: url('@/assets/img/app-ui.png');
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100%;
    //position: relative;
    padding: 0 16px;
    .phone-header-black {
      height: 99px;
      border-radius: 20px 20px 0 0;
      background-size: 100%;
      .title {
        height: 99px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: end;
        padding-bottom: 13px;

        .title-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .back {
            display: block;
            width: 50px;
            margin-left: 3px;
            background-color: #ffffff;
          }
          .share {
            display: block;
            width: 50px;
            cursor: pointer;
          }
        }
      }
    }
    .ad-bar {
      background-color: var(--grey-10);
      background-repeat: no-repeat;
      background-size: cover;
    }
    .phone-body-bg {
      padding: 0 16px;
      height: 680px;
      border-radius: 0 0 44px 44px;
      overflow: hidden;
    }
    .phone-body {
      width: 356px;
      margin-left: 17px;
      height: 630px;
      padding: 0;
      position: absolute;
      top: 98px;
      left: 0;
      z-index: 999;
      .comments {
        padding: 20px;
        word-break: break-all;
      }
      .form-data {
        padding: 10px 20px;
        .submit-btn {
          padding: 30px 0;
        }
      }
    }
    .goods {
      .price {
        font-size: 18px;
      }
      .ele-cell-title {
        font-weight: 600;
        font-size: 16px;
      }
      .goods-attr {
      }
    }
    .goods-divider {
      height: 6px;
    }
    .buy-bar {
      position: fixed;
      width: 356px;
      bottom: 70px;
      //top: 881px;
      background-color: #ffffff;
      border-radius: 0 0 44px 44px;
      border-top: 1px solid var(--grey-8);
      .ele-cell-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .home-btn,
      .shop-btn,
      .order-btn,
      .user-btn {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        padding: 0 9px;
        cursor: pointer;
        white-space: nowrap;
      }
      .icon {
        font-size: 19px;
      }
      .buy-btn {
        display: flex;
        .add-cart {
          border-radius: 100px 0 0 100px;
          border: none;
          background-color: var(--orange-5);
          color: #ffffff;
          height: 40px;
          width: 95px;
        }
        .buy-now {
          border-radius: 0 100px 100px 0;
          border: none;
          background-color: var(--red-6);
          color: #ffffff;
          height: 40px;
          width: 95px;
        }
      }
    }
  }
  :deep(.slick-slide) {
    overflow: hidden;
  }
  :deep(.slick-arrow.custom-slick-arrow) {
    font-size: 38px;
  }
  :deep(.slick-arrow.custom-slick-arrow) {
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
  }
  :deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
  }
  :deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    opacity: 0.5;
  }
  :deep(.slick-slide h3) {
    color: #fff;
  }

  .user-card {
    height: 170px;
    margin: 0 1px;
    background-color: var(--grey-10);
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    .user-avatar {
      margin-left: 16px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .user-info {
        margin-left: 10px;
        .nickname {
          color: var(--grey-3);
          font-size: 18px;
          font-weight: 500;
        }
        .phone {
          color: var(--grey-5);
        }
      }
    }
  }

  .menu-card {
    width: 330px;
    margin: 6px auto;
    border-radius: 5px;
    border-color: slategrey;
    .btn-center {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .merchant-card-title {
    width: 340px;
    margin: 6px auto;
    font-size: 20px;
    font-weight: 500;
    margin-top: 16px;
  }
  .merchant-card {
    width: 340px;
    max-height: 80px;
    margin: 6px auto;
    margin-bottom: 16px;
    padding: 8px;
    background: #ffffff;
    border-radius: 5px;
    border-color: slategrey;
    .merchant-name {
      font-weight: 500;
      font-size: 15px;
    }
    .merchant-desc {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .tools-card {
    width: 340px;
    margin: 0 1px;
    padding: 6px 16px;
    background: #ffffff;
    border-radius: 5px;
    border-color: slategrey;
    position: absolute;
    top: 324px;
    left: 24px;
    .ele-cell {
      padding: 4px 0;
      border-bottom: 1px solid var(--grey-9);
    }
    .btn-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .order-card {
    width: 330px;
    height: 80px;
    margin: 0 auto;
    padding: 8px;
    background: #ffffff;
    border-radius: 5px;
    border-color: slategrey;
    //position: absolute;
    //top: 230px;
    //left: 24px;
    .btn-center {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
</style>
