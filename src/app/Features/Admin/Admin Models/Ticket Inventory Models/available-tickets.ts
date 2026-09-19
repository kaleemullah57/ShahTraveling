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

  departureDateTime?: string | null;
  arrivalDateTime?: string | null;

  quantity: number;

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

  fromAirport?: string | null;
  toAirport?: string | null;

  fromCountry?: string | null;
  toCountry?: string | null;

  createdDate?: string | null;
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