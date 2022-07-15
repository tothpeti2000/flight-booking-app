<script setup lang="ts">
import { getOrders } from "@/api/home";
import { handleResponse } from "@/api/useAPI";
import { onMounted } from "vue";

const { execute: fetchOrders, data, isFetching, statusCode } = getOrders();

onMounted(async () => {
  await fetchOrders();
  handleResponse(statusCode.value, data.value);
});
</script>

<template>
  <h1>My Tickets</h1>
  <ProgressSpinner v-if="isFetching" />

  <div v-else-if="data">
    <Ticket v-for="order in data.orders" :key="order.id" v-bind="order" />
  </div>

  <RouterButton to="/booking"> Book your flight now </RouterButton>
</template>
