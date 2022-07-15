import type { PassengerDetails } from "@/interfaces/booking/passengers";
import useVuelidate from "@vuelidate/core";
import { reactive } from "vue";
import { requiredField } from "../validationUtils";

const usePassengers = () => {
  const data = reactive<PassengerDetails>({
    firstName: "",
    lastName: "",
    type: undefined,
    isLuggage: false,
  });

  const schema = {
    firstName: { requiredField },
    lastName: { requiredField },
    type: { requiredField },
  };

  const v$ = useVuelidate(schema, data);

  return {
    data,
    v$,
  };
};

export default usePassengers;
