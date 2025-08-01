<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑报险记录' : '添加报险记录'"
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
      <a-form-item label="车辆编号" name="carNo">
        {{ form.carNo }}
      </a-form-item>
      <a-form-item label="事故类型" name="accidentType">
        {{ form.accidentType }}
      </a-form-item>
      <a-form-item
        label="保险图片"
        name="image">
        <SelectFile
          :placeholder="`请选择图片`"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="事故描述" name="comments">
        {{ form.comments }}
        <!--        <a-textarea-->
        <!--          :rows="4"-->
        <!--          :maxlength="200"-->
        <!--          placeholder="请输入描述"-->
        <!--          v-model:value="form.comments"-->
        <!--        />-->
      </a-form-item>
      <a-form-item label="操作员" name="realName">
        {{ form.realName }}
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">待处理</a-radio>
          <a-radio :value="1">已处理</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addHjmBxLog, updateHjmBxLog} from '@/api/hjm/hjmBxLog';
import {HjmBxLog} from '@/api/hjm/hjmBxLog/model';
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
  data?: HjmBxLog | null;
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
const form = reactive<HjmBxLog>({
  id: undefined,
  userId: undefined,
  carId: undefined,
  carNo: undefined,
  realName: undefined,
  accidentType: undefined,
  parentOrganization: undefined,
  image: undefined,
  comments: undefined,
  status: undefined,
  deleted: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  sortNumber: 100
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  hjmBxLogName: [
    {
      required: true,
      type: 'string',
      message: '请填写黄家明_报险记录名称',
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
      const saveOrUpdate = isUpdate.value ? updateHjmBxLog : addHjmBxLog;
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
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.image) {
          const arr = JSON.parse(props.data.image);
          arr.map((item) => {
            images.value.push({
              uid: uuid(),
              url: item.url,
              status: 'done'
            });
          });
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
