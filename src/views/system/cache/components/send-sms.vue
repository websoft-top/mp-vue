<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    width="400px"
    :visible="visible"
    :confirm-loading="loading"
    :title="'手机验证'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    :maskClosable="false"
    @ok="save"
  >
    <a-form class="login-form">
      <a-form-item label="绑定的手机号码" name="phone">
        {{ getMobile(form.phone) }}
      </a-form-item>
      <a-form-item label="校验码" name="code">
        <div class="login-input-group">
          <a-input
            allow-clear
            type="text"
            :maxlength="6"
            v-model:value="form.code"
          >
          </a-input>
          <a-button
            class="login-captcha"
            :disabled="!!countdownTime"
            @click="openImgCodeModal"
          >
            <span v-if="!countdownTime">发送验证码</span>
            <span v-else>已发送 {{ countdownTime }} s</span>
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onBeforeUnmount } from "vue";
import { Form, message, Modal, SelectProps } from "ant-design-vue";
import { useUserStore } from "@/store/modules/user";
import type { AccessKey } from "@/api/system/access-key/model";
import { addAccessKey, updateAccessKey } from "@/api/system/access-key";
import { FILE_SERVER } from "@/config/setting";
import { uploadFile } from "@/api/system/file";
import { RuleObject } from "ant-design-vue/es/form";
import { isImage } from "@/utils/common";
import { listUsers } from '@/api/system/user';
import { getMobile } from '@/utils/common';
import { sendSmsCaptcha } from '@/api/passport/login';

const useForm = Form.useForm;
const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: AccessKey | null;
}>();

const userStore = useUserStore();
// 当前登录用户信息
const loginUser = computed(() => userStore.info ?? {});
// 是否是修改
const isUpdate = ref(false);
const disabled = ref(false);
// 选项卡位置
const activeKey = ref("1");
const promoter = ref<any>(undefined);
const commander = ref(undefined);
const appid = ref(undefined);

/* 打开选择弹窗 */
const content = ref("");
// 图形验证码地址
const captcha = ref("");
// 验证码倒计时定时器
let countdownTimer: number | null = null;
// 验证码倒计时时间
const countdownTime = ref(0);
// 图形验证码
const imgCode = ref("");
// 发送验证码按钮loading
const codeLoading = ref(false);


const emit = defineEmits<{
  (e: "done", form: AccessKey): void;
  (e: "update:visible", value: boolean): void;
}>();
// 已上传数据, 可赋初始值用于回显
const avatar = ref(<any>[]);
// 提交状态
const loading = ref(false);
// 用户信息
const form = reactive<AccessKey>({
  id: 0,
  phone: "",
  accessKey: "",
  accessSecret: "",
  code: undefined,
  createTime: ""
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit("update:visible", value);
};

// 表单验证规则
const rules = reactive({
  name: [
    {
      required: true,
      type: "string",
      message: "请输入工单名称",
      trigger: "blur"
    }
  ],
  taskType: [
    {
      required: true,
      type: "string",
      message: "请选择工单类型",
      trigger: "blur"
    }
  ],
  content: [
    {
      required: true,
      type: "string",
      message: "请输入工单内容",
      trigger: "blur",
      validator: async (_rule: RuleObject, value: string) => {
        if (content.value == "") {
          return Promise.reject("请输入文字内容");
        }
        return Promise.resolve();
      }
    }
  ]
});

/* 显示发送短信验证码弹窗 */
const openImgCodeModal = () => {
  if (!form.phone) {
    message.error("手机号码有误");
    return;
  }
  // imgCode.value = "";
  sendCode();
  // visible.value = true;
};

/* 发送短信验证码 */
const sendCode = () => {
  codeLoading.value = true;
  sendSmsCaptcha({ phone: form.phone }).then((res) => {
    console.log(res);
    message.success("短信验证码发送成功, 请注意查收!");
    codeLoading.value = false;
    countdownTime.value = 30;
    // 开始对按钮进行倒计时
    countdownTimer = window.setInterval(() => {
      if (countdownTime.value <= 1) {
        countdownTimer && clearInterval(countdownTimer);
        countdownTimer = null;
      }
      countdownTime.value--;
    }, 1000);
  });
};

onBeforeUnmount(() => {
  countdownTimer && clearInterval(countdownTimer);
});

const { validate, validateInfos } = useForm(form, rules);

/* 保存编辑 */
const save = () => {
  validate()
    .then(() => {
      updateVisible(false);
      const { code,phone } = form;
      emit("done", { code,phone });
    })
    .catch(() => {
    });
};

const query = () => {
  listUsers({username: 'admin'}).then(res => {
    form.phone = res[0].phone;
  })
}
query();
</script>

<style lang="less" scoped>
.login-form{
  padding: 0 20px;
}
.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;

  :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }

  .login-captcha {
    margin-left: 10px;
    padding: 0 10px;

    & > img {
      width: 100%;
      height: 100%;
    }
  }
}

</style>
