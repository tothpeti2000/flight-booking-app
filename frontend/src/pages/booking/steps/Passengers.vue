<script setup lang="ts">
import PassengerForm from "@/components/forms/booking/PassengerForm.vue";
import { validateMultipleForms } from "@/components/forms/validationUtils";
import { useBookingStore } from "@/store/store";
import { computed } from "@vue/reactivity";
import { ref } from "vue";

const { bookingOptions, savePassengers } = useBookingStore()!;

const totalPassengers = computed(
  () => bookingOptions.value?.passengerCount ?? 0
);

const passengerForms = ref<InstanceType<typeof PassengerForm>[] | null>(null);
const emit = defineEmits(["prev-page", "next-page"]);

const validate = async () => {
  const allFormsValid = await validateMultipleForms(passengerForms);

  if (allFormsValid) {
    const passengers = passengerForms.value?.map((form) => form.passengerData);

    savePassengers(passengers);
    emit("next-page", { pageIdx: 2 });
  }
};
</script>

<template>
  <div v-for="idx in totalPassengers" :key="idx">
    <h1>Passenger #{{ idx }}</h1>
    <PassengerForm ref="passengerForms" />
  </div>

  <StepButtons
    @prevPage="$emit('prev-page', { pageIdx: 2 })"
    @nextPage="validate"
    :idx="2"
    direction="both"
  />
</template>
