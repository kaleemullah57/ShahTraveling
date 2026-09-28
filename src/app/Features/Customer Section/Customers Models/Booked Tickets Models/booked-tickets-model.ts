export interface BookedTicketsModel {}

export interface CustomerBookingSearchRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
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