<script setup lang="ts">
import { getSeats } from "@/api/booking";
import { handleResponse } from "@/api/useAPI";
import type SeatSelector from "@/components/booking/seats/SeatSelector.vue";
import type SeatForm from "@/components/forms/booking/SeatForm.vue";
import { validateSeatReservations } from "@/components/forms/validationUtils";
import type { SeatData, SeatFormData } from "@/interfaces/booking/seats";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { map, partialRight, pick } from "lodash";
import { onActivated, ref } from "vue";

const { toFlight, returnFlight, passengerDetails, saveSeatReservations } =
  useBookingStore()!;

const returnFlightChosen = computed(() => !!returnFlight.value);

const planeId = computed(() => toFlight.value?.planeId);
const flightId = computed(() => toFlight.value?.flightId);

const planeIdReturn = computed(() => returnFlight.value?.planeId);
const flightIdReturn = computed(() => returnFlight.value?.flightId);

const seatData = ref<SeatData | null>(null);
const fetching = ref(true);

const testSeatData: SeatData = {
  planeType: "",
  seatColCount: 3,
  seatRowCount: 10,
  bookedSeats: [
    {
      colNum: 1,
      rowNum: 1,
    },
  ],
};

const testReturnSeatData: SeatData = {
  planeType: "",

  seatColCount: 4,
  seatRowCount: 11,
  bookedSeats: [
    {
      colNum: 3,
      rowNum: 1,
    },
  ],
};

const seatReturnData = ref<SeatData | null>(null);
const fetchingReturn = ref(true);

const seatSelector = ref<InstanceType<typeof SeatSelector> | null>(null);
const seatSelectorReturn = ref<InstanceType<typeof SeatSelector> | null>(null);

const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const toSeats: SeatFormData[] = map(
    seatSelector.value?.passengers,
    partialRight(pick, ["colNum", "rowNum"])
  ) as SeatFormData[];

  const returnSeats: SeatFormData[] = map(
    seatSelectorReturn.value?.passengers,
    partialRight(pick, ["colNum", "rowNum"])
  ) as SeatFormData[];

  const reservationsValid = validateSeatReservations(toSeats);

  if (reservationsValid) {
    if (!returnFlightChosen.value) {
      saveSeatReservations(toSeats, false);
      emit("next-page", { pageIdx: 3 });
    } else {
      const reservationsReturnValid = validateSeatReservations(returnSeats);

      saveSeatReservations(returnSeats, true);
      reservationsReturnValid && emit("next-page", { pageIdx: 3 });
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
    <div class="flex justify-content-around">
      <SeatSelector v-if="seatData" :seatData="seatData" ref="seatSelector" />

      <Divider layout="vertical" />

      <SeatSelector
        v-if="returnFlightChosen && seatReturnData"
        :seatData="seatReturnData"
        ref="seatSelectorReturn"
      />
    </div>
  </div>

  <StepButtons
    @prevPage="$emit('prev-page', { pageIdx: 3 })"
    @nextPage="validate"
    :idx="3"
    direction="both"
  />
</template>
