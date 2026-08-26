export interface BranchModel {
    branchName: string;
    location: string;
    isActive: boolean;
    isDelete: boolean;
    createdById: number;
    userName: string;
}



// Add Branch Models
export interface AddBranchModel {
  branchName: string;
  location: string;
  isActive: boolean;
}