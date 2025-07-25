<template>
  <span>{{ item.meta.title }}</span>
  <div v-if="item.meta && item.meta.badge" class="ele-menu-badge">
    <a-badge
      :count="item.meta.badge"
      :number-style="{ background: item.meta.badgeColor as string }"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { MenuItemType } from 'ele-admin-pro/es';

  defineProps<{
    item: MenuItemType;
  }>();
</script>
