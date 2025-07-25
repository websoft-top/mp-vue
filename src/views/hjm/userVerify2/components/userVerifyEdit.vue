<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '实名认证' : '实名认证'"
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
      <a-form-item label="类型" name="type">
        <a-tag v-if="form.type === 0">{{ ['个人', '企业'][form.type] }}</a-tag>
        <a-tag color="pink" v-if="form.type === 1">{{ ['个人', '企业'][form.type] }}</a-tag>
      </a-form-item>
      <a-form-item label="主体名称" name="name">
        <a-input
          allow-clear
          :disabled="form.status == 1"
          placeholder="请输入公司名称或单位名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="营业执照号码" name="zzCode">
        <a-input
          allow-clear
          :disabled="form.status == 1"
          placeholder="请输入营业执照号码"
          v-model:value="form.zzCode"
        />
      </a-form-item>
      <a-form-item label="营业执照" name="zzImg">
        <SelectFile
          :placeholder="`请上传营业执照`"
          :limit="1"
          :data="zzImg"
          @done="chooseYzImg"
          @del="onDeleteYzImg"
        />
      </a-form-item>
      <a-form-item label="真实姓名" name="realName">
        <a-input
          allow-clear
          :disabled="form.status == 1"
          placeholder="请输入真实姓名"
          v-model:value="form.realName"
        />
      </a-form-item>
<!--      <a-form-item label="证件号码" name="idCard">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          :disabled="form.status == 1"-->
<!--          placeholder="请输入证件号码"-->
<!--          v-model:value="form.idCard"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="身份证(正面)" name="sfz1">-->
<!--        <a-image :src="form.sfz1" :width="80" :height="80" v-if="form.status == 1" />-->
<!--        <SelectFile-->
<!--          v-else-->
<!--          :placeholder="`请选择图片`"-->
<!--          :limit="1"-->
<!--          :data="sfz1"-->
<!--          @done="chooseSfz1"-->
<!--          @del="onDeleteSfz1"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="身份证(反面)" name="sfz2">-->
<!--        <a-image :src="form.sfz2" :width="80" :height="80" v-if="form.status == 1" />-->
<!--        <SelectFile-->
<!--          v-else-->
<!--          :placeholder="`请选择图片`"-->
<!--          :limit="1"-->
<!--          :data="sfz2"-->
<!--          @done="chooseSfz2"-->
<!--          @del="onDeleteSfz2"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="1">审核通过</a-radio>
          <a-radio :value="2">驳回</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="驳回原因" name="comments" v-if="form.status == 2">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请填写驳回原因"
          v-model:value="form.comments"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addUserVerify, updateUserVerify} from '@/api/system/userVerify';
import {UserVerify} from '@/api/system/userVerify/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance} from 'ant-design-vue/es/form';
import {FileRecord} from '@/api/system/file/model';

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
  data?: UserVerify | null;
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
const sfz1 = ref<ItemType[]>([]);
const sfz2 = ref<ItemType[]>([]);
const zzImg = ref<ItemType[]>([]);

// 用户信息
const form = reactive<UserVerify>({
  id: undefined,
  userId: undefined,
  type: undefined,
  name: undefined,
  zzCode: undefined,
  zzImg: undefined,
  realName: undefined,
  phone: undefined,
  idCard: undefined,
  birthday: undefined,
  sfz1: undefined,
  sfz2: undefined,
  status: undefined,
  deleted: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  comments: ''
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  type: [
    {
      required: true,
      type: 'number',
      message: '请选择类型',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      type: 'string',
      message: '请填写实名认证名称',
      trigger: 'blur'
    }
  ],
  zzCode: [
    {
      required: true,
      type: 'string',
      message: '请填写营业执照号码',
      trigger: 'blur'
    }
  ],
  zzImg: [
    {
      required: true,
      type: 'string',
      message: '请上传营业执照',
      trigger: 'blur'
    }
  ],
  realName: [
    {
      required: true,
      type: 'string',
      message: '请填写真实姓名',
      trigger: 'blur'
    }
  ],
  idCard: [
    {
      required: true,
      type: 'string',
      message: '请填写证件号码',
      trigger: 'blur'
    }
  ],
  sfz1: [
    {
      required: true,
      type: 'string',
      message: '请上传身份证正面',
      trigger: 'blur'
    }
  ],
  sfz2: [
    {
      required: true,
      type: 'string',
      message: '请上传身份证反面',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      type: 'number',
      message: '请选择审核状态',
      trigger: 'blur'
    }
  ],
  comments: [
    {
      required: true,
      type: 'string',
      message: '请填写驳回原因',
      trigger: 'blur'
    }
  ]
});

const chooseSfz1 = (data: FileRecord) => {
  sfz1.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.sfz1 = data.path;
};

const onDeleteSfz1 = (index: number) => {
  sfz1.value.splice(index, 1);
  form.sfz1 = '';
};

const chooseSfz2 = (data: FileRecord) => {
  sfz2.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.sfz2 = data.path;
};

const onDeleteSfz2 = (index: number) => {
  sfz2.value.splice(index, 1);
  form.sfz2 = '';
};

const chooseYzImg = (data: FileRecord) => {
  zzImg.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.zzImg = data.path;
};

const onDeleteYzImg = (index: number) => {
  zzImg.value.splice(index, 1);
  form.zzImg = '';
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
        ...form
      };
      const saveOrUpdate = isUpdate.value ? updateUserVerify : addUserVerify;
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
      sfz1.value = [];
      sfz2.value = [];
      zzImg.value = [];
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.sfz1) {
          sfz1.value.push({
            uid: uuid(),
            url: props.data.sfz1,
            status: 'done'
          })
        }
        if (props.data.sfz2) {
          sfz2.value.push({
            uid: uuid(),
            url: props.data.sfz2,
            status: 'done'
          })
        }
        if (props.data.zzImg) {
          zzImg.value.push({
            uid: uuid(),
            url: props.data.zzImg,
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
  {immediate: true}
);
</script>
