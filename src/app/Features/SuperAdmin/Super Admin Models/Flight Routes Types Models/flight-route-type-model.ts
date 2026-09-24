export interface FlightRouteTypeModel {}



export interface FlightRouteType {
  flightRouteTypeId: number;
  routeTypeName: string;
  code: string;
  description: string | null;
  isActive: boolean;

  createdById?: number | null;
  createdDate?: string;

  modifiedById?: number | null;
  modifiedDate?: string | null;
}

export interface FlightRouteTypeAddRequest {
  routeTypeName: string;
  code: string;
  description: string | null;
}

export interface FlightRouteTypeUpdateRequest {
  flightRouteTypeId: number;
  routeTypeName: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

export interface FlightRouteTypeGetRequest {
  search: string;
  isActive: boolean | null;
  flightRouteTypeId: number | null;
}