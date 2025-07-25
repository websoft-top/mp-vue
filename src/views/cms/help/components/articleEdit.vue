<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    title="文章详情"
    :body-style="{ paddingBottom: '18px' }"
    @update:visible="updateVisible"
    :confirm-loading="loading"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :label-col="styleResponsive ? { md: 2, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 20, sm: 20, xs: 20 } : { flex: '1' }
      "
    >
      <a-spin :spinning="loading">
        <div v-html="content"></div>
      </a-spin>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import {
    addCmsArticle,
    getCmsArticle,
    updateCmsArticle
  } from '@/api/cms/cmsArticle';
  import { CmsArticle } from '@/api/cms/cmsArticle/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { useWebsiteSettingStore } from '@/store/modules/setting';

  // 是否是修改
  const isUpdate = ref(false);
  const setting = useWebsiteSettingStore();
  const { locale } = useI18n();
  const editor = ref<number>(1);
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: CmsArticle | null;
    categoryId?: number;
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
  const content = ref('');
  const files = ref<ItemType[]>([]);
  const category = ref<string[]>([]);
  const password = ref();

  // 用户信息
  const form = reactive<CmsArticle>({
    articleId: undefined,
    // 文章模型
    model: 'detail',
    // 封面图
    image: '',
    // 文章标题
    title: '',
    type: 0,
    // 展现方式
    showType: 10,
    // 文章来源
    source: undefined,
    // 产品概述
    overview: undefined,
    // 标签集
    tags: undefined,
    // 父级栏目ID
    parentId: undefined,
    // 栏目ID
    categoryId: undefined,
    // 栏目名称
    categoryName: undefined,
    // 文章内容
    content: '',
    // 虚拟阅读量
    virtualViews: 0,
    // 实际阅读量
    actualViews: 0,
    recommend: undefined,
    translation: true,
    permission: 0,
    password: undefined,
    password2: undefined,
    // 用户ID
    userId: undefined,
    files: '',
    lang: locale.value || undefined,
    // 排序
    sortNumber: 100,
    // 备注
    comments: undefined,
    // 状态
    status: 1,
    // 创建时间
    createTime: '',
    // 更新时间
    updateTime: ''
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        if (password.value) {
          form.password = password.value;
        }
        if (form.tags) {
          form.tags = JSON.stringify(form.tags);
        }
        const formData = {
          ...form,
          editor: editor.value || 1,
          status: setting.setting?.articleReview ? 1 : 0,
          content: content.value
        };
        const saveOrUpdate = isUpdate.value ? updateCmsArticle : addCmsArticle;
        saveOrUpdate(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            message.error(e.message);
          })
          .finally(() => {
            loading.value = false;
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (props.categoryId) {
        form.categoryId = props.categoryId;
      }
      if (localStorage.getItem('Editor')) {
        editor.value = Number(localStorage.getItem('Editor'));
      }

      if (visible) {
        images.value = [];
        category.value = [];
        files.value = [];
        content.value = '';
        if (props.data) {
          loading.value = true;
          // 文章详情
          getCmsArticle(Number(props.data?.articleId)).then((data) => {
            assignObject(form, data);
            if (data.content) {
              content.value = data.content;
            }

            if (data.image) {
              images.value.push({
                uid: uuid(),
                url: data.image,
                status: 'done'
              });
            }
            if (!data.source) {
              form.source = undefined;
            }
            if (data.tags) {
              form.tags = JSON.parse(form.tags);
            } else {
              form.tags = undefined;
            }
            if (data.editor) {
              editor.value = data.editor;
            }
            if (data.files) {
              const arr = JSON.parse(data.files);
              arr.map((url: string) => {
                files.value.push({
                  uid: uuid(),
                  url: url,
                  status: 'done'
                });
              });
            }
            loading.value = false;
          });
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      }
    },
    { immediate: true }
  );
</script>
