<script setup lang="ts">
import { getSeats } from "@/api/booking";
import { handleResponse } from "@/api/useAPI";
import SeatForm from "@/components/forms/booking/SeatForm.vue";
import {
  validateMultipleForms,
  validateSeatReservations,
} from "@/components/forms/validationUtils";
import { useBookingStore } from "@/store/store";
import { onActivated, ref } from "vue";

const { bookingOptions, toFlight, saveSeatReservations } = useBookingStore()!;

const planeId = toFlight.value?.planeId;
const flightId = toFlight.value?.flightId;

const {
  execute: fetchSeats,
  data,
  isFetching,
  statusCode,
} = getSeats({
  planeId: planeId,
  flightId: flightId,
});

const seatForms = ref<InstanceType<typeof SeatForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(seatForms);

  if (allFormsValid) {
    const seatReservations = seatForms.value?.map((form) => form.data);

    const reservationsValid = validateSeatReservations(
      data.value?.bookedSeats,
      seatReservations,
      data.value?.seatRowCount,
      data.value?.seatColCount
    );

    if (reservationsValid) {
      saveSeatReservations(seatReservations);
      emit("next-page", { pageIdx: 3 });
    }
  }
};

onActivated(async () => {
  await fetchSeats();
  handleResponse(statusCode.value, data.value);
});
</script>

<template>
  <Spinner v-if="isFetching" />

  <div v-else>
    Rows: {{ data?.seatRowCount }} Columns: {{ data?.seatColCount }}

    <div v-if="data?.bookedSeats">
      <h1>Booked seats</h1>
      <div v-for="(bookedSeat, idx) in data.bookedSeats" :key="idx">
        Row {{ bookedSeat.rowNum }} - Column {{ bookedSeat.colNum }}
      </div>
    </div>

    <div v-for="idx in bookingOptions?.passengerCount" :key="idx">
      <h1>Seat for Passenger #{{ idx }}</h1>
      <SeatForm ref="seatForms" />
    </div>
  </div>

  <StepButtons
    @prevPage="$emit('prev-page', { pageIdx: 3 })"
    @nextPage="validate"
    :idx="3"
    direction="both"
  />
</template>
