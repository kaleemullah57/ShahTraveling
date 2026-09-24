import { inject, Injectable, Service } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { FlightRouteTypeAddRequest, FlightRouteTypeGetRequest, FlightRouteTypeUpdateRequest } from '../../Super Admin Models/Flight Routes Types Models/flight-route-type-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FlightRouteTypeService {


    private readonly apiService = inject(ApiService);



    getFlightRouteTypes(
        request: FlightRouteTypeGetRequest
    ): Observable<any> {

        return this.apiService.post(
            'SuperAdminSetup/GetFlightRouteTypes',
            request
        );
    }



    addFlightRouteType(
        request: FlightRouteTypeAddRequest
    ): Observable<any> {

        return this.apiService.post(
            'SuperAdminSetup/AddFlightRouteType',
            request
        );
    }



    updateFlightRouteType(
        request: FlightRouteTypeUpdateRequest
    ): Observable<any> {

        return this.apiService.put(
            'SuperAdminSetup/UpdateFlightRouteType',
            request
        );
    }
}
