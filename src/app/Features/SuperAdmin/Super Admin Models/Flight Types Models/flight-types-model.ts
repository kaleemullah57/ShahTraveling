export interface FlightTypesModel {}



export interface FlightJourneyType {
  flightJourneyTypeId: number;
  journeyTypeName: string;
  code: string;
  description: string | null;
  isActive: boolean;

  createdById?: number | null;
  createdDate?: string | null;

  modifiedById?: number | null;
  modifiedDate?: string | null;
}

export interface FlightJourneyTypeGetRequest {
  search: string;
  isActive: boolean | null;
  flightJourneyTypeId: number | null;
}

export interface FlightJourneyTypeAddRequest {
  journeyTypeName: string;
  code: string;
  description: string | null;
}

export interface FlightJourneyTypeUpdateRequest {
  flightJourneyTypeId: number;
  journeyTypeName: string;
  code: string;
  description: string | null;
  isActive: boolean;
}
