export interface PassengerTypePriceModel {}



export interface AddSharedTicketPassengerPriceRequest {
  purchaseInvoiceItemId: number;
  passengerTypeId: number;
  price: number;
}

export interface UpdateSharedTicketPassengerPriceRequest {
  sharedTicketPassengerPriceId: number;
   purchaseInvoiceItemId: number;
  price: number;
}

export interface SharedTicketPassengerPrice {
  sharedTicketPassengerPriceId: number;
  purchaseInvoiceItemId: number;
  passengerTypeId: number;
  passengerTypeName: string;
  price: number;
  branchId: number;
  createdById: number;
  createdDate: string;
  updatedById?: number;
  updatedDate?: string;
}