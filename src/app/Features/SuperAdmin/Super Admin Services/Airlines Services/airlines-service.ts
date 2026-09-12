import { Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { AddAirlineModel, AirlineResponse, EditAirlineRequest } from '../../Super Admin Models/Airlines Models/airlines-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AirlinesService {

    private readonly endpoint = 'SuperAdminSetup/GetAirlines';

    constructor(
        private apiService: ApiService
    ) { }

    getAirlines(
        search: string = '',
        pageNumber: number = 1,
        pageSize: number = 20
    ): Observable<AirlineResponse> {

        const payload = {
            search: search,
            pageNumber: pageNumber,
            pageSize: pageSize
        };

        return this.apiService.post<AirlineResponse>(
            this.endpoint,
            payload
        );
    }



    // Add Airliens
    addAirline(model: AddAirlineModel): Observable<any> {

        return this.apiService.post<any>(
            'SuperAdminSetup/AddAirline',
            model
        );

    }




    // Edit Airlines
    editAirline(model: EditAirlineRequest): Observable<any> {
        return this.apiService.put(
            `SuperAdminSetup/EditAirline`,
            model
        );
    }




    // Delete Airlines
    deleteAirline(airlineId: number): Observable<any> {
        return this.apiService.delete(
            `SuperAdminSetup/DeleteAirline/${airlineId}`
        );
    }


}
