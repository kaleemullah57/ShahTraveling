export interface DestinationModel {}


// Get Destinations 
export interface Destination {

  destinationId: number;

  destinationName: string;

  description: string;

  countryId: number;

  countryName: string;

  provinceId: number;

  provinceName: string;

  cityId: number;

  cityName: string;

  picturePath: string[];

  createdById: number;

  createdBy: string;

  createdOn: string;

  isActive: boolean;
}


export interface DestinationResponse {

  statusCode: number;

  status: boolean;

  message: string;

  data: Destination[];

}