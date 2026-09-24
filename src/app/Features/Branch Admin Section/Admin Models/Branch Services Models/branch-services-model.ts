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
   search: string | null;
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






// Update Branch Services
export interface UpdateBranchServiceRequest {
  branchServiceId: number;
  serviceId: number;
  isActive: boolean;
  branchServiceName: string;
}
