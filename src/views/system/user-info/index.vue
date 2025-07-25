<template>
  <div class="ele-body">
    <a-card title="基本信息" :bordered="false">
      <a-form
        class="ele-form-detail"
        :label-col="{ md: { span: 2 }, sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ md: { span: 22 }, sm: { span: 20 }, xs: { span: 18 } }"
      >
        <a-form-item label="账号">
          <div class="ele-text-secondary">{{ user.username }}</div>
        </a-form-item>
        <a-form-item label="昵称">
          <div class="ele-text-secondary">{{ user.nickname }}</div>
        </a-form-item>
        <a-form-item label="性别">
          <div class="ele-text-secondary">{{ user.sexName }}</div>
        </a-form-item>
        <a-form-item label="手机号">
          <div class="ele-text-secondary">{{ user.phone }}</div>
        </a-form-item>
        <a-form-item label="角色">
          <a-tag v-for="item in user.roles" :key="item.roleId" color="blue">
            {{ item.roleName }}
          </a-tag>
        </a-form-item>
        <a-form-item label="创建时间">
          <div class="ele-text-secondary">{{ user.createTime }}</div>
        </a-form-item>
        <a-form-item label="状态">
          <a-badge
            v-if="typeof user.status === 'number'"
            :status="(['processing', 'error'][user.status] as any)"
            :text="['正常', '冻结'][user.status]"
          />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { toDateString, assignObject } from 'ele-admin-pro';
  import { setPageTab } from '@/utils/page-tab-util';
  import { getUser } from '@/api/system/user';
  import type { User } from '@/api/system/user/model';

  const { currentRoute } = useRouter();

  // 用户信息
  const user = reactive<User>({
    username: '',
    nickname: '',
    sexName: '',
    phone: '',
    roles: [],
    createTime: undefined,
    status: undefined
  });

  // 请求状态
  const loading = ref(true);

  const query = () => {
    const { query, fullPath } = unref(currentRoute);
    const id = query.id;
    if (!id) {
      return;
    }
    loading.value = true;
    getUser(Number(id))
      .then((data) => {
        loading.value = false;
        assignObject(user, {
          ...data,
          createTime: toDateString(data.createTime)
        });
        // 修改页签标题
        setPageTab({
          fullPath: fullPath,
          title: data.nickname + '的信息'
        });
      })
      .catch((e) => {
        loading.value = false;
        message.error(e.message);
      });
  };

  watch(
    currentRoute,
    (route) => {
      const { path } = unref(route);
      if (path !== '/system/user-info') {
        return;
      }
      query();
    },
    {
      immediate: true
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'SystemUserInfo'
  };
</script>
