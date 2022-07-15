<script setup lang="ts">
import { useBookingStore } from "@/store/store";

const { toFlight, returnFlight } = useBookingStore()!;
</script>

<template>
  <h1>Order Summary</h1>

  <section v-if="toFlight">
    <FlightSummary v-bind="toFlight" />
  </section>

  <section v-if="returnFlight">
    <FlightSummary v-bind="returnFlight" />
  </section>
</template>
