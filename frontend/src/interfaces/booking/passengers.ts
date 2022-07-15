import type { TicketSelectOption } from "./order";

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  type: TicketSelectOption | undefined;
  isLuggage: boolean;
}
