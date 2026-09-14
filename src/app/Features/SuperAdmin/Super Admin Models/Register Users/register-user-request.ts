export interface RegisterUserRequest {
    userName: string;
    email: string;
    password: string;
    branchId: number;
    userTypeId: number;
}

export interface UserTypeOption {
    label: string;
    value: number;
}






// Get Users List
export interface GetUsersListRequest {
    pageNumber: number;
    pageSize: number;
    search: string;
}

export interface UserListItem {
    userId: number;
    userName: string;
    email: string;
    userTypeId: number;
    userType: string;
    branchId: number;
    branchName: string;
    isActive: boolean;
    createdOn: string;
}

export interface GetUsersListResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: UserListItem[];
    totalCount: number;
    filterCount: number;
    success: boolean;
}