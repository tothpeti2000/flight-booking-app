<!--<script setup lang="ts">
import { getDiscounts } from "@/api/discount"
import { onMounted } from "vue";

const { data, execute } = getDiscounts()

onMounted(async () => {
  await execute()
})

</script>

<template>
  <section class="p-5">
    <header class="px-8 mx-8 mb-5">
      <h1>LOOKING FOR CHEAPER FLIGHTS?</h1>
      <h1 class="text-right">We've got you covered</h1>
    </header>

    <div class="flex flex-wrap justify-content-between gap-5">
      <DiscountCard
        v-for="discount in data"
        :key="discount.flightID"
        v-bind="discount"
      />
    </div>
  </section>
</template>-->
