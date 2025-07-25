<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="780"
    :visible="visible"
    :confirm-loading="loading"
    title="安装插件"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    okText="安装插件"
    :footer="footer"
    @ok="save"
  >
    <template v-if="!isSuccess">
      <a-alert
        :description="`安装成功后，插件出现在左侧菜单中，请在 【系统设置->菜单管理】修改插件的名称及顺序`"
        type="success"
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
        :label-col="
          styleResponsive ? { md: 6, sm: 4, xs: 24 } : { flex: '90px' }
        "
        :wrapper-col="
          styleResponsive ? { md: 18, sm: 20, xs: 24 } : { flex: '1' }
        "
      >
        <a-row :gutter="16">
          <a-col
            v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
          >
            <a-form-item label="插件名称" name="parentId">
              <span class="ele-text-heading">{{ data.title }}</span>
            </a-form-item>
            <a-form-item label="价格" name="comments">
              ￥{{ data.price }}
            </a-form-item>
          </a-col>
          <a-col
            v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
          >
            <a-form-item label="插件ID" name="menuId">
              <span class="ele-text-secondary">{{ data.menuId }}</span>
            </a-form-item>
            <a-form-item label="开发商" name="sortName">
              <span class="ele-text-secondary">
                {{ data.tenantId === 5 ? '官方' : data.shortName }}
              </span>
            </a-form-item>
          </a-col>
          <a-col
            v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 24 }"
          >
            <a-form-item label="插件介绍" name="comments">
              <div class="ele-text-secondary" style="padding: 5px">
                <byte-md-viewer :value="data.comments" :plugins="plugins" />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <a-result
      status="success"
      title="安装成功"
      v-if="isSuccess"
      sub-title="请在 【系统设置->菜单管理】修改插件的名称及顺序"
    >
      <template #extra>
        <a-button key="console" type="primary" @click="reset(data.path)"
          >立即前往</a-button
        >
      </template>
    </a-result>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance } from 'ant-design-vue/es/form';
  import { isExternalLink } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { Menu } from '@/api/system/menu/model';
  import { Plug } from '@/api/system/plug/model';
  import { SmileOutlined } from '@ant-design/icons-vue';
  import gfm from '@bytemd/plugin-gfm';
  import highlight from '@bytemd/plugin-highlight-ssr';
  // // 插件的中文语言文件
  import zh_HansGfm from '@bytemd/plugin-gfm/locales/zh_Hans.json';
  import { installPlug } from '@/api/system/menu';
  import { reloadPageTab } from '@/utils/page-tab-util';
  import { useRouter } from 'vue-router';

  const { push } = useRouter();
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
    data?: Plug | null;
    // 上级插件id
    parentId?: number;
    // 全部插件数据
    menuList: Plug[];
  }>();

  // 是否是修改
  const isUpdate = ref(false);
  // 提交状态
  const loading = ref(false);
  const appid = ref(undefined);
  const formRef = ref<FormInstance | null>(null);
  const isSuccess = ref(false);
  const footer = ref();

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Plug>({
    plugId: undefined,
    menuId: undefined,
    parentId: undefined,
    title: '',
    menuType: 0,
    openType: 0,
    icon: '',
    path: '',
    component: '',
    authority: '',
    comments: '',
    sortNumber: undefined,
    hide: 0,
    meta: '',
    status: 10
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
          ...form,
          // menuType 对应的值与后端不一致在前端处理
          menuType: form.menuType === 2 ? 1 : 0,
          parentId: form.parentId || 0
        };
        console.log(menuForm);
        installPlug(form.menuId)
          .then((msg) => {
            loading.value = false;
            isSuccess.value = true;
            footer.value = null;
            // message.success(msg);
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

  // 插件
  const plugins = ref([
    gfm({
      locale: zh_HansGfm
    }),
    highlight()
  ]);

  const reset = (url) => {
    console.log(url);
    push(url);
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
