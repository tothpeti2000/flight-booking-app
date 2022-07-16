<script setup lang="ts">
import PassengerForm from "@/components/forms/booking/PassengerForm.vue";
import {
  validateMultipleForms,
  validateReturnTickets,
} from "@/components/forms/validationUtils";
import useFeedback from "@/components/useFeedback";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const { bookingOptions, savePassengers } = useBookingStore()!;
const { showError } = useFeedback();

const totalPassengers = computed(
  () => bookingOptions.value?.passengerCount ?? 0
);

const passengerForms = ref<InstanceType<typeof PassengerForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(passengerForms);

  if (allFormsValid) {
    const returnTicketsValid = validateReturnTickets(passengerForms);

    if (!returnTicketsValid) {
      showError("You must choose return tickets for all passengers");
    } else {
      const passengers = passengerForms.value?.map(
        (form) => form.passengerData
      );

      savePassengers(passengers);
      emit("next-page", { pageIdx: 2 });
    }
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
