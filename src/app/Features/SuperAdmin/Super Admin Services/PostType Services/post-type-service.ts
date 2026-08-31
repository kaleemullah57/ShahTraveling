import { Injectable, Service } from '@angular/core';
import { AddPostTypeModel, GetPostTypeRequest, GetPostTypeResponse } from '../../Super Admin Models/PostTypeModels/post-type-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostTypeService {

constructor(private apiService: ApiService) {}

  getTravelTypes(
    request: GetPostTypeRequest
  ): Observable<GetPostTypeResponse> {

    return this.apiService.post<GetPostTypeResponse>(
      'SuperAdminSetup/GetTravelTypes',
      request
    );
  }




  // Add Post Types
  addPostType(
    model: AddPostTypeModel
  ): Observable<any> {

    return this.apiService.post<any>(
      'SuperAdminSetup/AddPostType',
      model
    );

  }
}
