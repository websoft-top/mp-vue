<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑文章评论表' : '添加文章评论表'"
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
      <a-form-item label="文章ID" name="articleId">
        <a-input
          allow-clear
          placeholder="请输入文章ID"
          v-model:value="form.articleId"
        />
      </a-form-item>
      <a-form-item label="评分 (10好评 20中评 30差评)" name="score">
        <a-input
          allow-clear
          placeholder="请输入评分 (10好评 20中评 30差评)"
          v-model:value="form.score"
        />
      </a-form-item>
      <a-form-item label="评价内容" name="content">
        <a-input
          allow-clear
          placeholder="请输入评价内容"
          v-model:value="form.content"
        />
      </a-form-item>
      <a-form-item label="是否为图片评价" name="isPicture">
        <a-input
          allow-clear
          placeholder="请输入是否为图片评价"
          v-model:value="form.isPicture"
        />
      </a-form-item>
      <a-form-item label="评论者ID" name="userId">
        <a-input
          allow-clear
          placeholder="请输入评论者ID"
          v-model:value="form.userId"
        />
      </a-form-item>
      <a-form-item label="被评价者ID" name="toUserId">
        <a-input
          allow-clear
          placeholder="请输入被评价者ID"
          v-model:value="form.toUserId"
        />
      </a-form-item>
      <a-form-item label="回复的评论ID" name="replyCommentId">
        <a-input
          allow-clear
          placeholder="请输入回复的评论ID"
          v-model:value="form.replyCommentId"
        />
      </a-form-item>
      <a-form-item label="回复者ID" name="replyUserId">
        <a-input
          allow-clear
          placeholder="请输入回复者ID"
          v-model:value="form.replyUserId"
        />
      </a-form-item>
      <a-form-item label="排序(数字越小越靠前)" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="状态, 0未读, 1已读" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
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
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsArticleComment, updateCmsArticleComment } from '@/api/cms/cmsArticleComment';
  import { CmsArticleComment } from '@/api/cms/cmsArticleComment/model';
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
    data?: CmsArticleComment | null;
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
  const form = reactive<CmsArticleComment>({
    commentId: undefined,
    articleId: undefined,
    score: undefined,
    content: undefined,
    isPicture: undefined,
    userId: undefined,
    toUserId: undefined,
    replyCommentId: undefined,
    replyUserId: undefined,
    sortNumber: undefined,
    comments: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    cmsArticleCommentId: undefined,
    cmsArticleCommentName: '',
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
    cmsArticleCommentName: [
      {
        required: true,
        type: 'string',
        message: '请填写文章评论表名称',
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
        const saveOrUpdate = isUpdate.value ? updateCmsArticleComment : addCmsArticleComment;
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
