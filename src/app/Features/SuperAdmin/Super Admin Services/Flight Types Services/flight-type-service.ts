import { inject, Injectable, Service } from '@angular/core';
import { FlightJourneyTypeAddRequest, FlightJourneyTypeGetRequest, FlightJourneyTypeUpdateRequest } from '../../Super Admin Models/Flight Types Models/flight-types-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@microsoft/signalr';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

@Injectable({
    providedIn: 'root'
})
export class FlightTypeService {
    private readonly apiService = inject(ApiService);


    getFlightJourneyTypes(
    request: FlightJourneyTypeGetRequest
): Observable<any> {

    return this.apiService.post(
        'SuperAdminSetup/GetFlightJourneyTypes',
        request
    );
}


    addFlightJourneyType(
    request: FlightJourneyTypeAddRequest
  ): Observable<any> {
    return this.apiService.post(
      `SuperAdminSetup/AddFlightJourneyType`,
      request
    );
  }

updateFlightJourneyType(request: FlightJourneyTypeUpdateRequest): Observable<any> {
  return this.apiService.put(
    `SuperAdminSetup/UpdateFlightJourneyType`,
    request
  );
}
}
