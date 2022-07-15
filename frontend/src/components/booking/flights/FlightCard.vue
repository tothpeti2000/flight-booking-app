<script setup lang="ts">
import type { FlightCardProps } from "@/interfaces/booking/flightCardProps";
import { useBookingStore } from "@/store/store";
import { computed } from "vue";

const props = withDefaults(defineProps<FlightCardProps>(), {
  isReturn: false,
});

const { toFlight, returnFlight, saveFlightChoice } = useBookingStore()!;

const isChosen = computed(() => {
  return (
    props.flight.flightId === toFlight.value?.flightId ||
    props.flight.flightId === returnFlight.value?.flightId
  );
});

const bgColor = computed(() => {
  return isChosen.value ? "bg-primary" : "surface-card";
});

const handleClick = () => {
  const toSave = isChosen.value ? undefined : props.flight;

  saveFlightChoice(toSave, props.isReturn);
};

const arrival = computed(() => {
  return props.flight.arrivalTime.toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const departure = computed(() => {
  return props.flight.departureTime.toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const dayName = computed(() => {
  return props.flight.departureTime.toLocaleString("en-us", {
    weekday: "long",
  });
});

const departDate = computed(() => {
  return props.flight.departureTime.toLocaleString("hu-HU", {
    dateStyle: "medium",
  });
});

const flightTimeConverter = computed(() => {
  const hour = Math.floor(props.flight.flightTimeMinutes / 60);
  const minutes = props.flight.flightTimeMinutes % 60;
  return hour + "h " + minutes + "min";
});
</script>

<template>
  <Card @click="handleClick" :class="bgColor">
    <template #content>
      <div class="flex flex-row">
        <div class="flex flex-column align-items-start justify-content-end">
          <div class="text-l">{{ dayName }}, {{ departDate }}</div>
          <div class="text-5xl line-height-1 mb-1 mt-1">{{ arrival }}</div>
          <div class="text-xl">
            {{ flight.departureCity }} {{ flight.departureAirport }}
          </div>
        </div>
        <div
          class="flex flex-column align-items-center justify-content-center flex-grow-1 text-l"
        >
          {{ flightTimeConverter }}
        </div>
        <div class="flex flex-column align-items-end justify-content-end">
          <div class="text-5xl line-height-1 mb-1 mt-1">{{ departure }}</div>
          <div class="text-xl">
            {{ flight.arrivalCity }} {{ flight.arrivalAirport }}
          </div>
        </div>
        <div
          class="flex flex-column align-items-end justify-content-center ml-3"
        >
          <div
            class="bg-blue-400 ml-4 mr-3 pl-3 pr-3 p-2 text-2xl text-white border-round-md font-semibold w-auto"
          >
            {{ flight.price }} Ft
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>
