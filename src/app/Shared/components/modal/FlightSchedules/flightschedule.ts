// export interface Flightschedule {}
export interface TimetableResponse {
  pagination: Pagination;
  data: TimetableFlight[];
}

export interface Pagination {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

export interface TimetableFlight {
aircraft: any;

  airline: Airline;

  arrival: TimetableAirport;

  departure: TimetableAirport;

  flight: FlightNumber;

  codeshared?: Codeshared;

  status: string;

  type: 'arrival' | 'departure' | string;
}

export interface Airline {
  iataCode: string;
  icaoCode: string;
  name: string;
}

export interface TimetableAirport {

  actualRunway?: string | null;

  actualTime?: string | null;

  baggage?: string | null;

  delay?: string | null;

  estimatedRunway?: string | null;

  estimatedTime?: string | null;

  gate?: string | null;

  iataCode: string;

  icaoCode: string;

  scheduledTime?: string | null;

  terminal?: string | null;
}

export interface FlightNumber {

  iataNumber: string;

  icaoNumber: string;

  number: string;
}

export interface Codeshared {

  airline: Airline;

  flight: FlightNumber;
}