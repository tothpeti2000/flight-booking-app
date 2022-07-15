<script setup lang="ts">
import { ticketTypes } from "@/interfaces/booking/order";
import usePassengers from "./usePassengers";

const { data: passengerData, v$ } = usePassengers();
const validateForm = v$.value.$validate;

defineExpose({ passengerData, validateForm });
</script>

<template>
  <InputElement
    icon-name="user"
    label="First Name"
    :has-error="v$.firstName.$invalid"
    :errors="v$.firstName.$errors"
  >
    <InputText type="text" id="firstName" v-model="v$.firstName.$model" />
  </InputElement>

  <InputElement
    icon-name="user"
    label="Last Name"
    :has-error="v$.lastName.$invalid"
    :errors="v$.lastName.$errors"
  >
    <InputText type="text" id="lastName" v-model="v$.lastName.$model" />
  </InputElement>

  <InputElement
    label="Ticket type"
    :has-error="v$.type.$invalid"
    :errors="v$.type.$errors"
  >
    <Dropdown
      id="gender"
      :options="ticketTypes"
      optionLabel="label"
      optionValue="value"
      v-model="v$.type.$model"
    />
  </InputElement>

  <CheckboxElement
    id="luggage"
    v-model="passengerData.isLuggage"
    label="I want to take a luggage with me"
  />
</template>
