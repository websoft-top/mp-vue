<template>
  <div>
    <step-edit v-model:visible="showEdit" v-if="active === 0" @done="onDone" />
    <step-confirm
      v-if="active === 1"
      :data="form"
      @done="onNext"
      @back="onBack"
    />
    <step-success v-if="active === 2" :data="form" @back="onBack" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import StepEdit from './components/step-edit.vue';
  import StepConfirm from './components/step-confirm.vue';
  import StepSuccess from './components/step-success.vue';
  import type { StepForm } from './model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  // 选中步骤
  const active = ref(0);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 登录框方向, 0 居中, 1 居右, 2 居左
  const direction = ref(0);
  const form = reactive<StepForm>({});

  //
  const onDone = (data: StepForm) => {
    Object.assign(form, data);
    active.value = 1;
  };

  //
  const onNext = (data: StepForm) => {
    Object.assign(form, data);
    active.value = 2;
  };

  //
  const onBack = () => {
    active.value = 0;
  };
</script>

<script lang="ts">
  export default {
    name: 'FormStep'
  };
</script>

<style lang="less" scoped>
  .account-type {
    margin-bottom: 10px;
    font-weight: bold;
  }
  .account-desc {
    margin-bottom: 15px;
  }
</style>
