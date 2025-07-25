<!-- 顶栏消息通知 -->
<template>
  <a-dropdown
    v-model:visible="visible"
    placement="bottom"
    :trigger="['click']"
    :overlay-style="{ padding: '0 10px' }"
  >
    <a-badge :count="unreadNum" dot class="ele-notice-trigger" :offset="[4, 6]">
      <bell-outlined style="padding: 8px 0"/>
    </a-badge>
  </a-dropdown>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
// import {useChatStore} from '@/store/modules/chat';
import {useUserStore} from '@/store/modules/user';
import {pageChatMessage} from '@/api/system/chat';
import {ChatMessage} from '@/api/system/chat/model';

// const chatStore = useChatStore();
const userStore = useUserStore();
// 是否显示
const visible = ref<boolean>(false);
// 通知数据
const notice = ref<ChatMessage[]>([]);

console.log(userStore.info?.userId,'.....userId')
// chatStore.connectSocketIO(userStore.info?.userId || 0);

// 未读数量
const unreadNum = computed(() => {
  return notice.value.length;
});

/* 查询数据 */
// const query = () => {
//   pageNotices({ status: 0 })
//     .then((result) => {
//       notice.value = result?.list;
//     })
//     .catch((e) => {
//       message.error(e.message);
//     });
//
//   pageTodos({ status: 0 })
//     .then((result) => {
//       todo.value = result?.list;
//     })
//     .catch((e) => {
//       message.error(e.message);
//     });
// };

/* 查询未读数量 */
const queryUnReadNum = () => {
  const toUserId = Number(userStore.info?.userId || 0);
  console.log(toUserId);
  const status = 0;
  pageChatMessage({toUserId, status, keywords: ''}).then((result) => {
    console.log(result);
    notice.value = result?.list || [];
  });
};

queryUnReadNum();
</script>

<script lang="ts">
import {BellOutlined} from '@ant-design/icons-vue';

export default {
  name: 'HeaderNotice',
  components: {
    BellOutlined
  }
};
</script>

<style lang="less">
.ele-notice-trigger.ant-badge {
  color: inherit;
}

.ele-notice-pop {
  &.ant-dropdown-menu {
    padding: 0;
    width: 286px;
    max-width: 100%;
    margin-top: 11px;
  }

  // 内容
  .ant-list-item {
    padding-left: 24px;
    padding-right: 24px;
    transition: background-color 0.3s;
    cursor: pointer;

    &:hover {
      background: hsla(0, 0%, 60%, 0.05);
    }
  }

  .ant-tag {
    margin: 0;
  }

  // 操作按钮
  .ele-notice-actions {
    border-top: 1px solid hsla(0, 0%, 60%, 0.15);

    & > .ele-cell-content {
      line-height: 46px;
      text-align: center;
      transition: background-color 0.3s;
      cursor: pointer;
      color: inherit;

      &:hover {
        background: hsla(0, 0%, 60%, 0.05);
      }
    }
  }
}

.ele-cell-content {
  padding: 4px;
  display: flex;
  flex-direction: column;
}
</style>
