<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '表单设计' : '添加表单'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      labelAlign="left"
      :label-col="
              styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }
            "
      :wrapper-col="
              styleResponsive ? { md: 18, sm: 19, xs: 24 } : { flex: '1' }
            "
    >
      <a-form-item label="表单名称" name="name">
        <a-input
          allow-clear
          :maxlength="100"
          placeholder="请输入表单名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="表单说明">
        <a-textarea
          :rows="4"
          :maxlength="1000"
          show-count
          placeholder="请输入表单说明"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item
        label="提交次数"
        name="submitNumber"
        extra="设置每位用户可以提交表单的次数"
      >
        <a-radio-group v-model:value="form.submitNumber">
          <a-radio :value="1">1次</a-radio>
          <a-radio :value="0">不限</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="顶部图片" name="photo">
        <a-space direction="vertical" style="padding-top: 5px">
          <a-radio-group v-model:value="form.hidePhoto">
            <a-radio :value="1">隐藏</a-radio>
            <a-radio :value="0">顶部图片</a-radio>
          </a-radio-group>
          <template v-if="form.hidePhoto == 0">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="1"
              :data="photo"
              @done="chooseFile"
              @del="onDeleteItem"
            />
            <div class="ele-text-placeholder"
            >请上传jpg、png格式的图片，图片尺寸：750px*460px</div
            >
          </template>
        </a-space>
      </a-form-item>
      <a-form-item label="视频文件" name="video">
        <a-space direction="vertical" style="padding-top: 5px">
          <a-radio-group v-model:value="form.hideVideo">
            <a-radio :value="1">隐藏</a-radio>
            <a-radio :value="0">视频文件</a-radio>
          </a-radio-group>
          <template v-if="form.hideVideo == 0">
            <SelectFile
              :placeholder="`请选择视频文件`"
              :limit="1"
              :data="video"
              :type="`video`"
              @done="chooseVideo"
              @del="onDeleteVideoItem"
            />
            <div class="ele-text-placeholder"
            >请上传mp4格式的视频文件，大小200M以内</div
            >
          </template>
        </a-space>
      </a-form-item>
      <a-form-item label="背景图片" name="background">
        <a-space direction="vertical" style="padding-top: 5px">
          <a-radio-group
            v-model:value="form.hideBackground"
            name="submitNumber"
          >
            <a-radio :value="1">隐藏</a-radio>
            <a-radio :value="0">自定义</a-radio>
          </a-radio-group>
          <template v-if="form.hideBackground == 0">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="1"
              :data="background"
              @done="chooseFile2"
              @del="onDeleteItem2"
            />
            <div class="ele-text-placeholder"
            >请上传jpg、png格式的图片，图片尺寸：750px*1624px</div
            >
          </template>
        </a-space>
      </a-form-item>
      <a-form-item
        label="背景透明度"
        name="opacity"
        v-if="form.hideBackground == 0"
      >
        <a-input-number
          style="width: 140px"
          :step="0.1"
          :max="1"
          :min="0.1"
          placeholder="设置背景透明度"
          v-model:value="form.opacity"
        />
      </a-form-item>
      <a-form-item label="表单内容" name="content">
        <div class="demo-drag-list">
          <vue-draggable
            v-model="formData"
            item-key="id"
            :animation="300"
            handle=".sort-handle"
          >
            <template #item="{ element, index }">
              <a-form-item>
                <div class="demo-drag-list-item ele-cell">
                  <drag-outlined class="sort-handle" />
                  <div class="ele-cell-content">
                    <a-space class="ele-cell">
                      <a-input
                        v-model:value="element.name"
                        style="width: 500px"
                      >
                        <template #addonBefore>
                          <a-select
                            v-model:value="element.type"
                            style="width: 120px"
                            @change="onSelect(element, index)"
                          >
                            <a-select-option value="text"
                            >单行文本</a-select-option
                            >
                            <a-select-option value="textarea"
                            >多行文本</a-select-option
                            >
                            <a-select-option value="radio"
                            >单选</a-select-option
                            >
                            <a-select-option value="checkbox"
                            >多选</a-select-option
                            >
                            <a-select-option value="phone"
                            >手机号码</a-select-option
                            >
                            <a-select-option value="email"
                            >邮箱</a-select-option
                            >
                            <a-select-option value="time"
                            >时间</a-select-option
                            >
                            <a-select-option value="date"
                            >日期</a-select-option
                            >
                            <a-select-option value="image"
                            >图片上传</a-select-option
                            >
                          </a-select>
                        </template>
                      </a-input>
                      <a-checkbox v-model:checked="element.checked"
                      >必填</a-checkbox
                      >
                      <a
                        v-if="element.type == 'radio'"
                        @click="openRadioForm(element)"
                      >设置</a
                      >
                      <a
                        v-if="element.type == 'checkbox'"
                        @click="openCheckboxForm(element)"
                      >设置</a
                      >
                      <a-button
                        @click="removeItem(index)"
                        danger
                        style="margin-left: 10px"
                      >删除</a-button
                      >
                    </a-space>
                  </div>
                </div>
              </a-form-item>
            </template>
          </vue-draggable>
          <a @click="addItem"
          ><PlusCircleOutlined style="margin-right: 4px" />新增</a
          >
        </div>
      </a-form-item>
      <a-form-item label="操作">
        <a-space>
          <a-button type="primary" @click="save">保存</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsForm, updateCmsForm } from '@/api/cms/cmsForm';
  import { CmsForm } from '@/api/cms/cmsForm/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { Dayjs } from 'dayjs';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';
  import {Website} from "@/api/system/website/model";

  // 是否是修改
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: CmsForm | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const { styleResponsive } = storeToRefs(themeStore);
  const formId = ref<number>(0);
  const isUpdate = ref<boolean>(false);
  const currentItemIndex = ref<number>(0);
  const showRadioForm = ref<boolean>(false);
  const showCheckboxForm = ref<boolean>(false);
  const current = ref<any>();
  // 是否显示最大化切换按钮
  const maxable = ref(true);
  // 顶部图片
  const photo = ref<ItemType[]>([]);
  // 视频文就
  const video = ref<ItemType[]>([]);
  // 背景图片
  const background = ref<ItemType[]>([]);
  // 表单数据里的图片
  const imageItem = ref<ItemType[]>([]);
  // 时间
  const timeItem = ref<Dayjs>();

  const formData = ref<any[]>([
    { id: uuid(4), type: 'text', name: '姓名', checked: true },
    { id: uuid(4), type: 'phone', name: '手机号码', checked: true },
    { id: uuid(4), type: 'date', name: '日期', checked: false }
  ]);

  // 用户信息
  const form = reactive<CmsForm>({
    formId: undefined,
    name: undefined,
    photo: undefined,
    background: undefined,
    video: undefined,
    submitNumber: undefined,
    layout: undefined,
    hidePhoto: undefined,
    hideBackground: undefined,
    hideVideo: undefined,
    opacity: undefined,
    userId: undefined,
    merchantId: undefined,
    comments: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsFormName: [
      {
        required: true,
        type: 'string',
        message: '请填写表单设计表名称',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    // images.value.push({
    //   uid: data.id,
    //   url: data.path,
    //   status: 'done'
    // });
    form.image = data.path;
  };

  const onDeleteItem = (index: number) => {
    form.image = '';
  };

  const chooseFile = (data: FileRecord) => {
    photo.value.push({
      uid: data.id,
      url: data.downloadUrl,
      status: 'done'
    });
    form.photo = data.downloadUrl;
  };

  const chooseVideo = (data: FileRecord) => {
    video.value.push({
      uid: data.id,
      url: data.downloadUrl,
      status: 'done'
    });
    form.video = data.downloadUrl;
  };

  const onDeleteVideoItem = (index: number) => {
    video.value.splice(index, 1);
    form.video = '';
  };

  const chooseFile2 = (data: FileRecord) => {
    background.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.background = data.path;
  };

  const onDeleteItem2 = (index: number) => {
    background.value.splice(index, 1);
    form.background = '';
  };

  const openRadioForm = (row: any) => {
    current.value = row ?? null;
    showRadioForm.value = true;
  };

  const openCheckboxForm = (row: any) => {
    current.value = row ?? null;
    showCheckboxForm.value = true;
  };

  const doneRadio = (item: any) => {
    formData.value.map((d) => {
      if (d.id == item.id) {
        d.options = item.options;
      }
    });
  };

  const doneCheckbox = (item: any) => {
    formData.value.map((d) => {
      if (d.id == item.id) {
        d.options = item.options;
      }
    });
  };
  const addItem = () => {
    formData.value.push({
      id: uuid(4),
      type: 'text',
      placeholder: '请填写',
      value: undefined
    });
  };

  const removeItem = (index: number) => {
    formData.value.splice(index, 1);
  };

  const onSelect = (item: any, index: number) => {
    // console.log(item);
    // console.log(index)
    if (item.type == 'checkbox') {
      formData.value[index].checkedList = ['aaa'];
      formData.value[index].options = ['aaa', 'bbb'];
    }
    if (item.type == 'radio') {
      formData.value[index].radio = 'A';
      formData.value[index].options = ['A', 'B', 'C', 'D'];
    }
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
        const formData = {
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateCmsForm : addCmsForm;
        saveOrUpdate(formData)
          .then((msg) => {
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
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
    { immediate: true }
  );
</script>
