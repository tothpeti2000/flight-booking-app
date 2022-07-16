<script setup lang="ts">
import { getFlights } from "@/api/booking";
import { handleResponse } from "@/api/useAPI";
import useFeedback from "@/components/useFeedback";
import { useBookingStore } from "@/store/store";
import { onActivated } from "vue";

const { toFlight, bookingOptions } = useBookingStore()!;
const { showError } = useFeedback();

const {
  execute: fetchFlights,
  data,
  isFetching,
  statusCode,
} = getFlights(bookingOptions.value);

const emit = defineEmits(["prev-page", "next-page"]);

const validate = () => {
  if (!toFlight.value) {
    showError("A flight must be chosen");
  } else {
    emit("next-page", { pageIdx: 1 });
  }
};

onActivated(async () => {
  await fetchFlights();
  handleResponse(statusCode.value, data.value);
});
</script>

<template>
  <Spinner v-if="isFetching" />

  <div v-else>
    <FlightList :flights="data?.toFlights" />
    <FlightList :flights="data?.returnFlights" isReturn />
  </div>

  <StepButtons
    @prevPage="$emit('prev-page', { pageIdx: 1 })"
    @nextPage="validate"
    :idx="1"
    direction="both"
  />
</template>
