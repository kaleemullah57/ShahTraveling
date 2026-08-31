import { inject, Service } from '@angular/core';
import { AddCountryModel, ApiResponse, CountryResponse, GetCountriesRequest, GetCountry } from '../../Super Admin Models/CountriesModels/countries-model';
import { ApiService } from '../../../../Core/Services/API Services/api-service';

import { HttpClient } from '@angular/common/http';

@Service()
export class CountriesService {
  private readonly apiService = inject(ApiService);
  private readonly http = inject(HttpClient)


  getCountries(request: GetCountriesRequest) {

    return this.apiService.post<CountryResponse>(
      'SuperAdminSetup/GetCountries',
      request
    );
  }



  // Add Countreis
 addCountry(country: AddCountryModel) {

    return this.apiService.post<ApiResponse>(
      'SuperAdminSetup/AddCountry',
      country
    );
  }
}
