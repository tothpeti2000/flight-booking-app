export interface BookingOptions {
  from: string;
  to: string;
  departureDate: Date;
  returnDate?: Date;
  passengerCount: number;
}
