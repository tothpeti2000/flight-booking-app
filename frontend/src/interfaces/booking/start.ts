export interface BookingOptions {
  from: string;
  to: string;
  departureDate: Date;
  returnDate?: Date;
  passengerCount: number;
}

export interface Airport {
  id: string;
  name: string;
  cityName: string;
  latitude: number;
  longitude: number;
  blobUrl: string;
}
