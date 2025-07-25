<template>
  <a-popover>
    <template #content>
      <div class="user-box">
        <div class="user-info">
          <span class="ele-text-secondary">ID：{{ record.userId }} </span>
          <span class="ele-text-secondary">账号：{{ record.username }} </span>
          <span class="ele-text-secondary" v-if="record.alias">
            别名：{{ record.alias }}
          </span>
          <span class="ele-text-secondary">昵称：{{ record.nickname }}</span>
          <span class="ele-text-secondary" v-if="record.realName"
            >姓名：{{ record.realName }}
          </span>
          <span class="ele-text-secondary">手机号：{{ record.phone }}</span>
          <span class="ele-text-secondary">邮箱：{{ record.email }}</span>
        </div>
      </div>
    </template>
    <div class="user-box">
      <a-avatar v-if="record.avatar" :size="32" :src="`${record.avatar}`">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <div class="user-info">
        <router-link :to="'/system/user/details?id=' + record.userId">
          <span class="ele-text-primary">
            {{ record.alias ? record.alias : record.nickname }}
          </span>
        </router-link>
        <span class="ele-text-placeholder">{{ record.phone }}</span>
      </div>
    </div>
  </a-popover>
</template>

<script lang="ts" setup>
  import { User } from '@/api/system/user/model';
  withDefaults(
    defineProps<{
      placeholder?: string;
      record?: User | object;
    }>(),
    {
      placeholder: undefined
    }
  );
</script>

<style lang="less" scoped>
  .user-box {
    display: flex;
    align-items: center;
    .user-info {
      padding-left: 5px;
      display: flex;
      flex-direction: column;
      align-items: start;
      .nickname {
        text-align: left;
      }
    }
  }
</style>
