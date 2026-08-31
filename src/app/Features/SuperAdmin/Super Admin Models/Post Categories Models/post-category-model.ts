export interface PostCategoryModel {}


export interface GetPostCategoryRequest {
  search: string | null;
  pageNumber: number;
  pageSize: number;
}

export interface GetPostCategoryModel {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdById: number;
  userName: string;
  createdOn: string;
}

export interface GetPostCategoryResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: GetPostCategoryModel[];
  totalCount: number;
}





// Add Post Categoreis
export interface AddPostCategoryModel {
  categoryName: string;
  description: string;
  isActive: boolean;
}
export interface AddPostCategoryResponse {
  statusCode: number;
  status: boolean;
  message: string;
}