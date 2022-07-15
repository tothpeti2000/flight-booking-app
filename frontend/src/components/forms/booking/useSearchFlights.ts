import type { BookingOptions } from "@/interfaces/booking/start";
import useVuelidate from "@vuelidate/core";
import { minValue } from "@vuelidate/validators";
import { reactive } from "vue";
import { requiredField } from "../validationUtils";

const useSearchFlights = () => {
  const data = reactive<BookingOptions>({
    from: "",
    to: "",
    departureDate: new Date(),
    returnDate: undefined,
    passengerCount: 1,
  });

  const schema = {
    from: { requiredField },
    to: { requiredField },
    departureDate: { requiredField },
    passengerCount: { requiredField, minValue: minValue(1) },
  };

  const v$ = useVuelidate(schema, data);

  return {
    data,
    v$,
  };
};

export default useSearchFlights;
