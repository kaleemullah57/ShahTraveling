import { Inject, Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { AddServiceRequest, EditServiceRequest } from '../../Super Admin Models/Services Models/services-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private readonly endpoint = 'SuperAdminSetup';

    constructor(private apiService: ApiService) { }


    // Add Services
    addService(model: AddServiceRequest): Observable<any> {
        return this.apiService.post(
            `${this.endpoint}/AddService`,
            model
        );
    }





    // Get Services
    getServices(
        search: string = '',
        pageNumber: number = 1,
        pageSize: number = 10
    ): Observable<any> {

        return this.apiService.post(
            `${this.endpoint}/GetServices`,
            {
                search,
                pageNumber,
                pageSize
            }
        );
    }





    // Delete Services
    deleteService(serviceId: number): Observable<any> {

        return this.apiService.delete(
            `${this.endpoint}/DeleteService/${serviceId}`
        );
    }





    // Edit Services
    editService(
        model: EditServiceRequest
    ): Observable<any> {

        return this.apiService.put(
            `${this.endpoint}/EditService`,
            model
        );

    }
}
