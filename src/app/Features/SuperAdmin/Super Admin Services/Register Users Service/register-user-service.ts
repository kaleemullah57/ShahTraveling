import { Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { GetUsersListRequest, RegisterUserRequest } from '../../Super Admin Models/Register Users/register-user-request';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class RegisterUserService {
    constructor(
        private apiService: ApiService
    ) { }

    registerUser(
        request: RegisterUserRequest
    ): Observable<any> {

        return this.apiService.post(
            'Auth/register',
            request
        );
    }





    // Get Users List
    getUsersList(
        request: GetUsersListRequest
    ): Observable<any> {

        return this.apiService.post(
            'SuperAdminSetup/GetUsersList',
            request
        );

    }
}
