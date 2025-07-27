<template>
  <a-page-header :show-back="false">
    <a-row :gutter="16">
      <!-- 应用基本信息卡片 -->
      <a-col :span="24" style="margin-bottom: 16px">
        <a-card title="概况" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-image
                :width="80"
                :height="80"
                :preview="false"
                style="border-radius: 8px"
                :src="siteInfo.websiteLogo"
                fallback="/logo.png"
              />
            </a-col>
            <a-col :span="14">
              <div class="system-info">
                <h2 class="ele-text-heading">{{ siteInfo.websiteName }}</h2>
                <p class="ele-text-secondary">{{ siteInfo.comments }}</p>
                <a-space>
                  <a-tag color="blue">版本 {{ systemInfo.version }}</a-tag>
                  <a-tag color="green">{{ systemInfo.status }}</a-tag>
                  <a-popover title="小程序码">
                    <template #content>
                      <p><img :src="siteInfo.websiteDarkLogo" alt="小程序码" width="300" height="300"></p>
                    </template>
                    <a-tag><QrcodeOutlined/></a-tag>
                  </a-popover>
                </a-space>
              </div>
            </a-col>
            <a-col :span="3">
              <div class="flex justify-center items-center h-full w-full">

              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- 统计数据卡片 -->
      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="用户总数"
            :value="statistics.userCount"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <UserOutlined/>
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="订单总数"
            :value="statistics.orderCount"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <AccountBookOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="今日营业额"
            :value="statistics.todayVisit"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <MoneyCollectOutlined/>
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="系统运行天数"
            :value="statistics.runDays"
            suffix="天"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <ClockCircleOutlined/>
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <!-- 系统基本信息 -->
      <a-col :span="12">
        <a-card title="基本信息" :bordered="false">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="系统名称">
              {{ systemInfo.name }}
            </a-descriptions-item>
            <a-descriptions-item label="版本号">
              {{ systemInfo.version }}
            </a-descriptions-item>
            <a-descriptions-item label="部署环境">
              {{ systemInfo.environment }}
            </a-descriptions-item>
            <a-descriptions-item label="数据库">
              {{ systemInfo.database }}
            </a-descriptions-item>
            <a-descriptions-item label="服务器">
              {{ systemInfo.server }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ siteInfo?.createTime }}
            </a-descriptions-item>
            <a-descriptions-item label="到期时间">
              {{ siteInfo?.expirationTime }}
            </a-descriptions-item>
            <a-descriptions-item label="技术支持">
              <span class="cursor-pointer" @click="openNew(`https://websoft.top/order/3429.html`)">网宿软件</span>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <!-- 快捷操作 -->
      <a-col :span="12">
        <a-card title="快捷操作" :bordered="false">
          <a-space direction="vertical" style="width: 100%">
            <a-button type="primary" block @click="$router.push('/website/index')">
              <ShopOutlined/>
              站点管理
            </a-button>
            <a-button block @click="$router.push('/website/order')">
              <CalendarOutlined/>
              订单管理
            </a-button>
            <a-button block @click="$router.push('/system/user')">
              <UserOutlined/>
              用户管理
            </a-button>
            <a-button block @click="$router.push('/system/login-record')">
              <FileTextOutlined/>
              系统日志
            </a-button>
            <a-button block @click="$router.push('/system/setting')">
              <SettingOutlined/>
              系统设置
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import {
  UserOutlined,
  CalendarOutlined,
  QrcodeOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  AccountBookOutlined,
  FileTextOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons-vue';
import {getSiteInfo} from "@/api/layout";
import {CmsWebsite} from "@/api/cms/cmsWebsite/model";
import {pageUsers} from "@/api/system/user";
import {pageShopOrder} from "@/api/shop/shopOrder";
import {openNew} from "@/utils/common";

// 当前小程序项目
const siteInfo = ref<CmsWebsite>({});

// 系统信息
const systemInfo = ref({
  name: '小程序开发',
  description: '基于Spring、SpringBoot、SpringMVC等技术栈构建的前后端分离开发平台',
  version: '2.0.0',
  status: '运行中',
  logo: '/logo.png',
  environment: '生产环境',
  database: 'MySQL 8.0',
  server: 'Linux CentOS 7.9',
  expirationTime: '2024-01-01 09:00:00'
});

// 统计数据
const statistics = ref({
  userCount: 0,
  orderCount: 0,
  todayVisit: 3456,
  runDays: 365
});

onMounted(() => {
  // 加载系统信息和统计数据
  loadSystemInfo();
  loadStatistics();
});

const loadSystemInfo = async () => {
  // TODO: 调用API获取系统信息
  siteInfo.value = await getSiteInfo();
  if(siteInfo.value.createTime){
    // 根据创建时间计算运行天数
    statistics.value.runDays = Math.floor((new Date().getTime() - new Date(siteInfo.value.createTime).getTime()) / (24 * 60 * 60 * 1000))
  }
};

const loadStatistics = async () => {
  // TODO: 调用API获取统计数据
  const users = await pageUsers({})
  const orders = await pageShopOrder({})
  if(users){
    statistics.value.userCount = users.count
  }
  if(orders){
    statistics.value.orderCount = orders.count
  }
};
</script>

<style scoped>
.system-info h2 {
  margin-bottom: 8px;
}

.stat-card {
  text-align: center;
  margin-bottom: 16px;
}

.stat-card :deep(.ant-statistic-title) {
  font-size: 14px;
  color: #666;
}

.stat-card :deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}
</style>
