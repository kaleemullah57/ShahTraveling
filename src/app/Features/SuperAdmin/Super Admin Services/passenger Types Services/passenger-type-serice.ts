import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../Core/Services/API Services/api-service';

import {
  AddPassengerTypeRequest,
  PassengerTypeResponse,
  UpdatePassengerTypeRequest
} from '../../Super Admin Models/Passenger Types Models/passenget-type-model';

@Injectable({
  providedIn: 'root'
})
export class PassengerTypeService {

  private readonly endpoint = 'SuperAdminSetup/AddPassengerType';

  constructor(
    private apiService: ApiService
  ) {}


  // Add Passenger Type
  addPassengerType(
    request: AddPassengerTypeRequest
  ): Observable<any> {

    return this.apiService.post(
      this.endpoint,
      request
    );
  }


  // Get Passenger Types
  getPassengerTypes(): Observable<PassengerTypeResponse> {
  return this.apiService.get(
    'SuperAdminSetup/GetPassengerTypes',
    {}
  );
}


  // Update Passenger Type
  updatePassengerType(
    request: UpdatePassengerTypeRequest
  ): Observable<any> {

    return this.apiService.put(
      'SuperAdminSetup/UpdatePassengerType',
      request
    );
  }
}