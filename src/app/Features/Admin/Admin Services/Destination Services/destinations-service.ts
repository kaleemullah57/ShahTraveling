import { Injectable } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { DestinationResponse } from '../../Admin Models/Destinations/destination-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {


    constructor(
    private apiService: ApiService
  ) {}

  getDestinations(): Observable<DestinationResponse> {

    return this.apiService.get<DestinationResponse>(
      'BranchAdmin/GetDestinationsByBranchId'
    );

  }

}