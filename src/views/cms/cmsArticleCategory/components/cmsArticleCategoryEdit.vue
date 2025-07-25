<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑文章分类表' : '添加文章分类表'"
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
      <a-form-item label="分类标识" name="categoryCode">
        <a-input
          allow-clear
          placeholder="请输入分类标识"
          v-model:value="form.categoryCode"
        />
      </a-form-item>
      <a-form-item label="分类名称" name="title">
        <a-input
          allow-clear
          placeholder="请输入分类名称"
          v-model:value="form.title"
        />
      </a-form-item>
      <a-form-item label="类型 0列表 1单页 2外链" name="type">
        <a-input
          allow-clear
          placeholder="请输入类型 0列表 1单页 2外链"
          v-model:value="form.type"
        />
      </a-form-item>
        <a-form-item
          label="分类图片"
          name="image">
          <SelectFile
            :placeholder="`请选择图片`"
            :limit="1"
            :data="images"
            @done="chooseImage"
            @del="onDeleteItem"
          />
        </a-form-item>
      <a-form-item label="上级分类ID" name="parentId">
        <a-input
          allow-clear
          placeholder="请输入上级分类ID"
          v-model:value="form.parentId"
        />
      </a-form-item>
      <a-form-item label="路由/链接地址" name="path">
        <a-input
          allow-clear
          placeholder="请输入路由/链接地址"
          v-model:value="form.path"
        />
      </a-form-item>
      <a-form-item label="组件路径" name="component">
        <a-input
          allow-clear
          placeholder="请输入组件路径"
          v-model:value="form.component"
        />
      </a-form-item>
      <a-form-item label="绑定的页面" name="pageId">
        <a-input
          allow-clear
          placeholder="请输入绑定的页面"
          v-model:value="form.pageId"
        />
      </a-form-item>
      <a-form-item label="用户ID" name="userId">
        <a-input
          allow-clear
          placeholder="请输入用户ID"
          v-model:value="form.userId"
        />
      </a-form-item>
      <a-form-item label="文章数量" name="count">
        <a-input
          allow-clear
          placeholder="请输入文章数量"
          v-model:value="form.count"
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
      <a-form-item label="是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)" name="hide">
        <a-input
          allow-clear
          placeholder="请输入是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)"
          v-model:value="form.hide"
        />
      </a-form-item>
      <a-form-item label="是否推荐" name="recommend">
        <a-input
          allow-clear
          placeholder="请输入是否推荐"
          v-model:value="form.recommend"
        />
      </a-form-item>
      <a-form-item label="是否显示在首页" name="showIndex">
        <a-input
          allow-clear
          placeholder="请输入是否显示在首页"
          v-model:value="form.showIndex"
        />
      </a-form-item>
      <a-form-item label="状态, 0正常, 1禁用" name="status">
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
  import { addCmsArticleCategory, updateCmsArticleCategory } from '@/api/cms/cmsArticleCategory';
  import { CmsArticleCategory } from '@/api/cms/cmsArticleCategory/model';
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
    data?: CmsArticleCategory | null;
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
  const form = reactive<CmsArticleCategory>({
    categoryId: undefined,
    categoryCode: undefined,
    title: undefined,
    type: undefined,
    image: undefined,
    parentId: undefined,
    path: undefined,
    component: undefined,
    pageId: undefined,
    userId: undefined,
    count: undefined,
    sortNumber: undefined,
    comments: undefined,
    hide: undefined,
    recommend: undefined,
    showIndex: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    cmsArticleCategoryId: undefined,
    cmsArticleCategoryName: '',
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
    cmsArticleCategoryName: [
      {
        required: true,
        type: 'string',
        message: '请填写文章分类表名称',
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
        const saveOrUpdate = isUpdate.value ? updateCmsArticleCategory : addCmsArticleCategory;
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
