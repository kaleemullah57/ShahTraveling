export interface BranchServicesModel {}




// Add Branch Services

export interface AddBranchServiceRequest {
  serviceId: number;
  branchServiceName: string;
  isActive: boolean;
}




// Get Branch Services

export interface BranchService {
  branchServiceId: number;
  branchServiceName: string;
  isActive: boolean;
  createdOn: string;
  branchId: number;
  branchName: string;
  serviceId: number;
  serviceName: string;
  createdById: number;
  userName: string;
}

export interface GetBranchServicesRequest {
  search?: string;
  pageNumber: number;
  pageSize: number;
}

export interface GetBranchServicesResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: BranchService[];
  totalCount: number;
  success: boolean;
}
