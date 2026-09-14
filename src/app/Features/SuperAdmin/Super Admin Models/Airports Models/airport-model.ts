export interface AirportModel {

}

export interface GetAirportsRequest {
  search: string;
  pageNumber: number;
  pageSize: number;
}

export interface Airport {
  airportId: number;
  airportName: string;
  iataCode: string;
  icaoCode: string;
  countryId: number;
  countryName: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  isInternational: boolean;
  isActive: boolean;
}

export interface GetAirportsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Airport[];
  totalCount: number;
  filterCount: number;
  success: boolean;
}



// Add Airports
export interface AddAirportRequest {
  airportName: string;
  iataCode: string;
  icaoCode: string;
  countryId: number;
  provinceId: number;
  cityId: number;
  isInternational: number;
  isActive: boolean;
}
