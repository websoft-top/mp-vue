<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑小程序端菜单' : '添加小程序端菜单'"
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
      <a-form-item label="上级id, 0是顶级" name="parentId">
        <a-input
          allow-clear
          placeholder="请输入上级id, 0是顶级"
          v-model:value="form.parentId"
        />
      </a-form-item>
      <a-form-item label="菜单名称" name="title">
        <a-input
          allow-clear
          placeholder="请输入菜单名称"
          v-model:value="form.title"
        />
      </a-form-item>
      <a-form-item label="类型 0功能图标 1订单状态图标 2首页导航图标 3 商城导航图标 4管理人员功能图标" name="type">
        <a-input
          allow-clear
          placeholder="请输入类型 0功能图标 1订单状态图标 2首页导航图标 3 商城导航图标 4管理人员功能图标"
          v-model:value="form.type"
        />
      </a-form-item>
      <a-form-item label="是否微信小程序菜单" name="isMpWeixin">
        <a-input
          allow-clear
          placeholder="请输入是否微信小程序菜单"
          v-model:value="form.isMpWeixin"
        />
      </a-form-item>
      <a-form-item label="菜单路由地址" name="path">
        <a-input
          allow-clear
          placeholder="请输入菜单路由地址"
          v-model:value="form.path"
        />
      </a-form-item>
      <a-form-item label="菜单组件地址, 目录可为空" name="component">
        <a-input
          allow-clear
          placeholder="请输入菜单组件地址, 目录可为空"
          v-model:value="form.component"
        />
      </a-form-item>
      <a-form-item label="打开位置" name="target">
        <a-input
          allow-clear
          placeholder="请输入打开位置"
          v-model:value="form.target"
        />
      </a-form-item>
      <a-form-item label="菜单图标" name="avatar">
        <a-input
          allow-clear
          placeholder="请输入菜单图标"
          v-model:value="form.avatar"
        />
      </a-form-item>
      <a-form-item label="图标颜色" name="color">
        <a-input
          allow-clear
          placeholder="请输入图标颜色"
          v-model:value="form.color"
        />
      </a-form-item>
      <a-form-item label="上传图标" name="icon">
        <a-input
          allow-clear
          placeholder="请输入上传图标"
          v-model:value="form.icon"
        />
      </a-form-item>
      <a-form-item label="是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)" name="hide">
        <a-input
          allow-clear
          placeholder="请输入是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)"
          v-model:value="form.hide"
        />
      </a-form-item>
      <a-form-item label="位置 0不限 1顶部 2底部" name="position">
        <a-input
          allow-clear
          placeholder="请输入位置 0不限 1顶部 2底部"
          v-model:value="form.position"
        />
      </a-form-item>
      <a-form-item label="0 第一行 1第二行" name="rows">
        <a-input
          allow-clear
          placeholder="请输入0 第一行 1第二行"
          v-model:value="form.rows"
        />
      </a-form-item>
      <a-form-item label="菜单侧栏选中的path" name="active">
        <a-input
          allow-clear
          placeholder="请输入菜单侧栏选中的path"
          v-model:value="form.active"
        />
      </a-form-item>
      <a-form-item label="其它路由元信息" name="meta">
        <a-input
          allow-clear
          placeholder="请输入其它路由元信息"
          v-model:value="form.meta"
        />
      </a-form-item>
      <a-form-item label="绑定的页面" name="pageId">
        <a-input
          allow-clear
          placeholder="请输入绑定的页面"
          v-model:value="form.pageId"
        />
      </a-form-item>
      <a-form-item label="绑定的文章分类ID" name="articleCategoryId">
        <a-input
          allow-clear
          placeholder="请输入绑定的文章分类ID"
          v-model:value="form.articleCategoryId"
        />
      </a-form-item>
      <a-form-item label="绑定的文章ID" name="articleId">
        <a-input
          allow-clear
          placeholder="请输入绑定的文章ID"
          v-model:value="form.articleId"
        />
      </a-form-item>
      <a-form-item label="绑定的表单ID" name="formId">
        <a-input
          allow-clear
          placeholder="请输入绑定的表单ID"
          v-model:value="form.formId"
        />
      </a-form-item>
      <a-form-item label="绑定的书籍标识" name="bookCode">
        <a-input
          allow-clear
          placeholder="请输入绑定的书籍标识"
          v-model:value="form.bookCode"
        />
      </a-form-item>
      <a-form-item label="绑定的商品分类ID" name="goodsCategoryId">
        <a-input
          allow-clear
          placeholder="请输入绑定的商品分类ID"
          v-model:value="form.goodsCategoryId"
        />
      </a-form-item>
      <a-form-item label="绑定的商品ID" name="goodsId">
        <a-input
          allow-clear
          placeholder="请输入绑定的商品ID"
          v-model:value="form.goodsId"
        />
      </a-form-item>
      <a-form-item label="用户ID" name="userId">
        <a-input
          allow-clear
          placeholder="请输入用户ID"
          v-model:value="form.userId"
        />
      </a-form-item>
      <a-form-item label="是否管理人员可见" name="adminShow">
        <a-input
          allow-clear
          placeholder="请输入是否管理人员可见"
          v-model:value="form.adminShow"
        />
      </a-form-item>
      <a-form-item label="设为首页" name="home">
        <a-input
          allow-clear
          placeholder="请输入设为首页"
          v-model:value="form.home"
        />
      </a-form-item>
      <a-form-item label="分组名称" name="groupName">
        <a-input
          allow-clear
          placeholder="请输入分组名称"
          v-model:value="form.groupName"
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
      <a-form-item label="状态, 0正常, 1冻结" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsMpMenu, updateCmsMpMenu } from '@/api/cms/cmsMpMenu';
  import { CmsMpMenu } from '@/api/cms/cmsMpMenu/model';
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
    data?: CmsMpMenu | null;
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
  const form = reactive<CmsMpMenu>({
    menuId: undefined,
    parentId: undefined,
    title: undefined,
    type: undefined,
    isMpWeixin: undefined,
    path: undefined,
    component: undefined,
    target: undefined,
    avatar: undefined,
    color: undefined,
    icon: undefined,
    hide: undefined,
    position: undefined,
    rows: undefined,
    active: undefined,
    meta: undefined,
    pageId: undefined,
    articleCategoryId: undefined,
    articleId: undefined,
    formId: undefined,
    bookCode: undefined,
    goodsCategoryId: undefined,
    goodsId: undefined,
    userId: undefined,
    adminShow: undefined,
    home: undefined,
    groupName: undefined,
    comments: undefined,
    status: undefined,
    tenantId: undefined,
    createTime: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsMpMenuName: [
      {
        required: true,
        type: 'string',
        message: '请填写小程序端菜单名称',
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
        const saveOrUpdate = isUpdate.value ? updateCmsMpMenu : addCmsMpMenu;
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
