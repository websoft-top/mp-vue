<template>
  <a-page-header title="应用详情" @back="push('/system/plug')">
    <a-row :gutter="16">
      <!--      左侧区域-->
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 18, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 12 }
        "
        class="gutter-row"
        :span="6"
      >
        <a-card :bordered="false" style="width: 100%; margin-bottom: 16px">
          <div class="goods-info">
            <div class="logo">
              <a-image
                :width="72"
                :height="72"
                :preview="false"
                style="
                  border: 1px solid #e3e3e3;
                  box-shadow: 0 0 1px -1px;
                  border-radius: 12px;
                "
                :src="form.companyLogo"
              />
            </div>
            <div class="info">
              <a-card :bordered="false" :body-style="{ padding: 0 }">
                <div class="goods-name ele-text-heading">{{
                  form.shortName
                }}</div>
                <div class="comments ele-text-secondary">{{
                  form.comments
                }}</div>
              </a-card>
              <a-card :bordered="false" class="buy-card">
                <div class="price-box">
                  <div class="left">
                    <div
                      ><span class="ele-text-secondary">价格：</span
                      ><span class="ele-text-danger price">￥50</span>/月</div
                    >
                    <div
                      ><span class="ele-text-secondary">续费：</span
                      ><span class="ele-text-heading">￥1280</span></div
                    >
                  </div>
                  <div class="right">
                    <div class="sales ele-text-secondary">浏览 35</div>
                    <div class="sales ele-text-secondary">评价 3</div>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
<!--          <div class="goods-item">-->
<!--            <div class="title"> 购买时长 </div>-->
<!--            <div class="info">-->
<!--              <a-radio-group v-model:value="duration">-->
<!--                <a-radio-button value="1">1个月</a-radio-button>-->
<!--                <a-radio-button value="12">1年</a-radio-button>-->
<!--                <a-radio-button value="24">2年</a-radio-button>-->
<!--                <a-radio-button value="36">3年</a-radio-button>-->
<!--                <a-radio-button value="60">5年</a-radio-button>-->
<!--              </a-radio-group>-->
<!--            </div>-->
<!--          </div>-->
          <div class="goods-item">
            <div class="title"></div>
            <div class="info">
              <a-button type="primary" size="large">立即购买</a-button>
            </div>
          </div>
        </a-card>
        <a-card :body-style="{ padding: '0 16px 30px ' }">
          <a-tabs v-model:active-key="active">
            <a-tab-pane tab="应用详情" key="detail">
              <div>应用详情</div>
            </a-tab-pane>
            <a-tab-pane tab="演示地址" key="domo">
              <Tenant :use="true" />
            </a-tab-pane>
            <a-tab-pane tab="常见问题" key="help">
              <Tenant :use="true" />
            </a-tab-pane>
            <a-tab-pane tab="更新日志" key="log">
              <Tenant :use="true" />
            </a-tab-pane>
            <a-tab-pane tab="用户评论(8)" key="comments">
              <Tenant :use="true" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <!-- 右侧区域 -->
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 12 }
        "
        class="gutter-row"
        :span="6"
      >
        <a-card :bordered="false" class="task-card">
          <a-list :bordered="false">
            <a-list-item style="font-weight: 500">
              服务厂商：{{ form.companyName }}
            </a-list-item>
            <a-list-item @click="openUrl('http://www.' + form.domain)">
              官方网站：{{ form.domain }}
            </a-list-item>
            <a-list-item>
              联系客服：<QqOutlined :style="{ fontSize: '18px' }" /><span
                class="ele-text-secondary"
              >
                （在线时间：9:00到6:00）</span
              >
            </a-list-item>
            <a-list-item> 电话：0771-5386339 </a-list-item>
            <a-list-item> 邮箱：{{ form.email }} </a-list-item>
            <a-list-item>
              问题处理：<a-button @click="openUrl('/oa/task/add')"
                >提交工单</a-button
              ></a-list-item
            >
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { openUrl } from '@/utils/common';
  import { QqOutlined } from '@ant-design/icons-vue';
  import { setPageTabTitle } from '@/utils/page-tab-util';
  import useFormData from '@/utils/use-form-data';
  import { getCompanyAll } from '@/api/system/company';
  import { Company } from '@/api/system/company/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  const { push } = useRouter();

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const { currentRoute } = useRouter();
  const active = ref('detail');
  const duration = ref<any>('1');

  // 用户信息
  const { form, assignFields } = useFormData<Company>({
    companyId: undefined,
    companyName: undefined,
    companyLogo: undefined,
    shortName: undefined,
    domain: undefined,
    email: undefined,
    tenantId: undefined,
    tenantName: '',
    comments: '',
    version: undefined,
    createTime: undefined
  });

  // 表单验证规则
  const rules = reactive({
    taskType: [
      {
        required: true,
        message: '请选择工单类型',
        type: 'string',
        trigger: 'blur'
      }
    ],
    content: [
      {
        required: true,
        type: 'string',
        message: '请填写问题描述',
        trigger: 'blur'
      }
    ],
    sortNumber: [
      {
        required: true,
        message: '请输入排序号',
        type: 'number',
        trigger: 'blur'
      }
    ]
  });

  // 查询租户信息
  const query = () => {
    const { params } = unref(currentRoute);
    const id = params.id;
    if (id) {
      getCompanyAll(Number(id)).then((data) => {
        console.log(data,'getCompany')
        assignFields({
          ...data
        });
        // 修改当前页签标题
        setPageTabTitle(`${form.tenantName}`);
      });
    }
  };

  watch(
    currentRoute,
    () => {
      query();
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SystemPlugDetail'
  };
</script>

<style lang="less" scoped>
  .goods-info {
    max-width: 80%;
    display: flex;
    .logo {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
      width: 120px;
    }
    .info {
      .goods-name {
        font-size: 22px;
      }
      .comments {
        margin: 5px 0;
      }
      .buy-card {
        margin-top: 20px;
        width: 700px;
        justify-content: space-between;
        align-items: center;
        background-color: #f3faee;
        border-radius: 1px;
        .price-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            font-size: 28px;
            padding-right: 5px;
          }
        }
      }
    }
  }
  .goods-item {
    max-width: 80%;
    margin: 20px 0;
    display: flex;
    .title {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 20px;
      width: 120px;
    }
  }
  .task-card {
    padding: 2px !important;
    margin-bottom: 16px;
  }
  .user-content {
    max-width: 100%;
    border-radius: 8px !important;
    background-color: #a2ec71;
    border: none;
  }
  .admin-content {
    border-radius: 8px !important;
    border: 3px solid #f1f1f1;
  }
  /deep/.markdown-body {
    background-color: transparent; /* 设置背景透明 */
  }
  .files {
    margin-top: 10px;
  }
  #bottom {
    margin-bottom: 20px;
  }
  .transparent-bg {
    background-color: transparent; /* 设置背景透明 */
  }
  .item-name {
    font-size: 14px;
  }
</style>
