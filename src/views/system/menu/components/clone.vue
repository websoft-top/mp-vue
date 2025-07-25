<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="550"
    :visible="visible"
    :confirm-loading="loading"
    :title="`菜单克隆`"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 5, sm: 4, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 17, sm: 20, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="操作说明" name="readme">
        <a-alert
          description="本功能可以实现一键复制A系统的菜单到B系统的菜单，复制成功后会作为顶级目录出现在B系统的菜单功能上(注意：还需要手动给角色勾选权限才能使用)。菜单ID可以在A系统的菜单管理->修改菜单->是否展示的后面获取。"
          type="warning"
        />
      </a-form-item>
      <a-form-item label="菜单ID" name="menuId">
        <a-input
          allow-clear
          placeholder="请输入菜单ID"
          v-model:value="form.menuId"
        />
      </a-form-item>
      <a-form-item label="租户ID" name="tenantId">
        <a-input
          allow-clear
          placeholder="请输入租户ID"
          v-model:value="form.tenantId"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { isExternalLink } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import { clone } from '@/api/system/menu';
  import type { Menu } from '@/api/system/menu/model';

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
    data?: Menu | null;
    // 上级菜单id
    parentId?: number;
    // 全部菜单数据
    menuList: Menu[];
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  const tenantName = ref('请选择租户');

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Menu>({
    title: '',
    icon: '',
    path: '',
    component: '',
    tenantId: undefined,
    tenantName: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    tenantId: [
      {
        required: true,
        message: '请选择要复制的租户ID',
        type: 'string',
        trigger: 'blur'
      }
    ],
    menuId: [
      {
        required: true,
        message: '请选择要复制的菜单ID',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const menuForm = {
          ...form
        };
        clone(menuForm)
          .then((msg) => {
            loading.value = false;
            updateVisible(false);
            emit('done');
            message.success(msg);
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

  /* 判断是否是目录 */
  const isDirectory = (d: Menu) => {
    return !!d.children?.length && !d.component;
  };

  const onPromoter = (e) => {
    tenantName.value = e.tenantName;
    form.tenantId = e.tenantId;
    form.tenantName = e.tenantName;
  };

  // 查询租户列表
  // const tenantList = ref<Tenant[]>([]);
  // const reload = (tenantName?: any) => {
  //   listTenant({ tenantName }).then((result) => {
  //     tenantList.value = result;
  //   });
  // };
  //
  // reload();

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          const isExternal = isExternalLink(props.data.path);
          const isInner = isExternalLink(props.data.component);
          // menuType 对应的值与后端不一致在前端处理
          const menuType =
            props.data.menuType === 1 ? 2 : isDirectory(props.data) ? 0 : 1;
          assignFields({
            ...props.data,
            menuType,
            openType: isExternal ? 2 : isInner ? 1 : 0,
            parentId:
              props.data.parentId === 0 ? undefined : props.data.parentId
          });
          isUpdate.value = true;
        } else {
          form.parentId = props.parentId;
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>

<script lang="ts">
  import * as icons from '@/layout/menu-icons';

  export default {
    components: icons,
    data() {
      return {
        iconData: [
          {
            title: '已引入的图标',
            icons: Object.keys(icons)
          }
        ]
      };
    }
  };
</script>
