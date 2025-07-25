<template>
  <div class="ele-body">
    <a-card title="基本信息" :bordered="false">
      <a-form
        class="ele-form-detail"
        :label-col="
          styleResponsive ? { md: 2, sm: 4, xs: 6 } : { flex: '90px' }
        "
        :wrapper-col="
          styleResponsive ? { md: 22, sm: 20, xs: 18 } : { flex: '1' }
        "
      >
        <a-form-item label="账号">
          <div class="ele-text-secondary">{{ form.username }}</div>
        </a-form-item>
        <a-form-item label="昵称">
          <div class="ele-text-secondary">{{ form.nickname }}</div>
        </a-form-item>
        <a-form-item label="性别">
          <div class="ele-text-secondary">{{ form.sexName }}</div>
        </a-form-item>
        <a-form-item label="手机号">
          <div class="ele-text-secondary">{{ form.phone }}</div>
        </a-form-item>
        <a-form-item label="真实姓名">
          <div class="ele-text-secondary">{{ form.realName }}</div>
        </a-form-item>
        <a-form-item label="别名">
          <div class="ele-text-secondary">{{ form.alias }}</div>
        </a-form-item>
        <a-form-item label="角色">
          <a-tag v-for="item in form.roles" :key="item.roleId" color="blue">
            {{ item.roleName }}
          </a-tag>
        </a-form-item>
        <a-form-item label="创建时间">
          <div class="ele-text-secondary">{{ form.createTime }}</div>
        </a-form-item>
        <a-form-item label="状态">
          <a-badge
            v-if="typeof form.status === 'number'"
            :status="(['processing', 'error'][form.status] as any)"
            :text="['正常', '冻结'][form.status]"
          />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue/es';
  import { toDateString } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import { setPageTabTitle } from '@/utils/page-tab-util';
  import { getUser } from '@/api/system/user';
  import type { User } from '@/api/system/user/model';
  const ROUTE_PATH = '/system/user/details';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const { currentRoute } = useRouter();

  // 用户信息
  const { form, assignFields } = useFormData<User>({
    userId: undefined,
    alias: '',
    realName: '',
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

  /*  */
  const query = () => {
    const { query } = unref(currentRoute);
    const id = query.id;
    if (!id || form.userId === Number(id)) {
      return;
    }
    loading.value = true;
    getUser(Number(id))
      .then((data) => {
        loading.value = false;
        assignFields({
          ...data,
          createTime: toDateString(data.createTime)
        });
        // 修改页签标题
        if (unref(currentRoute).path === ROUTE_PATH) {
          setPageTabTitle(data.nickname + '的信息');
        }
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
      if (path !== ROUTE_PATH) {
        return;
      }
      query();
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SystemUserDetails'
  };
</script>
