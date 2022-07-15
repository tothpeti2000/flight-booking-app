import type { BookingOptions } from "./start";

type TicketType = "Tourist" | "Premium" | "SuperPremium";
export type TicketSelectOption = { label: TicketType; value: 0 | 1 | 2 };
export enum TicketEnum {
  Tourist,
  Premium,
  SuperPremium,
}

export const ticketTypes: TicketSelectOption[] = [
  { label: "Tourist", value: 0 },
  { label: "Premium", value: 1 },
  { label: "SuperPremium", value: 2 },
];

export interface Ticket {
  firstName: string;
  lastName: string;
  type: TicketType | undefined;
  isLuggage: boolean;
  colNum: number;
  rowNum: number;
}

interface Flight {
  flightId: string;
  isReturn: boolean;
  tickets: Ticket[];
}

export interface Order {
  toFlight: Flight;
  returnFlight?: Flight;
}

export interface BookingStoreData {
  order?: Order;
  bookingOptions?: BookingOptions;
}
