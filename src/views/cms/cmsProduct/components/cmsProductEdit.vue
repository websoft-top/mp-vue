<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑产品' : '添加产品'"
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
      <a-tabs type="card" v-model:active-key="active" @change="onChange">
        <a-tab-pane tab="基本信息" key="base">
          <a-form-item label="类型" name="title">
            <a-radio-group v-model:value="form.type">
              <a-radio-button :value="0"
              >产品
              </a-radio-button
              >
              <a-radio-button :value="1"
              >插件
              </a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="所属栏目" name="categoryId">
            <a-tree-select
              allow-clear
              :tree-data="navigationList"
              tree-default-expand-all
              placeholder="请选择栏目"
              :value="form.categoryId || undefined"
              :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
              @update:value="(value?: number) => (form.categoryId = value)"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}名称`" name="title">
            <a-input
              allow-clear
              :placeholder="`内容管理系统`"
              v-model:value="form.title"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}标识`" name="code">
            <a-input
              allow-clear
              placeholder="cms"
              v-model:value="form.code"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}描述`" name="comments">
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="基础模块，包含菜单、角色、用户、字典、支付、云存储、短信等配置"
              v-model:value="form.comments"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}图标`" name="image">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="1"
              :data="images"
              @done="chooseImage"
              @del="onDeleteItem"
            />
          </a-form-item>
          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}截图`" name="files">
            <SelectFile
              :placeholder="`请选择视频文件`"
              :limit="6"
              :data="files"
              @done="chooseFile"
              @del="onDeleteFile"
            />
          </a-form-item>
          <template v-if="form.type === 1">
            <a-divider style="margin-bottom: 20px"/>
            <a-form-item :label="`关联菜单ID`" name="menuId">
              <a-input-number
                allow-clear
                style="width: 220px"
                placeholder="请输入管理菜单的ID"
                v-model:value="form.menuId"
              />
            </a-form-item>
          </template>
          <!--          <a-form-item :label="`插件入口`" name="path">-->
          <!--            <a-input-->
          <!--              allow-clear-->
          <!--              placeholder="/system/menu"-->
          <!--              v-model:value="form.path"-->
          <!--            />-->
          <!--          </a-form-item>-->
          <a-divider style="margin-bottom: 20px"/>
          <a-form-item label="单位" name="unitName">
            <a-input
              allow-clear
              style="width: 220px"
              placeholder="(套)"
              v-model:value="form.unitName"
            />
          </a-form-item>
          <a-form-item label="价格" name="price">
            <a-input-number
              :min="0"
              allow-clear
              style="width: 220px"
              placeholder="请输入销售价格"
              v-model:value="form.price"
            />
          </a-form-item>
          <a-form-item label="库存" name="stock">
            <a-input-number
              allow-clear
              style="width: 220px"
              placeholder="请输入库存"
              v-model:value="form.stock"
            />
          </a-form-item>
          <a-form-item label="排序号" name="sortNumber">
            <a-input-number
              :min="0"
              :max="9999"
              style="width: 220px"
              placeholder="请输入排序号"
              v-model:value="form.sortNumber"
            />
          </a-form-item>
          <a-form-item label="交付方式" name="deliveryMethod">
            <a-radio-group v-model:value="form.deliveryMethod">
              <a-radio-button :value="0"
              >不启用
              </a-radio-button
              >
              <a-radio-button :value="1"
              >SaaS交付
              </a-radio-button
              >
              <a-radio-button :value="2"
              >源码交付
              </a-radio-button
              >
            </a-radio-group>
            <!--            <a-space>-->
            <!--              <div><a-switch v-model:checked="form.deliveryMethod" /></div>-->
            <!--              <template v-if="form.deliveryMethod">-->
            <!--                <span class="text-gray-400 px-4">字典名称：deliveryMethod</span>-->
            <!--              </template>-->
            <!--            </a-space>-->
          </a-form-item>
          <a-form-item label="计费方式" name="durationMethod">
            <a-radio-group v-model:value="form.durationMethod">
              <a-radio-button :value="0"
              >一次性
              </a-radio-button
              >
              <a-radio-button :value="1"
              >按年
              </a-radio-button
              >
              <a-radio-button :value="2"
              >按月
              </a-radio-button
              >
              <a-radio-button :value="3"
              >按天
              </a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="最多可购买数" name="canBuyNumber">
            <a-input-number
              allow-clear
              style="width: 220px"
              :min="1"
              placeholder="最多可购买数量"
              v-model:value="form.canBuyNumber"
            />
          </a-form-item>
          <a-form-item label="标签" name="tag">
            <a-radio-group v-model:value="form.tag">
              <a-radio-button value="0"
              >不显示
              </a-radio-button
              >
              <a-radio-button value="1"
              >免费
              </a-radio-button
              >
              <a-radio-button value="2"
              >开源
              </a-radio-button
              >
              <a-radio-button value="3"
              >付费
              </a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="是否官方自营" name="official">
            <a-switch
              checked-children="是"
              un-checked-children="否"
              :checked="form.official"
              @update:checked="updateOfficial"
            />
          </a-form-item>

          <a-form-item :label="`${form.type == 0 ? '产品' : '插件'}详情`" name="content">
            <!-- 编辑器 -->
            <tinymce-editor
              ref="editorRef"
              class="content"
              v-model:value="content"
              :disabled="disabled"
              :init="config"
              placeholder="图片直接粘贴自动上传"
              @paste="onPaste"
            />
          </a-form-item>
        </a-tab-pane>
        <template v-if="isUpdate">
          <a-tab-pane tab="产品规格" key="spec">
            <Spec :productId="form.productId"/>
          </a-tab-pane>
          <a-tab-pane tab="链接管理" key="links">
            <CmsProductUrl :productId="form.productId"/>
          </a-tab-pane>
          <a-tab-pane tab="产品参数" key="parameter">
            <CmsProductParameter :productId="form.productId"/>
          </a-tab-pane>
          <a-tab-pane tab="评论管理" key="comment">
            <CmsProductComment :productId="form.productId"/>
          </a-tab-pane>
        </template>
      </a-tabs>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addCmsProduct, updateCmsProduct} from '@/api/cms/cmsProduct';
import {CmsProduct} from '@/api/cms/cmsProduct/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance, RuleObject} from 'ant-design-vue/es/form';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FileRecord} from '@/api/system/file/model';
import TinymceEditor from "@/components/TinymceEditor/index.vue";
import {uploadFile, uploadOss} from "@/api/system/file";
// import Spec from './spec.vue';
import CmsProductUrl from '@/views/cms/cmsProductUrl/index.vue';
import CmsProductParameter from '@/views/cms/cmsProductParameter/index.vue';
import CmsProductComment from '@/views/cms/cmsProductComment/index.vue';
import {Navigation} from "@/api/cms/navigation/model";

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsProduct | null;
  // 栏目数据
  navigationList?: Navigation[];
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 是否显示最大化切换按钮
const maxable = ref(true);
const content = ref('');
const disabled = ref(false);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);
const images = ref<ItemType[]>([]);
const files = ref<ItemType[]>([]);
// 当前选项卡
const active = ref('base');

// 用户信息
const form = reactive<CmsProduct>({
  productId: undefined,
  type: 0,
  code: undefined,
  title: undefined,
  image: undefined,
  content: undefined,
  parentId: 0,
  parentName: '',
  categoryId: 0,
  categoryName: '',
  menuId: 0,
  path: undefined,
  tag: undefined,
  specs: undefined,
  position: undefined,
  unitName: undefined,
  price: undefined,
  salePrice: undefined,
  deductStockType: undefined,
  deliveryMethod: undefined,
  durationMethod: 0,
  serverMethod: undefined,
  packageMethod: undefined,
  canBuyNumber: 1,
  files: undefined,
  sales: undefined,
  stock: 1000,
  official: undefined,
  gainIntegral: undefined,
  recommend: undefined,
  merchantId: undefined,
  isShow: undefined,
  status: undefined,
  userId: undefined,
  deleted: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  comments: '',
  sortNumber: 100
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  categoryId: [
    {
      required: true,
      type: 'number',
      message: '请所属栏目',
      trigger: 'blur'
    }
  ],
  title: [
    {
      required: true,
      type: 'string',
      message: '请填写产品名称',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      type: 'string',
      message: '请填写产品/插件标识',
      trigger: 'blur'
    }
  ],
  menuId: [
    {
      required: true,
      type: 'number',
      message: '请选择菜单ID',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      type: 'string',
      message: '请填写插件入口地址',
      trigger: 'blur'
    }
  ],
  price: [
    {
      required: true,
      type: 'number',
      message: '请填写产品价格',
      trigger: 'blur'
    }
  ],
  stock: [
    {
      required: true,
      type: 'number',
      message: '请填写库存数量',
      trigger: 'blur'
    }
  ],
  unitName: [
    {
      required: true,
      type: 'string',
      message: '请填写单位名称',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      type: "string",
      message: "请输入产品详情",
      trigger: "blur",
      validator: async (_rule: RuleObject, value: string) => {
        if (content.value == "") {
          return Promise.reject("请输入文字内容");
        }
        return Promise.resolve();
      }
    }
  ],
  comments: [
    {
      required: true,
      type: 'string',
      message: '请填写产品描述',
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

const chooseFile = (data: FileRecord) => {
  files.value.push({
    uid: data.id,
    url: data.url,
    status: 'done'
  });
};

const onDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

const updateOfficial = () => {
  form.official = !form.official;
}

const onChange = () => {
  // 加载多规格
  form.productId = props.data?.productId
};

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);
const config = ref({
  height: 500,
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();
    const formData = new FormData();
    formData.append('file', file, file.name);
    uploadOss(file).then(res => {
      success(res.path)
    }).catch((msg) => {
      error(msg);
    })
  },
  // 自定义文件上传(这里使用把选择的文件转成 blob 演示)
  file_picker_callback: (callback: any, _value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    // 设定文件可选类型
    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*,.pdf');
    }
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      if (meta.filetype === 'media') {
        if (file.size / 1024 / 1024 > 200) {
          editorRef.value?.alert({content: '大小不能超过 200MB'});
          return;
        }
        if (file.type.startsWith('application/pdf')) {
          uploadOss(file).then(res => {
            const addPath = `<a href="${res.downloadUrl}" target="_blank">${res.name}</a>`;
            content.value = content.value + addPath
          })
          return;
        }
        if (!file.type.startsWith('video/')) {
          editorRef.value?.alert({content: '只能选择视频文件'});
          return;
        }
        uploadOss(file).then(res => {
          callback(res.path)
        });
      }
    };
    input.click();
  }
});

/* 粘贴图片上传服务器并插入编辑器 */
const onPaste = (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  let hasFile = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      let file = items[i].getAsFile();
      const item: ItemType = {
        file,
        uid: (file as any).lastModified,
        name: file.name
      };
      uploadFile(<File>item.file)
        .then((result) => {
          const addPath = `<p><img class="content-img" src="${result.url}"></p>`;
          content.value = content.value + addPath
        })
        .catch((e) => {
          message.error(e.message);
        });
      hasFile = true;
    }
  }
  if (hasFile) {
    e.preventDefault();
  }
}

const {resetFields} = useForm(form, rules);

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
        ...form,
        content: content.value,
        files: JSON.stringify(files.value),
      };
      const saveOrUpdate = isUpdate.value ? updateCmsProduct : addCmsProduct;
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
    .catch(() => {
    });
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      images.value = [];
      files.value = [];
      content.value = '';
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.image) {
          images.value.push({
            uid: uuid(),
            url: props.data.image,
            status: 'done'
          });
        }
        if (props.data.files) {
          files.value = JSON.parse(props.data.files);
        }
        if (props.data.content) {
          content.value = props.data.content
        }
        isUpdate.value = true;
      } else {
        isUpdate.value = false;
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
