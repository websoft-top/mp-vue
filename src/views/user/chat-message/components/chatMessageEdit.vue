<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? `【${form.formUserName}】给你发送的消息` : '发送消息'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    :ok-button-props="{ disabled: isUpdate }"
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
      <template v-if="isUpdate">
        <a-form-item label="消息类型" name="type">
          <span class="ele-text-secondary">文本</span>
        </a-form-item>
        <a-form-item label="消息内容" name="content">
          <div class="ele-text-secondary">
            <byte-md-viewer :value="form.content" :plugins="plugins" />
          </div>
        </a-form-item>
        <a-form-item label="发送时间" name="type">
          <div class="ele-text-secondary">{{ form.createTime }}</div>
        </a-form-item>
      </template>
      <template v-else>
        <a-form-item label="接收对象" name="toUserIds" v-if="!isUpdate">
          <SelectUser
            :placeholder="`选择用户`"
            v-model:value="form.toUserName"
            @done="onToUser"
          />
        </a-form-item>
        <a-form-item label="消息类型" name="type">
          <DictSelect
            dict-code="chatMessageType"
            :placeholder="`选择消息类型`"
            v-model:value="form.type"
            :disabled="true"
            @done="chooseType"
          />
        </a-form-item>
        <a-form-item label="消息内容" name="content">
          <!-- 编辑器 -->
          <byte-md-editor
            v-model:value="content"
            placeholder="请描述您的问题，支持图片粘贴"
            mode="tab"
            height="300px"
            :locale="zh_Hans"
            :plugins="plugins"
            maxLength="500"
            :editorConfig="{ lineNumbers: true }"
          />
        </a-form-item>
      </template>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import {
    addBatchChatMessage,
    addChatMessage,
    updateChatMessage
  } from '@/api/system/chatMessage';
  import { ChatMessage } from '@/api/system/chatMessage/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance, RuleObject } from 'ant-design-vue/es/form';

  import 'bytemd/dist/index.min.css';
  import 'github-markdown-css/github-markdown-light.css';
  // // 链接、删除线、复选框、表格等的插件
  import gfm from '@bytemd/plugin-gfm';
  // // 插件的中文语言文件
  import zh_HansGfm from '@bytemd/plugin-gfm/locales/zh_Hans.json';
  // 中文语言文件
  import zh_Hans from 'bytemd/locales/zh_Hans.json';
  import 'bytemd/dist/index.min.css';
  import highlight from '@bytemd/plugin-highlight-ssr';
  import 'highlight.js/styles/default.css';
  import { MerchantAccount } from '@/api/shop/merchantAccount/model';
  import { User } from '@/api/system/user/model';

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
    data?: ChatMessage | null;
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
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const images = ref<ItemType[]>([]);
  const merchantAccount = ref<MerchantAccount[]>([]);
  const formDataBatch = ref<ChatMessage[]>([]);

  // 用户信息
  const form = reactive<ChatMessage>({
    formUserId: undefined,
    toUserId: undefined,
    toUserIds: undefined,
    type: 'text',
    content: '',
    sideTo: undefined,
    sideFrom: undefined,
    withdraw: undefined,
    fileInfo: undefined,
    hasContact: undefined,
    status: 0,
    formUserName: '',
    createTime: ''
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    toUserIds: [
      {
        required: true,
        type: 'any',
        message: '请选择用户',
        trigger: 'blur'
      }
    ],
    type: [
      {
        required: true,
        type: 'string',
        message: '请选择消息类型',
        trigger: 'blur'
      }
    ],
    content: [
      {
        required: true,
        type: 'string',
        message: '请填写消息内容',
        trigger: 'blur',
        validator: async (_rule: RuleObject, value: string) => {
          if (content.value == '') {
            return Promise.reject('请填写消息内容');
          }
          return Promise.resolve();
        }
      }
    ]
  });

  // 插件
  const plugins = ref([
    gfm({
      locale: zh_HansGfm
    }),
    highlight()
  ]);

  const onToUser = (item: User) => {
    form.toUserIds = [item.phone];
    form.toUserName = [item.phone];
    console.log(form);
    // form.toUserId = item.userId;
    // form.toUserName = item.nickname;
  };

  const chooseType = (item: any) => {
    form.type = 'text';
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
        loading.value = true;
        if (!isUpdate.value) {
          merchantAccount.value.map((d) => {
            formDataBatch.value.push({
              toUserId: d.userId,
              type: form.type,
              content: content.value
            });
          });
          addBatchChatMessage(formDataBatch.value)
            .then((msg) => {
              loading.value = false;
              form.toUserIds = [];
              formDataBatch.value = [];
              merchantAccount.value = [];
              form.toUserName = undefined;
              message.success(msg);
              updateVisible(false);
              emit('done');
            })
            .catch((e) => {
              loading.value = false;
              message.error(e.message);
            });
          return;
        }
        const formData = {
          ...form,
          status: isUpdate.value ? 1 : 0,
          content: content.value
        };
        const saveOrUpdate = isUpdate.value
          ? updateChatMessage
          : addChatMessage;
        saveOrUpdate(formData)
          .then(() => {
            loading.value = false;
            form.toUserName = undefined;
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
        content.value = '';
        if (props.data) {
          assignObject(form, props.data);
          // 标记已读
          updateChatMessage({ id: props.data.id, status: 1 });
          emit('done');
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

<style lang="less" scoped>
  .user-content {
    max-width: 100%;
    border-radius: 8px !important;
    background-color: #a2ec71;
    border: none;
  }
  .admin-content {
    border-radius: 8px !important;
    border: 3px solid #f1f1f1;
  }
</style>
