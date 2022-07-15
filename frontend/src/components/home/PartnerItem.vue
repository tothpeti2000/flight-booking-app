<script setup lang="ts">
interface Partner {
  name: string;
  blobUrl: string;
}

defineProps<Partner>();
</script>

<template>
  <div class="text-center shadow-5">
    <img class="border-round-sm" alt="Partner" :src="blobUrl" height="100" />
    <h3>{{ name }}</h3>
  </div>
</template>
