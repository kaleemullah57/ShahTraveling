export interface PassengetTypeModel {}




export interface PassengerType {
  passengerTypeId: number;
  passengerTypeName: string;
  isActive: boolean;
  createdById: number;
  createdAt: string;
}

export interface AddPassengerTypeRequest {
  passengerTypeName: string;
  isActive: boolean;
}

export interface UpdatePassengerTypeRequest {
  passengerTypeId: number;
  passengerTypeName: string;
  isActive: boolean;
}

export interface PassengerTypeResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: PassengerType[];
  success: boolean;
}