<script setup lang="ts">
import { getSeats } from "@/api/booking";
import { handleResponse } from "@/api/useAPI";
import SeatForm from "@/components/forms/booking/SeatForm.vue";
import {
  validateMultipleForms,
  validateSeatReservations,
} from "@/components/forms/validationUtils";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { onActivated, ref } from "vue";

const { bookingOptions, toFlight, returnFlight, saveSeatReservations } =
  useBookingStore()!;

const returnFlightChosen = computed(() => !!returnFlight.value);

const planeId = toFlight.value?.planeId;
const flightId = toFlight.value?.flightId;

const planeIdReturn = returnFlight.value?.planeId;
const flightIdReturn = returnFlight.value?.flightId;

const {
  execute: fetchSeats,
  data,
  isFetching,
  statusCode,
} = getSeats({
  planeId: planeId,
  flightId: flightId,
});

const {
  execute: fetchReturnSeats,
  data: dataReturn,
  isFetching: isFetchingReturn,
  statusCode: statusCodeReturn,
} = getSeats({
  planeId: planeIdReturn,
  flightId: flightIdReturn,
});

const seatForms = ref<InstanceType<typeof SeatForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(
    seatForms,
    returnFlightChosen.value
  );

  if (allFormsValid) {
    const seatReservations = seatForms.value?.map((form) => form.data);

    const seatReturnReservations = seatForms.value?.map(
      (form) => form.dataReturn
    );

    const reservationsValid = validateSeatReservations(
      data.value?.bookedSeats,
      seatReservations,
      data.value?.seatRowCount,
      data.value?.seatColCount
    );

    const reservationsReturnValid = validateSeatReservations(
      dataReturn.value?.bookedSeats,
      seatReturnReservations,
      dataReturn.value?.seatRowCount,
      dataReturn.value?.seatColCount
    );

    if (reservationsValid && reservationsReturnValid) {
      saveSeatReservations(seatReservations, false);
      saveSeatReservations(seatReturnReservations, true);

      emit("next-page", { pageIdx: 3 });
    }
  }
};

onActivated(async () => {
  await fetchSeats();
  handleResponse(statusCode.value, data.value);

  await fetchReturnSeats();
  handleResponse(statusCodeReturn.value, dataReturn.value);
});
</script>

<template>
  <Spinner v-if="isFetching || isFetchingReturn" />

  <div v-else>
    <div class="flex justify-content-between">
      <div>
        Rows: {{ data?.seatRowCount }} Columns: {{ data?.seatColCount }}

        <div v-if="data?.bookedSeats">
          <h1>Booked seats</h1>
          <div v-for="(bookedSeat, idx) in data.bookedSeats" :key="idx">
            Row {{ bookedSeat.rowNum }} - Column {{ bookedSeat.colNum }}
          </div>
        </div>
      </div>

      <div>
        Rows: {{ dataReturn?.seatRowCount }} Columns:
        {{ dataReturn?.seatColCount }}

        <div v-if="dataReturn?.bookedSeats">
          <h1>Booked seats</h1>
          <div v-for="(bookedSeat, idx) in dataReturn.bookedSeats" :key="idx">
            Row {{ bookedSeat.rowNum }} - Column {{ bookedSeat.colNum }}
          </div>
        </div>
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
