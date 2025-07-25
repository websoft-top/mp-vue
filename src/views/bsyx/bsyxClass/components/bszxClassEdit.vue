<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑班级' : '添加班级'"
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
      <a-form-item label="选择年级" name="gradeId">
        <a-select
          v-model:value="form.gradeName"
          show-search
          placeholder="选择年级"
          style="width: 200px"
          :options="options"
          @change="handleChange"
        ></a-select>
      </a-form-item>
      <a-form-item label="班级" name="name">
        <a-input
          allow-clear
          placeholder="请输入班级"
          v-model:value="form.name"
          @pressEnter="save"
        />
      </a-form-item>
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
  import { addBszxClass, updateBszxClass } from '@/api/bszx/bszxClass';
  import { BszxClass } from '@/api/bszx/bszxClass/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import {BszxGrade} from "@/api/bszx/bszxGrade/model";
  import {listBszxGrade} from "@/api/bszx/bszxGrade";

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
    data?: BszxClass | null;
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
  const options = ref<BszxGrade[]>([]);

  // 用户信息
  const form = reactive<BszxClass>({
    id: undefined,
    name: undefined,
    gradeId: undefined,
    gradeName: undefined,
    branch: 2,
    sortNumber: 100,
    comments: undefined,
    status: undefined,
    tenantId: undefined,
    createTime: undefined
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    appBszxClassName: [
      {
        required: true,
        type: 'string',
        message: '请填写应用-百色中学-班级名称',
        trigger: 'blur'
      }
    ]
  });

  const handleChange = (value: string, item: any) => {
    form.gradeName = value;
    form.gradeId = item.id;
  };

  const handleBranch = () => {
    getBszxGradeList();
  }

  const getBszxGradeList = () => {
    listBszxGrade({branch: form.branch}).then((list) => {
      options.value = list.map(d => {
        d.value = d.name;
        d.label = d.name;
        return d;
      });
    })
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
        const saveOrUpdate = isUpdate.value ? updateBszxClass : addBszxClass;
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
        getBszxGradeList()
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        // resetFields();
      }
    },
    { immediate: true }
  );
</script>
