import { Injectable } from '@angular/core';
import { ApiService } from '../../../../Core/Services/API Services/api-service';
import { AddDestinationRequest, DestinationResponse } from '../../Admin Models/Destinations/destination-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {


  constructor(
    private apiService: ApiService
  ) { }

  getDestinations(): Observable<DestinationResponse> {

    return this.apiService.get<DestinationResponse>(
      'BranchAdmin/GetDestinationsByBranchId'
    );

  }




  // Add Destinations
  addDestination(
    model: AddDestinationRequest
  ): Observable<any> {

    const formData = new FormData();

    formData.append(
      'DestinationName',
      model.destinationName
    );

    formData.append(
      'Description',
      model.description
    );

    formData.append(
      'CountryId',
      model.countryId.toString()
    );

    formData.append(
      'ProvinceId',
      model.provinceId.toString()
    );

    formData.append(
      'CityId',
      model.cityId.toString()
    );

    formData.append(
      'IsActive',
      model.isActive.toString()
    );

    // Multiple pictures
    if (model.picturePath?.length) {

      model.picturePath.forEach(file => {

        formData.append(
          'PicturePath',
          file,
          file.name
        );

      });

    }

    return this.apiService.post<any>(
      'BranchAdmin/AddDestination',
      formData
    );
  }









  // Delete Destinations
  deleteDestination(destinationId: number): Observable<any> {
    return this.apiService.delete(
      `BranchAdmin/DeleteDestination/${destinationId}`
    );
  }
}