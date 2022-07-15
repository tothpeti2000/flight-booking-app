export interface BookingOptions {
  from: string;
  to: string;
  departureDate: Date | string;
  returnDate?: Date | string;
  passengerCount: number;
}
