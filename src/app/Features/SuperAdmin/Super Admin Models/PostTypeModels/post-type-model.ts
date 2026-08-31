export interface PostTypeModel {}


export interface GetPostTypeModel {
  travelTypeId: number;
  travelTypeName: string;
  isActive: boolean;
  createdById: number;
  userName: string;
  createdOn: string;
}

export interface GetPostTypeRequest {
  search: string | null;
  pageNumber: number;
  pageSize: number;
}

export interface GetPostTypeResponse {
  statusCode: number;
  status: boolean;
  message: string;
  totalCount: number;
  data: GetPostTypeModel[];
}



// Add Post Types
export interface AddPostTypeModel {
  postTypeName: string;
  isActive: boolean;
}