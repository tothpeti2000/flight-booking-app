<script setup lang="ts">
import type { Order } from "@/interfaces/home/orders";
import { computed } from "vue";

const props = defineProps<Order>();

const toFlightDeparture = computed(() => {
  return new Date(props.toFlight.departure).toLocaleString()
})

const returnFlightDeparture = computed(() => {
  return props.returnFlight ? new Date(props.returnFlight.departure).toLocaleString() : null
})

</script>

<template>
  <div class="flex">
    <Card class="shadow-6 mb-5">
      <template #title
        ><div>
          <div>{{ toFlight.from }} to {{ toFlight.to }}</div>
        </div>
      </template>
      <template #subtitle
        ><div>Departure: {{ toFlightDeparture }}</div>
        <div>{{ price }} Ft</div></template
      >
    </Card>

    <Card v-if="returnFlight" class="shadow-6 mb-5">
      <template #title
        ><div>
          <div>{{ returnFlight.from }} to {{ returnFlight.to }}</div>
        </div>
      </template>
      <template #subtitle
        ><div>Departure: {{ returnFlightDeparture }}</div>
        <div>{{ price }} Ft</div></template
      >
    </Card>
  </div>
</template>
