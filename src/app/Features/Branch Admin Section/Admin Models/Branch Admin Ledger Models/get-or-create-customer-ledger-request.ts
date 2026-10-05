export interface GetOrCreateCustomerLedgerRequest {}




export interface GetLedgerCustomerBookingsRequest {
  search?: string | null;
  customerId: number;
}

export interface LedgerCustomerBooking {
  bookingId: number;
  bookingReference: string;
  createdDate: string;
  userName: string;
}















// Get Passenger Confirm Tickets
export interface LedgerConfirmedBookingPassenger {
  bookingPassengerId: number;
  bookingId: number;

  passengerTypeId: number;
  passengerTypeName: string;
  fullName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  contactNumber?: string | null;
  passportNumber?: string | null;
  passportIssueDate?: string | null;
  passportExpireDate?: string | null;
  email?: string | null;

  airlineId: number;
  airline: string;

  fromAirportId: number;
  fromAirport: string;

  toAirportId: number;
  toAirport: string;

  countryId: number;
  country: string;

  bookingStatusId: number;
  unitPrice : number;
}
