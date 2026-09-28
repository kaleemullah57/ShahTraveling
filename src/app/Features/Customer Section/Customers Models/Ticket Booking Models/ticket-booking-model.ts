export interface TicketBookingModel {}



export interface BookingPassengerRequest {
  passengerTypeId: number;
  fullName: string;
  passportNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  contactNumber: string;
  email: string;
}

export interface CreateBookingRequest {
  purchaseInvoiceItemId: number;
  passengers: BookingPassengerRequest[];
}

export interface CreateBookingResponse {
  bookingId: number;
  bookingReference: string;
  quantity: number;
  totalAmount: number;
  holdUntil: string;
}