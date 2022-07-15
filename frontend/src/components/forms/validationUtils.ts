import type { Seat, SeatFormData } from "@/interfaces/booking/seats";
import {
  email,
  helpers,
  maxLength,
  minLength,
  required,
} from "@vuelidate/validators";
import { intersectionWith, isEqual, uniqWith } from "lodash-es";
import useFeedback from "../useFeedback";

const hasCapitalLetter = (value: string) => value.match(/[A-Z]/g) !== null;
const hasNumber = (value: string) => value.match(/[0-9]/g) !== null;

export const requiredField = helpers.withMessage(
  "This field is required",
  required
);

export const emailField = helpers.withMessage(
  "Please, enter a valid email address",
  email
);

export const containsCapital = helpers.withMessage(
  "At least one capital letter is required",
  hasCapitalLetter
);

export const containsNumber = helpers.withMessage(
  "At least one number is required",
  hasNumber
);

export const minCharacters = (minCharacters: number) =>
  helpers.withMessage(
    `Please, enter at least ${minCharacters} characters`,
    minLength(minCharacters)
  );

export const maxCharacters = (maxCharacters: number) =>
  helpers.withMessage(
    `Please, enter at most ${maxCharacters} characters`,
    maxLength(maxCharacters)
  );

export const validateMultipleForms = async (forms: any) => {
  const validationResults = await Promise.all(
    forms.value?.map(async (form: any) => {
      return await form.validateForm();
    }) as []
  );

  return validationResults.every((result) => result === true);
};

const maxValueExceeded = (
  reservations: SeatFormData[],
  rows: number,
  columns: number
) => {
  return reservations.some((reservation) => {
    if (!reservation.rowNum || !reservation.colNum) {
      return true;
    }

    return reservation.rowNum > rows || reservation.colNum > columns;
  });
};

const reservationsUnique = (reservations: SeatFormData[]) => {
  const uniqueReservations = uniqWith(reservations, isEqual);

  return isEqual(uniqueReservations, reservations);
};

const invalidSeats = (reservations: SeatFormData[], bookedSeats: Seat[]) => {
  const invalidReservations = intersectionWith(
    reservations,
    bookedSeats,
    isEqual
  );

  const seatInfo = invalidReservations.map(
    (reservation) => `Row ${reservation.rowNum} - Column ${reservation.colNum}`
  );

  return seatInfo;
};

export const validateSeatReservations = (
  bookedSeats: Seat[] | undefined,
  reservations: SeatFormData[] | undefined,
  rows: number | undefined,
  columns: number | undefined
) => {
  const { showError } = useFeedback();

  if (!bookedSeats || !reservations || !rows || !columns) {
    showError("Error while trying to book the seats");
    return false;
  }

  // Check if row and column values exceed the max value
  if (maxValueExceeded(reservations, rows, columns)) {
    showError(`There are only ${rows} rows and ${columns} columns`);

    return false;
  }

  // Check if every reservation is different
  if (!reservationsUnique(reservations)) {
    showError("The same seat has been booked by multiple passengers");
    return false;
  } else {
    // Check if any reserved seat has been booked already
    const alreadyBookedSeats = invalidSeats(reservations, bookedSeats);

    if (alreadyBookedSeats.length > 0) {
      showError(
        `The following seats have been booked already: ${alreadyBookedSeats}`
      );
      return false;
    }
  }

  return true;
};
