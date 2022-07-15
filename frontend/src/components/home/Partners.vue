<!--<script setup lang="ts">
import { partners } from "@/testData/testData";

import { getPartners } from "@/api/partner"
import { onMounted } from "vue";

const { data, execute } = getPartners()

onMounted(async () => {
  await execute()
})

</script>

<template>
  <section class="p-5">
    <h1 class="mb-5">Huge thanks to our supportive partners</h1>

    <div class="flex gap-5 overflow-hidden">
      <PartnerItem
        v-for="partner in data"
        :key="partner.partnerID"
        v-bind="partner"
      />
    </div>
  </section>
</template>-->
