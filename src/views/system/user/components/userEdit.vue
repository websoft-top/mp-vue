<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑' : '添加'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="用户唯一小程序id" name="openId">
        <a-input
          allow-clear
          placeholder="请输入用户唯一小程序id"
          v-model:value="form.openId"
        />
      </a-form-item>
      <a-form-item label="小程序用户秘钥" name="sessionKey">
        <a-input
          allow-clear
          placeholder="请输入小程序用户秘钥"
          v-model:value="form.sessionKey"
        />
      </a-form-item>
      <a-form-item label="用户名" name="username">
        <a-input
          allow-clear
          placeholder="请输入用户名"
          v-model:value="form.username"
        />
      </a-form-item>
      <a-form-item label="头像地址" name="avatarUrl">
        <a-input
          allow-clear
          placeholder="请输入头像地址"
          v-model:value="form.avatarUrl"
        />
      </a-form-item>
      <a-form-item label="1男，2女" name="gender">
        <a-input
          allow-clear
          placeholder="请输入1男，2女"
          v-model:value="form.gender"
        />
      </a-form-item>
      <a-form-item label="国家" name="country">
        <a-input
          allow-clear
          placeholder="请输入国家"
          v-model:value="form.country"
        />
      </a-form-item>
      <a-form-item label="省份" name="province">
        <a-input
          allow-clear
          placeholder="请输入省份"
          v-model:value="form.province"
        />
      </a-form-item>
      <a-form-item label="城市" name="city">
        <a-input
          allow-clear
          placeholder="请输入城市"
          v-model:value="form.city"
        />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input
          allow-clear
          placeholder="请输入手机号码"
          v-model:value="form.phone"
        />
      </a-form-item>
      <a-form-item label="积分" name="integral">
        <a-input
          allow-clear
          placeholder="请输入积分"
          v-model:value="form.integral"
        />
      </a-form-item>
      <a-form-item label="余额" name="money">
        <a-input
          allow-clear
          placeholder="请输入余额"
          v-model:value="form.money"
        />
      </a-form-item>
      <a-form-item label="" name="idcard">
        <a-input
          allow-clear
          placeholder="请输入"
          v-model:value="form.idcard"
        />
      </a-form-item>
      <a-form-item label="" name="truename">
        <a-input
          allow-clear
          placeholder="请输入"
          v-model:value="form.truename"
        />
      </a-form-item>
      <a-form-item label="是否管理员：1是；2否" name="isAdmin">
        <a-input
          allow-clear
          placeholder="请输入是否管理员：1是；2否"
          v-model:value="form.isAdmin"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addUser, updateUser } from '@/api/system/user';
  import { User } from '@/api/system/user/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';

  // 是否是修改
  const isUpdate = ref(false);
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

  // 提交状态
  const loading = ref(false);
  // 是否显示最大化切换按钮
  const maxable = ref(true);
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const images = ref<ItemType[]>([]);

  // 用户信息
  const form = reactive<User>({
    id: undefined,
    openId: undefined,
    sessionKey: undefined,
    username: undefined,
    avatarUrl: undefined,
    gender: undefined,
    country: undefined,
    province: undefined,
    city: undefined,
    phone: undefined,
    integral: undefined,
    money: undefined,
    createTime: undefined,
    idcard: undefined,
    truename: undefined,
    isAdmin: undefined,
    tenantId: undefined,
    userId: undefined,
    userName: '',
    status: 0,
    comments: '',
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    userName: [
      {
        required: true,
        type: 'string',
        message: '请填写名称',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.image = data.path;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.image = '';
  };

  const { resetFields } = useForm(form, rules);

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const formData = {
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateUser : addUser;
        saveOrUpdate(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          if(props.data.image){
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
            })
          }
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
