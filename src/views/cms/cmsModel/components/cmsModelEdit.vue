<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑模型' : '添加模型'"
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
        styleResponsive ? { md: 18, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="模型名称" name="name">
        <a-input
          allow-clear
          placeholder="文章"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="模型标识" name="model">
        <a-input
          allow-clear
          placeholder="article"
          v-model:value="form.model"
          @input="onInput"
        />
      </a-form-item>
      <a-form-item label="列表路径" name="component" extra="模版存放路径">
        <a-input
          allow-clear
          placeholder="/pages/article/[id].vue"
          v-model:value="form.component"
        />
      </a-form-item>
      <a-form-item label="详情页" name="componentDetail" extra="模版存放路径">
        <a-input
          allow-clear
          placeholder="/pages/detail/[id].vue"
          v-model:value="form.componentDetail"
        />
      </a-form-item>
      <a-form-item label="文件后缀" name="suffix">
        <a-select v-model:value="form.suffix" allow-clear placeholder=".html">
          <a-select-option value=".html">.html</a-select-option>
          <a-select-option value=".do">.do</a-select-option>
          <a-select-option value=".php">.php</a-select-option>
          <a-select-option value=".java">.java</a-select-option>
          <a-select-option value=".py">.py</a-select-option>
          <a-select-option value=".tsx">.tsx</a-select-option>
          <a-select-option value=".ws">.ws</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Banner" name="banner">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          :width="416"
          :heigit="120"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="尺寸" name="imageWidth">
        <a-space>
          <a-input
            allow-clear
            placeholder="100vw"
            v-model:value="form.imageWidth"
          />
          <a-input
            allow-clear
            placeholder="200px"
            v-model:value="form.imageHeight"
          />
        </a-space>
      </a-form-item>
      <a-form-item label="CSS样式" name="style">
        <a-input
          allow-clear
          placeholder="CSS样式"
          v-model:value="form.style"
        />
        <div class="pt-2">
          <a class="text-sm text-gray-500" href="https://www.tailwindcss.cn/docs/installation" target="_blank">Tailwind Css使用教程</a>
        </div>
      </a-form-item>
<!--      <a-form-item label="Banner标题" name="title">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入Banner上的标题"-->
<!--          v-model:value="form.title"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="Banner描述" name="describe">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          placeholder="请输入Banner上的描述"-->
<!--          v-model:value="form.describe"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="显示方式" name="showType">-->
<!--        <a-radio-group v-model:value="form.showType">-->
<!--          <a-radio :value="0">文字列表</a-radio>-->
<!--          <a-radio :value="10">小图展示</a-radio>-->
<!--          <a-radio :value="20">大图展示</a-radio>-->
<!--        </a-radio-group>-->
<!--      </a-form-item>-->
      <a-form-item label="排序" name="sortNumber">
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
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsModel, updateCmsModel } from '@/api/cms/cmsModel';
  import { CmsModel } from '@/api/cms/cmsModel/model';
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
    data?: CmsModel | null;
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
  const form = reactive<CmsModel>({
    modelId: undefined,
    name: undefined,
    model: undefined,
    component: undefined,
    componentDetail: undefined,
    banner: undefined,
    thumb: undefined,
    suffix: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    style: undefined,
    title: undefined,
    desc: undefined,
    showType: undefined,
    userId: undefined,
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
    name: [
      {
        required: true,
        type: 'string',
        message: '请填写模型名称',
        trigger: 'blur'
      }
    ],
    model: [
      {
        required: true,
        type: 'string',
        message: '请填写模型标识',
        trigger: 'blur'
      }
    ],
    path: [
      {
        required: true,
        type: 'string',
        message: '请填写菜单路由地址',
        trigger: 'blur'
      }
    ],
    // component: [
    //   {
    //     required: true,
    //     type: 'string',
    //     message: '请填写菜单组件地址',
    //     trigger: 'blur'
    //   }
    // ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.banner = data.downloadUrl + '?x-oss-process=image/resize,m_fixed,w_2000/quality,Q_90';
    form.thumb = data.path;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.banner = '';
    form.thumb = '';
  };

  const onInput = () => {
    form.component = `/pages/${form.model}/[id].vue`;
    form.componentDetail = `/pages/${form.model}/detail/[id].vue`;
  }

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
        const saveOrUpdate = isUpdate.value ? updateCmsModel : addCmsModel;
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
          if(props.data.banner){
            images.value.push({
              uid: uuid(),
              url: props.data.banner,
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
