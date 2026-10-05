export interface BookedTicketsModel { }

export interface CustomerBookingSearchRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
}

export interface CustomerBookingStop {
  purchaseInvoiceItemStopId: number;
  purchaseInvoiceItemId: number;
  stopNumber: number;
  airportId: number;
  stopAirport: string | null;
  arrivalDateTime: string | null;
  departureDateTime: string | null;
}


export interface CustomerBookingPassenger {
  bookingPassengerId: number;

  passengerTypeId: number;
  passengerTypeName: string;

  passengerName: string;
  passportNumber: string;

  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;

  contactNumber: string | null;
  email: string | null;

  unitPrice: number;
  totalPrice: number;

  createdDate: string;

  flightRouteType: number,
  flightJourneyType: string,
  checkedBaggagekg: string,
  handBaggagekg: string,
  personalItemkg: string,


  fromAirportId: number | null;
  fromAirport: string | null;
  departureDateTime : Date,
  toAirportId: number | null;
  toAirport: string | null;
  arrivalDateTime: Date,

  airlineId: number | null;
  airlineName: string | null;

  stops: CustomerBookingStop[];

  passengerBookingStatusId: number | null;
  passengerBookingStatus: string | null;

  holdUntil: string | null;

  approvedDate: string | null;
  approvedById: number | null;
  approvedBy: string | null;

  cancelledDate: string | null;
  cancellationReason: string | null;
  cancelledByUserId: number | null;
  cancelledBy: string | null;

  rejectedDate: string | null;
  rejectionReason: string | null;
  rejectedById: number | null;
  rejectedBy: string | null;

  cancellationTypeId: number | null;
  cancellationTypeName: string | null;
}

export interface CustomerBooking {
  bookingId: number;
  bookingReference: string;
  pnrNo: string;

  customerId: number;
  createdBy: string;

  createdDate: string;

  purchaseInvoiceItemId: number;

  bookedTickets: number;

  bookingStatusId: number;
  bookingStatus: string;

  passengerBookingDetails: CustomerBookingPassenger[];
}


export interface CustomerBookingApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: CustomerBooking[];
  success: boolean;
}


















// Cancel Ticket Booking
export interface CancelBookingPassengerRequest {
  bookingPassengerId: number;
  cancellationReason?: string;
}

export interface CancelBookingPassengerResponse {
  bookingId: number;
  bookingPassengerId: number;
  purchaseInvoiceItemId: number;
  bookingStatusId: number;
  bookingStatus?: string;
  cancellationTypeId: number;
  cancellationTypeName?: string;
}











// Confirm Held Ticket Models
export interface ConfirmHeldTicketData {
  bookingPassengerId: number;
  bookingId: number;
  customerId: number;
  bookingStatusId: number;
  bookingStatus: string;
  approvedDate?: string | null;
  approvedById?: number | null;
  approvedBy?: string | null;
}

export interface ConfirmHeldTicketResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: ConfirmHeldTicketData | null;
  success: boolean;
}