<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="520"
    :visible="visible"
    :confirm-loading="loading"
    title="发布插件"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    cancelText="取消"
    okText="确定发布"
    @ok="save"
  >
    <a-form ref="formRef" :model="form" :rules="rules">
      <a-alert
        :description="`审核通过后，该插件将展示在扩展插件模块，可供其他用户安装和使用后，获得销售分成。`"
        type="success"
        closable
        show-icon
      >
        <template #icon><SmileOutlined /></template>
      </a-alert>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import useFormData from '@/utils/use-form-data';
  import { createPlug } from '@/api/system/plug';
  import type { Plug } from '@/api/system/plug/model';
  import { RuleObject } from 'ant-design-vue/es/form';
  import { isExternalLink } from 'ele-admin-pro';

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: Plug | null;
    // 上级菜单id
    parentId?: number;
    // 全部菜单数据
    menuList: Plug[];
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  const appid = ref(undefined);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Plug>({
    parentId: undefined
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    appId: [
      {
        required: true,
        message: '请选择要绑定的应用',
        type: 'number',
        trigger: 'blur',
        validator: async (_rule: RuleObject, value: string) => {
          if (appid.value == undefined) {
            return Promise.reject('请选择要绑定的应用');
          }
          return Promise.resolve();
        }
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
        form.parentId = props.data?.menuId;
        createPlug(form)
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

  /* 判断是否是目录 */
  const isDirectory = (d: Plug) => {
    return !!d.children?.length && !d.component;
  };

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
