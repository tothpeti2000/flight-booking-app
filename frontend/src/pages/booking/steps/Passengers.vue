<script setup lang="ts">
import PassengerForm from "@/components/forms/booking/PassengerForm.vue";
import { validateMultipleForms } from "@/components/forms/validationUtils";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const {
  bookingOptions,
  returnFlight,
  savePassengerDetails,
  savePassengerReturnDetails,
} = useBookingStore()!;

const totalPassengers = computed(
  () => bookingOptions.value?.passengerCount ?? 0
);

const returnFlightChosen = computed(() => !!returnFlight.value);

const passengerForms = ref<InstanceType<typeof PassengerForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(
    passengerForms,
    returnFlightChosen.value
  );

  if (allFormsValid) {
    const passengerDetails = passengerForms.value?.map(
      (form) => form.passengerData
    );

    const passengerReturnDetails = passengerForms.value?.map(
      (form) => form.passengerDataReturn
    );

    savePassengerDetails(passengerDetails);
    savePassengerReturnDetails(passengerReturnDetails);
    emit("next-page", { pageIdx: 2 });
  }
};
</script>

<template>
  <div v-for="idx in totalPassengers" :key="idx">
    <h1 class="mb-4 font-bold">Passenger {{ idx }}</h1>
    <PassengerForm ref="passengerForms" />
    <SectionDivider />
  </div>

  <StepButtons
    @prevPage="$emit('prev-page', { pageIdx: 2 })"
    @nextPage="validate"
    :idx="2"
    direction="both"
  />
</template>
