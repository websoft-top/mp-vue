<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑网站设置' : '添加网站设置'"
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
      <a-form-item label="关联网站ID" name="websiteId">
        <a-input
          allow-clear
          placeholder="请输入关联网站ID"
          v-model:value="form.websiteId"
        />
      </a-form-item>
      <a-form-item label="是否官方插件" name="official">
        <a-input
          allow-clear
          placeholder="请输入是否官方插件"
          v-model:value="form.official"
        />
      </a-form-item>
      <a-form-item label="是否展示在插件市场" name="market">
        <a-input
          allow-clear
          placeholder="请输入是否展示在插件市场"
          v-model:value="form.market"
        />
      </a-form-item>
      <a-form-item label="是否允许被搜索" name="search">
        <a-input
          allow-clear
          placeholder="请输入是否允许被搜索"
          v-model:value="form.search"
        />
      </a-form-item>
      <a-form-item label="是否共享" name="share">
        <a-input
          allow-clear
          placeholder="请输入是否共享"
          v-model:value="form.share"
        />
      </a-form-item>
      <a-form-item label="是否插件 0应用1 插件 " name="plugin">
        <a-input
          allow-clear
          placeholder="请输入是否插件 0应用1 插件 "
          v-model:value="form.plugin"
        />
      </a-form-item>
      <a-form-item label="编辑器类型 1 md-editor-v3, 2 tinymce-editor" name="editor">
        <a-input
          allow-clear
          placeholder="请输入编辑器类型 1 md-editor-v3, 2 tinymce-editor"
          v-model:value="form.editor"
        />
      </a-form-item>
      <a-form-item label="显示站内搜索" name="searchBtn">
        <a-input
          allow-clear
          placeholder="请输入显示站内搜索"
          v-model:value="form.searchBtn"
        />
      </a-form-item>
      <a-form-item label="显示登录注册功能" name="loginBtn">
        <a-input
          allow-clear
          placeholder="请输入显示登录注册功能"
          v-model:value="form.loginBtn"
        />
      </a-form-item>
      <a-form-item label="显示悬浮客服工具" name="kefuTool">
        <a-input
          allow-clear
          placeholder="请输入显示悬浮客服工具"
          v-model:value="form.floatTool"
        />
      </a-form-item>
      <a-form-item label="显示版权链接" name="copyrightLink">
        <a-input
          allow-clear
          placeholder="请输入显示版权链接"
          v-model:value="form.copyrightLink"
        />
      </a-form-item>
      <a-form-item label="导航栏最多显示数量" name="maxMenuNum">
        <a-input
          allow-clear
          placeholder="请输入导航栏最多显示数量"
          v-model:value="form.maxMenuNum"
        />
      </a-form-item>
      <a-form-item label="排序号" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="是否删除, 0否, 1是" name="deleted">
        <a-input
          allow-clear
          placeholder="请输入是否删除, 0否, 1是"
          v-model:value="form.deleted"
        />
      </a-form-item>
      <a-form-item label="修改时间" name="updateTime">
        <a-input
          allow-clear
          placeholder="请输入修改时间"
          v-model:value="form.updateTime"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addCmsWebsiteSetting, updateCmsWebsiteSetting } from '@/api/cms/cmsWebsiteSetting';
  import { CmsWebsiteSetting } from '@/api/cms/cmsWebsiteSetting/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';

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
    data?: CmsWebsiteSetting | null;
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
  const form = reactive<CmsWebsiteSetting>({
    id: undefined,
    websiteId: undefined,
    official: undefined,
    market: undefined,
    search: undefined,
    share: undefined,
    plugin: undefined,
    editor: undefined,
    searchBtn: undefined,
    loginBtn: undefined,
    floatTool: undefined,
    copyrightLink: undefined,
    maxMenuNum: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsWebsiteSettingName: [
      {
        required: true,
        type: 'string',
        message: '请填写网站设置名称',
        trigger: 'blur'
      }
    ]
  });

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
        const saveOrUpdate = isUpdate.value ? updateCmsWebsiteSetting : addCmsWebsiteSetting;
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
