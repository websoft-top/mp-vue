<!-- 用户编辑弹窗 -->
<template>
  <a-drawer
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="'基本信息'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    :footer="null"
  >
    <a-form
      :label-col="{ md: { span: 6 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 19 }, sm: { span: 24 } }"
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="账号">
            <span class="ele-text">{{ user.username }}</span>
          </a-form-item>
          <a-form-item label="昵称">
            <span class="ele-text">{{ user.nickname }}</span>
          </a-form-item>
          <a-form-item label="性别">
            <span class="ele-text">{{ user.sexName }}</span>
          </a-form-item>
          <a-form-item label="手机号">
            <span class="ele-text">{{ user.phone }}</span>
          </a-form-item>
          <a-form-item label="角色">
            <a-tag v-for="item in user.roles" :key="item.roleId" color="blue">
              {{ item.roleName }}
            </a-tag>
          </a-form-item>
          <a-form-item label="状态">
            <a-badge
              v-if="typeof user.status === 'number'"
              :status="(['processing', 'error'][user.status] as any)"
              :text="['正常', '冻结'][user.status]"
            />
          </a-form-item>
          <a-form-item label="地址">
            <span class="ele-text">{{ user.address }}</span>
          </a-form-item>
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="可用余额">
            <span class="ele-text-success">￥{{ formatNumber(user.balance) }}</span>
          </a-form-item>
          <a-form-item label="可用积分">
            <span class="ele-text">{{ user.points }}</span>
          </a-form-item>
          <a-form-item label="实际消费">
            <span class="ele-text">{{ user.payMoney }}</span>
          </a-form-item>
          <a-form-item label="机构/部门">
            <span class="ele-text">{{ user.organizationName }}</span>
          </a-form-item>
          <a-form-item label="头像">
            <a-image :src="user.avatar" :width="36" />
          </a-form-item>
          <a-form-item label="生日">
            <span class="ele-text">{{ user.birthday }}</span>
          </a-form-item>
          <a-form-item label="创建时间">
            <span class="ele-text">{{ user.createTime }}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import type { User } from '@/api/system/user/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { formatNumber } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';

  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: User | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 用户信息
  const user = reactive<User>({
    username: '',
    nickname: '',
    sexName: '',
    phone: '',
    avatar: '',
    balance: undefined,
    points: 0,
    payMoney: 0,
    birthday: '',
    address: '',
    roles: [],
    createTime: undefined,
    status: undefined
  });

  // 请求状态
  const loading = ref(true);

  const { resetFields } = useForm(user);

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          loading.value = false;
          assignObject(user, props.data);
        }
      } else {
        resetFields();
      }
    }
  );
</script>
