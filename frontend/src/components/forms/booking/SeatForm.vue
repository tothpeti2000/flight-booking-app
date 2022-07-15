<script setup lang="ts">
import useSeats from "./useSeats";

const { data, v$ } = useSeats();
const validateForm = v$.value.$validate;

defineExpose({ data, validateForm });
</script>

<template>
  <InputElement
    label="Row"
    :has-error="v$.rowNum.$invalid"
    :errors="v$.rowNum.$errors"
  >
    <InputNumber id="seatRow" v-model="v$.rowNum.$model" />
  </InputElement>

  <InputElement
    label="Column"
    :has-error="v$.colNum.$invalid"
    :errors="v$.colNum.$errors"
  >
    <InputNumber id="seatCol" v-model="v$.colNum.$model" />
  </InputElement>
</template>
