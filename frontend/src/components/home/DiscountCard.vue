<!--<script setup lang="ts">
import type { Discount } from "@/interfaces/discount";

defineProps<Discount>();
</script>

<template>
  <Card class="w-2 text-center overflow-hidden">
    <template #header>
      <div class="card-imgs">
        <img alt="Flight" :src="imgUrlFrom" />
        <img alt="Flight" :src="imgUrlTo" />
      </div>
    </template>
    <template #title>
      {{ fromCity }} <i class="pi pi-arrow-right" /> {{ toCity }}
    </template>
    <template #content
      ><div class="flex justify-content-between align-items-center">
        Only for {{ price }} Ft<Button label="Buy Now" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
  .card-imgs {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card-imgs > img{
    width: 400;
  }
</style>-->
