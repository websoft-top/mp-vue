<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-range-picker
      v-model:value="dateRange"
      @change="search"
      value-format="YYYY-MM-DD"
    />
    <a-tooltip title="获得捐款总金额" class="flex px-4">
      <span class="text-gray-400">捐款总金额：</span>
      <span class="text-gray-700 font-bold">￥{{ formatNumber(totalPriceAmount) }}</span>
    </a-tooltip>
  </a-space>
</template>

<script lang="ts" setup>
  import useSearch from "@/utils/use-search";
  import { watch,ref } from 'vue';
  import { formatNumber } from 'ele-admin-pro/es';
  import {BszxPayRankingParam} from "@/api/bszx/bszxPayRanking/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      totalPriceAmount?: number;
    }>(),
    {}
  );

  // 日期范围选择
  const dateRange = ref<[string, string]>(['', '']);

  const emit = defineEmits<{
    (e: 'search', where?: BszxPayRankingParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const {where,resetFields} = useSearch<BszxPayRankingParam>({
    id: undefined,
    userId: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
    keywords: ''
  });

  /* 搜索 */
  const search = () => {
    const [d1, d2] = dateRange.value ?? [];
    emit('search', {
      ...where,
      createTimeStart: d1 ? d1 + ' 00:00:00' : '',
      createTimeEnd: d2 ? d2 + ' 23:59:59' : ''
    });
  };

  const onSearch = (text: string) => {
    where.sceneType = text
    search();
  }

  watch(
    () => props.selection,
    () => {}
  );
</script>
