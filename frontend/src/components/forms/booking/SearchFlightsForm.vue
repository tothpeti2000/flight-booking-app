<script setup lang="ts">
import { useBookingStore } from "@/store/store";
import useSearchFlights from "./useSearchFlights";

const { saveBookingOptions } = useBookingStore()!;
const { data: bookingOptions, v$ } = useSearchFlights();

const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const isValid = await v$.value.$validate();

  if (isValid) {
    saveBookingOptions(bookingOptions);
    emit("next-page", { pageIdx: 0 });
  }
};
</script>

<template>
  <div class="p-fluid">
    <InputElement
      label="From"
      :has-error="v$.from.$invalid"
      :errors="v$.from.$errors"
    >
      <InputText type="text" id="from" v-model="v$.from.$model" />
    </InputElement>

    <InputElement
      label="To"
      :has-error="v$.to.$invalid"
      :errors="v$.to.$errors"
    >
      <InputText type="text" id="to" v-model="v$.to.$model" />
    </InputElement>

    <InputElement
      label="Departure date"
      :has-error="v$.departureDate.$invalid"
      :errors="v$.departureDate.$errors"
    >
      <Calendar
        id="departureDate"
        :showIcon="true"
        v-model="v$.departureDate.$model"
      />
    </InputElement>

    <InputElement label="Return date">
      <Calendar
        id="returnDate"
        :showIcon="true"
        v-model="bookingOptions.returnDate"
      />
    </InputElement>

    <InputElement
      label="Total passengers"
      :has-error="v$.passengerCount.$invalid"
      :errors="v$.passengerCount.$errors"
    >
      <InputNumber id="passengers" v-model="v$.passengerCount.$model" />
    </InputElement>
  </div>

  <StepButtons @nextPage="validate" :idx="0" direction="next" />
</template>
