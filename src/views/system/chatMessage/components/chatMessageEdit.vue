<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑聊天消息表' : '添加聊天消息表'"
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
      <a-form-item label="发送人ID" name="formUserId">
        <a-input
          allow-clear
          placeholder="请输入发送人ID"
          v-model:value="form.formUserId"
        />
      </a-form-item>
      <a-form-item label="接收人ID" name="toUserId">
        <a-input
          allow-clear
          placeholder="请输入接收人ID"
          v-model:value="form.toUserId"
        />
      </a-form-item>
      <a-form-item label="消息类型" name="type">
        <a-input
          allow-clear
          placeholder="请输入消息类型"
          v-model:value="form.type"
        />
      </a-form-item>
      <a-form-item label="消息内容" name="content">
        <a-input
          allow-clear
          placeholder="请输入消息内容"
          v-model:value="form.content"
        />
      </a-form-item>
      <a-form-item label="屏蔽接收方" name="sideTo">
        <a-input
          allow-clear
          placeholder="请输入屏蔽接收方"
          v-model:value="form.sideTo"
        />
      </a-form-item>
      <a-form-item label="屏蔽发送方" name="sideFrom">
        <a-input
          allow-clear
          placeholder="请输入屏蔽发送方"
          v-model:value="form.sideFrom"
        />
      </a-form-item>
      <a-form-item label="是否撤回" name="withdraw">
        <a-input
          allow-clear
          placeholder="请输入是否撤回"
          v-model:value="form.withdraw"
        />
      </a-form-item>
      <a-form-item label="文件信息" name="fileInfo">
        <a-input
          allow-clear
          placeholder="请输入文件信息"
          v-model:value="form.fileInfo"
        />
      </a-form-item>
      <a-form-item label="存在联系方式" name="hasContact">
        <a-input
          allow-clear
          placeholder="请输入存在联系方式"
          v-model:value="form.hasContact"
        />
      </a-form-item>
      <a-form-item label="状态, 0未读, 1已读" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="是否删除, 0否, 1是" name="deleted">
        <a-input
          allow-clear
          placeholder="请输入是否删除, 0否, 1是"
          v-model:value="form.deleted"
        />
      </a-form-item>
      <a-form-item label="修改时间" name="updateTime">
        <a-input
          allow-clear
          placeholder="请输入修改时间"
          v-model:value="form.updateTime"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addChatMessage, updateChatMessage } from '@/api/system/chatMessage';
  import { ChatMessage } from '@/api/system/chatMessage/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';

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
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);
  const images = ref<ItemType[]>([]);

  // 用户信息
  const form = reactive<ChatMessage>({
    id: undefined,
    formUserId: undefined,
    toUserId: undefined,
    type: undefined,
    content: undefined,
    sideTo: undefined,
    sideFrom: undefined,
    withdraw: undefined,
    fileInfo: undefined,
    hasContact: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    chatMessageId: undefined,
    chatMessageName: '',
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
    chatMessageName: [
      {
        required: true,
        type: 'string',
        message: '请填写聊天消息表名称',
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
        const saveOrUpdate = isUpdate.value
          ? updateChatMessage
          : addChatMessage;
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
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          if (props.data.image) {
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
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
    { immediate: true }
  );
</script>
