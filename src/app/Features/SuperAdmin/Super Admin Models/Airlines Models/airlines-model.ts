export interface AirlinesModel {}




export interface Airline {
  airlineId: number;
  airlineName: string;
  airlineCode: string;
  iataCode: string;
  icaoCode: string;
  logoPath: string | null;
  isActive: boolean;
  countryId: number;
  countryName: string;
  createdById: number;
  createdBy: string;
  createdOn: string;
}

export interface AirlineResponse {
  statusCode: number;
  status: string;
  message: string;
  data: Airline[];
  totalCount?: number;
}





// Add Airlines
export interface AddAirlineModel {
  airlineName: string;
  airlineCode: string;
  iataCode: string;
  icaoCode: string;
  countryId: number | null;
  logoPath: string;
  isActive: boolean;
}




// Edit Airlines
export interface EditAirlineRequest {
  airlineId: number;
  airlineName: string;
  airlineCode: string;
  iataCode: string;
  icaoCode: string;
  countryId: number;
  isActive: boolean;
}