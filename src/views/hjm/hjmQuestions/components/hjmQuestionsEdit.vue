<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑题目' : '添加题目'"
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
      <a-form-item label="所属课程" name="courseId">
        <a-tree-select
          allow-clear
          :tree-data="navigationList"
          tree-default-expand-all
          style="width: 300px"
          placeholder="请选择栏目"
          :value="form.courseId || undefined"
          :listHeight="700"
          :dropdown-style="{ overflow: 'auto' }"
          @update:value="(value?: number) => (form.courseId = value)"
          @change="onCategoryId"
        />
      </a-form-item>
      <a-form-item label="题目" name="question">
        <a-input
          allow-clear
          placeholder="请输入题目"
          v-model:value="form.question"
        />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio :value="0">选择题</a-radio>
          <a-radio :value="1">填空题</a-radio>
          <!--          <a-radio :value="2">问答题</a-radio>-->
        </a-radio-group>
      </a-form-item>
      <a-form-item label="A选项" name="choicesA" v-if="form.type === 0">
        <div class="flex items-center">
          <a-input
            allow-clear
            placeholder="A 选项的内容"
            v-model:value="form.choicesA"
            @input="onChangeA"
          />
        </div>
      </a-form-item>
      <a-form-item label="B选项" name="choicesB" v-if="form.type === 0">
        <div class="flex items-center">
          <a-input
            allow-clear
            placeholder="B 选项的内容"
            v-model:value="form.choicesB"
            @input="onChangeB"
          />
        </div>
      </a-form-item>
      <a-form-item label="C选项" name="choicesC" v-if="form.type === 0">
        <div class="flex items-center">
          <a-input
            allow-clear
            placeholder="C 选项的内容"
            v-model:value="form.choicesC"
            @input="onChangeC"
          />
        </div>
      </a-form-item>
      <a-form-item label="D选项" name="choicesD" v-if="form.type === 0">
        <div class="flex items-center">
          <a-input
            allow-clear
            placeholder="D 选项的内容"
            v-model:value="form.choicesD"
            @input="onChangeD"
          />
        </div>
      </a-form-item>
      <a-form-item label="正确答案" name="choices" v-if="form.type === 0">
        <a-radio-group v-model:value="form.choices" @change="updateCorrectAnswer">
          <a-radio :value="0">A</a-radio>
          <a-radio :value="1">B</a-radio>
          <a-radio :value="2">C</a-radio>
          <a-radio :value="3">D</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="正确答案" name="correctAnswer" v-if="form.type !== 0">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.correctAnswer"
        />
        <!-- 编辑器 -->
        <!--        <tinymce-editor-->
        <!--          ref="editorRef"-->
        <!--          class="editor-content"-->
        <!--          v-model:value="form.correctAnswer"-->
        <!--          :init="config"-->
        <!--          placeholder="本地图片支持直接粘贴或拖拽至光标处"-->
        <!--        />-->
      </a-form-item>
<!--      <a-form-item label="难度" name="difficulty">-->
<!--        <a-radio-group v-model:value="form.difficulty">-->
<!--          <a-radio :value="0">简单</a-radio>-->
<!--          <a-radio :value="1">中等</a-radio>-->
<!--          <a-radio :value="2">困难</a-radio>-->
<!--        </a-radio-group>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="状态" name="status">-->
<!--        <a-radio-group v-model:value="form.status">-->
<!--          <a-radio :value="0">已发布</a-radio>-->
<!--          <a-radio :value="1">待审核</a-radio>-->
<!--        </a-radio-group>-->
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
      <!--      <a-form-item label="备注" name="comments">-->
      <!--        <a-textarea-->
      <!--          :rows="4"-->
      <!--          :maxlength="200"-->
      <!--          placeholder="请输入描述"-->
      <!--          v-model:value="form.comments"-->
      <!--        />-->
      <!--      </a-form-item>-->
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject} from 'ele-admin-pro';
import {addHjmQuestions, updateHjmQuestions} from '@/api/hjm/hjmQuestions';
import {HjmQuestions} from '@/api/hjm/hjmQuestions/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance} from 'ant-design-vue/es/form';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import TinymceEditor from "@/components/TinymceEditor/index.vue";
import {uploadOss} from "@/api/system/file";

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
  data?: HjmQuestions | null;
  // 栏目数据
  navigationList?: CmsNavigation[];
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
const form = reactive<HjmQuestions>({
  id: undefined,
  courseId: undefined,
  type: 0,
  question: undefined,
  correctAnswer: undefined,
  difficulty: 0,
  deleted: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  status: 0,
  comments: '',
  sortNumber: 100,
  choicesA: undefined,
  choicesB: undefined,
  choicesC: undefined,
  choicesD: undefined,
  choices: undefined,
  choicesList: undefined
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  courseId: [
    {
      required: true,
      message: '请选择课程',
      type: 'number',
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      type: 'number',
      trigger: 'blur'
    }
  ],
  question: [{
    required: true,
    message: '请输入题目',
    type: 'string',
    trigger: 'blur'
  }],
  correctAnswer: [
    {
      required: true,
      message: '请输入正确答案',
      type: 'string',
      trigger: 'blur'
    }
  ],
  choicesA: [
    {
      required: true,
      message: '请输入选项内容',
      type: 'string',
      trigger: 'blur'
    }
  ],
  choicesB: [
    {
      required: true,
      message: '请输入选项内容',
      type: 'string',
      trigger: 'blur'
    }
  ],
  choicesC: [
    {
      required: true,
      message: '请输入选项内容',
      type: 'string',
      trigger: 'blur'
    }
  ],
  choicesD: [
    {
      required: true,
      message: '请输入选项内容',
      type: 'string',
      trigger: 'blur'
    }
  ],
  choices: [
    {
      required: true,
      message: '请选择正确答案',
      type: 'number',
      trigger: 'blur'
    }
  ]
  // difficulty: [
  //   {
  //     required: true,
  //     message: '请选择难度',
  //     type: 'number',
  //     trigger: 'blur'
  //   }
  // ]
});

// 选择栏目
const onCategoryId = (id: number) => {
  form.courseId = id;
};

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);
const config = ref({
  height: 300,
  paste_data_images: true,
  automatic_uploads: true,
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();
    uploadOss(file)
      .then((res) => {
        success(res.url);
      })
      .catch((msg) => {
        error(msg);
      });
  }
});

const onChangeA = () => {
  if (form.choicesList) {
    form.choicesList[0].content = form.choicesA || '';
  }
}
const onChangeB = () => {
  if (form.choicesList) {
    form.choicesList[1].content = form.choicesB || '';
  }
}
const onChangeC = () => {
  if (form.choicesList) {
    form.choicesList[2].content = form.choicesC || '';
  }
}
const onChangeD = () => {
  if (form.choicesList) {
    form.choicesList[3].content = form.choicesD || '';
  }
}

const updateCorrectAnswer = () => {
  // 确保 choicesList 存在
  if (!form.choicesList) {
    form.choicesList = [
      { content: form.choicesA, isCorrect: false },
      { content: form.choicesB, isCorrect: false },
      { content: form.choicesC, isCorrect: false },
      { content: form.choicesD, isCorrect: false }
    ];
  }

  // 先将所有选项设为不正确
  form.choicesList.forEach(item => {
    item.isCorrect = false;
  });

  // 设置选中的选项为正确
  if (form.choices !== undefined && form.choicesList[form.choices]) {
    form.choicesList[form.choices].isCorrect = true;
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
        ...form
      };
      const saveOrUpdate = isUpdate.value ? updateHjmQuestions : addHjmQuestions;
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
      form.choicesList = [
        { content: form.choicesA, isCorrect: false },
        { content: form.choicesB, isCorrect: false },
        { content: form.choicesC, isCorrect: false },
        { content: form.choicesD, isCorrect: false }
      ];
      if (props.data) {
        assignObject(form, props.data);
        if (props.data.choicesList) {
          props.data.choicesList.forEach((item, index) => {
            console.log(index,item.isCorrect)
            if (item.isCorrect) {
              form.choices = index;
            }
          })
          form.choicesA = props.data.choicesList[0].content;
          form.choicesB = props.data.choicesList[1].content;
          form.choicesC = props.data.choicesList[2].content;
          form.choicesD = props.data.choicesList[3].content;
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
