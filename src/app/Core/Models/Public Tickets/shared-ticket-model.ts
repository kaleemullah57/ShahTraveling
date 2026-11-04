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
  ticketTypeId: number | null;
  ticketTypeName: string | null;

  // Outbound flight stops
  stopsJson?: string | null;
  stops: SharedTicketStop[];

  // Return flight details
  returnAiroplanDetailJson?: string | null;
  returnFlightDetails: SharedTicketReturnFlight | null;

  // Return flight stops
  returnStopsJSON?: string | null;
  returnStops: SharedTicketReturnStop[];
}

export interface SharedTicketStop {
  stopNumber: number;
  stopAirport: string | null;
  arrivalDateTime: string | null;
  departureDateTime: string | null;
}

export interface SharedTicketReturnFlight {
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

export interface SharedTicketReturnStop {
  stopNumber: number | null;
  purchaseInvoiceItemId: number | null;
  airportId: number | null;
  airportName: string | null;
  arrivalDateTime: string | null;
  departureDateTime: string | null;
  createdDate: string | null;
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

export interface SharedTicketsApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: SharedTicketModel[];
  totalCount: number;
  success: boolean;
}



export interface TicketCountryGroup {
  key: string;
  fromCountry: string;
  toCountry: string;
  oneWayTickets: SharedTicketModel[];
  roundTripTickets: SharedTicketModel[];
}