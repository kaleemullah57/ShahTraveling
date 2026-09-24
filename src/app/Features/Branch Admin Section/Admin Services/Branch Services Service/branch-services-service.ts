import { Injectable, Service } from '@angular/core';
import { AddBranchServiceRequest, GetBranchServicesRequest, GetBranchServicesResponse, UpdateBranchServiceRequest } from '../../Admin Models/Branch Services Models/branch-services-model';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class BranchServicesService {

    private readonly endpoint = 'BranchAdmin'
    constructor(private apiservice: ApiService) {

    }





    // Add Branch Services
    addBranchService(model: AddBranchServiceRequest): Observable<any> {
        return this.apiservice.post
            (
                `${this.endpoint}/AddBranchService`, model
            );
    }





    // Get Branch Services
    getBranchServices(
        request: GetBranchServicesRequest
    ): Observable<GetBranchServicesResponse> {

        return this.apiservice.post(
            'BranchAdmin/GetBranchServices',
            request
        );
    }




    // Delete Branch Services
    deleteBranchService(branchServiceId: number): Observable<any> {
        return this.apiservice.delete(
            `BranchAdmin/DeleteBranchService/${branchServiceId}`
        );
    }




    // Update Branch Services 

    updateBranchService(
        request: UpdateBranchServiceRequest
    ): Observable<any> {

        return this.apiservice.put(
            `${this.endpoint}/UpdateBranchService`,
            request
        );
    }
}
