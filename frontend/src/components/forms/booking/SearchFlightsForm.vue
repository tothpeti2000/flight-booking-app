<script setup lang="ts">
import type { SearchFlightsFormProps } from "@/interfaces/booking/searchFlightsFormProps";
import { useBookingStore } from "@/store/store";
import type { AutoCompleteCompleteEvent } from "primevue/autocomplete";
import { datesValid } from "../validationUtils";
import useSearchFlights from "./useSearchFlights";

defineProps<SearchFlightsFormProps>();

const { saveBookingOptions } = useBookingStore()!;
const { data: bookingOptions, v$ } = useSearchFlights();

const emit = defineEmits(["prev-page", "next-page"]);

const selectAirport = (e: AutoCompleteCompleteEvent) => {
  console.log(e.query);
};

const cities = [{ name: "BUD", cityName: "Budapest" }];

const validate = async () => {
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    const validDates = datesValid(
      bookingOptions.departureDate,
      bookingOptions.returnDate
    );

    if (validDates) {
      saveBookingOptions(bookingOptions);
      emit("next-page", { pageIdx: 0 });
    }
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
      <AutoComplete
        :suggestions="airports"
        field="cityName"
        @complete="selectAirport($event)"
        :dropdown="true"
      />
    </InputElement>

    <InputElement
      label="To"
      :has-error="v$.to.$invalid"
      :errors="v$.to.$errors"
    >
      <AutoComplete :suggestions="cities" field="cityName" :dropdown="true" />
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
