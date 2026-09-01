export interface CountriesModel {}


export interface GetCountriesRequest {
  search: string | null;
  pageNumber: number;
  pageSize: number;
}

export interface GetCountry {
  countryId: number;
  countryName: string;
  countryCode: string;
  isActive: boolean;
  createdById: number;
  userName: string;
  createdOn: string;
}

export interface CountryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GetCountry[];
}




// Add Countries 
export interface AddCountryModel {
  countryName: string;
  countryCode: string;
  isActive: boolean;
}
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  status:number;
  data?: T;
}