<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑网站模版' : '添加网站模版'"
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
      <a-form-item label="模版名称" name="name">
        <a-input
          allow-clear
          placeholder="请输入模版名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="模版标识" name="code">
        <a-input
          allow-clear
          placeholder="请输入模版标识"
          v-model:value="form.code"
        />
      </a-form-item>
        <a-form-item
          label="缩列图"
          name="image">
          <SelectFile
            :placeholder="`请选择图片`"
            :limit="1"
            :data="images"
            @done="chooseImage"
            @del="onDeleteItem"
          />
        </a-form-item>
<!--      <a-form-item label="类型 1企业官网 2其他" name="type">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入类型 1企业官网 2其他"-->
<!--          v-model:value="form.type"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="网站关键词" name="keywords">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入网站关键词"-->
<!--          v-model:value="form.keywords"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="域名前缀" name="prefix">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入域名前缀"-->
<!--          v-model:value="form.prefix"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="预览地址" name="domain">
        <a-input
          allow-clear
          placeholder="请输入预览地址"
          v-model:value="form.domain"
        />
      </a-form-item>
      <a-form-item label="模版下载地址" name="downUrl">
        <a-input
          allow-clear
          placeholder="请输入模版下载地址"
          v-model:value="form.downUrl"
        />
      </a-form-item>
<!--      <a-form-item label="色系" name="color">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入色系"-->
<!--          v-model:value="form.color"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="应用版本 10免费版 20授权版 30永久授权" name="version">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入应用版本 10免费版 20授权版 30永久授权"-->
<!--          v-model:value="form.version"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="行业类型(父级)" name="industryParent">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入行业类型(父级)"-->
<!--          v-model:value="form.industryParent"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="行业类型(子级)" name="industryChild">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入行业类型(子级)"-->
<!--          v-model:value="form.industryChild"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
<!--      <a-form-item label="是否共享模板" name="share">-->
<!--        <a-radio-group-->
<!--          v-model:value="form.share"-->
<!--        >-->
<!--          <a-radio :value="1">共享</a-radio>-->
<!--          <a-radio :value="0">私有</a-radio>-->
<!--        </a-radio-group>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="排序号" name="sortNumber">-->
<!--        <a-input-number-->
<!--          :min="0"-->
<!--          :max="9999"-->
<!--          class="ele-fluid"-->
<!--          placeholder="请输入排序号"-->
<!--          v-model:value="form.sortNumber"-->
<!--        />-->
<!--      </a-form-item>-->
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsTemplate, updateCmsTemplate } from '@/api/cms/cmsTemplate';
  import { CmsTemplate } from '@/api/cms/cmsTemplate/model';
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
    data?: CmsTemplate | null;
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
  const form = reactive<CmsTemplate>({
    id: undefined,
    name: undefined,
    code: undefined,
    image: undefined,
    type: undefined,
    keywords: undefined,
    prefix: undefined,
    domain: undefined,
    downUrl: undefined,
    color: undefined,
    version: undefined,
    industryParent: undefined,
    industryChild: undefined,
    comments: undefined,
    recommend: undefined,
    share: undefined,
    sortNumber: undefined,
    userId: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsTemplateName: [
      {
        required: true,
        type: 'string',
        message: '请填写网站模版名称',
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
        const saveOrUpdate = isUpdate.value ? updateCmsTemplate : addCmsTemplate;
        saveOrUpdate(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch(() => {
            loading.value = false;
            message.info('该功能仅对认证开发者开放');
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
