<script setup lang="ts">
import type { TicketsProps } from "@/interfaces/booking/confirmation";
import { TicketEnum } from "@/interfaces/booking/order";

const props = defineProps<TicketsProps>();

const ticketTypes = props.tickets.map((ticket) => {
  if (ticket.type === undefined) {
    return "N/A";
  }

  return TicketEnum[ticket.type];
});

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

      {{ ticketTypes[idx] }} ticket, Luggage: {{ hasLuggages[idx] }}
    </div>
  </div>
</template>
