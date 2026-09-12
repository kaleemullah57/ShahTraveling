export interface ServicesModel {
  serviceId: number;
  serviceName: string;
  description: string;
  isActive: boolean;
  createdOn: string;
  createdById: number;
  createdBy: string;
}
export interface GetServicesResponse {
  items: ServicesModel[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}




// Add Services Model.
export interface AddServiceRequest {
    serviceName: string;
    description: string;
    isActive: boolean;
}




// Edit Service
export interface EditServiceRequest {
  serviceId: number;
  serviceName: string;
  description: string;
  isActive: boolean;
}

