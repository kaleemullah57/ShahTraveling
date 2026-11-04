export interface InventoryModel { }






export interface PurchasedInvoiceSearchRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
  fromDate: string | null;
  toDate: string | null;
}

export interface PurchasedInvoicePayment {
  paymentAmount: number;
  paymentDate: string;
  paymentMethodId: number | null;
  methodName: string | null;
  paymentReference: string | null;
  paymentRemarks: string | null;
  paidAmount: number;
  remainingAmount: number;
}

export interface PurchasedInvoice {
  purchaseInvoiceId: number;
  branchId: number;
  branchName: string;

  invoiceNumber: string;
  pnrNo: string | null;

  purchasedFrom: string;
  purchaseReference: string | null;

  invoiceDate: string;

  subTotal: number;
  discount: number;
  tax: number;
  grandTotal: number;

  paidAmount: number;
  remainingAmount: number;

  paymentStatusId: number;
  paymentStatus: string;

  statusId: number;
  inventoryStatus: string;

  createdById: number;
  createdBy: string;
  createdDate: string;

  // Outbound flight details
  airlineId: number;
  airlineName: string;
  airlineCode: string;

  fromAirportId: number;
  fromAirport: string;

  toAirportId: number;
  toAirport: string;

  departureDateTime: string;
  arrivalDateTime: string | null;

  ticketQuantity: number;
  purchasePrice: number;

  checkedBaggageKg: number | null;
  handBaggageKg: number | null;
  personalItemKg: number | null;

  validFrom: string | null;
  validUntil: string;

  ticketTypeId: number | null;
  ticketTypeName: string;

  flightJourneyTypeId: number | null;
  flightRouteTypeId: number | null;

  // Outbound stops
  stopsJson?: string | null;
  stops: PurchasedInvoiceStop[];

  // Payment history
  paymentHistoryJson?: string | null;
  paymentHistory: PurchasedInvoicePayment[];

  // Return flight details
  returnAiroplanDetailJson?: string | null;
  returnFlightDetails: PurchasedInvoiceReturnFlight | null;

  // Return flight stops
  returnStopsJSON?: string | null;
  returnStops: PurchasedInvoiceReturnStop[];
}

export interface PurchasedInvoiceStop {
  stopNumber: number;
  stopAirport: string | null;
  arrivalDateTime: string | null;
  departureDateTime: string | null;
}

export interface PurchasedInvoiceReturnFlight {
  returnAirlineId: number | null;
  returnAirline: string | null;

  returnFromAirportId: number | null;
  returnFromAirport: string | null;

  returnToAirportId: number | null;
  returnToAirport: string | null;

  returnDepartureDateTime: string | null;
  returnArrivalDateTime: string | null;

  returnFlightRouteTypeId: number | null;
  returnFlightRoute: string | null;
}

export interface PurchasedInvoiceReturnStop {
  stopNumber: number;
  purchaseInvoiceItemId: number;
  airportId: number;
  airportName: string | null;

  arrivalDateTime: string | null;
  departureDateTime: string | null;
  createdDate: string | null;
}















export interface AddTicketPurchaseRequest {
  // Purchase / Invoice
  pnrno: string;
  purchasedFrom: string;
  purchaseReference: string;
  invoiceDate: string;

  ticketTypeId: number;

  // Outbound Flight
  airlineId: number;
  fromAirportId: number;
  toAirportId: number;

  flightJourneyTypeId: number | null;
  flightRouteTypeId: number | null;

  stops: TicketPurchaseStop[];

  departureDateTime: string;
  arrivalDateTime: string | null;

  // Return Flight
  returnAirlineId: number | null;
  returnFromAirportId: number | null;
  returnToAirportId: number | null;
  returnFlightRouteTypeId: number | null;

  returnDepartureDateTime: string | null;
  returnArrivalDateTime: string | null;

  returnStops: TicketPurchaseStop[];

  // Quantity / Pricing
  quantity: number;
  purchasePrice: number;
  sellingPrice: number | null;

  // Baggage
  checkedBaggageKg: number;
  handBaggageKg: number;
  personalItemKg: number;

  // Validity
  validFrom: string;
  validUntil: string;

  // Payment
  paidAmount: number;
  paymentMethodId: number | null;
  paymentReference: string;
  remarks: string;
}

export interface TicketPurchaseStop {
  stopNumber: number;
  airportId: number;
  arrivalDateTime: string;
  departureDateTime: string;
}





















// Update Inventory Payments Invoices
export interface UpdatePurchasedInvoicePaymentRequest {
  purchaseInvoiceId: number;
  paymentAmount: number;
  paymentDate: string;
  paymentMethodId: number;
  paymentReference: string;
  remarks: string;
}