<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
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
      :label-col="styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="类型" name="adType">
        <a-select
          ref="select"
          :disabled="isUpdate"
          v-model:value="form.adType"
          style="width: 120px"
        >
          <a-select-option value="图片广告">图片广告</a-select-option>
          <a-select-option value="幻灯片">幻灯片</a-select-option>
          <a-select-option value="视频广告">视频广告</a-select-option>
        </a-select>
      </a-form-item>
      <template v-if="form.adType == '幻灯片'">
        <a-form-item label="图片" name="images">
          <SelectFile
            :placeholder="`请选择图片`"
            :limit="9"
            :data="images"
            @done="chooseFile"
            @del="onDeleteItem"
          />
        </a-form-item>
      </template>
      <template v-if="form.adType == '图片广告'">
        <a-form-item label="图片" name="images">
          <SelectFile
            :limit="1"
            :data="images"
            @done="chooseFile"
            @del="onDeleteItem"
          />
        </a-form-item>
      </template>
      <template v-if="form.adType == '视频广告'">
        <a-form-item
          label="上传视频"
          name="images"
          extra="请上传视频文件，仅支持mp4格式，大小200M以内"
        >
          <SelectFile
            :placeholder="`请选择视频文件`"
            :limit="1"
            :data="images"
            @done="chooseFile"
            @del="onDeleteItem"
          />
        </a-form-item>
      </template>
      <a-form-item label="位置" name="pageId">
        <SelectMpPages
          :placeholder="`请选择页面`"
          v-model:value="form.pageName"
          @done="choosePageId"
        />
      </a-form-item>
      <a-form-item label="路由/链接地址" name="path">
        <template v-if="form.adType == '幻灯片' && images.length > 0">
          <template v-for="(item, index) in images" :key="index">
            <a-input
              allow-clear
              :maxlength="100"
              :placeholder="`请输入地址${index + 1}`"
              v-model:value="pathList[index]"
            />
          </template>
        </template>
        <template v-else>
          <a-input
            allow-clear
            :maxlength="100"
            placeholder="请输入路由/链接地址"
            v-model:value="form.path"
          />
        </template>
      </a-form-item>
      <a-form-item label="图标背景色" v-if="data && data.adId === 278">
        <div class="flex justify-start items-start flex-wrap">
          <div class="flex flex-col justify-center items-center" v-for="(item, index) in colors" :key="index">
            <div
              @click="changeShowColorPicker(index)"
              class=" w-10 h-10 rounded-full m-2 cursor-pointer border-2 border-solid flex justify-center items-center text-red-600"
              :class="[item ? 'border-none' : 'border-red-300']"
              :style="{backgroundColor: item ?? 'red'}"
            >{{ item ? '' : '选色' }}
            </div>
            <span v-if="item" class="text-sm cursor-pointer" @click="clearColor(index)">清除</span>
          </div>
        </div>
<!--        <Vue3ColorPicker v-if="showColorPicker" v-model="colors[showColorPickerIndex]" mode="solid"-->
<!--                         :showColorList="false" :showEyeDrop="false" type="RGBA"/>-->
      </a-form-item>
      <a-form-item label="标题" name="name">
        <a-input
          allow-clear
          :maxlength="100"
          placeholder="请输入广告标题"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="广告描述" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入广告描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="排序号" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
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
import {addCmsMpAd, updateCmsMpAd} from '@/api/cms/cmsMpAd';
import {CmsMpAd} from '@/api/cms/cmsMpAd/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance, type Rule, RuleObject} from 'ant-design-vue/es/form';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FileRecord} from '@/api/system/file/model';
import {CmsMpPages} from '@/api/cms/cmsMpPages/model';
// import {Vue3ColorPicker} from "@cyhnkckali/vue3-color-picker";

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
  data?: CmsMpAd | null;
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 已上传数据
const images = ref<ItemType[]>([]);
const pathList = ref<any[]>([]);
// 是否显示最大化切换按钮
const maxable = ref(true);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);

// 用户信息
const form = reactive<CmsMpAd>({
  adId: undefined,
  pageId: 0,
  pageName: '',
  name: '',
  adType: '图片广告',
  images: '',
  colors: '',
  width: '',
  height: '',
  path: '',
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
  adType: [
    {
      required: true,
      type: 'string',
      message: '请选择广告类型',
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
    url: data.downloadUrl,
    status: 'done'
  });
  form.images = data.downloadUrl;
  colors.value.push('')
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  colors.value.splice(index, 1);
  form.images = '';
};

const choosePageId = (data: CmsMpPages) => {
  form.pageName = data.title;
  form.pageId = data.id;
};

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
        images: JSON.stringify(images.value),
        colors: JSON.stringify(colors.value),
        path:
          form.adType == '幻灯片' ? JSON.stringify(pathList.value) : form.path
      };
      const saveOrUpdate = isUpdate.value ? updateCmsMpAd : addCmsMpAd;
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

const colors = ref<string[]>([])
const showColorPicker = ref(false)
const showColorPickerIndex = ref<number>(-1)
const changeShowColorPicker = (index: number) => {
  if (showColorPickerIndex.value === index) showColorPicker.value = !showColorPicker.value
  else {
    showColorPickerIndex.value = index
    showColorPicker.value = true
  }
}

const clearColor = (index) => {
  showColorPicker.value = false
  colors.value[index] = ''
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (props.data) {
        assignObject(form, props.data);
        images.value = [];
        pathList.value = [];
        colors.value = []
        if (props.data.images) {
          const arr = JSON.parse(props.data.images);
          arr.map((d) => {
            images.value.push({
              uid: d.uid,
              url: d.url,
              status: 'done'
            });
          });
        }
        if (props.data.colors) {
          colors.value = JSON.parse(props.data.colors);
        } else {
          colors.value = []
          for (let i = 0; i < images.value.length; i++) {
            colors.value.push('')
          }
        }
        if (props.data.adType == '幻灯片') {
          const arr = JSON.parse(props.data.path);
          arr.map((d) => {
            pathList.value.push(d);
          });
        }
        isUpdate.value = true;
      } else {
        images.value = [];
        isUpdate.value = false;
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
<style lang="less">
.tab-pane {
  min-height: 300px;
}

.ml-10 {
  margin-left: 5px;
}

.upload-text {
  margin-right: 70px;
}

.icon-bg {
  width: 50px;
  height: 50px;
  display: block;
  border-radius: 50px;
  background: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%221%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%220%22%20gradientTransform%3D%22matrix(6.123233995736766e-17%2C%201%2C%20-0.024693877551020406%2C%206.123233995736766e-17%2C%200.5%2C%200)%22%3E%3Cstop%20stop-color%3D%22%230a060d%22%20stop-opacity%3D%221%22%20offset%3D%220%22%3E%3C%2Fstop%3E%3Cstop%20stop-color%3D%22%23660061%22%20stop-opacity%3D%221%22%20offset%3D%220.95%22%3E%3C%2Fstop%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%231)%22%3E%3C%2Frect%3E%3C%2Fsvg%3E');
}
</style>
