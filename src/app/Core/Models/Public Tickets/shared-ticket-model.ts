export interface SharedTicketModel {
  purchaseInvoiceItemId: number;
  airlineName: string;
  airlineCode: string;
  fromAirport: string;
  toAirport: string;
  fromCountry: string;
  toCountry: string;
  departureDateTime: string;
  arrivalDateTime: string;
  availableQuantity: number;
  sellingPrice: number;
  checkedBaggageKg: number;
  handBaggageKg: number;
  personalItemKg: number;
  validFrom: string;
  validUntil: string;
  branchId: number;
  branchName: string;
  createdDate: string;
  createdBy: string;
  ticketTypeId:number | null,
  ticketTypeName : string | null;
}

export interface SharedTicketsRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
  fromDate: string | null;
  toDate: string | null;
  fromSellingPrice: number | null;
  toSellingPrice: number | null;
}