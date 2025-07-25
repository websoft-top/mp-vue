<!-- 详情弹窗 -->
<template>
  <ele-modal
    title="详情"
    :width="640"
    :footer="null"
    :visible="visible"
    @update:visible="updateVisible"
  >
    <a-form
      class="ele-form-detail"
      :label-col="{ sm: { span: 8 }, xs: { span: 6 } }"
      :wrapper-col="{ sm: { span: 16 }, xs: { span: 18 } }"
    >
      <a-row :gutter="16">
        <a-col :sm="12" :xs="24">
          <a-form-item label="操作人">
            <div class="ele-text-secondary">
              {{ data.nickname }}({{ data.username }})
            </div>
          </a-form-item>
          <a-form-item label="操作模块">
            <div class="ele-text-secondary">
              {{ data.module }}
            </div>
          </a-form-item>
          <a-form-item label="操作时间">
            <div class="ele-text-secondary">
              {{ toDateString(data.createTime) }}
            </div>
          </a-form-item>
          <a-form-item label="请求方式">
            <div class="ele-text-secondary">
              {{ data.requestMethod }}
            </div>
          </a-form-item>
        </a-col>
        <a-col :sm="12" :xs="24">
          <a-form-item label="IP地址">
            <div class="ele-text-secondary">
              {{ data.ip }}
            </div>
          </a-form-item>
          <a-form-item label="操作功能">
            <div class="ele-text-secondary">
              {{ data.description }}
            </div>
          </a-form-item>
          <a-form-item label="请求耗时">
            <div v-if="!isNaN(data.spendTime)" class="ele-text-secondary">
              {{ data.spendTime / 1000 }}s
            </div>
          </a-form-item>
          <a-form-item label="请求状态">
            <a-tag :color="['green', 'red'][data.status]">
              {{ ['正常', '异常'][data.status] }}
            </a-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin: 12px 0">
        <a-divider />
      </div>
      <a-form-item
        label="请求地址"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <div class="ele-text-secondary">
          {{ data.url }}
        </div>
      </a-form-item>
      <a-form-item
        label="调用方法"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <div class="ele-text-secondary">
          {{ data.method }}
        </div>
      </a-form-item>
      <a-form-item
        label="请求参数"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <div class="ele-text-secondary">
          {{ data.params }}
        </div>
      </a-form-item>
      <a-form-item
        v-if="data.status === 0"
        label="返回结果"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <text-ellipsis :content="data.result" class="ele-text-secondary" />
      </a-form-item>
      <a-form-item
        v-else
        label="异常信息"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <text-ellipsis :content="data.error" class="ele-text-secondary" />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { toDateString } from 'ele-admin-pro/es';
  import type { OperationRecord } from '@/api/system/operation-record/model';
  import TextEllipsis from './text-ellipsis.vue';

  const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
  }>();

  defineProps<{
    // 弹窗是否打开
    visible?: boolean;
    // 修改回显的数据
    data: OperationRecord;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
</script>
