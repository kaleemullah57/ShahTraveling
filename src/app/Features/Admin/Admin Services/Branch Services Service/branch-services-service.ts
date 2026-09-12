import { Injectable, Service } from '@angular/core';
import { AddBranchServiceRequest } from '../../Admin Models/Branch Services Models/branch-services-model';
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
    addBranchService(model: AddBranchServiceRequest): Observable<any> {
        return this.apiservice.post
            (
                `${this.endpoint}/AddBranchService`, model
            );
    }
}
