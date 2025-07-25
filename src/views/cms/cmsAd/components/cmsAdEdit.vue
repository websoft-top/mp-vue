<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑广告' : '添加广告'"
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
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="标题" name="name">
        <a-input
          allow-clear
          :maxlength="100"
          style="width: 500px"
          placeholder="请输入广告标题"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-radio-group
          v-model:value="form.type"
          :disabled="isUpdate || !disabled"
          @change="onTypeChange"
        >
          <a-radio :value="1">轮播</a-radio>
          <a-radio :value="2">图片</a-radio>
          <a-radio :value="3">视频</a-radio>
          <a-radio :value="4">文本</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="form.type == 1">
        <a-form-item label="多图" name="images">
          <div :class="`item-style ${form.style}`">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="9"
              :data="images"
              @done="chooseFile"
              @del="onDeleteItem"
            />
          </div>
          <a-space class="flex flex-col gap-2">
            <div class="w-[500px]" v-for="(item, index) in images" :key="index">
              <a-input
                v-model:value="images[index].path"
                placeholder="https://"
              />
            </div>
          </a-space>
        </a-form-item>
      </template>
      <template v-if="form.type == 2">
        <a-form-item label="单图" name="images">
          <div :class="`item-style ${form.style}`">
            <SelectFile
              :limit="1"
              :data="images"
              @done="chooseFile"
              @del="onDeleteItem"
            />
          </div>
        </a-form-item>
      </template>
      <template v-if="form.type == 3">
        <a-form-item
          label="视频"
          name="images"
          extra="请上传视频文件，仅支持mp4格式，大小200M以内"
        >
          <div :class="`item-style ${form.style}`">
            <SelectFile
              :placeholder="`请选择视频文件`"
              :limit="1"
              :data="images"
              @done="chooseFile"
              @del="onDeleteItem"
            />
          </div>
        </a-form-item>
      </template>
      <template v-if="form.type == 4">
        <a-form-item
          label="文本"
          name="comments"
        >
          <a-textarea
            :rows="4"
            :maxlength="200"
            placeholder="请输入广告内容"
            v-model:value="form.comments"
          />
        </a-form-item>
      </template>
      <a-form-item label="链接" name="path" v-if="form.type == 4">
        <a-input
          v-model:value="form.path"
          placeholder="https://"
        />
      </a-form-item>
      <a-form-item label="尺寸">
        <a-space>
          <a-input-number
            allow-clear
            :maxlength="3000"
            placeholder="宽"
            v-model:value="form.width"
          />
          <span>X</span>
          <a-input-number
            allow-clear
            :maxlength="2000"
            placeholder="高"
            v-model:value="form.height"
          />
        </a-space>
        <div class="pt-2">
          <span class="text-gray-400">广告位尺寸大小(默认值：100% * 500px)</span>
        </div>
      </a-form-item>
      <a-form-item label="栏目">
        <a-tree-select
          allow-clear
          :tree-data="navigationList"
          tree-default-expand-all
          style="width: 500px;"
          placeholder="请选择栏目"
          :value="form.categoryId || undefined"
          :listHeight="700"
          :dropdown-style="{ overflow: 'auto' }"
          @update:value="(value?: number) => (form.categoryId = value)"
          @change="onCategoryId"
        />
      </a-form-item>
      <a-form-item label="样式" name="style">
        <a-input
          allow-clear
          placeholder="w-full border-solid border-gray-800 p-2 shadow-lg rounded-lg my-10"
          v-model:value="form.style"
        />
        <div class="pt-2 none">
          <a class="text-sm text-gray-400" href="https://tailwindcss.com/docs/padding" target="_blank">Tailwind
            Css使用教程</a>
        </div>
      </a-form-item>
      <a-form-item label="描述" name="comments" v-if="form.type != 4">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入广告描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="排序" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">开启</a-radio>
          <a-radio :value="1">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject} from 'ele-admin-pro';
import {addCmsAd, updateCmsAd} from '@/api/cms/cmsAd';
import {CmsAd} from '@/api/cms/cmsAd/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance, type Rule} from 'ant-design-vue/es/form';
import {useI18n} from 'vue-i18n';
import {FileRecord} from '@/api/system/file/model';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";

// 是否是修改
const isUpdate = ref(false);
const disabled = ref(true);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsAd | null;
  // 栏目导航
  navigationList?: CmsNavigation[];
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 已上传数据
const images = ref<any[]>([]);
const {locale} = useI18n();
// 是否显示最大化切换按钮
const maxable = ref(true);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);

// 用户信息
const form = reactive<CmsAd>({
  adId: undefined,
  type: undefined,
  categoryId: undefined,
  name: '',
  style: '',
  images: '',
  imageList: undefined,
  width: '',
  height: '',
  path: '',
  status: 0,
  comments: '',
  lang: locale.value || undefined,
  sortNumber: 100,
  merchantId: undefined
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
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      type: 'number',
      message: '请选择类型',
      trigger: 'blur'
    }
  ],
  images: [
    {
      required: true,
      type: 'string',
      message: '请上传图片或视频',
      trigger: 'blur',
      validator: (_rule: Rule, value: string) => {
        return new Promise<void>((resolve, reject) => {
          if (images.value.length == 0) {
            return reject('请上传图片或视频文件');
          }
          return resolve();
        });
      }
    }
  ]
});

const {resetFields} = useForm(form, rules);

const chooseFile = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.downloadUrl + '?x-oss-process=image/resize,m_fixed,w_2000/quality,Q_90',
    status: 'done'
  });
  form.images = data.downloadUrl + '?x-oss-process=image/resize,m_fixed,w_2000/quality,Q_90';
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.images = '';
};

// 选择栏目
const onCategoryId = (id: number) => {
  form.categoryId = id;
};

const onTypeChange = () => {
  disabled.value = !disabled.value;
}

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
        images: JSON.stringify(images.value)
      };
      const saveOrUpdate = isUpdate.value ? updateCmsAd : addCmsAd;
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
      if (props.data) {
        assignObject(form, props.data);
        images.value = props.data.imageList;
        isUpdate.value = true;
      } else {
        images.value = [];
        disabled.value = true;
        isUpdate.value = false;
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
