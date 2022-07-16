<script setup lang="ts">
import type { TicketsProps } from "@/interfaces/booking/confirmation";

const props = defineProps<TicketsProps>();

const hasLuggages = props.tickets.map((ticket) =>
  ticket.isLuggage ? "yes" : "no"
);
</script>

<template>
  <h2>Passengers</h2>
  <div v-for="(ticket, idx) in tickets" :key="idx">
    {{ ticket.firstName }} {{ ticket.lastName }}
    <div>
      Row {{ ticket.rowNum }} - Column {{ ticket.colNum }},

      {{ ticket.type }} ticket, Luggage: {{ hasLuggages[idx] }}
    </div>
  </div>
</template>
