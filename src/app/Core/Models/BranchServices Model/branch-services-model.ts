export interface BranchServicesModel {}


export interface GetBranchServicesRequest {
  search: string | null;
  pageNumber: number;
  pageSize: number;
}

export interface BranchService {
  branchServiceName: string;
  serviceName: string;
  branchName: string;
  userName: string;
  createdOn: string;
}

export interface BranchServicesResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: BranchService[];
  totalCount: number;
  success: boolean;
}