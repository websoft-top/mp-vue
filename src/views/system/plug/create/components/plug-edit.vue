<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="740"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '插件管理' : '发布插件'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-alert
      :description="`审核通过后，插件将展示在插件市场，可供其他用户安装和使用后，获取销售分成。`"
      closable
      show-icon
      style="margin-bottom: 20px"
    >
      <template #icon><SmileOutlined /></template>
    </a-alert>
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 6, sm: 4, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 18, sm: 20, xs: 24 } : { flex: '1' }
      "
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="模块名称" name="parentId">
            <a-tree-select
              allow-clear
              :tree-data="menuList"
              tree-default-expand-all
              placeholder="请选择上级插件"
              :value="form.parentId || undefined"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              @update:value="(value?: number) => (form.parentId = value)"
            />
          </a-form-item>
          <a-form-item label="插件名称" name="title">
            <a-input
              allow-clear
              placeholder="请输入插件名称"
              v-model:value="form.title"
            />
          </a-form-item>
          <!--          <a-form-item label="关联应用" name="appId">-->
          <!--            <SelectApp v-model:value="appId" @done="onApp" />-->
          <!--          </a-form-item>-->
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="插件价格" name="price">
            <a-input-number
              allow-clear
              :min="0"
              :precision="2"
              style="width: 200px"
              placeholder="请输入插件价格"
              v-model:value="form.price"
            />
            <span class="ml-10">元</span>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin-bottom: 22px">
        <a-divider />
      </div>
      <a-form-item
        label="插件简介"
        name="comments"
        :label-col="
          styleResponsive ? { md: 3, sm: 4, xs: 24 } : { flex: '90px' }
        "
        :wrapper-col="
          styleResponsive ? { md: 21, sm: 20, xs: 24 } : { flex: '1' }
        "
      >
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入插件简介"
          v-model:value="form.comments"
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
  import type { Menu } from '@/api/system/menu/model';
  import { createPlug, updatePlug } from '@/api/system/plug';
  import { Plug } from '@/api/system/plug/model';
  import { SmileOutlined } from '@ant-design/icons-vue';
  import { addDocs, updateDocs } from '@/api/cms/docs';

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
    // 上级插件id
    parentId?: number;
    // 全部插件数据
    menuList: Menu[];
  }>();

  // 是否是修改
  const isUpdate = ref(false);
  // 提交状态
  const loading = ref(false);
  const formRef = ref<FormInstance | null>(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Plug>({
    plugId: undefined,
    menuId: undefined,
    parentId: undefined,
    title: '',
    price: undefined,
    comments: '',
    status: undefined
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    parentId: [
      {
        required: true,
        message: '请选择模块',
        type: 'number',
        trigger: 'blur'
      }
    ],
    title: [
      {
        required: true,
        message: '请输入插件名称',
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
        const formData = {
          ...form,
          status: 10
          // content: content.value
        };
        const saveOrUpdate = isUpdate.value ? updatePlug : createPlug;
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

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  /* 判断是否是目录 */
  const isDirectory = (d: Menu) => {
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
          form.parentId = props.parentId;
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
<style lang="less">
  .tab-pane {
    min-height: 300px;
  }
  .ml-10 {
    margin-left: 5px;
  }
</style>
