<script setup lang="ts">
import type { Flight } from "@/interfaces/booking/flights";
import { useBookingStore } from "@/store/store";

const flight = defineProps<Flight>();

const { order } = useBookingStore()!;
</script>

<template>
  <FlightCard :flight="flight" />
  <TicketsSummary :tickets="order.toFlight.tickets" />
</template>
