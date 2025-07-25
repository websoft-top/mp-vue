<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch />
    </template>
    <a-card class="ele-body" :bordered="false" :body-style="{ padding: '16px' }">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="styleResponsive ? { md: 2, sm: 5, xs: 24 } : { flex: '120px' }"
        :wrapper-col="
        styleResponsive ? { md: 14, sm: 19, xs: 24 } : { flex: '1' }
      "
      >
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="setting" tab="网站设置" class="mt-5">
          <a-form-item label="悬浮工具栏" name="floatTool" extra="显示网站悬浮客服工具栏">
            <a-switch v-model:checked="form.floatTool" checked-children="显示" un-checked-children="隐藏" @change="save" />
          </a-form-item>
          <a-form-item label="显示站内搜索" name="searchBtn">
            <a-switch v-model:checked="form.searchBtn" checked-children="显示" un-checked-children="隐藏" @change="save" />
          </a-form-item>
          <a-form-item label="显示版权" name="showCopyright">
            <a-switch v-model:checked="form.showCopyright" checked-children="显示" un-checked-children="隐藏" @change="save" />
          </a-form-item>
          <a-form-item label="启用登录注册" name="loginBtn">
            <a-switch v-model:checked="form.loginBtn" checked-children="启用" un-checked-children="不启用" @change="save" />
          </a-form-item>
          <a-form-item label="默认编辑器" name="editor" extra="设置默认编辑器">
            <a-select v-model:value="form.editor" placeholder="请选择编辑器" class="max-w-xs" @change="save">
              <a-select-option :value="1">富文本编辑器</a-select-option>
              <a-select-option :value="2">Markdown编辑器</a-select-option>
            </a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="privacy" tab="隐私与安全" class="mt-5">
          <a-form-item label="允许被搜索" name="name" extra="关闭后，用户无法通过名称搜索到此网站">
            <a-switch v-model:checked="form.market" checked-children="允许" un-checked-children="不允许" @change="save" />
          </a-form-item>
          <a-form-item label="文章发布审核" name="articleReview" extra="开启需要审核后发布，关闭则直接发布">
            <a-switch v-model:checked="form.articleReview" checked-children="需要" un-checked-children="不需要" @change="save" />
          </a-form-item>
          <a-form-item label="开发者模式" name="plugin" extra="开启开发者模式">
            <a-switch v-model:checked="form.plugin" checked-children="启用" un-checked-children="禁用" @change="save" />
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      </a-form>
    </a-card>
  </a-page-header>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { FormInstance } from 'ant-design-vue/es/form';
  import {getPageTitle} from "@/utils/common";
  import { storeToRefs } from 'pinia';
  import { assignObject } from 'ele-admin-pro';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import CmsWebsiteSearch from "@/views/cms/cmsWebsite/components/search.vue";
  import {useThemeStore} from "@/store/modules/theme";
  import router from "@/router";
  import {CmsWebsiteSetting} from "@/api/cms/cmsWebsiteSetting/model";
  import {getCmsWebsiteSetting, updateCmsWebsiteSetting} from "@/api/cms/cmsWebsiteSetting";
  import {useWebsiteSettingStore} from "@/store/modules/setting";

  // 网站设置信息
  const setting = useWebsiteSettingStore();
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  // 加载状态
  const loading = ref(true);
  const logo = ref<ItemType[]>([]);
  const activeKey = ref('setting');

  // 用户信息
  const form = reactive<CmsWebsiteSetting>({
    id: undefined,
    websiteId: undefined,
    official: undefined,
    market: undefined,
    search: undefined,
    share: undefined,
    articleReview: undefined,
    plugin: undefined,
    editor: undefined,
    searchBtn: undefined,
    loginBtn: undefined,
    floatTool: undefined,
    showCopyright: undefined,
    copyrightLink: undefined,
    maxMenuNum: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    sortNumber: 100
  });

  // 表单验证规则
  const rules = reactive({
    websiteName: [
      {
        required: true,
        type: 'string',
        message: '请填写网站信息名称',
        trigger: 'blur'
      }
    ]
  });

  /* 查询 */
  const query = () => {
    loading.value = true;
    getCmsWebsiteSetting(Number(localStorage.getItem('WebsiteId'))).then(data => {
      assignObject(form, data);
      if(data){
        assignObject(form,data)
      }else {
        resetFields()
      }
    }).catch((msg) => {
      console.log(msg)
    })
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
        setting.setSetting(formData);
        updateCmsWebsiteSetting(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => router,
    () => {
      query()
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'CmsWebsiteSetting'
  };
</script>

<style lang="less" scoped></style>
