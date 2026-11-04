export interface AvailableTickets {}





export interface AvailableTicketsRequest {
  search?: string;
  pageNumber: number;
  pageSize: number;
  fromDate?: string | null;
  toDate?: string | null;
  fromSellingPrice?: number | null;
  toSellingPrice?: number | null;
}
export interface AvailableTicketModel {
  purchaseInvoiceItemId: number;
  purchaseInvoiceId: number;
  invoiceNumber : string | null;

  departureDateTime?: string | null;
  arrivalDateTime?: string | null;

  quantity: number;
  sharedQuantity: number;
  soldQuantity: number;
  remainingInventory: number;
  availableToCustomer: number;
  availableToShare: number;

  purchasePrice: number;
  sellingPrice: number;

  checkedBaggageKg?: number | null;
  handBaggageKg?: number | null;
  personalItemKg?: number | null;

  validFrom?: string | null;
  validUntil?: string | null;

  branchId: number;
  branchName?: string | null;

  airlineName?: string | null;
  airlineCode?: string | null;
  pnrNo: string;

  fromAirport?: string | null;
  toAirport?: string | null;

  fromCountry?: string | null;
  toCountry?: string | null;

  createdDate?: string | null;

  ticketTypeId?: number | null;
  ticketTypeName: string;

  // Outbound flight stops
  stopsJson?: string | null;
  stops: GetAvailablePurchaseInvoiceStop[];

  // Return flight details
  returnAiroplanDetailJson?: string | null;
  returnFlightDetails?: AvailableTicketReturnFlightModel | null;

  // Return flight stops
  returnStopsJSON?: string | null;
  returnStops: AvailableTicketReturnStop[];
}

export interface GetAvailablePurchaseInvoiceStop {
  stopNumber: number;
  stopAirport: string;
  arrivalDateTime: string | null;
  departureDateTime: string | null;
}

export interface AvailableTicketReturnFlightModel {
  returnAirlineId: number;
  returnAirline: string;

  returnFromAirportId: number;
  returnFromAirport: string;

  returnToAirportId: number;
  returnToAirport: string;

  returnDepartureDateTime: string | null;
  returnArrivalDateTime: string | null;

  returnFlightRouteTypeId: number;
  returnFlightRoute: string;
}

export interface AvailableTicketReturnStop {
  stopNumber: number;
  purchaseInvoiceItemId: number;
  airportId: number;
  airportName: string;

  arrivalDateTime: string | null;
  departureDateTime: string | null;
  createdDate: string | null;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}







// Update Ticket Selling Price
export interface UpdateTicketSellingPriceRequest {
  purchaseInvoiceItemId: number;
  sellingPrice: number;
}








// Share Tickets To Customers
export interface ShareTicketsRequest {
  purchaseInvoiceItemId: number;
  quantity: number;
}





// Reduce Shared Tickets
export interface ReduceSharedTicketQuantityRequest {
  purchaseInvoiceItemId: number;
  quantity: number;
}