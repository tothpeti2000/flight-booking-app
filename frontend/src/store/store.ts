import type { Flight } from "@/interfaces/booking/flights";
import type { Order } from "@/interfaces/booking/order";
import type { PassengerDetails } from "@/interfaces/booking/passengers";
import type { SeatFormData } from "@/interfaces/booking/seats";
import type { BookingOptions } from "@/interfaces/booking/start";
import { createGlobalState, useSessionStorage } from "@vueuse/core";
import { createInjectionState } from "@vueuse/shared";
import { merge } from "lodash-es";
import { computed, ref } from "vue";

export const useTokenStore = createGlobalState(() =>
  useSessionStorage<string | null>("token", null)
);

const [useProvideBookingStore, useBookingStore] = createInjectionState(() => {
  const bookingOptions = ref<BookingOptions>();
  const toFlight = ref<Flight>();
  const returnFlight = ref<Flight>();
  const passengers = ref<PassengerDetails[]>([]);
  const seatReservations = ref<SeatFormData[]>([]);
  const order = computed(() => getOrder());

  const saveBookingOptions = (options: BookingOptions) => {
    bookingOptions.value = options;
  };

  const saveFlightChoice = (flight: Flight | undefined, isReturn: boolean) => {
    isReturn ? (returnFlight.value = flight) : (toFlight.value = flight);
  };

  const savePassengers = (details: PassengerDetails[] | undefined) => {
    details && (passengers.value = details);
  };

  const saveSeatReservations = (reservations: SeatFormData[] | undefined) => {
    reservations && (seatReservations.value = reservations);
  };

  const getOrder = () => {
    const tickets = merge(passengers.value, seatReservations.value);

    let orderToFlight = {};

    if (toFlight.value?.flightId) {
      orderToFlight = {
        toFlight: {
          flightId: toFlight.value.flightId,
          isReturn: false,
          tickets: tickets,
        },
      };
    }

    let orderReturnFlight = {};

    if (returnFlight.value?.flightId) {
      orderReturnFlight = {
        returnFlight: {
          flightId: returnFlight.value.flightId,
          isReturn: true,
          tickets: tickets,
        },
      };
    }

    const order = merge(orderToFlight, orderReturnFlight);

    return order as Order;
  };

  return {
    bookingOptions,
    toFlight,
    returnFlight,
    passengers,
    seatReservations,
    order,
    saveBookingOptions,
    saveFlightChoice,
    savePassengers,
    saveSeatReservations,
  };
});

export { useProvideBookingStore };
export { useBookingStore };
