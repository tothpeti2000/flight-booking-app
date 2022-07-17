<script setup lang="ts">
import { useBookingStore } from "@/store/store";

const { toFlight, returnFlight } = useBookingStore()!;
</script>

<template>
  <h1>Order Summary</h1>

  <section v-if="toFlight">
    <FlightSummary :flight="toFlight" />
  </section>

  <section v-if="returnFlight">
    <FlightSummary :flight="returnFlight" isReturn />
  </section>
</template>
