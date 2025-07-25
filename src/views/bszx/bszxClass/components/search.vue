<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined/>
      </template>
      <span>添加</span>
    </a-button>
    <a-radio-group v-model:value="where.branch" @change="handleSearch">
      <a-radio-button :value="1">初中部</a-radio-button>
      <a-radio-button :value="2">高中部</a-radio-button>
    </a-radio-group>
    <a-select
      show-search
      v-model:value="where.gradeId"
      style="width: 240px"
      placeholder="选择年级"
      :options="gradeList"
      @change="onGrade"
    ></a-select>
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 240px"
      v-model:value="where.keywords"
      @search="handleSearch"
    />
    <a-button @click="reset">重置</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {PlusOutlined} from '@ant-design/icons-vue';
import {watch,ref} from 'vue';
import useSearch from "@/utils/use-search";
import {BszxClassParam} from "@/api/bszx/bszxClass/model";
import {listBszxGrade} from "@/api/bszx/bszxGrade";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
  }>(),
  {}
);

const gradeList = ref<BszxClassParam[]>([]);


const emit = defineEmits<{
  (e: 'search', where?: BszxClassParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const {where, resetFields} = useSearch<BszxClassParam>({
  gradeId: undefined,
  eraId: undefined,
  branch: undefined,
  keywords: ''
});

// 新增
const add = () => {
  emit('add');
};

const handleSearch = () => {
  emit('search', where);
}

/*  重置 */
const reset = () => {
  resetFields();
  handleSearch();
};

const onGrade = (gradeId: number) => {
  where.gradeId = gradeId;
  handleSearch();
}

const reload = () => {
  listBszxGrade({}).then(res => {
    gradeList.value = res.map(d => {
      d.value = Number(d.id);
      d.label = d.name;
      return d;
    });
  })
}
reload();
watch(
  () => props.selection,
  () => {
  },
  { immediate: true }
);
</script>
