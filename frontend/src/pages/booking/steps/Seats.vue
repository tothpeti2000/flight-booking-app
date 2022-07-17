<script setup lang="ts">
import { getSeats } from "@/api/booking";
import { handleResponse } from "@/api/useAPI";
import SeatForm from "@/components/forms/booking/SeatForm.vue";
import {
  validateMultipleForms,
  validateSeatReservations,
} from "@/components/forms/validationUtils";
import type { SeatData } from "@/interfaces/booking/seats";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { onActivated, ref } from "vue";

const { bookingOptions, toFlight, returnFlight, saveSeatReservations } =
  useBookingStore()!;

const returnFlightChosen = computed(() => !!returnFlight.value);

const planeId = computed(() => toFlight.value?.planeId);
const flightId = computed(() => toFlight.value?.flightId);

const planeIdReturn = computed(() => returnFlight.value?.planeId);
const flightIdReturn = computed(() => returnFlight.value?.flightId);

const seatData = ref<SeatData | null>();
const fetching = ref(true);

const seatReturnData = ref<SeatData | null>();
const fetchingReturn = ref(true);

const seatForms = ref<InstanceType<typeof SeatForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(
    seatForms,
    returnFlightChosen.value
  );

  if (allFormsValid) {
    const seatReservations = seatForms.value?.map((form) => form.data);

    const reservationsValid = validateSeatReservations(
      seatData.value?.bookedSeats,
      seatReservations,
      seatData.value?.seatRowCount,
      seatData.value?.seatColCount
    );

    if (reservationsValid) {
      saveSeatReservations(seatReservations, false);

      if (!returnFlightChosen.value) {
        emit("next-page", { pageIdx: 3 });
      } else {
        const seatReturnReservations = seatForms.value?.map(
          (form) => form.dataReturn
        );

        const reservationsReturnValid = validateSeatReservations(
          seatReturnData.value?.bookedSeats,
          seatReturnReservations,
          seatReturnData.value?.seatRowCount,
          seatReturnData.value?.seatColCount
        );

        if (reservationsReturnValid) {
          saveSeatReservations(seatReturnReservations, true);
          emit("next-page", { pageIdx: 3 });
        }
      }
    }
  }
};

onActivated(async () => {
  const {
    execute: fetchSeats,
    data,
    statusCode,
  } = getSeats({
    planeId: planeId.value,
    flightId: flightId.value,
  });

  const {
    execute: fetchReturnSeats,
    data: dataReturn,
    statusCode: statusCodeReturn,
  } = getSeats({
    planeId: planeIdReturn.value,
    flightId: flightIdReturn.value,
  });

  await fetchSeats();
  handleResponse(statusCode.value, data.value);

  fetching.value = false;
  seatData.value = data.value;

  if (returnFlightChosen) {
    await fetchReturnSeats();
    handleResponse(statusCodeReturn.value, dataReturn.value);

    fetchingReturn.value = false;
    seatReturnData.value = dataReturn.value;
  }
});
</script>

<template>
  <Spinner v-if="fetching || fetchingReturn" />

  <div v-else>
    <div class="flex justify-content-between">
      <div>
        {{ seatData?.planeType }}
        Rows: {{ seatData?.seatRowCount }} Columns: {{ seatData?.seatColCount }}

        <div v-if="seatData?.bookedSeats">
          <h1>Booked seats</h1>
          <div v-for="(bookedSeat, idx) in seatData.bookedSeats" :key="idx">
            Row {{ bookedSeat.rowNum }} - Column {{ bookedSeat.colNum }}
          </div>
        </div>
      </div>

      <div v-if="returnFlightChosen">
        {{ seatReturnData?.planeType }}
        Rows: {{ seatReturnData?.seatRowCount }} Columns:
        {{ seatReturnData?.seatColCount }}

        <div v-if="seatReturnData?.bookedSeats">
          <h1>Booked seats</h1>
          <div
            v-for="(bookedSeat, idx) in seatReturnData.bookedSeats"
            :key="idx"
          >
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
