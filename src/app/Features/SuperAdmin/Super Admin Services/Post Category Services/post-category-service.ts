import { Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { AddPostCategoryModel, AddPostCategoryResponse, GetPostCategoryRequest, GetPostCategoryResponse } from '../../Super Admin Models/Post Categories Models/post-category-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostCategoryService {

    constructor(
        private apiService: ApiService
    ) { }

    getPostCategories(
        request: GetPostCategoryRequest
    ): Observable<GetPostCategoryResponse> {

        return this.apiService.post<GetPostCategoryResponse>(
            'SuperAdminSetup/GetPostCategories',
            request
        );

    }




     addPostCategory(
    model: AddPostCategoryModel
  ): Observable<AddPostCategoryResponse> {

    return this.apiService.post<AddPostCategoryResponse>(
      'SuperAdminSetup/AddPostCategory',
      model
    );

  }

}