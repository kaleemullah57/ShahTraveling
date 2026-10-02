export interface HoldPendingConfirmCancelledModel {}



export interface PendingHoldBookingPassenger {
  bookingPassengerId: number;
  bookingId: number;
  passengerTypeId: number;
  passengerType: string;

  passengerName: string;
  passportNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  email?: string | null;

  unitPrice: number;
  totalPrice: number;
  createdDate: string;

  approvedDate?: string | null;
  approvedById?: number | null;
  approvedBy?: string | null;

  cancellationReason?: string | null;

  rejectedDate?: string | null;
  rejectedById?: number | null;
  rejectedBy?: string | null;

  rejectionReason?: string | null;

  bookingStatusId: number;
  bookingStatus: string;

  holdUntil?: string | null;

  cancelledDate?: string | null;
  cancellationTypeId?: number | null;
  cancellationType?: string | null;

  cancelledByuserId?: number | null;
  cancelledBy?: number | null;
}


export interface PendingHoldBookingStop {
  purchaseInvoiceItemStopId: number;
  purchaseInvoiceItemId: number;
  stopNumber: number;
  airportId: number;
  stopAirport: string;

  arrivalDateTime?: string | null;
  departureDateTime?: string | null;
}


export interface PendingHoldBooking {
  bookingId: number;
  bookingReference: string;

  customerId: number;
  customerName: string;

  quantity: number;
  totalAmount: number;

  bookingStatusId: number;
  bookingStatus: string;

  createdDate: string;
  cancelledOn?: string | null;

  purchaseInvoiceItemId: number;

  airlineName: string;

  ticketValidUntil?: string | null;
  pnrnumber?: string | null;

  passengers?: string | null;
  passengerList: PendingHoldBookingPassenger[];

  fromAirportId: number;
  fromAirport: string;

  toAirportId: number;
  toAirport: string;

  stops?: string | null;
  stopList: PendingHoldBookingStop[];
}


export interface PendingHoldBookingResponse {
  status: boolean;
  statusCode: number;
  message: string;

  data: PendingHoldBooking[];

  totalCount: number;

  success: boolean;
}