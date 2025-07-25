<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="'批量更新'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 24, sm: 24, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item>
        <a-alert :message="'提示：每次最多修改 50000 条数据'" banner />
      </a-form-item>
      <a-form-item label="选择栏目">
        <a-tree-select
          allow-clear
          :tree-data="navigationList"
          tree-default-expand-all
          style="width: 400px"
          placeholder="请选择栏目"
          :value="form.categoryId || undefined"
          :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
          @update:value="(value?: number) => (form.categoryId = value)"
          @change="onCategoryId"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { updateBatchCmsArticle } from "@/api/cms/cmsArticle";
  import { CmsArticle } from '@/api/cms/cmsArticle/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { FormInstance, RuleObject } from 'ant-design-vue/es/form';
  import { CmsNavigation } from "@/api/cms/cmsNavigation/model";

  // 是否是修改
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 表格选中数据
    selection?: CmsArticle[];
    // 栏目数据
    navigationList?: CmsNavigation[];
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
  const content = ref('');

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
    source: '-',
    // 文章类型
    categoryId: undefined,
    // 栏目名称
    categoryName: undefined,
    // 文章内容
    content: '',
    // 虚拟阅读量
    virtualViews: 0,
    // 实际阅读量
    actualViews: 0,
    permission: 0,
    password: undefined,
    password2: undefined,
    // 用户ID
    userId: undefined,
    files: '',
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

  // 表单验证规则
  const rules = reactive({
    title: [
      {
        required: true,
        message: '请选择文章标题',
        type: 'string',
        trigger: 'blur'
      }
    ],
    categoryId: [
      {
        required: true,
        message: '请选择栏目',
        type: 'number',
        trigger: 'blur'
      }
    ],
    content: [
      {
        required: true,
        type: "string",
        message: "请输入文章内容",
        trigger: "blur",
        validator: async (_rule: RuleObject, value: string) => {
          if (content.value == "") {
            return Promise.reject("请输入文字内容");
          }
          return Promise.resolve();
        }
      }
    ],
  });

  // 选择栏目
  const onCategoryId = (id: number) => {
    console.log(id);
    form.categoryId = id;
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
        props.selection?.map(d => d.articleId)
        updateBatchCmsArticle({
          ids: props.selection?.map(d => d.articleId),
          data: {
            categoryId: form.categoryId
          }
        }).then((msg) => {
          message.success(msg);
          loading.value = false;
          updateVisible(false);
          emit('done');
        })
          .catch((e) => {
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
