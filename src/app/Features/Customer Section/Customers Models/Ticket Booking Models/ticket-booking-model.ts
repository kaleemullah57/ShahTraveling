export interface TicketBookingModel {}



export interface BookingPassengerRequest {
  passengerTypeId: number;
  firstName: string;
  middleName: string;
  lastName : string;
  passportNumber: string;
  passportIssueDate :Date | null;
  passportExpireDate : Date | null;
  dateOfBirth: Date | null;
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