<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="1280"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '添加成员' : '添加成员'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-card :bordered="false" :body-style="{ padding: '16px 16px' }">
      <a-row :gutter="14">
        <a-col
          v-bind="
            styleResponsive ? { lg: 12, md: 24, sm: 24, xs: 24 } : { span: 12 }
          "
        >
          <!-- 未选择的成员数据表格 -->
          <ele-pro-table
            bordered
            size="small"
            :toolkit="[]"
            :columns="columns"
            row-key="userId"
            sub-title="未选成员:"
            empty-text="已全部选择"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="unChooseClass"
            :scroll="{ x: 400 }"
          >
            <template #toolkit>
              <a-button type="dashed" class="ele-btn-icon" @click="addAll">
                全部添加
              </a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button size="small" type="dashed" @click="addItem(record)">
                  添加
                </a-button>
              </template>
            </template>
          </ele-pro-table>
        </a-col>
        <a-col
          v-bind="
            styleResponsive ? { lg: 12, md: 24, sm: 24, xs: 24 } : { span: 12 }
          "
        >
          <!-- 已选择的成员数据表格 -->
          <ele-pro-table
            bordered
            size="small"
            :toolkit="[]"
            :columns="columns"
            row-key="userId"
            sub-title="已选成员:"
            emptyText="未选择成员"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="chooseUsers"
            :scroll="{ x: 400 }"
          >
            <template #toolkit>
              <a-button
                danger
                type="dashed"
                class="ele-btn-icon"
                @click="removeAll"
              >
                全部移除
              </a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button
                  danger
                  size="small"
                  type="dashed"
                  @click="removeItem(record)"
                >
                  移除
                </a-button>
              </template>
            </template>
          </ele-pro-table>
        </a-col>
      </a-row>
    </a-card>
    <!--    <a-form-->
    <!--      ref="formRef"-->
    <!--      :model="form"-->
    <!--      :rules="rules"-->
    <!--      :label-col="styleResponsive ? { md: 7, sm: 24 } : { flex: '90px' }"-->
    <!--      :wrapper-col="styleResponsive ? { md: 17, sm: 24 } : { flex: '1' }"-->
    <!--    >-->
    <!--      <a-row :gutter="16">-->
    <!--        <a-col-->
    <!--          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"-->
    <!--        >-->
    <!--          <a-form-item label="所属部门">-->
    <!--            <org-select-->
    <!--              :data="organizationList"-->
    <!--              placeholder="请选择所属部门"-->
    <!--              v-model:value="form.organizationId"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="账号" name="username">-->
    <!--            <a-input-->
    <!--              allow-clear-->
    <!--              :maxlength="20"-->
    <!--              placeholder="请输入用户账号"-->
    <!--              v-model:value="form.username"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="姓名" name="realName">-->
    <!--            <a-input-->
    <!--              allow-clear-->
    <!--              :maxlength="20"-->
    <!--              placeholder="请输入真实姓名"-->
    <!--              v-model:value="form.realName"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="性别" name="sex">-->
    <!--            <sex-select v-model:value="form.sex" />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="角色" name="roles">-->
    <!--            <role-select v-model:value="form.roles" />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--        <a-col-->
    <!--          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"-->
    <!--        >-->
    <!--          <a-form-item label="手机号" name="phone">-->
    <!--            <a-input-->
    <!--              allow-clear-->
    <!--              :maxlength="11"-->
    <!--              placeholder="请输入手机号"-->
    <!--              v-model:value="form.phone"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="邮箱" name="email">-->
    <!--            <a-input-->
    <!--              allow-clear-->
    <!--              :maxlength="100"-->
    <!--              placeholder="请输入邮箱"-->
    <!--              v-model:value="form.email"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="出生日期">-->
    <!--            <a-date-picker-->
    <!--              class="ele-fluid"-->
    <!--              value-format="YYYY-MM-DD"-->
    <!--              placeholder="请选择出生日期"-->
    <!--              v-model:value="form.birthday"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item v-if="!isUpdate" label="登录密码" name="password">-->
    <!--            <a-input-password-->
    <!--              :maxlength="20"-->
    <!--              v-model:value="form.password"-->
    <!--              placeholder="请输入登录密码"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--          <a-form-item label="个人简介">-->
    <!--            <a-textarea-->
    <!--              :rows="4"-->
    <!--              :maxlength="200"-->
    <!--              placeholder="请输入个人简介"-->
    <!--              v-model:value="form.introduction"-->
    <!--            />-->
    <!--          </a-form-item>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--    </a-form>-->
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { emailReg, phoneReg } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import OrgSelect from './org-select.vue';
  import RoleSelect from './role-select.vue';
  import SexSelect from './sex-select.vue';
  import {
    addUser,
    updateUser,
    checkExistence,
    pageUsers
  } from '@/api/system/user';
  import type { User } from '@/api/system/user/model';
  import type { Organization } from '@/api/system/organization/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: User | null;
    // 全部部门
    organizationList: Organization[];
    // 部门id
    organizationId?: number;
  }>();

  interface MockData {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
  }

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  const targetKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const users = ref<User[]>([]);
  const mockData: MockData[] = [];
  const disabled = ref<boolean>(false);

  // 已选择的成员数据
  const chooseUsers = ref<User[]>([]);

  // 未选择的成员数据
  const unChooseClass = computed(() =>
    users.value.filter((d) => chooseUsers.value.indexOf(d) === -1)
  );

  /* 获取全部成员 */
  const query = () => {
    pageUsers({})
      .then((data) => {
        if (data?.list) {
          users.value = data?.list;
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  query();

  /* 添加 */
  const addItem = (row: User) => {
    chooseUsers.value = [...chooseUsers.value, row];
  };

  /* 移除 */
  const removeItem = (row: User) => {
    const index = chooseUsers.value.indexOf(row);
    chooseUsers.value = chooseUsers.value.filter((_d, i) => i !== index);
  };

  /* 添加全部 */
  const addAll = () => {
    chooseUsers.value = [...users.value];
  };

  /* 移除所有 */
  const removeAll = () => {
    chooseUsers.value = [];
  };

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<User>({
    userId: undefined,
    organizationId: undefined,
    username: '',
    nickname: '',
    realName: '',
    sex: undefined,
    roles: [],
    email: '',
    phone: '',
    password: '',
    introduction: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入用户账号');
            }
            checkExistence('username', value, props.data?.userId)
              .then(() => {
                reject('账号已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    nickname: [
      {
        required: true,
        message: '请输入昵称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    realName: [
      {
        required: true,
        message: '请输入真实姓名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    // sex: [
    //   {
    //     required: true,
    //     message: '请选择性别',
    //     type: 'string',
    //     trigger: 'blur'
    //   }
    // ],
    roles: [
      {
        required: true,
        message: '请选择角色',
        type: 'array',
        trigger: 'blur'
      }
    ],
    email: [
      {
        pattern: emailReg,
        message: '邮箱格式不正确',
        type: 'string',
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        type: 'string',
        validator: async (_rule: Rule, value: string) => {
          if (isUpdate.value || /^[\S]{5,18}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('密码必须为5-18位非空白字符');
        },
        trigger: 'blur'
      }
    ],
    phone: [
      {
        required: true,
        pattern: phoneReg,
        message: '手机号格式不正确',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      showSorterTooltip: false
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      showSorterTooltip: false
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      showSorterTooltip: false
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 80,
      align: 'center',
      showSorterTooltip: false,
      hideInTable: true,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center'
    }
  ]);

  const handleChange = (
    nextTargetKeys: string[],
    direction: string,
    moveKeys: string[]
  ) => {
    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };
  const handleScroll = (direction: string, e: Event) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  const reload = () => {
    pageUsers({}).then((res) => {
      if (res?.list) {
        users.value = res?.list;
      }
    });
  };

  reload();

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        form.nickname = form.realName;
        form.alias = form.realName;
        const saveOrUpdate = isUpdate.value ? updateUser : addUser;
        saveOrUpdate(form)
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

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          form.organizationId = props.organizationId;
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
