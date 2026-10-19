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




















// Add Customer Ledger
export interface TicketPaymentAllocation {
  bookingPassengerId: number;
  allocatedAmount: number | null;
}

export interface TicketPaymentAddRequest {
  customerId: number;
  bookingId: number;
  paymentMethodId: number;
  totalAmount: number;
  paymentDate: string | null;
  paymentReference: string | null;
  remarks: string | null;
  allocations: TicketPaymentAllocation[];
}

export interface TicketPaymentAddResponse {
  ticketPaymentId: number;
  customerId: number;
  bookingId: number;
  paymentMethodId: number;
  totalAmount: number;
  message: string;
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
  alreadyPaid : string | null;
}










// Get Full Ledger 

export interface LedgerFullDetails {
  customerId: number;
  userName : string;
  bookingId: number;
  bookingReference: string;
  bookingPassengerId: number;
  passengerName: string;
  ticketPrice: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: string;
  ticketPaymentId: number | null;
  paymentMethodId: number | null;
  paymentMethodName: string | null;
  paidAmount: number | null;
  paidDate: string | null;
}

export interface LedgerFullDetailsData {
  items: LedgerFullDetails[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface LedgerFullDetailsResponse {
  status: string;
  statusCode: number;
  message: string;
  data: LedgerFullDetailsData;
  success: boolean;
}

export interface LedgerFullDetailsRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
  amountStatus: number;
}
