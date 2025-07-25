<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑电子围栏' : '添加电子围栏'"
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
      <a-form-item label="围栏名称" name="name">
        <a-input
          allow-clear
          placeholder="请输入围栏名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <!--      <a-form-item label="类型" name="type">-->
      <!--        <a-radio-group v-model:value="form.type">-->
      <!--          <a-radio :value="0">圆形</a-radio>-->
      <!--          <a-radio :value="1">方形</a-radio>-->
      <!--        </a-radio-group>-->
      <!--      </a-form-item>-->
<!--      <a-form-item label="经纬度" name="location">-->
<!--        <div class="flex">-->
<!--          <a-input-->
<!--            allow-clear-->
<!--            placeholder="请选取车辆所在位置"-->
<!--            v-model:value="form.location"-->
<!--          >-->
<!--          </a-input>-->
<!--        </div>-->
<!--      </a-form-item>-->
      <a-form-item label="轮廓" name="points">
        <div class="flex">
          <a-input
            allow-clear
            placeholder="请选取电子围栏的轮廓"
            v-model:value="form.points"
          >
          </a-input>
        </div>
        <template #extra>
          <p class="py-2">
            <a class="text-blue-500" href="https://lbs.qq.com/dev/console/cloud/placeCloud/datamanage?table_id=0q3W4MrK1-_6Xag7V1" target="_blank">使用腾讯地图的工具绘制电子围栏</a>
          </p>
        </template>
      </a-form-item>
<!--      <a-form-item label="经度" name="longitude">-->
<!--        <a-input-number-->
<!--          allow-clear-->
<!--          style="width: 120px"-->
<!--          placeholder="请输入经度"-->
<!--          v-model:value="form.longitude"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="纬度" name="latitude">-->
<!--        <a-input-number-->
<!--          allow-clear-->
<!--          style="width: 120px"-->
<!--          placeholder="请输入纬度"-->
<!--          v-model:value="form.latitude"-->
<!--        />-->
<!--      </a-form-item>-->
<!--      <a-form-item label="半径" name="district">-->
<!--        <a-input-number-->
<!--          allow-clear-->
<!--          style="width: 120px"-->
<!--          placeholder="请输入半径"-->
<!--          v-model:value="form.district"-->
<!--        />-->
<!--      </a-form-item>-->
      <!--      <a-form-item label="排序" name="sortNumber">-->
      <!--        <a-input-number-->
      <!--          :min="0"-->
      <!--          :max="9999"-->
      <!--          class="ele-fluid"-->
      <!--          placeholder="请输入排序号"-->
      <!--          v-model:value="form.sortNumber"-->
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
    </a-form>
    <!-- 地图位置选择弹窗 -->
    <ele-map-picker
      :need-city="true"
      :dark-mode="darkMode"
      v-model:visible="showMap"
      :center="[108.374959, 22.767024]"
      :search-type="1"
      :zoom="12"
      @done="onDone"
    />
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject} from 'ele-admin-pro';
import {addHjmFence, updateHjmFence} from '@/api/hjm/hjmFence';
import {HjmFence} from '@/api/hjm/hjmFence/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {CenterPoint} from "ele-admin-pro/es/ele-map-picker/types";
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance} from 'ant-design-vue/es/form';

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);
const {darkMode} = storeToRefs(themeStore);
// 是否显示地图选择弹窗
const showMap = ref(false);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: HjmFence | null;
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
const form = reactive<HjmFence>({
  id: undefined,
  name: undefined,
  type: undefined,
  location: undefined,
  longitude: undefined,
  latitude: undefined,
  district: undefined,
  points: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
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
      message: '请填写电子围栏名称',
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
  location: [
    {
      required: true,
      type: 'string',
      message: '请填写经纬度',
      trigger: 'blur'
    }
  ],
  points: [
    {
      required: true,
      type: 'string',
      message: '请填写轮廓经纬度数组',
      trigger: 'blur'
    }
  ],
  longitude: [
    {
      required: true,
      type: 'string',
      message: '请填写经度',
      trigger: 'blur'
    }
  ],
  latitude: [
    {
      required: true,
      type: 'string',
      message: '请填写纬度',
      trigger: 'blur'
    }
  ],
  district: [
    {
      required: true,
      type: 'string',
      message: '请填写半径',
      trigger: 'blur'
    }
  ]
});

/* 打开位置选择 */
const openMapPicker = () => {
  showMap.value = true;
};

/* 地图选择后回调 */
const onDone = (location: CenterPoint) => {
  if (location) {
    console.log(location)
    form.location = `${location.lat},${location.lng}`;
    form.longitude = `${location.lng}`;
    form.latitude = `${location.lat}`;
    form.comments = `${location.address}`;
    form.district = `1000`
  }
  showMap.value = false;
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
      const saveOrUpdate = isUpdate.value ? updateHjmFence : addHjmFence;
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
