export interface PublicDestinationsModel {}



export interface GetPublicDestinationModel {
  destinationName: string;
  description: string;
  picturePathJson: string | null;
  picturePath: string[];
  countryName: string;
  provinceName: string | null;
  cityName: string | null;
  branchName: string | null;
  createdBy: string | null;
}

export interface PublicDestinationResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: GetPublicDestinationModel[];
}