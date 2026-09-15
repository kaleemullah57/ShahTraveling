import { Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { AddAirportRequest, GetAirportsRequest, UpdateAirportRequest } from '../../Super Admin Models/Airports Models/airport-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AirportsServices {
    private readonly endpoint = 'SuperAdminSetup/AddAirport';

    constructor(
        private apiService: ApiService
    ) { }

    addAirport(
        request: AddAirportRequest
    ): Observable<any> {

        return this.apiService.post(
            this.endpoint,
            request
        );
    }






    // Get Airports
    getAirports(request: GetAirportsRequest): Observable<any> {

        return this.apiService.post(
            'SuperAdminSetup/GetAirports',
            request
        );
    }





    // Updaet Airports
    updateAirport(request: UpdateAirportRequest) {
        return this.apiService.put(
            'SuperAdminSetup/UpdateAirport',
            request
        );
    }




    // Delete Airports
    deleteAirport(airportId: number) {
        return this.apiService.delete(
            `SuperAdminSetup/DeleteAirport/${airportId}`
        );
    }
}
