<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch />
    </template>
    <Tenant :use="false" />
  </a-page-header>
</template>

<script lang="ts" setup>
  import Tenant from './components/tenant.vue';
  import {getPageTitle} from "@/utils/common";
  import CmsWebsiteSearch from "./components/search.vue";
</script>

<script lang="ts">
  export default {
    name: 'SystemPlug'
  };
</script>
