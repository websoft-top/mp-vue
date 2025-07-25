<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 280px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button type="text" @click="handleExport">导出</a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { utils, writeFile } from 'xlsx';
  import dayjs from 'dayjs';
  import { message } from 'ant-design-vue';
  import useSearch from "@/utils/use-search";
  import {BszxPayParam} from "@/api/bszx/bszxPay/model";
  import {BszxBm} from "@/api/bszx/bszxBm/model";
  import {listBszxPay} from "@/api/bszx/bszxPay";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: BszxPayParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<BszxPayParam>({
    id: undefined,
    keywords: '',
    userId: undefined
  });

  const reload = () => {
    emit('search', where);
  };

  // 变量
  const loading = ref(false);
  const bmList = ref<BszxBm[]>([])
  const xlsFileName = ref<string>();

  // 导出
  const handleExport = async () => {
    loading.value = true;
    const array: (string | number)[][] = [
      [
        '用户ID',
        '姓名',
        '性别',
        '手机号码',
        '班级',
        '年级',
        '居住地址',
        '工作单位',
        '职务',
        '是否能到场',
        '邀请函',
        '捐款时间'
      ]
    ];

    // 按搜索结果导出
    where.sceneType = 'Content';
    await listBszxPay(where)
      .then((list) => {
        bmList.value = list;
        list?.forEach((d: BszxBm) => {
          array.push([
            `${d.userId}`,
            `${d.name}`,
            `${d.sex}`,
            `${d.phone}`,
            `${d.className}`,
            `${d.gradeName}`,
            `${d.address}`,
            `${d.workUnit}`,
            `${d.position}`,
            `${d.present}`,
            `${d.certificate}`,
            `${d.createTime}`
          ]);
        });
        const sheetName = `导出捐款记录${dayjs(new Date()).format('YYYYMMDD')}`;
        const workbook = {
          SheetNames: [sheetName],
          Sheets: {}
        };
        const sheet = utils.aoa_to_sheet(array);
        workbook.Sheets[sheetName] = sheet;
        // 设置列宽
        sheet['!cols'] = [
          { wch: 10 },
          { wch: 40 },
          { wch: 20 },
          { wch: 20 },
          { wch: 60 },
          { wch: 15 },
          { wch: 10 },
          { wch: 10 },
          { wch: 20 },
          { wch: 10 },
          { wch: 20 }
        ];
        message.loading('正在导出...');
        setTimeout(() => {
          writeFile(
            workbook,
            `${
              where.createTimeEnd ? xlsFileName.value + '_' : ''
            }${sheetName}.xlsx`
          );
          loading.value = false;
        }, 1000);
      })
      .catch((msg) => {
        message.error(msg);
        loading.value = false;
      })
      .finally(() => {});

  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
