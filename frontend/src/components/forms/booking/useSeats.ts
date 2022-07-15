import type { SeatFormData } from "@/interfaces/booking/seats";
import useVuelidate from "@vuelidate/core";
import { minValue } from "@vuelidate/validators";
import { reactive } from "vue";
import { requiredField } from "../validationUtils";

const useSeats = () => {
  const data = reactive<SeatFormData>({
    colNum: undefined,
    rowNum: undefined,
  });

  const schema = {
    colNum: { requiredField, minValue: minValue(1) },
    rowNum: { requiredField, minValue: minValue(1) },
  };

  const v$ = useVuelidate(schema, data);

  return {
    data,
    v$,
  };
};

export default useSeats;
